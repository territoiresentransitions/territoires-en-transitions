import {fr} from '@codegouvfr/react-dsfr';

export default function Home() {
  return (
    <div className="fr-container">
      <div className="fr-mt-1w fr-mt-md-4w fr-mb-5w">
        <h1 className="fr-header__body">Mentions légales</h1>
        <h2>Informations légales</h2>
        <p>
          Territoires en transitions{' '}
          <a href="/">(https://territoiresentransitions.fr)</a> est un service
          créé par{' '}
          <a href="https://www.ademe.fr/" rel="external">
            l’ADEME
          </a>{' '}
          en partenariat avec{' '}
          <a href="https://beta.gouv.fr/" rel="external">
            beta.gouv.fr
          </a>
          .
        </p>
        <p>
          Le site constitué par l’ensemble des pages rattachées au nom
          Territoires en Transitions est la propriété de l’Agence de
          l’Environnement et de la Maîtrise de l’Energie (ADEME), Établissement
          Public à caractère Industriel et Commercial (EPIC) régi par les
          articles L131-3 à L131-7 et R131-1 à R131-26 du Code de
          l’environnement, inscrit au registre du commerce d’Angers sous le n°
          385 290 309 et ayant son siège social au : 20, avenue du Grésillé - BP
          90406 - 49004 Angers Cedex 01
          <br />
          Tél. 02 41 20 41 20
        </p>
        <h2>Direction de publication</h2>
        <p>
          Le directeur de publication est M. Boris RAVIGNON, agissant en qualité
          de Président-directeur général de l’ADEME.
        </p>
        <p>
          La personne responsable de l’accès aux documents administratifs et des
          questions relatives à la réutilisation des informations est Monsieur
          Luc MORINIÈRE en qualité de Chef du service des affaires juridiques.
        </p>
        <h2>Hébergement du site</h2>
        <p>
          Scalingo
          <br />
          15 avenue du Rhin 67100 Strasbourg
        </p>
        <h2>Attribution</h2>
        <p>
          Certaines illustrations sont réalisées par Storyset de
          www.flaticon.com
        </p>
        <h2>Modification des mentions légales</h2>
        <p>
          L’ADEME se réserve le droit de modifier les présentes mentions légales
          à tout moment. L’utilisateur est lié par les conditions en vigueur
          lors de sa visite.
        </p>
      </div>
    </div>
  );
}
