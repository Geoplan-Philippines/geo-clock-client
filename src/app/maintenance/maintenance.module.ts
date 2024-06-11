import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaintenanceComponent } from "./maintenance.component";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../material.module";

@NgModule({
    declarations: [MaintenanceComponent],
    imports: [CommonModule, SharedModule, MaterialModule],
})
export class MaintenanceModule {}
