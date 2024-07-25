import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { EmployeeService } from "./_service/employee.service";
import { EmployeeModel } from "../models/employee.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { AddComponent } from "./_component/add/add.component";
import { EditComponent } from "./_component/edit/edit.component";

@Component({
    selector: "app-employee",
    templateUrl: "./employee.component.html",
    styleUrls: ["./employee.component.scss"],
})
export class EmployeeComponent {
    employeeEntry: any[] = [];
    dataSource = new MatTableDataSource<EmployeeModel>();

    employeeId: number[] = [];

    element: any;
    constructor(
        private employeeService: EmployeeService,
        public dialog: MatDialog,
    ) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit() {
        this.loadEmployee();
    }
    loadEmployee() {
        this.employeeService.getAllemployeetData().subscribe((res: any) => {
            const ds = res;
            this.employeeEntry = ds;
            this.dataSource = new MatTableDataSource<EmployeeModel>(ds);
            this.dataSource.paginator = this.paginator;
            this.getEmployeeId();
        });
    }

    getEmployeeId() {
        try {
            if (this.dataSource.data && this.dataSource.data.length > 0) {
                const allIdsAlt = this.dataSource.data.map((employee) => employee.id);
                this.employeeId = allIdsAlt;
            } else {
                console.log("Data source is empty");
            }
        } catch (error) {
            console.error("Error:", error); // Check if any error occurs during execution
        }
    }

    displayedColumns: any[] = [
        "is_active",
        "employee_code",
        "first_name",
        "last_name",
        "email",
        "role",
        "classification",
        "last_update",
        "action",
    ];

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openAdd(): void {
        const dialogRef = this.dialog.open(AddComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });

        dialogRef.componentInstance.refreshEmployees.subscribe(() => {
            this.ngOnInit();
        });
    }

    openEdit(
        employee_id: number,
        employee_code: string,
        first_name: string,
        last_name: string,
        email: string,
        department: string,
        classification: string,
        role: string,
        is_active: boolean,
    ) {
        const dialogRef = this.dialog.open(EditComponent, {
            data: {
                employee_id: employee_id,
                first_name: first_name,
                last_name: last_name,
                employee_code: employee_code,
                email: email,
                department: department,
                classification: classification,
                role: role,
                is_active: is_active,
            },
        });
        dialogRef.afterClosed().subscribe(() => {
            this.ngOnInit();
        });
    }
}
