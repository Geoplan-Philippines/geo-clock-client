import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../material.module";
import { TimesheetApprovedComponent } from "./timesheet-approved.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SummaryComponent } from "./_components/summary/summary.component";
import { ClipboardModule } from "ngx-clipboard";

@NgModule({
    declarations: [TimesheetApprovedComponent, SummaryComponent],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, MaterialModule, ClipboardModule],
    exports: [TimesheetApprovedComponent],
})
export class TimesheetApprovedModule {}
