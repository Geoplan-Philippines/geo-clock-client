// external dependencies
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// pages
import { TimesheetComponent } from "./timesheet/timesheet.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EmployeeComponent } from "./employee/employee.component";
import { TrainingComponent } from "./training/training.component";
import { authGuard } from "./authentication/_guards/auth.guard";
import { RoleAuthGuard } from "./authentication/_guards/role.guard";

import { AngularFireAuthGuard, redirectUnauthorizedTo } from "@angular/fire/compat/auth-guard";
import { LoginComponent } from "./authentication/login/login.component";
import { RegisterComponent } from "./authentication/register/register.component";
import { TimesheetUserComponent } from "./timesheet-user/timesheet-user.component";
import { TimesheetApprovedComponent } from "./timesheet-approved/timesheet-approved.component";

import { ProfileComponent } from "./profile/profile.component";
import { ProjectsComponent } from "./projects/projects.component";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["login"]);
const routes: Routes = [
    {
        path: "",
        component: LoginComponent,
        canActivate: [authGuard],
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [authGuard],
    },
    {
        path: "projects",
        component: ProjectsComponent,
    },
    {
        path: "register",
        component: RegisterComponent,
    },
    {
        path: "profile",
        // component: LoginComponent,
        component: ProfileComponent,
    },
    {
        path: "timesheet-approved",
        // component: LoginComponent,
        component: TimesheetApprovedComponent,
        canActivate: [AngularFireAuthGuard, RoleAuthGuard],
        data: {
            authGuardPipe: redirectUnauthorizedToLogin,
            role: ["admin", "superAdmin"]
        },
    },
    {
        path: "timesheet",
        component: TimesheetComponent,
        // firebase auth
        canActivate: [AngularFireAuthGuard],
        data: {
            authGuardPipe: redirectUnauthorizedToLogin,
        },
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AngularFireAuthGuard, RoleAuthGuard],
        data: {
            authGuardPipe: redirectUnauthorizedToLogin,
            role: ["admin", "superAdmin"]
        },
    },
    {
        path: "employee",
        component: EmployeeComponent,
        canActivate: [AngularFireAuthGuard, RoleAuthGuard],
        data: {
            authGuardPipe: redirectUnauthorizedToLogin,
            role: ["superAdmin"]
        },
    },
    {
        path: "training",
        component: TrainingComponent,
        canActivate: [AngularFireAuthGuard, RoleAuthGuard],
        data: {
            authGuardPipe: redirectUnauthorizedToLogin,
            role: ["admin", "superAdmin"]
        },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
