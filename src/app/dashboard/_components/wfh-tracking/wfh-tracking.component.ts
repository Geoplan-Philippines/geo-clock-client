import { Component, ViewChild, OnInit } from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexXAxis,
    ApexAnnotations,
    ApexFill,
    ApexStroke,
    ApexGrid,
} from 'ng-apexcharts';
import { SharedAnalyticsService } from '../shared-analytics.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    annotations: ApexAnnotations;
    fill: ApexFill;
    stroke: ApexStroke;
    grid: ApexGrid;
};

const defaultChartOptions: ChartOptions = {
    series: [],
    chart: {
        height: 350,
        type: 'bar',
    },
    dataLabels: {
        enabled: false,
    },
    plotOptions: {
        bar: {
            columnWidth: '20%',
        },
    },
    yaxis: {
        title: {
            text: 'Total Hours',
        },
    },
    xaxis: {
        labels: {
            rotate: -45,
        },
        categories: [],
        tickPlacement: 'on',
    },
    annotations: {
        points: [],
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100],
        },
    },
    stroke: {
        width: 2,
    },
    grid: {
        row: {
            colors: ['#fff', '#f2f2f2'],
        },
    },
};

@Component({
    selector: 'app-wfh-tracking',
    templateUrl: './wfh-tracking.component.html',
    styleUrls: ['./wfh-tracking.component.scss'],
})
export class WfhTrackingComponent implements OnInit {
    @ViewChild('chart') chart!: ChartComponent;
    public chartOptions: ChartOptions;

    constructor(private sharedAnalyticsService: SharedAnalyticsService) {
        this.chartOptions = { ...defaultChartOptions };
    }

    ngOnInit() {
        this.fetchData();
    }

    fetchData() {
        this.sharedAnalyticsService.getAllWorkFromHome().subscribe((data: any[]) => {
            const userHours: { [key: string]: number } = {};
            const userLabels: { [key: string]: string } = {};

            data.forEach((item) => {
                const userId = item.user_id;
                const userName = `${item.user.first_name} ${item.user.last_name}`;

                if (userHours[userId]) {
                    userHours[userId] += item.actual_hours;
                } else {
                    userHours[userId] = item.actual_hours;
                    userLabels[userId] = userName;
                }
            });

            this.updateChart(userHours, userLabels);
        });
    }

    updateChart(userHours: { [key: string]: number }, userLabels: { [key: string]: string }) {
        const categories = Object.values(userLabels);
        const data = Object.values(userHours);

        this.chartOptions.series = [
            {
                name: 'Total Hours',
                data: data,
            },
        ];
        this.chartOptions.xaxis = {
            ...this.chartOptions.xaxis,
            categories: categories,
        };
    }
}
