import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaintenanceComponent } from "./maintenance.component";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { DeleteConfirmModalComponent } from './_components/delete-confirm-modal/delete-confirm-modal.component';

@NgModule({
    declarations: [MaintenanceComponent, DeleteConfirmModalComponent],
    imports: [CommonModule, SharedModule, MaterialModule, ReactiveFormsModule],
})
export class MaintenanceModule {}
