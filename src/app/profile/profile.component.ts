import { Component } from "@angular/core";
import { ProfileService } from "./_service/profile.service";
import { EncryptionService } from "../authentication/_guards/encrpytion.service";
@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {
    profilData: any[] = [];

    firstName: string = "";
    lastName: string = "";
    department: string = "";
    classification: string = "";
    employee_code: string = "";
    email: string = "";

    constructor(private ProfileService: ProfileService, private encrypt: EncryptionService) {}

    ngOnInit() {
        this.loadEmployeeData();
    }
    loadEmployeeData() {
        const timesheetIdString = this.encrypt.getItem("id");

        if (timesheetIdString !== null) {
            const timesheetId = +timesheetIdString;

            this.ProfileService.getAllemployeetData().subscribe((res: any) => {
                const ds = res;
                const singleData = ds[timesheetId - 1];
                for (let i = 0; i < ds.length; i++) {
                    if (ds[i].id === timesheetId) {
                        this.firstName = ds[i].first_name;
                        this.lastName = ds[i].last_name;
                        this.department = ds[i].department;
                        this.classification = ds[i].classification;
                        this.employee_code = ds[i].employee_code;
                        this.email = ds[i].email;
                    }
                }

                this.profilData = Array.isArray(singleData) ? singleData : [singleData]; // Wrap single object in array
                // console.log(this.profilData);
            });
        } else {
            console.error("Timesheet ID is not available in localStorage");
        }
    }

 
}
