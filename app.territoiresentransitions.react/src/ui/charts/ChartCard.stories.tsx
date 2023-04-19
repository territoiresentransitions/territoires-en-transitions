import {Meta, Story} from '@storybook/react';
import React from 'react';
import ChartCard, {ChartCardProps} from './ChartCard';
import {
  fakeBarChartArgs,
  fakeDonutChartArgs,
  fakeDonutChartWithCustomColorsArgs,
  fakeDonutChartWithLabelsArgs,
  fakeDonutChartWithoutDataArgs,
  fakeHorizontalBarChartArgs,
  fakeHorizontalBarChatWithCustomColorsArgs,
  fakeHorizontalDownloadableBarChartArgs,
  fakeHorizontalExpandableBarChartArgs,
  fakeInvertedHorizontalChartArgs,
} from './fixture';

export default {
  component: ChartCard,
  title: 'Charts/ChartCard',
} as Meta;

const Template: Story<ChartCardProps> = args => <ChartCard {...args} />;

/**
 * Stories sur les donut charts
 */

export const DonutChart = Template.bind({});
DonutChart.args = fakeDonutChartArgs;

export const DonutChartAvecLabels = Template.bind({});
DonutChartAvecLabels.args = fakeDonutChartWithLabelsArgs;

export const DonutChartAvecLabelsEtCouleursCustom = Template.bind({});
DonutChartAvecLabelsEtCouleursCustom.args = fakeDonutChartWithCustomColorsArgs;

export const DonutChartSansData = Template.bind({});
DonutChartSansData.args = fakeDonutChartWithoutDataArgs;

/**
 * Stories sur les bar charts
 */

export const BarChartVertical = Template.bind({});
BarChartVertical.args = fakeBarChartArgs;

export const BarChartHorizontal = Template.bind({});
BarChartHorizontal.args = fakeHorizontalBarChartArgs;

export const BarChartHorizontalAvecCouleursCustom = Template.bind({});
BarChartHorizontalAvecCouleursCustom.args =
  fakeHorizontalBarChatWithCustomColorsArgs;

export const BarChartHorizontalInverse = Template.bind({});
BarChartHorizontalInverse.args = fakeInvertedHorizontalChartArgs;

/**
 * Stories générales
 */

export const ChartZoomable = Template.bind({});
ChartZoomable.args = fakeHorizontalExpandableBarChartArgs;

export const ChartTelechargeable = Template.bind({});
ChartTelechargeable.args = fakeHorizontalDownloadableBarChartArgs;
