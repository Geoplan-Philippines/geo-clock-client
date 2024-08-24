import { Component, Inject, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SummaryModel } from "src/app/models/summary.model";
import { SummaryService } from "./_service/summary.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClipboardModule, ClipboardService } from "ngx-clipboard";
import { SnackBarService } from "src/app/shared/service/snack-bar/snack-bar.service";

import { EncryptionService } from "src/app/authentication/_guards/encrpytion.service";
import * as moment from "moment";
export interface DialogData {
    id: number;
    week_number: number;
    user_id: number;
    start_date: Date;
    end_date: Date;
}

@Component({
    selector: "app-summary",
    templateUrl: "./summary.component.html",
    styleUrls: ["./summary.component.scss"],
})
export class SummaryComponent implements OnInit {
    submitForm() {
        throw new Error("Method not implemented.");
    }
    dataSource = new MatTableDataSource<SummaryModel>();
    employeeEntry: any;

    admin_name: any;
    employee_department:any
    employed_name: any;
    employee_code: any;
    timesheetId: any;
    clickboard: any = "";

    constructor(
        private SummaryService: SummaryService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private clipboardService: ClipboardService,
        private _snackBarService: SnackBarService,
        private encrypt: EncryptionService
    ) {}
    ngOnInit() {
        this.loadTimesheet();
        this.loadAdminUser();
        this.loadEmployedUser();
        const data={
            id: this.data.id,
            week_number:this.data.week_number,
            user_id:this.data.user_id,
            start_date: this.data.start_date, 
            end_date:this.data.end_date
        }
        // console.log("data of user",data)
    }

    loadAdminUser() {
        const userId = Number(this.encrypt.getItem("id"));
        this.SummaryService.getAllDataUsers(userId).subscribe((res: any) => {
            const ds = res;
            this.admin_name = ds.first_name + " " + ds.last_name;
        });
    }

    loadEmployedUser() {
        this.SummaryService.getAllDataUsers(this.data.user_id).subscribe((res: any) => {
            const ds = res;
            this.employee_department = ds.department
            this.employed_name = ds.first_name + " " + ds.last_name;
            this.employee_code = ds.employee_code;
        });
    }

    hasValue(value: any): boolean {
        return value !== undefined && value !== null && value !== "" && value !== 0;
    }

    loadTimesheet() {
        const weekNumber = this.data.week_number;
        const userId = this.data.user_id;
        const startDate = this.data.start_date;
        const endDate = this.data.end_date;

        // console.log(startDate);
        // console.log(endDate);

        this.SummaryService.getAllTimesheetDaily(weekNumber, userId, startDate, endDate).subscribe((res: any) => {
            const ds = res;
            this.employeeEntry = ds;
            // console.log("daraSource", ds)
            const timesheetEntries = ds[0]?.timesheetEntries || [];
            this.timesheetId = timesheetEntries.id;
            const filteredEntries = timesheetEntries.filter((entry: any) => entry.actual_hours > 0);
            this.dataSource = new MatTableDataSource<SummaryModel>(filteredEntries);
            // console.log(filteredEntries);
            this.clickboard = filteredEntries;
        });
    }

    loadTimesheetForLength() {
        const weekNumber = this.data.week_number;
        const userId = this.data.user_id;
        const startDate = this.data.start_date;
        const endDate = this.data.end_date;

        this.SummaryService.getAllTimesheetDaily(weekNumber, userId, startDate, endDate).subscribe((res: any) => {
            const ds = res;
            this.employeeEntry = ds;

            const timesheetEntries = ds[0]?.timesheetEntries || [];
            this.timesheetId = timesheetEntries.id;
            const approvedCount = this.countApprovedEntries(timesheetEntries);
            const approvalStatus = this.determineApprovalStatus(approvedCount);

            this.updateApproved(approvalStatus);
        });
    }

    countApprovedEntries(entries: any[]): number {
        let approvedCount = 0;
        for (const entry of entries) {
            if (entry.approved_check) {
                approvedCount++;
            }
        }
        return approvedCount;
    }

    determineApprovalStatus(approvedCount: number): string {
        let approvalStatus: string = "";
        if (approvedCount > 5) {
            approvalStatus = "Approved";
        } else if (approvedCount > 0) {
            approvalStatus = "Partially Approved";
        } else if (approvedCount === 0) {
            approvalStatus = "Not Approved";
        }
        return approvalStatus;
    }

    updateApproved(status: any) {
        const ApprovedId = this.data.id;
        const approvedForm = {
            approved: status,
        };
        const weekNumber = this.data.week_number;
        const userId = this.data.user_id;
        const startDate = this.data.start_date;
        // const formattedDate = startDate.format('YYYY-MM-DD');

        this.SummaryService.patchTimesheetApproved(userId, startDate ,weekNumber, approvedForm).subscribe({
            next: (response) => {
                // console.log("Edit successfully:", response);

                this.loadTimesheet();
            },
            error: (error) => {
                console.error("Error creating entry:", error);
            },
        });
    }

    getEntryData(element: any, field: string) {
        const adminName = this.admin_name;
        const entryId = element.id;
        let updateValueApproved = {
            approved_check: element.approved_check,
            is_nd: element.is_nd,
            is_ot: element.is_ot,
            ot_number: element.ot_number,
            nd_number: element.nd_number,
            description: element.description,
            working_location: element.working_location,
            approved_by: adminName,
        };

        if (field === "approved_check") {
            updateValueApproved.approved_check = !element.approved_check;
            if (element.approved_check) {
                updateValueApproved.approved_by = "";
            }
            this.updateTimesheetEntry(entryId, updateValueApproved);
        } else if (field === "is_nd") {
            if (element.approved_check === true) {
                this._snackBarService.openSnackBar("Cannot Update", "okay");
                return;
            }

            updateValueApproved.is_nd = !element.is_nd;
            updateValueApproved.approved_by = "";
            this.updateNightDiff(entryId, updateValueApproved);

        } else if (field === "is_ot") {
            if (element.approved_check === true) {
                this._snackBarService.openSnackBar("Cannot Update", "okay");
                return;
            }

            updateValueApproved.is_ot = !element.is_ot;
            updateValueApproved.approved_by = "";
            this.updateOverTime(entryId, updateValueApproved);
        }
    }

    updateOverTime(entryId: number, entriesValue: any) {
        this.SummaryService.patchTimesheetEntry(entryId, entriesValue).subscribe({
            next: (response) => {
                this._snackBarService.openSnackBar("Update successfully", "okay");
                this.loadTimesheetForLength();
            },
            error: (error) => {
                console.error("Error creating entry:", error);
            },
        });
    }

    updateNightDiff(entryId: number, entriesValue: any) {
        this.SummaryService.patchTimesheetEntry(entryId, entriesValue).subscribe({
            next: (response) => {
                this._snackBarService.openSnackBar("Update successfully", "okay");
                this.loadTimesheetForLength();
            },
            error: (error) => {
                console.error("Error creating entry:", error);
            },
        });
    }

    updateTimesheetEntry(entryId: number, entriesValue: any) {
        this.SummaryService.patchTimesheetEntry(entryId, entriesValue).subscribe({
            next: (response) => {
                this._snackBarService.openSnackBar("Update successfully", "okay");
                this.loadTimesheetForLength();
                this.timesheetApprovedData(response);
            },
            error: (error) => {
                console.error("Error creating entry:", error);
            },
        });
    }

    timesheetApprovedData(dataTimesheet: any) {
        const week_no = dataTimesheet.week_number;
        const employed_department = this.employee_department;
        const employed_name = this.employed_name;
        const employee_code = this.employee_code;
        const employee_id = dataTimesheet.user_id;
        const working_type = dataTimesheet.working_type;
        const actual_hours = dataTimesheet.actual_hours;
        const is_ot = dataTimesheet.is_ot;
        const ot_number = dataTimesheet.ot_number;
        const is_nd = dataTimesheet.is_nd;
        const nd_number = dataTimesheet.nd_number;
        const approved_check = dataTimesheet.approved_check;
        const dateyear = new Date(dataTimesheet.date);
        const year = dateyear.getFullYear().toString();

        

        let RG = 0;
        let ND = 0;
        let LVE = 0;
        let RD = 0;
        let SH = 0;
        let RHRD = 0;
        let SHRD = 0;

        if (working_type === "RG" || working_type === "WFH" || working_type === "FLD") {
            RG = actual_hours;
        } else if (working_type === "ND") {
            ND = actual_hours;
        } else if (working_type === "LVE") {
            LVE = actual_hours;
        } else if (working_type === "RD") {
            RD = actual_hours;
        } else if (working_type === "SH") {
            SH = actual_hours;
        } else if (working_type === "RHRD") {
            RHRD = actual_hours;
        } else if (working_type === "SHRD") {
            SHRD = actual_hours;
        } else {
            console.warn("Unexpected working_type:", working_type);
        }

        const DataSummary: any = {
            Week_no: week_no,
            Date: year,
            user_id: employee_id,
            Department: employed_department,
            Employee: employed_name,
            Code: employee_code,
            is_ot: is_ot,
            is_nd: is_nd,
            RG: RG,
            ND: ND,
            LVE: LVE,
            RD: RD,
            SH: SH,
            RHRD: RHRD,
            SHRD: SHRD,
        };
        // console.log('sdasd',DataSummary.ND)
        if (is_ot) {
            DataSummary.OT = ot_number;
        } else {
            DataSummary.OT = 0;
        }
        if (is_nd) {
            DataSummary.ND = nd_number;
        } else if(ND) {
            DataSummary.ND = ND;
        }else{
            DataSummary.ND = 0;
        }
        
        if (approved_check) {
            this.updateSummary(DataSummary, true);
        } else {
            this.updateSummary(DataSummary, false);
        }
    }

    updateSummary(DataSummary: any, isAddition: boolean) {
        const weekNo = DataSummary.Week_no;
        const date = DataSummary.Date;
        const userId = DataSummary.user_id;
        // console.log(DataSummary.OT)

        let regData = 0;
        let OTData = 0;
        let RDData = 0;
        let RHData = 0;
        let SHData = 0;
        let RHRDData = 0;
        let SHRDData = 0;
        let LVEData = 0;
        let NDData = 0;

        this.SummaryService.getAllSummaryDataWithId(weekNo, date, userId).subscribe((res: any) => {
            for (let data of res) {
                regData += data.RG;
                NDData += data.ND;
                OTData += data.OT;
                LVEData += data.LVE;
                RDData += data.RD;
                RHData += data.RH;
                SHData += data.SH;
                RHRDData += data.RHRD;
                SHRDData += data.SHRD;
            }

            const totalRegular = isAddition ? DataSummary.RG + regData : regData - DataSummary.RG;
            const totalOT = isAddition ? DataSummary.OT + OTData : OTData - DataSummary.OT;
            const totalND = isAddition ? DataSummary.ND + NDData : NDData - DataSummary.ND;
            const totalLVE = isAddition ? DataSummary.LVE + LVEData : LVEData - DataSummary.LVE;
            const totalRD = isAddition ? DataSummary.RD + RDData : RDData - DataSummary.RD;
            const totalSH = isAddition ? DataSummary.SH + SHData : SHData - DataSummary.SH;
            const totalRHRD = isAddition ? DataSummary.RHRD + RHRDData : RHRDData - DataSummary.RHRD;
            const totalSHRD = isAddition ? DataSummary.SHRD + SHRDData : SHRDData - DataSummary.SHRD;
            const totalSum = totalRegular + totalOT + totalRD + RHData + totalSH + totalRHRD + totalSHRD + totalLVE + totalND;

            const sumData: any = {
                Week_no: weekNo,
                Date: date,
                user_id: userId,
                Department: DataSummary.Department,
                Employee: DataSummary.Employee,
                Code: DataSummary.Code,
                RG: totalRegular,
                OT: totalOT,
                ND: totalND,
                RD: totalRD,
                RH: RHData,
                SH: totalSH,
                RHRD: totalRHRD,
                SHRD: totalSHRD,
                LVE: totalLVE,
                Hours: totalSum,
            };
           
            this.entrySummary(sumData);
        });
    }

    entrySummary(SummaryData: any) {
        this.SummaryService.postTimesheetSummary(SummaryData).subscribe({
            next: (response: any) => {
                console.log("Successfully created:", response);
            },
            error: (error) => {
                console.log("Successfully error:", error);
                
            },
        });
    }

   

    displayedColumns: any[] = [
        "project_name",
        "aproved_by",
        "is_approved",
        "over_time",
        "night_diff",
        "date_created",
        "actual_hours",
        "ot_number",
        "nd_number",
        "working_location",
        "working_type",
        "discription",
    ];
}
