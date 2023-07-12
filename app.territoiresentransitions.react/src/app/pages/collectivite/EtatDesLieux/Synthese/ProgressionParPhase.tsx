import {referentielToName} from 'app/labels';
import ChartCard from 'ui/charts/ChartCard';
import {defaultColors} from 'ui/charts/chartsTheme';
import {toLocaleFixed} from 'utils/toFixed';

type ProgressionParPhaseProps = {
  repartitionPhases: {id: string; value: number}[];
  referentiel: string;
  customStyle?: React.CSSProperties;
};

const ProgressionParPhase = ({
  referentiel,
  repartitionPhases,
  customStyle,
}: ProgressionParPhaseProps) => {
  const scoreTotal =
    Math.round(
      repartitionPhases.reduce(
        (total, currValue) => (total += currValue.value),
        0
      ) * 10
    ) / 10;

  return (
    <ChartCard
      chartType="donut"
      chartProps={{
        data: repartitionPhases,
        label: true,
        displayPercentageValue: true,
      }}
      chartInfo={{
        title: `Répartition du score "Réalisé" par phase (${
          scoreTotal > 1 ? Math.round(scoreTotal) : toLocaleFixed(scoreTotal, 2)
        } point${Math.round(scoreTotal) <= 1 ? '' : 's'})`,
        subtitle: referentielToName[referentiel],
        legend: repartitionPhases.map((el, index) => ({
          name: el.id,
          color: defaultColors[index % defaultColors.length],
        })),
        expandable: true,
        downloadedFileName: `${referentiel}-realise-par-phase`,
      }}
      customStyle={customStyle}
    />
  );
};

export default ProgressionParPhase;
