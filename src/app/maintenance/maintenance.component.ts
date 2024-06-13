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
    @Output() refreshEmployees: EventEmitter<void> = new EventEmitter<void>();

    formData!: FormGroup; // Using definite assignment assertion
    displayedColumns: string[] = ["department_name"];

    constructor(
        private el: ElementRef,
        private fb: FormBuilder,
        private maintenanceService: MaintenanceService,
    ) {}
    ngOnInit(): void {
        this.loadProjects();
        this.createForm();
    }

    loadProjects() {
        this.maintenanceService.getAllDepartmentData().subscribe((res: any) => {
            const ds = res;
            this.dataSource = ds;
        });
    }

    createForm(): void {
        this.formData = this.fb.group({
            department_name: ["", Validators.required],
        });
    }
    submitForm(): void {
        if (this.formData.valid) {
            const addedDepartment = this.formData.value;
            this.maintenanceService.postAllDepartmentData(addedDepartment).subscribe({
                next: (response) => {
                    console.log("User created successfully:", response);
                    this.formData.reset();
                    this.refreshEmployees.emit();
                },
                error: (error) => {
                    console.error("Error creating user:", error);
                    // this.openSnackBar("User already exist", "okay");
                },
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
            Object.values(this.formData.controls).forEach((control) => control.markAsTouched());
        }
    }
    scrollToSection(sectionId: string) {
        const element = this.el.nativeElement.querySelector(`#${sectionId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }
}
