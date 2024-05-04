import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { EmployeeService } from "../../_service/employee.service";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface DialogData {
    employee_id: number;
    last_name: "";
    first_name: "";
    employee_code: "";
    email: "";
    password: "";
    department: "";
    role: "";
    is_active: boolean;
}

@Component({
    selector: "app-edit",
    templateUrl: "./edit.component.html",
    styleUrls: ["./edit.component.scss"],
})
export class EditComponent {
    formData!: FormGroup; // Using definite assignment assertion
    employeeEntry: any[] = [];

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private employeeservice: EmployeeService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public updatedialogRef: MatDialogRef<EditComponent>,
    ) {}

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2 * 1000,
            horizontalPosition: "left",
            verticalPosition: "top",
        });
    }

    ngOnInit(): void {
        this.createForm();
        this.loadEmployee();
    }

    createForm(): void {
        this.formData = this.fb.group({
            first_name: [this.data.first_name, Validators.required],
            last_name: [this.data.last_name, Validators.required],
            employee_code: [this.data.employee_code, Validators.required],
            email: [this.data.email, Validators.required],
            password: [this.data.password, Validators.required],
            department: [this.data.department, Validators.required],
            role: [this.data.role, Validators.required],
            is_active: [this.data.is_active],
        });
    }

    loadEmployee() {
        this.employeeservice.getAllemployeetData().subscribe((res: any) => {
            const ds = res;
            this.employeeEntry = ds;
        });
    }
    
    submitForm(): void {
        if (this.formData.valid) {
            const userId = this.data.employee_id;
            const userData = this.formData.value;
    
            if (this.employeeEntry.some((employee: { employee_code: any; email: any; id: number; }) => 
                ((employee.employee_code === userData.employee_code || employee.email === userData.email) && 
                employee.id !== userId))) {
                console.log("Employee code or email already exists for another user. Cannot update.");
                return;
            }
    
            this.employeeservice.patchEmployeeData(userId, userData).subscribe({
                next: (response) => {
                    console.log("Data patched successfully:", response);
                    this.updatedialogRef.close(); 
                },
                error: (error) => {
                    console.error("Error patching data:", error);
                    this.openSnackBar("Error updating data", "Okay");
                },
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
        }
    }
    
    
    
}
