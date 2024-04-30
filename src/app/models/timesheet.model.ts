export interface TimesheetModel {
    id: number;
    is_approved: boolean;
    approved_by: string; // Corrected typo in the property name
    over_time: boolean;
    night_diff: boolean; // Corrected data type
    project_name: string;
    created_by_id: number;
    created_by: string;
    date_created: Date;

    entries: number[]; // Add the entries property
}
