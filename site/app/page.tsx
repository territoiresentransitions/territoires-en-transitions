'use server';

import Temoignages from './Temoignages';
import Accompagnement from './Accompagnement';
import Informations from './Informations';
import AccueilBanner from './AccueilBanner';
import Newsletter from './Newsletter';
import {getData} from './utils';
import NoResult from '@components/info/NoResult';
import {AccueilData} from './types';

const Accueil = async () => {
  const data: AccueilData | null = await getData();

  return data ? (
    <>
      <AccueilBanner titre={data.titre} couverture={data.couverture} />

      <Accompagnement
        titre={data.accompagnement.titre}
        description={data.accompagnement.description}
        contenu={data.accompagnement.contenu}
      />

      {data.temoignages && (
        <Temoignages
          titre={data.temoignages.titre}
          description={data.temoignages.description}
          contenu={data.temoignages.contenu}
        />
      )}

      <Informations
        titre={data.informations.titre}
        description={data.informations.description}
      />

      <Newsletter
        titre={data.newsletter.titre}
        description={data.newsletter.description}
      />
    </>
  ) : (
    <NoResult />
  );
};

export default Accueil;
