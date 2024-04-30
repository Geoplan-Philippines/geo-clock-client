import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
// services
import { AuthenticationService } from "../_service/authentication.service";

@Injectable({
    providedIn: "root",
})
export class RoleAuthGuard implements CanActivate {
    users: any[] = [];
    LoggedinEmail: string = "";

    constructor(

        private router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
         // Check if role token is set in localStorage
         const roletoken = localStorage.getItem('role');
         if (!roletoken) {
             // Redirect to login or appropriate route if role token is not set
             this.router.navigate(['/login']); // Adjust this to your login route
             return false;
         }
         
         // Check if user has access to the requested route based on role
         const requiredRole = route.data["role"];
         if (requiredRole === roletoken) {
             return true;
         } 
         else if(requiredRole !== roletoken) {
            switch(roletoken){
                case "admin":
                        this.router.navigate(['/timesheet']); 
                     
                        break;
                case "user":
                        this.router.navigate(['/timesheet']); 
              
                        break;
                    default: console.log("error sa role")
            }
         }
         return false;
     }
     }
