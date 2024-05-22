import { Component } from "@angular/core";
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexFill,
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    title: ApexTitleSubtitle;
};

@Component({
    selector: "app-wfh-tracking",
    templateUrl: "./wfh-tracking.component.html",
    styleUrls: ["./wfh-tracking.component.scss"],
})
export class WfhTrackingComponent {
    public chartOptions: ChartOptions;
    public dataFromDatabase: any;

    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: "Inflation",
                    data: [5, 10, 20, 15, 10],
                },
            ],
            chart: {
                height: 350,
                type: "bar",
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: "top", // top, center, bottom
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "%";
                },
                offsetY: -20,
                style: {
                    fontSize: "12px",
                    colors: ["#304758"],
                },
            },
            xaxis: {
                categories: ["Prince Cipriano", "Ace Pasilio", "Joseph Naval", "Jayvee Empleo", "Renan Boniza"],
                position: "top",
                labels: {
                    offsetY: -18,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    fill: {
                        type: "gradient",
                        gradient: {
                            colorFrom: "#D8E3F0",
                            colorTo: "#BED1E6",
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        },
                    },
                },
                tooltip: {
                    enabled: true,
                    offsetY: -35,
                },
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [50, 0, 100, 100],
                },
            },
            yaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    formatter: function (val) {
                        return val + "%";
                    },
                },
            },
            title: {
                text: "WFH",
                offsetY: 320,
                align: "center",
                style: {
                    color: "#444",
                },
            },
        };
    }
}
