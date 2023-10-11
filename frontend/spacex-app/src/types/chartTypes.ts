// src/types/chartTypes.ts

import { ChartData, ChartDataset } from 'chart.js';

export type PieChartProps = {
  data: {
    datasets: ChartDataset<'pie', number | number[] | null | undefined>[];
    labels: string[];
  };
};

export type BarChartProps = {
  data: {
    datasets: ChartDataset<'bar', number | number[] | null | undefined>[];
    labels: string[];
  };
};
