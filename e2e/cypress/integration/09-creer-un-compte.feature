# language: fr

Fonctionnalité: Créer un compte

  Scénario: Créer un compte et se connecter
    Etant donné que j'ouvre le site
    Alors la page vérifie les conditions suivantes :
      | Elément                 | Condition |
      | header                  | visible   |
      | home                    | visible   |
      | formulaire de connexion | absent    |
      | footer                  | présent   |

    Quand je clique sur le bouton "Créer un compte" du "header"
    Alors la page vérifie les conditions suivantes :
      | Elément                          | Condition |
      | header                           | visible   |
      | home                             | absent    |
      | formulaire de création de compte | visible   |
      | footer                           | présent   |

    Quand je remplis le "formulaire de création de compte" avec les valeurs suivantes :
      | Champ  | Valeur        |
      | email  | nono@dodo.com |
      | mdp    | Noo0000oo00!! |
      | prenom | Nono          |
      | nom    | Dodo          |

    Et que je clique sur le bouton "Valider" du "formulaire de création de compte"
    Alors la page vérifie les conditions suivantes :
      | Elément                          | Condition |
      | formulaire de création de compte | visible   |
      | CGU en erreur                    | visible   |


    Quand je clique sur le bouton "cgu" du "formulaire de création de compte"
    Et que je clique sur le bouton "Valider" du "formulaire de création de compte"
    Alors la page vérifie les conditions suivantes :
      | Elément                            | Condition |
      | header                             | visible   |
      | home                               | absent    |
      | formulaire de création de compte   | absent    |
      | Confirmation de création de compte | visible   |
      | footer                             | présent   |

    # ------------
    # Cette partie bouton se connecter etg rechargement n'a pas lieu d'être car le flow va changer
    # avec l'onboarding.
    Et que je clique sur le bouton "se connecter" de la page "confirmation de creation de compte"
    Quand je recharge la page
    # ------------

    Alors la page vérifie les conditions suivantes :
      | Elément                  | Condition |
      | header                   | visible   |
      | home                     | absent    |
      | formulaire de connexion  | absent    |
      | toutes les collectivités | visible   |
      | footer                   | présent   |
