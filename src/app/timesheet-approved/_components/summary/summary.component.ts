import { Component, Inject, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SummaryModel } from "src/app/models/summary.model";
import { SummaryService } from "./_service/summary.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClipboardModule, ClipboardService } from "ngx-clipboard";
import { SnackBarService } from "src/app/shared/service/snack-bar/snack-bar.service";

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
    employed_name: any;
    employee_code: any;
    timesheetId: any;
    clickboard: any = "";

    constructor(
        private SummaryService: SummaryService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private clipboardService: ClipboardService,
        private _snackBarService: SnackBarService,
    ) {}
    ngOnInit() {
        this.loadTimesheet();
        this.loadAdminUser();
        this.loadEmployedUser();
    }

    loadAdminUser() {
        const userId = Number(localStorage.getItem("id"));
        this.SummaryService.getAllDataUsers(userId).subscribe((res: any) => {
            const ds = res;
            this.admin_name = ds.first_name + " " + ds.last_name;
        });
    }

    loadEmployedUser() {
        this.SummaryService.getAllDataUsers(this.data.user_id).subscribe((res: any) => {
            const ds = res;
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

            const timesheetEntries = ds[0]?.timesheetEntries || [];
            this.timesheetId = timesheetEntries.id;
            const filteredEntries = timesheetEntries.filter((entry: any) => entry.actual_hours > 0);
            this.dataSource = new MatTableDataSource<SummaryModel>(filteredEntries);
            console.log(filteredEntries);
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
        this.SummaryService.patchTimesheetApproved(ApprovedId, approvedForm).subscribe({
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
            description: element.description,
            approved_by: adminName,
        };

        if (field === "approved_check") {
            updateValueApproved.approved_check = !element.approved_check;
            if (element.approved_check) {
                updateValueApproved.approved_by = "";
            }
            this.updateTimesheetEntry(entryId, updateValueApproved);
        } else if (field === "is_nd") {
            updateValueApproved.is_nd = !element.is_nd;
            if (element.approved_check === false) {
                updateValueApproved.approved_by = "";
            }
            this.updateTimesheetEntry(entryId, updateValueApproved);
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
        const employed_name = this.employed_name;
        const employee_code = this.employee_code;
        const employee_id = dataTimesheet.user_id;
        const working_type = dataTimesheet.working_type;
        const actual_hours = dataTimesheet.actual_hours;
        const is_ot = dataTimesheet.is_ot;
        const ot_number = dataTimesheet.ot_number;
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
            Employee: employed_name,
            Code: employee_code,
            is_ot: is_ot,
            RG: RG,
            ND: ND,
            LVE: LVE,
            RD: RD,
            SH: SH,
            RHRD: RHRD,
            SHRD: SHRD,
        };

        if (is_ot) {
            DataSummary.OT = ot_number;
        } else {
            DataSummary.OT = 0;
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
                // console.log("Successfully created:", response);
            },
            error: (error) => {
                console.log("Successfully created:", error);
            },
        });
    }

    // copyToClipboard() {
    //     const filteredEntries = this.clickboard;
    //     console.log(filteredEntries);

    //     // Initialize an array to store sentences
    //     const sentences: string[] = [];

    //     // Keep track of the previous date
    //     let previousDate: string | null = null;

    //     // Create sentences for each entry
    //     for (const entry of filteredEntries) {
    //         let sentence = "";
    //         for (const key in entry) {
    //             if (entry.hasOwnProperty(key)) {
    //                 if (["date", "actual_hours", "is_ot", "is_nd", "week_number", "project", "approved_by"].includes(key)) {
    //                     let value = entry[key];
    //                     if (typeof value === "object") {
    //                         // Handle nested objects
    //                         let nestedSentence = "";
    //                         for (const nestedKey in value) {
    //                             if (value.hasOwnProperty(nestedKey)) {
    //                                 if (nestedSentence !== "") {
    //                                     nestedSentence += ", ";
    //                                 }
    //                                 if (nestedKey === "project_name") {
    //                                     nestedSentence += `project_name: ${value[nestedKey]}`;
    //                                 } else {
    //                                     nestedSentence += `${nestedKey}: ${value[nestedKey]}`;
    //                                 }
    //                             }
    //                         }
    //                         value = nestedSentence;
    //                     }
    //                     if (sentence !== "") {
    //                         sentence += ", ";
    //                     }
    //                     if (key === "project") {
    //                         sentence += `${value}`;
    //                     } else {
    //                         sentence += `${key}: ${value}`;
    //                     }
    //                 }
    //             }
    //         }

    //         // Check if the current date differs from the previous one
    //         if (previousDate !== entry.date) {
    //             // Append a new line if it's a new date
    //             if (previousDate !== null) {
    //                 sentences.push(""); // Empty line
    //             }
    //             previousDate = entry.date;
    //         }
    //         sentences.push(sentence);
    //     }

    //     // Convert the sentences to a single string
    //     const contentToCopy = sentences.join(".\n");

    //     // Copy the content to the clipboard
    //     this.clipboardService.copyFromContent(contentToCopy);
    // }

    displayedColumns: any[] = [
        "project_name",
        "aproved_by",
        "is_approved",
        "over_time",
        "date_created",
        "actual_hours",
        "ot_number",
        "working_location",
        "working_type",
        "discription",
    ];
}
