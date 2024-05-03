import { Component, Inject, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SummaryModel } from "src/app/models/summary.model";
import { SummaryService } from "./_service/summary.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData{
    id: number,
    week_number: number,
    user_id: number,
    start_date: Date,
    end_date: Date,
}

@Component({
    selector: "app-summary",
    templateUrl: "./summary.component.html",
    styleUrls: ["./summary.component.scss"],
})
export class SummaryComponent implements OnInit{
submitForm() {
throw new Error('Method not implemented.');
}
    dataSource = new MatTableDataSource<SummaryModel>();
    employeeEntry: any;

    admin_name: any;
    timesheetId: any;

    
    constructor(private SummaryService: SummaryService, @Inject(MAT_DIALOG_DATA) public data: DialogData,) {}
    ngOnInit() {
        this.loadTimesheet();
        this.loadUser();
    }


    loadUser() {
        const userId = Number(localStorage.getItem('id'));
        this.SummaryService.getAllDataUsers(userId).subscribe((res:any) =>{
            const ds = res;
            this.admin_name = ds.first_name +' '+ ds.last_name;
            console.log(ds);
            console.log(this.admin_name); 
        });
    }



    loadTimesheet() {
        const weekNumber = this.data.week_number;
        const userId = this.data.user_id;
        const startDate = this.data.start_date;
        const endDate = this.data.end_date;
        

        this.SummaryService.getAllTimesheetDaily(weekNumber, userId, startDate, endDate).subscribe((res: any) => {
            const ds = res;
            this.employeeEntry = ds;
        
            const timesheetEntries = ds[0]?.timesheetEntries || [];
            this.timesheetId = timesheetEntries.id;
          
            // Update the dataSource with timesheetEntries
            this.dataSource = new MatTableDataSource<SummaryModel>(timesheetEntries);
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
      
          console.log('Approval Status:', approvalStatus);
          this.updateApproved(approvalStatus); // Pass the ID and status to updateApproved
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
        let approvalStatus: string = '';
        if (approvedCount === 5) {
          approvalStatus = 'Approved';
        } else if (approvedCount > 0) {
          approvalStatus = 'Partially Approved';
        } else if (approvedCount === 0) {
          approvalStatus = 'Not Approved';
        }
        return approvalStatus;
      }
      updateApproved(status: any){
        const ApprovedId = this.data.id
        const approvedForm = {
            approved: status
        }
        this.SummaryService.patchTimesheetApproved(ApprovedId, approvedForm).subscribe({
            next: (response) => {
                console.log("Edit successfully:", response);

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
          approved_by: adminName
        };
      
        if (field === 'approved_check') {
          updateValueApproved.approved_check = !element.approved_check;
          if (element.approved_check) {
            updateValueApproved.approved_by = '';
          }
        } else if (field === 'is_nd') {
          updateValueApproved.is_nd = !element.is_nd;
        } else if (field === 'is_ot') {
          updateValueApproved.is_ot = !element.is_ot;
        }
      
        this.updateTimesheetEntry(entryId, updateValueApproved);
      }
      

    updateTimesheetEntry(entryId: number , entriesValue: any){
        

        this.SummaryService.patchTimesheetEntry(entryId, entriesValue).subscribe({
            next: (response) => {
                console.log("Edit successfully:", response);

                this.loadTimesheetForLength();
            },
            error: (error) => {
                console.error("Error creating entry:", error);
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
        "discription",
    ];
}
