import { Component, Inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
@Component({
    selector: "app-headsup-dialog",
    templateUrl: "./headsup-dialog.component.html",
    styleUrls: ["./headsup-dialog.component.scss"],
})
export class HeadsupDialogComponent {
    constructor(
        private angularAuth: AngularFireAuth,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<HeadsupDialogComponent>,
    ) {}
    cancel() {}
    onSignOutClick() {
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        this.angularAuth
            .signOut()
            .then(() => {
                console.log("sign out successfully");
                this.dialogRef.close();
                this.router.navigate(["/login"]);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
