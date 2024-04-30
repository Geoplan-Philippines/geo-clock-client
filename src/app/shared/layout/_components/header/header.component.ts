import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { MatDialog } from "@angular/material/dialog";
import { HeadsupDialogComponent } from "src/app/shared/ui/headsup-dialog/headsup-dialog.component";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
    mobileMenuOpen: boolean = false;

    constructor(
        private router: Router,
        private angularAuth: AngularFireAuth,
        public dialog: MatDialog,
    ) { }

    // logout auth
    // logout() {
    //     this.onSignOutClick();
    // }
    // signout of googlex
    // onSignOutClick() {
    //     const confirmation = confirm("Do You want to log out?");
    //     if (confirmation) {
    //         localStorage.removeItem("role");
    //         this.angularAuth
    //             .signOut()
    //             .then(() => {
    //                 console.log("sign out successfully");
    //                 this.router.navigate(["/login"]);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             });
    //     }
    // }

    @ViewChild("userMenuWrapper")
    userMenuWrapper!: ElementRef;
    @ViewChild("sidemenu")
    menuside!: ElementRef;

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    openDialog() {
        const dialogRef = this.dialog.open(HeadsupDialogComponent, {
            data: { key: "Are you sure you want to log out?" }, // Replace key, value with your actual data
        });
    }
}
