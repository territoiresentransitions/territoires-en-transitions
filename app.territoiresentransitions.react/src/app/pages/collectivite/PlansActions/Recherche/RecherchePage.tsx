import {lazy, Suspense} from 'react';
import {renderLoader} from 'utils/renderLoader';

const Recherche = lazy(
  () => import('app/pages/collectivite/PlansActions/Recherche/Recherche')
);

type RecherchePageProps = {
  collectiviteId: number;
};

export const RecherchePage = ({collectiviteId}: RecherchePageProps) => {
  return (
    <Suspense fallback={renderLoader()}>
      <Recherche collectiviteId={collectiviteId} />
    </Suspense>
  );
};
