import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart } from 'ng-apexcharts';
import { SharedAnalyticsService } from '../shared-analytics.service';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};

@Component({
    selector: 'app-project-manhours',
    templateUrl: './project-manhours.component.html',
    styleUrls: ['./project-manhours.component.scss'],
})
export class ProjectManhoursComponent {
    public chartOptions: ChartOptions;

    constructor(
        private http: HttpClient,
        private sharedAnalyticsService: SharedAnalyticsService
    ) {
        this.chartOptions = {
            series: [],
            chart: {
                width: 680,
                type: 'pie',
            },
            labels: [],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };
    }

    ngOnInit() {
        this.sharedAnalyticsService.getAllDataOfProjectUsed().subscribe((data) => {
            const projectCount = data.reduce(
                (acc, project) => {
                    const projectName = project.project.project_name;
                    if (!acc[projectName]) {
                        acc[projectName] = { count: 0, project_name: projectName };
                    }
                    acc[projectName].count++;
                    return acc;
                },
                {} as { [key: string]: { count: number; project_name: string } }
            );

            this.chartOptions.series = Object.values(projectCount).map((p) => p.count);
            this.chartOptions.labels = Object.values(projectCount).map((p) => p.project_name);
        });
    }
}
