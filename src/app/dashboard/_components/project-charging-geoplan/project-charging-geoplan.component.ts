import { Component } from "@angular/core";

import { ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexFill, ApexDataLabels, ApexLegend } from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    fill: ApexFill;
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
};

@Component({
    selector: "app-project-charging-geoplan",
    templateUrl: "./project-charging-geoplan.component.html",
    styleUrls: ["./project-charging-geoplan.component.scss"],
})
export class ProjectChargingGeoplanComponent {
    public chartOptions: ChartOptions;

    constructor() {
        this.chartOptions = {
            series: [44, 55, 41, 17, 15],
            chart: {
                width: 380,
                type: "donut",
            },
            labels: ["A", "B", "C", "D", "E"],
            dataLabels: {
                enabled: false,
            },
            fill: {
                type: "gradient",
            },
            legend: {
                formatter: function (val, opts) {
                    return val + " - " + opts.w.globals.series[opts.seriesIndex];
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
        };
    }
}
