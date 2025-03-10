import {getReferentContacts} from 'core-logic/api/procedures/collectiviteProcedures';
import { yuluCredentials } from 'test_utils/collectivites';
import {supabaseClient} from "../supabase";

describe('Claim and remove collectivite Remote Procedure Call', () => {
  it('should return true when user is first to claim this collectivite', async () => {
    // TODO : test me in the data-layer. The following test CANNOT be run more than once ...
    // await supabaseClient.auth.signInWithPassword(yiliCredentials);
    // const procedureResponse = await claimCollectivite(20);
    // expect(procedureResponse).toBe(true);
  });
  it('should return false when user is not first to claim this collectivite', async () => {});
  it('should be able to remove its own rights from an collectivite', async () => {});
});

describe('Request referent contacts', () => {
  it('should return all referent contacts of owned collectivite if exists', async () => {
    await supabaseClient.auth.signInWithPassword(yuluCredentials);
    const procedureResponse = await getReferentContacts(1);
    expect(procedureResponse).not.toBeNull();
    expect(procedureResponse).toEqual([
      {
        prenom: 'Yolo',
        nom: 'Dodo',
        email: 'yolo@dodo.com',
      },
    ]);
  });
  it('should return an empty list if no referent yet', async () => {
    await supabaseClient.auth.signInWithPassword(yuluCredentials);
    const procedureResponse = await getReferentContacts(40);
    expect(procedureResponse).toBeDefined();
    expect(procedureResponse).toHaveLength(0);
  });
});
