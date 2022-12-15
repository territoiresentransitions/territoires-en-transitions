-- Verify tet:referentiel/action_definition on pg

BEGIN;

select has_function_privilege('private.upsert_referentiel_after_json_insert()', 'execute');

ROLLBACK;
