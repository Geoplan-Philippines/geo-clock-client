import { Component, ElementRef, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MaintenanceService } from "./_service/maintenance.service";
import { MatTableDataSource } from "@angular/material/table";
import { MaintenanceModel } from "../models/maintenance.model";
import { DeleteConfirmModalComponent } from "./_components/delete-confirm-modal/delete-confirm-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-maintenance",
    templateUrl: "./maintenance.component.html",
    styleUrls: ["./maintenance.component.scss"],
})
export class MaintenanceComponent {
    dataSource = new MatTableDataSource<MaintenanceModel>();
    dataSourceHolidays = new MatTableDataSource<any>();
    dialogRef: any = MatDialogRef<any>;

    @Output() refreshEmployees: EventEmitter<void> = new EventEmitter<void>();

    formDataHoliday!: FormGroup;

    formDataDep!: FormGroup; // Using definite assignment assertion
    displayedColumns: string[] = ["department_name", "action"];
    displayedColumnsHolliday: string[] = ["holiday_name", "date", "type", "action"];

    constructor(
        private el: ElementRef,
        private fb: FormBuilder,
        private maintenanceService: MaintenanceService,
        private dialog: MatDialog,
    ) {}
    ngOnInit(): void {
        this.loadDepartmentData();
        this.loadHolidayData();
        this.createFormDep();
        this.createFormHoliday();
    }

    loadDepartmentData() {
        this.maintenanceService.getAllDepartmentData().subscribe((res: any) => {
            const ds = res;
            this.dataSource = ds;
        });
    }

    loadHolidayData() {
        this.maintenanceService.getAllHolidayData().subscribe((res: any) => {
            const ds = res;
            this.dataSourceHolidays = ds;
        });
    }

    createFormHoliday(): void {
        this.formDataHoliday = this.fb.group({
            holiday_date: ["", Validators.required],
            holiday_name: ["", Validators.required],
            type: ["", Validators.required],
        });
    }

    submitFormHoliday(): void {
        if (this.formDataHoliday.valid) {
            const addedHoliday = this.formDataHoliday.value;
            this.maintenanceService.postAllHolidayData(addedHoliday).subscribe({
                next: (response) => {
                    console.log("Holiday created successfully:", response);
                    this.formDataHoliday.reset();
                    this.loadHolidayData();
                },
                error: (error) => {
                    console.error("Error creating holiday:", error);
                    // this.openSnackBar("User already exist", "okay");
                },
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
            Object.values(this.formDataDep.controls).forEach((control) => control.markAsTouched());
        }
    }

    createFormDep(): void {
        this.formDataDep = this.fb.group({
            department_name: ["", Validators.required],
        });
    }

    submitFormDep(): void {
        if (this.formDataDep.valid) {
            const addedDepartment = this.formDataDep.value;
            this.maintenanceService.postAllDepartmentData(addedDepartment).subscribe({
                next: (response) => {
                    console.log("Department created successfully:", response);
                    this.formDataDep.reset();
                    this.loadDepartmentData(); // Adjusted call to pass the date object
                },
                error: (error) => {
                    console.error("Error creating department:", error);
                    // this.openSnackBar("User already exist", "okay");
                },
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
            Object.values(this.formDataDep.controls).forEach((control) => control.markAsTouched());
        }
    }

    scrollToSection(sectionId: string) {
        const element = this.el.nativeElement.querySelector(`#${sectionId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    deleteData(id: number) {
        this.dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
            data: {
                id: id,
                table: "department",
            },
        });

        this.dialogRef.afterClosed().subscribe((result: any) => {
            // Handle result here
            console.log("Dialog closed with result:", result);
            this.loadDepartmentData(); // Adjusted call to pass the date object
        });
    }

    deleteDataHoliday(id: number) {
        this.dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
            data: {
                id: id,
                table: "holiday",
            },
        });

        this.dialogRef.afterClosed().subscribe((result: any) => {
            // Handle result here
            console.log("Dialog closed with result:", result);
            this.loadHolidayData(); // Adjusted call to pass the date object
        });
    }
}
