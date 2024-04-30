import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";

@NgModule({
    declarations: [LoginComponent, RegisterComponent, RegisterComponent],
    imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, SharedModule],
    exports: [LoginComponent, RegisterComponent],
})
export class AuthenticationModule {}
