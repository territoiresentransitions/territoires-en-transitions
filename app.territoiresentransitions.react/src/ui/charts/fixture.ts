import {avancementToLabel} from 'app/labels';
import {actionAvancementColors} from 'app/theme';
import {BarChartProps} from './BarChart';
import {defaultColors, StatusColor} from './chartsTheme';
import {DonutChartProps} from './DonutChart';

const fakeChartInfo = {
  title: 'Titre du graphe',
  legend: undefined,
  expandable: false,
  downloadedFileName: undefined,
  additionalInfo: undefined,
};

/**
 * Données associées au donut chart
 */

const fakeDonuChartProps: DonutChartProps = {
  data: [
    {id: 'À venir', value: 10},
    {id: 'En cours', value: 50},
    {id: 'Réalisé', value: 30},
    {id: 'En pause', value: 40},
    {id: 'Abandonné', value: 10},
  ],
};

export const fakeDonutChartArgs = {
  chartType: 'donut',
  chartProps: fakeDonuChartProps,
  chartInfo: {
    ...fakeChartInfo,
    title: "Répartition par statut d'avancement",
  },
  customStyle: {width: '700px'},
};

export const fakeDonutChartWithLabelsArgs = {
  ...fakeDonutChartArgs,
  chartProps: {
    ...fakeDonutChartArgs.chartProps,
    label: true,
  },
};

export const fakeDonutChartWithCustomColorsArgs = {
  ...fakeDonutChartArgs,
  chartProps: {
    data: fakeDonutChartArgs.chartProps.data.map(d => ({
      ...d,
      // @ts-ignore
      color: StatusColor[d.id],
    })),
    label: true,
  },
};

export const fakeDonutChartWithoutDataArgs = {
  ...fakeDonutChartArgs,
  chartProps: {data: []},
};

/**
 * Données associées au bar chart
 */

const customColors = {
  [`${avancementToLabel.fait}_color`]: actionAvancementColors.fait,
  [`${avancementToLabel.programme}_color`]: actionAvancementColors.programme,
  [`${avancementToLabel.pas_fait}_color`]: actionAvancementColors.pas_fait,
};

const fakeBarChartLegend = [
  avancementToLabel.fait,
  avancementToLabel.programme,
  avancementToLabel.pas_fait,
].map((el, i) => ({name: el, color: defaultColors[i]}));

const fakeAdditionalInfo = [
  "1. Définition d'une stratégie globale de la politique économie circulaire et inscription dans le territoire",
  '2. Développement des services de réduction, collecte et valorisation des déchets',
  "3. Déploiement des autres piliers de l'économie circulaire dans les territoires",
  '4. Outils financiers du changement de comportement',
  '5. Coopération et engagement',
];

const fakeBarChartProps: BarChartProps = {
  data: [
    {
      axe: '1',
      [avancementToLabel.fait]: 10,
      [avancementToLabel.programme]: 30,
      [avancementToLabel.pas_fait]: 20,
      ...customColors,
    },
    {
      axe: '2',
      [avancementToLabel.fait]: 25,
      [avancementToLabel.programme]: 20,
      [avancementToLabel.pas_fait]: 30,
      ...customColors,
    },
    {
      axe: '3',
      [avancementToLabel.fait]: 5,
      [avancementToLabel.programme]: 15,
      [avancementToLabel.pas_fait]: 20,
      ...customColors,
    },
    {
      axe: '4',
      [avancementToLabel.fait]: 15,
      [avancementToLabel.programme]: 20,
      [avancementToLabel.pas_fait]: 15,
      ...customColors,
    },

    {
      axe: '5',
      [avancementToLabel.fait]: 30,
      [avancementToLabel.programme]: 40,
      [avancementToLabel.pas_fait]: 0,
      ...customColors,
    },
  ],
  indexBy: 'axe',
  keys: [
    avancementToLabel.fait,
    avancementToLabel.programme,
    avancementToLabel.pas_fait,
  ],
  indexTitles: fakeAdditionalInfo,
  unit: 'points',
  onSelectIndex: index => alert(`Click sur l'index ${index}`),
};

export const fakeBarChartArgs = {
  chartType: 'bar',
  chartProps: fakeBarChartProps,
  chartInfo: {
    ...fakeChartInfo,
    title: 'Progression par axe en valeur absolue',
  },
  customStyle: {width: '700px'},
};

export const fakeHorizontalBarChartArgs = {
  ...fakeBarChartArgs,
  chartProps: {
    ...fakeBarChartArgs.chartProps,
    layout: 'horizontal',
  },
};

export const fakeHorizontalBarChatWithCustomColorsArgs = {
  ...fakeHorizontalBarChartArgs,
  chartProps: {
    ...fakeHorizontalBarChartArgs.chartProps,
    customColors: true,
  },
};

export const fakeInvertedHorizontalChartArgs = {
  ...fakeHorizontalBarChartArgs,
  chartProps: {
    ...fakeHorizontalBarChartArgs.chartProps,
    inverted: true,
  },
};

/**
 * Stories générales
 */

export const fakeHorizontalExpandableBarChartArgs = {
  ...fakeInvertedHorizontalChartArgs,
  chartInfo: {
    ...fakeInvertedHorizontalChartArgs.chartInfo,
    legend: fakeBarChartLegend,
    expandable: true,
    additionalInfo: fakeAdditionalInfo,
  },
};

export const fakeHorizontalDownloadableBarChartArgs = {
  ...fakeHorizontalExpandableBarChartArgs,
  chartInfo: {
    ...fakeHorizontalExpandableBarChartArgs.chartInfo,
    downloadedFileName: 'exemple',
  },
};
