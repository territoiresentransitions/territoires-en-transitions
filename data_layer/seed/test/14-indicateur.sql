-- Ajoute les fonctionnalités pour tester les indicateurs.

-- Copie la table des valeurs des indicateurs référentiels
create table test.indicateur_resultat
as
select *
from public.indicateur_resultat;
comment on table test.indicateur_resultat is
    'Copie de la table indicateur_resultat.';

create table test.indicateur_objectif
as
select *
from public.indicateur_objectif;
comment on table test.indicateur_objectif is
    'Copie de la table indicateur_objectif.';

-- Copie la table des définitions des indicateurs personnalises
create table test.indicateur_personnalise_definition
as
select *
from public.indicateur_personnalise_definition;
comment on table test.indicateur_personnalise_definition is
    'Copie de la table indicateur_personnalise_definition.';

-- Copie la table des objectifs des indicateurs personnalises
create table test.indicateur_personnalise_objectif
as
select *
from public.indicateur_personnalise_objectif;
comment on table test.indicateur_personnalise_objectif is
    'Copie de la table indicateur_personnalise_objectif.';

-- Copie la table des valeurs des indicateurs personnalises
create table test.indicateur_personnalise_resultat
as
select *
from public.indicateur_personnalise_resultat;
comment on table test.indicateur_personnalise_resultat is
    'Copie de la table indicateur_personnalise_resultat.';

-- Copie la table des commentaires d'indicateur
create table test.indicateur_commentaire
as
select *
from public.indicateur_commentaire;
comment on table test.indicateur_commentaire is
    'Copie de la table indicateur_commentaire.';

create function
    test_reset_indicateur()
    returns void
as
$$
    -- Vide les tables des indicateurs
truncate indicateur_commentaire cascade;
truncate indicateur_personnalise_resultat cascade;
truncate indicateur_personnalise_objectif cascade;
truncate indicateur_personnalise_definition cascade;
truncate indicateur_objectif cascade;
truncate indicateur_resultat cascade;

insert into public.indicateur_resultat
select *
from test.indicateur_resultat;

insert into public.indicateur_objectif
select *
from test.indicateur_objectif;

insert into public.indicateur_personnalise_definition
select *
from test.indicateur_personnalise_definition;

insert into public.indicateur_personnalise_objectif
select *
from test.indicateur_personnalise_objectif;

insert into public.indicateur_personnalise_resultat
select *
from test.indicateur_personnalise_resultat;

insert into public.indicateur_commentaire
select *
from test.indicateur_commentaire;

$$ language sql security definer;
comment on function test_reset_indicateur is
    'Reinitialise les indicateurs.';
