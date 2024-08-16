import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimesheetComponent } from './timesheet.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { DeleteConfirmationModalComponent } from './_components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DescriptionComponent } from './_components/description/description.component';
import { WholeDeleteModalComponent } from './_components/whole-delete-modal/whole-delete-modal.component';

@NgModule({
    declarations: [
        TimesheetComponent,
        DeleteConfirmationModalComponent,
        DescriptionComponent,
        WholeDeleteModalComponent,
    ],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, MaterialModule],
    providers: [DatePipe],
    exports: [TimesheetComponent],
})
export class TimesheetModule {}
