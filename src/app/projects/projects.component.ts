import { Component, ViewChild } from "@angular/core";
import { ProjectsService } from "./_service/projects.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

@Component({
    selector: "app-projects",
    templateUrl: "./projects.component.html",
    styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent {
    timesheetEntry: any[] = []; // table filter
    displayedColumns: string[] = ["work_order_number", "projectName", "project_description"];

    dataSource = new MatTableDataSource<any>(); // for table

    constructor(private projectsService: ProjectsService) {}
    ngOnInit() {
        this.loadProjects();
    }

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    loadProjects() {
        this.projectsService.getAllProjectData().subscribe((res: any) => {
            const ds = res.response;
            this.dataSource = new MatTableDataSource<any>(ds);
            this.dataSource.paginator = this.paginator;
        });
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
