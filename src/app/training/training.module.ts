import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { TrainingComponent } from "./training.component";
import { MaterialModule } from "../material.module";
import { MatMenuModule } from "@angular/material/menu";
import { ReactiveFormsModule } from "@angular/forms";
import { AddTrainingComponent } from "./_components/add-training/add-training.component";

@NgModule({
    declarations: [TrainingComponent, AddTrainingComponent],
    imports: [CommonModule, SharedModule, MaterialModule, ReactiveFormsModule],
    exports: [],
})
export class TrainingModule { }
