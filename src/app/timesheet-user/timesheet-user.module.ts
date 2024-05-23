import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { TimesheetUserComponent } from "./timesheet-user.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material.module";

@NgModule({
    declarations: [TimesheetUserComponent],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, MaterialModule],
    exports: [TimesheetUserComponent],
})
export class TimesheetUserModule {}
