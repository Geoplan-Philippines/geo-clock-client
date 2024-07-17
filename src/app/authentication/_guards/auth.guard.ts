import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs'; // Import Observable from rxjs
import { map } from 'rxjs/operators';


// services
import { AuthenticationService } from "../_service/authentication.service";

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  //global
  users: any[] = [];
  LoggedinEmail: string = "";
  constructor(private afAuth: AngularFireAuth, private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user) {
      
      
    //google auth gaurd get email
    this.afAuth.authState.subscribe((user) => {
      if (user) {
          this.LoggedinEmail = user.email as string;
          console.log(user.email)
      }
  });
  //getting value from database
  this.authenticationService.getUser().subscribe((res: any) => {
      const ds = res;
      this.users = ds;

  //for loop of database
  for(let i = 0; i < this.users.length; i++) {
          //condition of email database and email google database
      if (this.LoggedinEmail === this.users[i].email) {
        if(this.users[i].is_active === true ){
          //condition role
          switch(this.users[i].role){
            case "superAdmin":
                    this.router.navigate(['/attendance']); 
                    break;
            case "admin":
                    this.router.navigate(['/attendance']); 
                    break;
            case "user":
                    this.router.navigate(['/attendance']); 
                    break;
          }
        }
        else if(this.users[i].is_active === false){
          console.log("Deactivated");
        }

          
      } else {
        // this.router.navigate(['/login']);
        console.log("error");
      }
  }
});

          // return false;
        }
        return true;
      })
    );
  }
}
