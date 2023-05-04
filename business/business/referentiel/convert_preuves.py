import json
import os
from dataclasses import asdict, dataclass
from glob import glob
from pathlib import Path
from typing import List, Tuple

import marshmallow_dataclass
from marshmallow import ValidationError

from business.utils.find_duplicates import find_duplicates
from business.utils.markdown_import.markdown_parser import build_markdown_parser
from business.utils.markdown_import.markdown_utils import load_md
from business.utils.exceptions import MarkdownError


@dataclass
class Preuve:
    id: str
    nom: str
    actions: List[str]
    description: str = ""


def build_md_preuve_as_dict_from_md(path: str) -> List[dict]:
    """Extract an preuve from a markdown document"""

    markdown = load_md(path)
    parser = build_markdown_parser(
        title_key="nom",
        description_key="description",
        initial_keyword="preuves",
        keyword_node_builders={"preuves": lambda: {"nom": ""}},
    )
    preuves_as_dict = parser(markdown)
    return preuves_as_dict


markdown_preuve_schema = marshmallow_dataclass.class_schema(Preuve)()


def parse_preuves_from_markdown(md_file: str) -> Tuple[List[dict], List[str]]:
    md_preuves = build_md_preuve_as_dict_from_md(md_file)
    preuves = []
    errors = []
    for md_preuve in md_preuves:
        try:
            preuve = markdown_preuve_schema.load(md_preuve)
            preuves.append(asdict(preuve))
        except ValidationError as error:
            errors.append(f"Dans le fichier {Path(md_file).name} {str(error)}")
    return preuves, errors


def convert_preuves_markdown_folder_to_json(folder_path: str, json_filename: str):
    md_files = glob(os.path.join(folder_path, "*.md"))
    print(
        f"Lecture de {len(md_files)} fichiers preuves depuis le dossier {folder_path} :) "
    )
    preuves: List[dict] = []
    errors: List[str] = []
    for md_file in md_files:
        file_preuves, file_errors = parse_preuves_from_markdown(md_file)
        preuves += file_preuves
        errors += file_errors
    # Plante si y a des erreurs
    if errors:
        raise MarkdownError(
            "Erreurs dans le format des fichiers preuves :\n- " + "\n- ".join(errors)
        )

    # Vérifie la longueur des ids
    long_preuve_ids = [preuve["id"] for preuve in preuves if len(preuve["id"]) > 50]
    if long_preuve_ids:
        raise Exception(
            "Les ids des preuves suivantes sont trop longs : "
            + ", ".join(long_preuve_ids),
            )

    # Vérifie que les ids sont uniques
    duplicated_preuve_ids = find_duplicates([preuve["id"] for preuve in preuves])
    if duplicated_preuve_ids:
        raise Exception(
            "Les ids des preuves suivantes ne sont pas uniques : "
            + ", ".join(duplicated_preuve_ids),
        )
    with open(json_filename, "w") as f:
        json.dump({"preuves": preuves}, f, indent=2, sort_keys=True)
    print(
        "Lecture et conversion réussies, le résultat JSON se trouve dans ",
        json_filename,
    )
