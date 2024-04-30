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
    userMenuOpen: boolean = false;
    mobileMenuOpen: boolean = false;

    constructor(
        private router: Router,
        private angularAuth: AngularFireAuth,
        public dialog: MatDialog,
    ) {}

    // logout auth
    // logout() {
    //     this.onSignOutClick();
    // }
    // signout of google
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

    toggleUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    // Close the menu if the user clicks outside of it
    @HostListener("document:click", ["$event"])
    onClick(event: MouseEvent) {
        const clickedInsideMenu = this.userMenuWrapper.nativeElement.contains(event.target);
        const clickedInsideMenu2 = this.menuside.nativeElement.contains(event.target);

        if (!clickedInsideMenu) {
            if (!clickedInsideMenu2) {
                this.userMenuOpen = false;
                this.mobileMenuOpen = false;
            } else {
                this.userMenuOpen = false;
            }
        }
    }
    openDialog() {
        const dialogRef = this.dialog.open(HeadsupDialogComponent, {
            data: { key: "Are you sure you want to log out?" }, // Replace key, value with your actual data
        });
    }
}
