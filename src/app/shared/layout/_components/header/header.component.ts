import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { HeadsupDialogComponent } from 'src/app/shared/ui/headsup-dialog/headsup-dialog.component';
import { HeaderService } from './_service/header.service';
import { EncryptionService } from 'src/app/authentication/_guards/encrpytion.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    mobileMenuOpen: boolean = false;
    headerCategory: any;
    sidebarLinks: any;

    constructor(
        private router: Router,
        private angularAuth: AngularFireAuth,
        public dialog: MatDialog,
        private headerService: HeaderService,
        private encrypt: EncryptionService
    ) {}

    ngOnInit() {
        this.loadHeaderBarData();
        // const role = localStorage.getItem("role");
        // console.log(role)
    }

    @ViewChild('userMenuWrapper')
    userMenuWrapper!: ElementRef;
    @ViewChild('sidemenu')
    menuside!: ElementRef;

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    openDialog() {
        const dialogRef = this.dialog.open(HeadsupDialogComponent, {
            data: { key: 'Are you sure you want to log out?' }, // Replace key, value with your actual data
        });
    }

    loadHeaderBarData() {
        const siderole = this.encrypt.getItem('role');
        if (siderole !== null) {
            this.headerService.getSidebarModule(siderole).subscribe((res: any) => {
                const ds = res;
                this.headerCategory = ds.map((category: { category_name: any; items: any }) => ({
                    category_name: category.category_name,
                    sidebarLinks: category.items,
                }));
                this.headerFunction();
            });
        } else {
            console.error("'role' not found in localStorage");
        }
    }

    headerFunction() {
        this.sidebarLinks = [];
        for (let head of this.headerCategory) {
            for (let asideItems of head.sidebarLinks) {
                this.sidebarLinks.push(asideItems);
            }
        }
    }
}
