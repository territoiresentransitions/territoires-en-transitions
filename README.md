# Territoires en Transition

Dans le cadre des programmes d'accompagnement des collectivités dans leurs démarches de transition écologique, l'[ADEME (l'Agence de la transition écologique)](https://www.ademe.fr/) s'est associée à [beta.gouv.fr](https://beta.gouv.fr/) pour lancer une plateforme numérique pour faciliter et accélérer la mise en œuvre des actions de transition écologique dans les collectivités territoriales.

L'interface a pour objectifs de permettre aux utilisateurs :

- d'accéder aux référentiels d'actions de transition écologique
  (Climat-Air-Énergie et Économie Circulaire) et de personnaliser leur utilisation,
- de gérer et suivre ses actions et indicateurs de transition écologique,
- de prioriser les actions ayant le plus d'impact,
- de partager la progression des réalisations et des retours d'expériences entre collectivités.

### Organisation du dépôt

Ce dépôt Git contient :

- 3 services :
    - le ["data-layer"](./data_layer)
    - le ["business"](./business)
    - le [client](./app.territoiresentransitions.react)
- les données des référentiels en [markdown](./markdown)
- le [code du site statique](./territoiresentransitions.fr)

Chaque dossier à la racine contient son propre `README.md` et peut a priori fonctionner de manière autonome.

Vous pouvez contribuer à notre projet [en suivant cette documentation](docs/workflows/contribuer-au-projet.md).

# Conception

La conception, des données au choix de la stack.

## Données

### Les données métier

Les contenus de notre application sont écrits en markdown, ce faisant les experts métiers travaillent dans le même dépôt
que les devs.

Ces fichiers markdowns représentent des définitions auxquelles sont rattachées des données provenant d'utilisateurs. Par
exemple un indicateur tel que [Emissions de GES](markdown/indicateurs/crte/crte_001.md)
est destiné à permettre aux utilisateurs à saisir leurs données annuelles dans notre application.

Ces définitions sont lues par la partie [referentiel](business/business/referentiel/README.md) du `business` et sauvegardée en
base afin d'être

- utilisées pour le processus d'[évaluation](./business/business/evaluation/README.md)
- affichées dans le `client`
- utilisées comme garantie de la cohérence des données utilisateur stockées dans le `data layer`

### Les données utilisateurs

Les utilisateurs saisissent pour le compte de leur collectivité des données qui sont stockées dans le `data layer` qui vérifie leurs droits en écriture grace aux
[row security policies](https://www.postgresql.˚org/docs/current/ddl-rowsecurity.html)

### Les données d'évaluation

Les données utilisateurs rattachées aux référentiels sont évaluées par le service évaluation du `business` qui inscrit
les résultats en base et les transmets au `client` via les WebSockets
de [supabase realtime](https://github.com/supabase/realtime)

## Design

L'application est composée de trois éléments :
le `client`, le `data layer` et le `business`.

Chacun de ses éléments a un périmètre définit :

- le `client` permet aux utilisateurs de se servir du produit et ne communique qu'avec le `data layer`
- le `data layer` se charge des données et de l'authentification.
    - Il permet au `client` de stocker les données de façon sécurisé et lui fournit les moyens via une API REST de lire
      les données simplement en lui fournissant des endpoints adaptés.
    - Il permet au `business` de stocker les données métier et d'accéder aux données utilisateurs
    - Dans le processus d'évaluation, il permet au `business` de réagir aux changements des données utilisateur et au
      `client` de réagir aux changements des évaluations.
    - Enfin, il garantit la cohérence des données.
- le `business` se charge des parties métier et ne communique qu'avec le `data layer`
    - il lit les contenus markdown et les enregistre dans le `data layer`
    - il évalue les données utilisateur et les enregistre dans le `data layer`

## Stack

- Le `client` utilise React ce qui nous permet de bénéficier d'un écosystème riche. Il est développé en TypeScript.

- Le `data layer` utilise [Supabase](https://github.com/supabase/), une solution qui intègre tous
  les [services](https://supabase.com/docs/architecture) dont nous avons besoin en open source dont :
    - [gotrue](https://github.com/netlify/gotrue) pour l'authentification OAuth2
    - [PostgreSQL](https://www.postgresql.org/) la base qui nous apporte le typage et la consistence des données.
    - [PostgREST](https://postgrest.org/en/stable/) qui transforme la base de donnée en une API RESTful.

- le `business` est développé en Python 🐍.

## Lancer le projet en local pour le développement

### Dépendances

- Docker, permet de lancer les conteneurs qui composent le produit. Installation simple avec [Docker Desktop](https://docs.docker.com/desktop/).
- [Earthly](https://earthly.dev/get-earthly) qui permet de lancer le projet et la CI en local comme en remote.
- [Supabase CLI](https://supabase.com/docs/guides/cli) pour lancer le datalayer et générer les types.


### Set up

Une fois les dépendances il suffit de lancer la commande `setup-env` avec `earthly` pour configurer les variables d'environnement de chaque projet.

```shell
earthly +setup-env
```

### Lancer les différents services en local

Pour lancer les services en local avec docker, on utilise la commande `dev` :

```shell
earthly +dev
```

Par default le client n'est pas lancé, on peut néanmoins spécifier les options suivantes :

- `stop` : commence par stopper les services.
- `datalayer` : lance supabase.
- `business` : build et lance le business.
- `client` : build et lance le client

On peut écrire par exemple :

```shell
earthly +dev --stop=yes --datalayer=yes --business=yes --client=no
```

### Lancer les tests

Les trois services sont des projets indépendants qui peuvent-être testés en local sous reserve que les dépendances de
développement soient installées.

Néanmoins, on peut lancer les tests avec `earthly` en utilisant des conteneurs :

```shell
# Lance le projet suivi de tout les tests.
earthly +dev

# Lance les tests indépendamment
earthly --push +db-test
earthly --push +business-test
earthly --push +client-test
earthly --push +api-test
earthly --push +deploy-test
```

## Déploiement

Aujourd'hui le `business` et le `client` sont déployés chez [Scalingo](https://scalingo.com/), le `data layer` est chez [Supabase](https://supabase.com/) en mode BaaS.
