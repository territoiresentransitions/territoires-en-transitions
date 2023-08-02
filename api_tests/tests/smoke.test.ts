/**
 * Les "smoke tests" permettent de vérifier que le minimum requis pour les
 * tests fonctionne.
 */

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.163.0/testing/asserts.ts";
import { fakeCredentials, signIn, signOut } from "../lib/auth.ts";
import { supabase } from "../lib/supabase.ts";
import { Database } from "../lib/database.types.ts";
import { testReset } from "../lib/rpcs/testReset.ts";

await new Promise((r) => setTimeout(r, 0));

Deno.test("Deno test: Génération des login/mdp de test", () => {
  assertEquals(
    fakeCredentials("yolododo"),
    { email: "yolo@dodo.com", password: "yolododo" },
  );

  assertEquals(
    fakeCredentials("youloudoudou"),
    { email: "youlou@doudou.com", password: "youloudoudou" },
  );
});

Deno.test("Authentification et DCP", async () => {
  const authResponse = await signIn("yolododo");
  assertEquals(authResponse!.data!.user!.role, "authenticated");
  assertEquals(authResponse!.data!.user!.email, "yolo@dodo.com");

  const dcps = await supabase.from("dcp").select();

  // Yolododo ne peut récupérer que ses propres DCP.
  assertEquals(dcps.data!.length, 1);
  assertEquals(dcps.data![0].email, "yolo@dodo.com");

  // on se déconnecte pour libérer les ressources
  await signOut();
});

Deno.test("Le reset du datalayer n'émet pas d'erreur", async () => {
  await testReset();
});
