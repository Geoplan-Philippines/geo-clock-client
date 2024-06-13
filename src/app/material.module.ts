import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
// import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
    exports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
    ],
})
export class MaterialModule {}
