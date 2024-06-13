import { Component, ElementRef, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MaintenanceService } from "./_service/maintenance.service";
import { MatTableDataSource } from "@angular/material/table";
import { MaintenanceModel } from "../models/maintenance.model";

@Component({
    selector: "app-maintenance",
    templateUrl: "./maintenance.component.html",
    styleUrls: ["./maintenance.component.scss"],
})
export class MaintenanceComponent {
    dataSource = new MatTableDataSource<MaintenanceModel>();
    dataSourceHolidays = new MatTableDataSource<any>();

    @Output() refreshEmployees: EventEmitter<void> = new EventEmitter<void>();


    formDataHoliday!: FormGroup;



    formDataDep!: FormGroup; // Using definite assignment assertion
    displayedColumns: string[] = ["department_name", "action"];
    displayedColumnsHolliday: string[] = ["holiday_name"];

    constructor(
        private el: ElementRef,
        private fb: FormBuilder,
        private maintenanceService: MaintenanceService,
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
            const addedDepartment = this.formDataHoliday.value;
            this.maintenanceService.postAllHolidayData(addedDepartment).subscribe({
                next: (response) => {
                    console.log("Holiday created successfully:", response);
                    this.formDataHoliday.reset();
                    this.refreshEmployees.emit();
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
                    this.refreshEmployees.emit();
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
}
