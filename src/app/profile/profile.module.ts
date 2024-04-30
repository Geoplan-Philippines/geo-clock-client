import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile.component";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../material.module";

@NgModule({
    declarations: [ProfileComponent],
    imports: [CommonModule, SharedModule, MaterialModule],
})
export class ProfileModule {}
