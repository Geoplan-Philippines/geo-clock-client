export interface TimesheetApprovedModel {
    week_no: number;
    employee: String;
    approved: boolean;
    aproved_by: String;
    start_date: number;
    end_date: Date;
}
