import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaintenanceComponent } from "./maintenance.component";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../material.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [MaintenanceComponent],
    imports: [CommonModule, SharedModule, MaterialModule, ReactiveFormsModule],
})
export class MaintenanceModule {}
