import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "../../_service/employee.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
@Component({
    selector: "app-add",
    templateUrl: "./add.component.html",
    styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit {
    @Output() refreshEmployees: EventEmitter<void> = new EventEmitter<void>();
    formData!: FormGroup; // Using definite assignment assertion

    departments: any[] = [];
    classification: any[] = [];

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private employeeservice: EmployeeService,
        public dialogRef: MatDialogRef<AddComponent>,
    ) { }
    
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2 * 1000,
            horizontalPosition: "left",
            verticalPosition: "top",
        });
    }

    ngOnInit(): void {
        this.createForm();
        this.getClassification();  
        this.getDepartment();  
    }

    getClassification(){
        this.employeeservice.getAllClassification().subscribe((res: any) =>{
            const ds = res
            this.classification = ds
        })
    }

    getDepartment(){
        this.employeeservice.getAllDepartment().subscribe((res: any) =>{
            const ds = res
            this.departments = ds
        })
    }

    createForm(): void {
        this.formData = this.fb.group({
            employee_code: ["", Validators.required],
            first_name: ["", Validators.required],
            last_name: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(8)]],
            department: ["", Validators.required],
            classification: ["", Validators.required],
            role: ["", Validators.required],
            is_active: [true, Validators.required],
        });
    }

    submitForm(): void {
        if (this.formData.valid) {
            const userData = this.formData.value;
            this.employeeservice.postAllEmployeeData(userData).subscribe({
                next: (response) => {
                    
                    console.log("User created successfully:", response);
                    
                    this.formData.reset();
                    this.dialogRef.close(); 
                    this.refreshEmployees.emit(); 
                },
                error: (error) => {
                    console.error("Error creating user:", error);
                    this.openSnackBar("User already exist", "okay");
                }
            });
        } else {
            console.log("Form is invalid. Please fill in all required fields.");
            Object.values(this.formData.controls).forEach((control) => control.markAsTouched());
        }
    }
}
