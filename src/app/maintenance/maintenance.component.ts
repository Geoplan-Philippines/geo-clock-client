import { Component, ElementRef, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MaintenanceService } from "./_service/maintenance.service";
import { MatTableDataSource } from "@angular/material/table";
import { MaintenanceModel } from "../models/maintenance.model";
import { DeleteConfirmModalComponent } from "./_components/delete-confirm-modal/delete-confirm-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import * as moment from 'moment-timezone';
import { UpdateModalComponent } from "./_components/update-modal/update-modal.component";
import { UpdateHolidayModalComponent } from "./_components/update-holiday-modal/update-holiday-modal.component";

@Component({
    selector: "app-maintenance",
    templateUrl: "./maintenance.component.html",
    styleUrls: ["./maintenance.component.scss"],
})
export class MaintenanceComponent {

    dataSourceDepartment = new MatTableDataSource<any>();
    dataSourceHolidays = new MatTableDataSource<any>();
    dataSourceClassification = new MatTableDataSource<any>();
    dataSourceDifferential = new MatTableDataSource<any>();
    dialogRef: any = MatDialogRef<any>;

    @Output() refreshEmployees: EventEmitter<void> = new EventEmitter<void>();

    formDataHoliday!: FormGroup;
    formDataDep!: FormGroup; 
    formDataClass!: FormGroup; 

    displayedColumnsDepartment: string[] = ["department_name", "action"];
    displayedColumnsHolliday: string[] = ["holiday_name", "date", "type", "update", "delete"];
    displayedColumnsClassification: string[] = ["classification_name", "action"];
    displayColumnsDifferential: string[] = ["diff_name", "start_time","end_start","action"];
    generalFilter: string = '';
    constructor(
        private el: ElementRef,
        private fb: FormBuilder,
        private maintenanceService: MaintenanceService,
        private dialog: MatDialog,
    ) {}
    ngOnInit(): void {
        this.loadDepartmentData();
        this.loadHolidayData();
        this.loadClassificationData();
        this.createFormDep();
        this.createFormHoliday();
        this.createFormClass();
        this.loadDifferentialData();
    }

    applyFilterHoliday(event: any) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.generalFilter = filterValue; 
        this.loadHolidayData();
    }
    
    loadHolidayData() {
        this.maintenanceService.getAllHolidayData().subscribe((res: any) => {
            this.dataSourceHolidays.data = res;
    
            this.dataSourceHolidays.filterPredicate = (data: any, filter: string) => {
                const dataStr = JSON.stringify(data).toLowerCase();
                return dataStr.includes(filter);
            };
    
            this.dataSourceHolidays.filter = this.generalFilter;
            
        });
    }

    applyFilterDepartment(event: any) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.generalFilter = filterValue; 
        this.loadDepartmentData();
    }

    loadDepartmentData() {
        this.maintenanceService.getAllDepartmentData().subscribe((res: any) => {
            this.dataSourceDepartment.data = res;
    
            this.dataSourceDepartment.filterPredicate = (data: any, filter: string) => {
                const dataStr = JSON.stringify(data).toLowerCase();
                return dataStr.includes(filter);
            };
    
            this.dataSourceDepartment.filter = this.generalFilter;
        });
    }

    applyFilterClassification(event: any) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.generalFilter = filterValue; 
        this.loadClassificationData();
    }
    
    loadClassificationData() {
        this.maintenanceService.getAllClassificationData().subscribe((res: any) => {
            this.dataSourceClassification.data = res;
        
            this.dataSourceClassification.filterPredicate = (data: any, filter: string) => {
                const dataStr = JSON.stringify(data).toLowerCase();
                return dataStr.includes(filter);
            };
    
            this.dataSourceClassification.filter = this.generalFilter;
        });
    }

    applyFilterDifferential(event: any) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.generalFilter = filterValue; 
        this.loadDifferentialData();
    }
    
    loadDifferentialData() {
        this.maintenanceService.getAllDifferentialData().subscribe((res: any) => {
            this.dataSourceDifferential.data = res;
        
            this.dataSourceDifferential.filterPredicate = (data: any, filter: string) => {
                const dataStr = JSON.stringify(data).toLowerCase();
                return dataStr.includes(filter);
            };
    
            this.dataSourceDifferential.filter = this.generalFilter;

            console.log(this.dataSourceDifferential)
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
            const holidayDateValue = this.formDataHoliday.get('holiday_date')?.value;
            const holidayName = this.formDataHoliday.get('holiday_name')?.value;
            const holiday_type = this.formDataHoliday.get('type')?.value;

            const momentDatePHT = moment.tz(holidayDateValue, 'Asia/Manila').format('YYYY-MM-DD');
            const stringDateFormant = `${momentDatePHT}T00:00:00.000Z`
            
            const data = {
                holiday_date: stringDateFormant,
                holiday_name: holidayName,
                type: holiday_type
            }


            this.maintenanceService.postAllHolidayData(data).subscribe({
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
    createFormClass(): void {
        this.formDataClass = this.fb.group({
            classification_name: ["", Validators.required],
        });
    }
    submitFormClass() {
        if (this.formDataClass.valid) {
            const addedClassification = this.formDataClass.value;
            this.maintenanceService.postAllClassificationData(addedClassification).subscribe({
                next: (response) => {
                    console.log("Classification created successfully:", response);
                    this.formDataClass.reset();
                    this.loadClassificationData(); // Adjusted call to pass the date object
                },
                error: (error) => {
                    console.error("Error creating Classificatrio:", error);
                    // this.openSnackBar("User already exist", "okay");
                },
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
            Object.values(this.formDataClass.controls).forEach((control) => control.markAsTouched());
        }
    }

    scrollToSection(sectionId: string) {
        const element = this.el.nativeElement.querySelector(`#${sectionId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    updateDataHoliday(id: number) {
       const data = this.dataSourceHolidays.data.find(holiday => holiday.id === id)
        // console.log("dialog", data)
        this.dialogRef = this.dialog.open(UpdateHolidayModalComponent, {
            data: {
                id: id,
                dataHoliday: data,
                table: "holiday",
            },
        });

        this.dialogRef.afterClosed().subscribe((result: any) => {
            // Handle result here
            console.log("Dialog closed with result:", result);
            this.loadHolidayData(); // Adjusted call to pass the date object
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



    deleteDataDep(id: number) {
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

    deleteDataClass(id: number) {
        this.dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
            data: {
                id: id,
                table: "classification",
            },
        });

        this.dialogRef.afterClosed().subscribe((result: any) => {
            // Handle result here
            console.log("Dialog closed with result:", result);
            this.loadClassificationData(); // Adjusted call to pass the date object
        });
    }

    updateDataClass(id: number, start_time: any, out_time: any){
        this.dialogRef = this.dialog.open(UpdateModalComponent, {
            data: {
                id: id,
                start_time: start_time,
                out_time: out_time
            },
        });

        this.dialogRef.afterClosed().subscribe((result: any) => {
            // Handle result here
            console.log("Dialog closed with result:", result);
            this.loadDifferentialData(); // Adjusted call to pass the date object
        });
        

        }

        activeSection: string | null = null; // No default active section

    setActiveSection(section: string) {
        // Set the clicked section as the active one
        this.activeSection = section;
        this.scrollToSection(section); // Call your existing scroll function
     
    }

   
}
