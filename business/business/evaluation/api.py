from datetime import datetime
import os
import json
from dataclasses import asdict, dataclass
from typing import Union, Optional
from urllib.parse import urljoin
from fastapi import BackgroundTasks, APIRouter
import requests

from business.evaluation.evaluation.compute_scores import (
    ActionPointTree,
    compute_scores,
)
from business.evaluation.personnalisation.execute_personnalisation_regles import (
    execute_personnalisation_regles,
)
from business.evaluation.personnalisation.regles_parser import ReglesParser
from business.utils.models.actions import (
    ActionChildren,
    ActionComputedPoint,
    ActionId,
    ActionReferentiel,
)
from business.utils.models.action_statut import ActionStatut
from business.utils.models.identite import IdentiteCollectivite
from business.utils.models.personnalisation import ActionPersonnalisationConsequence
from business.utils.models.action_score import ActionScore
from business.utils.models.personnalisation import ActionPersonnalisationRegles
from business.utils.models.reponse import Reponse

router = APIRouter()


@dataclass
class EvaluationReferentiel:
    children: list[ActionChildren]
    computed_points: list[ActionComputedPoint]
    action_level: int


@dataclass
class EvaluatePayload:
    statuts: list[ActionStatut]
    consequences: dict[ActionId, ActionPersonnalisationConsequence]
    referentiel: EvaluationReferentiel


@router.post("/evaluation/")
async def evaluate(payload: EvaluatePayload) -> list[ActionScore]:
    point_tree_referentiel = ActionPointTree(
        payload.referentiel.computed_points,
        payload.referentiel.children,
    )
    scores = compute_scores(
        point_tree_referentiel,
        payload.statuts,
        payload.consequences,
        payload.referentiel.action_level,
    )
    return list(scores.values())


@dataclass
class PersonnalizePayload:
    regles: list[ActionPersonnalisationRegles]
    reponses: list[Reponse]
    identite: IdentiteCollectivite

    def asdict(self):
        return {
            "regles": [asdict(regle) for regle in self.regles],
            "reponses": [asdict(reponse) for reponse in self.reponses],
            "identite": self.identite.asdict(),
        }


@router.post("/personnalisation/")
async def personnalize(
        payload: PersonnalizePayload,
) -> dict[ActionId, ActionPersonnalisationConsequence]:
    regles_parser = ReglesParser(payload.regles)
    consequences = execute_personnalisation_regles(
        regles_parser,
        payload.reponses,
        payload.identite,
    )
    return consequences


# Endpoints called by the datalayer: return immediately and then post the responses to the right tables
# ---------------------------------
supabase_key = os.environ.get("SUPABASE_KEY")
supabase_url = os.environ.get("SUPABASE_URL")
supabase_rest_url = urljoin(supabase_url, 'rest/v1')


def supabase_headers() -> dict:
    return {"ApiKey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"}


@dataclass
class DatalayerEvaluationPayload:
    timestamp: datetime
    collectivite_id: int
    scores_table: str
    referentiel: ActionReferentiel
    payload: EvaluatePayload
    audit_id: Union[int, None] = None


@dataclass
class DatalayerPersonnalisationPayload:
    timestamp: datetime
    collectivite_id: int
    consequences_table: str  # optionnelle
    payload: PersonnalizePayload
    evaluation_payloads: list[DatalayerEvaluationPayload]


@router.post("/dl_personnalisation/")
async def datalayer_personnalisation(payload: DatalayerPersonnalisationPayload, background_tasks: BackgroundTasks):
    background_tasks.add_task(personnalize_then_post_consequences, payload)
    return


@router.post("/dl_evaluation/")
async def datalayer_evaluation(payload: DatalayerEvaluationPayload, background_tasks: BackgroundTasks):
    background_tasks.add_task(evaluate_then_post_scores, payload)
    return


async def personnalize_then_post_consequences(
        payload: DatalayerPersonnalisationPayload,
):
    consequences = await personnalize(payload.payload)
    response: Optional[requests.Response] = None

    # Si le nom d'une table est présent
    if payload.consequences_table:
        # on enregistre les conséquences du calcul de la personnalisation
        response = requests.post(
            f'{supabase_rest_url}/{payload.consequences_table}?on_conflict=collectivite_id',
            data=json.dumps(
                {
                    "consequences": {
                        action_id: asdict(consequence)
                        for action_id, consequence in consequences.items()
                    },
                    "collectivite_id": payload.collectivite_id,
                    "payload_timestamp": payload.timestamp.isoformat(),
                }
            ),
            headers=supabase_headers(),
        )
        print(f'{response.url} replied with a code {response.status_code} in {response.elapsed}')

    # S'il n'y pas de nom de table
    # ou si les personnalisations ont été insérées
    # ou si des personnalisations plus récentes existaient
    if not payload.consequences_table or response.status_code == 201 or response.status_code == 400:
        for evaluation_payload in payload.evaluation_payloads:
            # on reprend les conséquences calculées pour le référentiel de la payload
            # pour calculer les scores.
            evaluation_payload.payload.consequences = {
                action_id: consequence
                for action_id, consequence in consequences.items()
                if action_id.startswith(evaluation_payload.referentiel)
            }
            await evaluate_then_post_scores(evaluation_payload)


async def evaluate_then_post_scores(
        payload: DatalayerEvaluationPayload,
):
    scores = await evaluate(payload.payload)
    row = {
        "scores": [
            asdict(score) for score in scores
        ],
        "collectivite_id": payload.collectivite_id,
        "referentiel": payload.referentiel,
        "payload_timestamp": payload.timestamp.isoformat(),
    }
    on_conflict = 'collectivite_id,referentiel'
    if payload.audit_id:
        row['audit_id'] = payload.audit_id
        on_conflict += ',audit_id'

    response = requests.post(
        f'{supabase_rest_url}/{payload.scores_table}?on_conflict={on_conflict}',
        data=json.dumps(row),
        headers=supabase_headers(),
    )
    print(f'{response.url} replied with a code {response.status_code} in {response.elapsed}')
