export interface TimesheetApprovedModel {
    week_no: number;
    user_id: number;
    approved: string;
    start_date: number;
    end_date: Date;
    employee_name: string;
}
