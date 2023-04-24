import PictoCalendar from 'ui/pictogrammes/PictoCalendar';
import PictoCommunity from 'ui/pictogrammes/PictoCommunity';
import PictoDataViz from 'ui/pictogrammes/PictoDataViz';
import PictoDocument from 'ui/pictogrammes/PictoDocument';
import PictoInformation from 'ui/pictogrammes/PictoInformation';
import Checkbox from 'ui/shared/form/Checkbox';
import FormField from 'ui/shared/form/FormField';
import TextareaControlled from 'ui/shared/form/TextareaControlled';
import MultiSelectDropdown from 'ui/shared/select/MultiSelectDropdown';
import MultiSelectTagsDropdown from 'ui/shared/select/MultiSelectTagsDropdown';
import SelectDropdown from 'ui/shared/select/SelectDropdown';
import {
  ficheActionCiblesOptions,
  ficheActionNiveauPrioriteOptions,
  ficheActionResultatsAttendusOptions,
  ficheActionStatutOptions,
} from '../data/options/listesStatiques';
import {FicheAction} from '../data/types';
import {useEditFicheAction} from '../data/useUpsertFicheAction';
import FicheActionBadgeStatut from './FicheActionBadgeStatut';
import FicheActionFormBudgetInput from './FicheActionFormBudgetInput';
import FicheActionFormDateInput from './FicheActionFormDateInput';
import Section from './Section';
import StructurePiloteDropdown from './StructurePiloteDropdown';
import PartenairesDropdown from './PartenairesDropdown';
import PersonnePiloteDropdown from './PersonnePiloteDropdown';
import PersonneReferenteDropdown from './PersonneReferenteDropdown';
import ThematiquesDropdown from './ThematiquesDropdown';
import SousThematiquesDropdown from './SousThematiquesDropdown';
import {
  TFicheActionStatuts,
  TSousThematiqueRow,
  TThematiqueRow,
} from 'types/alias';
import {DSFRbuttonClassname} from 'ui/shared/select/commons';
import FicheActionRangerModal from '../FicheActionRangerModal/FicheActionRangerModal';
import {usePlanActionProfondeur} from '../../PlanAction/data/usePlanActionProfondeur';
import ServicePiloteDropdown from './ServicePiloteDropdown';
import Financeurs from './Financeurs';
import PictoLeaf from 'ui/pictogrammes/PictoLeaf';
import ActionsLiees from './ActionsLiees';
import PictoBook from 'ui/pictogrammes/PictoBook';
import {AddAnnexeButton} from './AddAnnexeButton';
import PreuveDoc from 'ui/shared/preuves/Bibliotheque/PreuveDoc';
import {useAnnexesFicheAction} from '../data/useAnnexesFicheAction';
import {TPreuve} from 'ui/shared/preuves/Bibliotheque/types';
import FichesLiees from './FichesLiees';
import IndicateursLies from './IndicateursLies';

type TFicheActionForm = {
  fiche: FicheAction;
  isReadonly: boolean;
};

const FicheActionForm = ({fiche, isReadonly}: TFicheActionForm) => {
  const {mutate: updateFiche} = useEditFicheAction();
  const plansProfondeur = usePlanActionProfondeur();
  const {data: annexes} = useAnnexesFicheAction(fiche.id);

  return (
    <div className="flex flex-col gap-6">
      <Section isDefaultOpen icon={<PictoInformation />} title="Présentation">
        {!isReadonly &&
          plansProfondeur?.plans &&
          plansProfondeur.plans.length > 0 && (
            <FicheActionRangerModal fiche={fiche} />
          )}
        <FormField
          label="Nom de la fiche"
          hint="Exemple : 1.3.2.5 Limiter les émissions liées au chauffage résidentiel au bois"
          htmlFor="title"
        >
          <TextareaControlled
            id="title"
            initialValue={fiche.titre ?? ''}
            onBlur={e => {
              if (fiche.titre) {
                e.target.value !== fiche.titre &&
                  updateFiche({...fiche, titre: e.target.value.trim()});
              } else {
                e.target.value.trim().length > 0 &&
                  updateFiche({...fiche, titre: e.target.value.trim()});
              }
            }}
            placeholder="Écrire ici..."
            maxLength={300}
            className="outline-transparent resize-none"
            disabled={isReadonly}
          />
        </FormField>
        <FormField label="Description de l'action" htmlFor="description">
          <TextareaControlled
            id="description"
            initialValue={fiche.description ?? ''}
            onBlur={e => {
              if (fiche.description) {
                e.target.value !== fiche.description &&
                  updateFiche({...fiche, description: e.target.value.trim()});
              } else {
                e.target.value.trim().length > 0 &&
                  updateFiche({...fiche, description: e.target.value.trim()});
              }
            }}
            placeholder="Écrire ici..."
            maxLength={20000}
            className="outline-transparent resize-none"
            disabled={isReadonly}
          />
        </FormField>
        <FormField label="Thématique">
          <ThematiquesDropdown
            thematiques={fiche.thematiques}
            onSelect={thematiques => updateFiche({...fiche, thematiques})}
            isReadonly={isReadonly}
          />
        </FormField>
        <FormField label="Sous-thématique">
          <SousThematiquesDropdown
            thematiques={
              fiche.thematiques
                ? fiche.thematiques.map((t: TThematiqueRow) => t.thematique)
                : []
            }
            sousThematiques={fiche.sous_thematiques as TSousThematiqueRow[]}
            onSelect={sous_thematiques =>
              updateFiche({...fiche, sous_thematiques})
            }
            isReadonly={isReadonly}
          />
        </FormField>
      </Section>

      <Section icon={<PictoDataViz />} title="Objectifs et indicateurs">
        <FormField label="Objectifs">
          <TextareaControlled
            initialValue={fiche.objectifs ?? ''}
            onBlur={e => {
              if (fiche.objectifs) {
                e.target.value !== fiche.objectifs &&
                  updateFiche({...fiche, objectifs: e.target.value.trim()});
              } else {
                e.target.value.trim().length > 0 &&
                  updateFiche({...fiche, objectifs: e.target.value.trim()});
              }
            }}
            placeholder="Écrire ici..."
            maxLength={10000}
            className="outline-transparent resize-none"
            disabled={isReadonly}
          />
        </FormField>
        <IndicateursLies
          indicateurs={fiche.indicateurs}
          onSelect={indicateurs => updateFiche({...fiche, indicateurs})}
          isReadonly={isReadonly}
        />
        <FormField label="Résultats attendus">
          <MultiSelectDropdown
            buttonClassName={DSFRbuttonClassname}
            values={fiche.resultats_attendus ?? []}
            options={ficheActionResultatsAttendusOptions}
            onSelect={values =>
              updateFiche({...fiche, resultats_attendus: values})
            }
            disabled={isReadonly}
          />
        </FormField>
      </Section>

      <Section
        icon={<PictoCommunity />}
        title="Acteurs"
        dataTest="section-acteurs"
      >
        <FormField label="Cibles">
          <MultiSelectTagsDropdown
            buttonClassName={DSFRbuttonClassname}
            values={fiche.cibles ?? []}
            options={ficheActionCiblesOptions}
            onSelect={values => updateFiche({...fiche, cibles: values})}
            disabled={isReadonly}
          />
        </FormField>
        <FormField label="Structure pilote">
          <StructurePiloteDropdown
            structures={fiche.structures}
            onSelect={structures => updateFiche({...fiche, structures})}
            isReadonly={isReadonly}
          />
        </FormField>
        <FormField
          label="Moyens humains et techniques"
          htmlFor="moyens-humains-tech"
        >
          <TextareaControlled
            id="moyens-humains-tech"
            initialValue={fiche.ressources ?? ''}
            onBlur={e => {
              if (fiche.ressources) {
                e.target.value !== fiche.ressources &&
                  updateFiche({...fiche, ressources: e.target.value.trim()});
              } else {
                e.target.value.trim().length > 0 &&
                  updateFiche({...fiche, ressources: e.target.value.trim()});
              }
            }}
            placeholder="Écrire ici..."
            maxLength={10000}
            className="outline-transparent resize-none"
            disabled={isReadonly}
          />
        </FormField>
        <FormField label="Partenaires">
          <PartenairesDropdown
            partenaires={fiche.partenaires}
            onSelect={partenaires => updateFiche({...fiche, partenaires})}
            isReadonly={isReadonly}
          />
        </FormField>
        <FormField label="Personne pilote">
          <PersonnePiloteDropdown
            personnes={fiche.pilotes}
            onSelect={pilotes => updateFiche({...fiche, pilotes})}
            isReadonly={isReadonly}
          />
        </FormField>
        <FormField label="Direction ou service pilote">
          <ServicePiloteDropdown
            services={fiche.services}
            onSelect={services => updateFiche({...fiche, services})}
            isReadonly={isReadonly}
          />
        </FormField>
        <FormField label="Élu·e référent·e">
          <PersonneReferenteDropdown
            personnes={fiche.referents}
            onSelect={referents => updateFiche({...fiche, referents})}
            isReadonly={isReadonly}
          />
        </FormField>
      </Section>

      <Section
        dataTest="section-modalites"
        icon={<PictoCalendar />}
        title="Modalités de mise en œuvre"
      >
        <FormField
          label="Budget prévisionnel total "
          htmlFor="budget-previsionnel"
        >
          <FicheActionFormBudgetInput
            budget={fiche.budget_previsionnel}
            onBlur={e => {
              if (fiche.budget_previsionnel) {
                parseInt(e.target.value) !== fiche.budget_previsionnel &&
                  updateFiche({
                    ...fiche,
                    budget_previsionnel: parseInt(e.target.value.trim()),
                  });
              } else {
                e.target.value.length > 0 &&
                  updateFiche({
                    ...fiche,
                    budget_previsionnel: parseInt(e.target.value.trim()),
                  });
              }
            }}
            disabled={isReadonly}
          />
        </FormField>
        <div className="mb-6 pt-6 border-y border-gray-300">
          <Financeurs
            fiche={fiche}
            onUpdate={newFiche => updateFiche(newFiche)}
            isReadonly={isReadonly}
          />
        </div>
        <FormField
          label="Financements"
          htmlFor="financements"
          hint="Programmes de financements, etc."
        >
          <TextareaControlled
            id="financements"
            initialValue={fiche.financements ?? ''}
            onBlur={e => {
              if (fiche.financements) {
                e.target.value !== fiche.financements &&
                  updateFiche({...fiche, financements: e.target.value.trim()});
              } else {
                e.target.value.trim().length > 0 &&
                  updateFiche({...fiche, financements: e.target.value.trim()});
              }
            }}
            placeholder="Écrire ici..."
            className="outline-transparent resize-none"
            disabled={isReadonly}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Statut">
            <SelectDropdown
              data-test="Statut"
              buttonClassName={DSFRbuttonClassname}
              value={fiche.statut ?? undefined}
              options={ficheActionStatutOptions}
              onSelect={value => updateFiche({...fiche, statut: value})}
              placeholderText="Sélectionnez une option"
              renderSelection={v => <FicheActionBadgeStatut statut={v} />}
              renderOption={option => (
                <FicheActionBadgeStatut
                  statut={option.value as TFicheActionStatuts}
                />
              )}
              disabled={isReadonly}
            />
          </FormField>
          <FormField label="Niveau de priorité">
            <SelectDropdown
              buttonClassName={DSFRbuttonClassname}
              value={fiche.niveau_priorite ?? undefined}
              options={ficheActionNiveauPrioriteOptions}
              onSelect={value =>
                updateFiche({...fiche, niveau_priorite: value})
              }
              placeholderText="Sélectionnez une option"
              disabled={isReadonly}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date de début">
            <FicheActionFormDateInput
              initialValue={fiche.date_debut}
              onBlur={e =>
                updateFiche({
                  ...fiche,
                  date_debut:
                    e.target.value.length !== 0 ? e.target.value : null,
                })
              }
              disabled={isReadonly}
            />
          </FormField>
          <FormField label="Date de fin prévisionnelle">
            <FicheActionFormDateInput
              initialValue={fiche.date_fin_provisoire}
              disabled={(fiche.amelioration_continue || isReadonly) ?? false}
              onBlur={e =>
                updateFiche({
                  ...fiche,
                  date_fin_provisoire:
                    e.target.value.length !== 0 ? e.target.value : null,
                })
              }
            />
            <Checkbox
              label="Action en amélioration continue, sans date de fin"
              onCheck={() => {
                updateFiche({
                  ...fiche,
                  amelioration_continue: !fiche.amelioration_continue,
                  date_fin_provisoire: null,
                });
              }}
              checked={fiche.amelioration_continue ?? false}
              disabled={isReadonly}
            />
          </FormField>
        </div>
        <FormField
          label="Calendrier"
          htmlFor="calendrier"
          hint="Si l’action est en pause ou abandonnée, expliquez pourquoi"
          className="mt-6"
        >
          <TextareaControlled
            id="calendrier"
            initialValue={fiche.calendrier ?? ''}
            onBlur={e => {
              if (fiche.calendrier) {
                e.target.value !== fiche.calendrier &&
                  updateFiche({...fiche, calendrier: e.target.value.trim()});
              } else {
                e.target.value.trim().length > 0 &&
                  updateFiche({...fiche, calendrier: e.target.value.trim()});
              }
            }}
            placeholder="Écrire ici..."
            className="outline-transparent resize-none"
            disabled={isReadonly}
          />
        </FormField>
      </Section>
      <Section icon={<PictoLeaf />} title="Actions et fiches liées">
        <ActionsLiees
          actions={fiche.actions}
          onSelect={actions => updateFiche({...fiche, actions})}
          isReadonly={isReadonly}
        />
        <FichesLiees
          ficheCouranteId={fiche.id}
          fiches={fiche.fiches_liees}
          onSelect={fiches_liees => updateFiche({...fiche, fiches_liees})}
          isReadonly={isReadonly}
        />
      </Section>
      <Section icon={<PictoDocument />} title="Notes">
        <FormField
          label="Notes complémentaires"
          hint="Évaluation ou autres informations sur l’action "
          htmlFor="notes-complementaires"
        >
          <TextareaControlled
            id="notes-complementaires"
            initialValue={fiche.notes_complementaires ?? ''}
            onBlur={e => {
              if (fiche.notes_complementaires) {
                e.target.value !== fiche.notes_complementaires &&
                  updateFiche({
                    ...fiche,
                    notes_complementaires: e.target.value.trim(),
                  });
              } else {
                e.target.value.trim().length > 0 &&
                  updateFiche({
                    ...fiche,
                    notes_complementaires: e.target.value.trim(),
                  });
              }
            }}
            placeholder="Écrire ici..."
            maxLength={20000}
            className="outline-transparent resize-none"
            disabled={isReadonly}
          />
        </FormField>
      </Section>
      <Section icon={<PictoBook />} title="Documents et liens">
        {annexes?.map(doc => (
          <PreuveDoc preuve={doc as unknown as TPreuve} />
        ))}
        <div className={annexes?.length ? 'fr-mt-2w' : undefined}>
          <AddAnnexeButton fiche_id={fiche.id!} />
        </div>
      </Section>
      {/* <Checkbox
        label="Mise à jour de la fiche terminée"
        onCheck={() =>
          updateFiche({
            ...fiche,
            maj_termine: !fiche.maj_termine,
          })
        }
        checked={fiche.maj_termine ?? false}
      /> */}
    </div>
  );
};

export default FicheActionForm;
