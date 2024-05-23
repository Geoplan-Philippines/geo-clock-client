// angular dependencies
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

// internal module
import { TimesheetModule } from "./timesheet/timesheet.module";

import { SharedModule } from "./shared/shared.module";
import { TrainingModule } from "./training/training.module";
import { EmployeeModule } from "./employee/employee.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { environment } from "src/environments/environment.dev";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { TimesheetUserModule } from "./timesheet-user/timesheet-user.module";
import { TimesheetApprovedModule } from "./timesheet-approved/timesheet-approved.module";

import { ReactiveFormsModule } from "@angular/forms";
import { ProjectsComponent } from "./projects/projects.component";
import { ProjectsModule } from "./projects/projects.module";
import { ProfileModule } from "./profile/profile.module";
import { DashboardModule } from "./dashboard/dashboard.module";
@NgModule({
    declarations: [AppComponent],
    imports: [
        ProfileModule,
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        TimesheetApprovedModule,
        BrowserAnimationsModule,
        TimesheetModule,
        TimesheetUserModule,
        HttpClientModule,
        TrainingModule,
        EmployeeModule,
        AuthenticationModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        ProjectsModule,
        DashboardModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
