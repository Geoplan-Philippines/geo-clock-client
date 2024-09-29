// angular & firebase dependencies
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// services
import { AuthenticationService } from '../_service/authentication.service';

//mat
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EncryptionService } from '../_guards/encrpytion.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    users: any[] = [];
    LoggedinEmail: string = '';
    private requiredRole: string = '';

    errorMessage: string | null = null;

    constructor(
        private angularAuth: AngularFireAuth,
        private authenticationService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute, // Include route here
        private _snackBar: MatSnackBar,
        private encrypt: EncryptionService
    ) {}

    ngOnInit() {
        this.loadUser();
        this.userInfo();
        this.requiredRole = this.route.snapshot.data['role'];
        // console.log('Required Role:', this.requiredRole);
    }

    // firebase output email
    userInfo() {
        this.angularAuth.authState.subscribe((user) => {
            if (user) {
                this.LoggedinEmail = user.email as string;
            }
        });
    }

    // GET database value
    loadUser() {
        this.authenticationService.getUser().subscribe((res: any) => {
            const ds = res;
            // console.log(ds);
            this.users = ds;
        });
    }

    // popup of login google
    googleSignIn() {
        this.angularAuth
            .signInWithPopup(new GoogleAuthProvider())
            .then((result: any) => {
                console.log('success');
                const userEmail = result.user.email;
                this.credential(userEmail);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // signout of google
    // onSignOutClick() {
    //     this.angularAuth
    //         .signOut()
    //         .then(() => {
    //             console.log("sign out successfully");
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    credential(userEmail: string) {
        let userFound = false; // Initialize a flag to track if the user is found
        let userDeact = false;
        for (let i = 0; i < this.users.length; i++) {
            if (userEmail === this.users[i].email) {
                userFound = true; // Set flag to true since user is found
                if (this.users[i].is_active === true) {
                    userDeact = true;
                    this.encrypt.setItem('id', this.users[i].id);

                    switch (this.users[i].role) {
                        case 'superAdmin':
                            this.router.navigate(['/attendance']);
                            this.encrypt.setItem('role', this.users[i].role);
                            break;
                        case 'admin':
                            this.router.navigate(['/attendance']);
                            this.encrypt.setItem('role', this.users[i].role);
                            break;
                        case 'user':
                            this.router.navigate(['/attendance']);
                            this.encrypt.setItem('role', this.users[i].role);
                            break;
                        default:
                            console.log('error sa role');
                    }
                    break;
                }
            }
        }
        if (!userFound) {
            this.angularAuth
                .signOut()
                .then(() => {
                    // alert("email not exist");
                    this.openSnackBar(
                        'The account is not authorized please contact the Administrator',
                        'okey'
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (!userDeact) {
            this.angularAuth
                .signOut()
                .then(() => {
                    // alert("email not exist");
                    this.openSnackBar('Your Account has been Deactivated', 'okey');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2 * 5000,
            horizontalPosition: 'left',
            verticalPosition: 'top',
        });
    }
}
