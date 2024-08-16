import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsideService } from './_service/aside.service';

import { EncryptionService } from 'src/app/authentication/_guards/encrpytion.service';
@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {
    sideCategory: any;
    sidebarLinks: any;
    constructor(
        private router: Router,
        private asidebar: AsideService,
        private encrypt: EncryptionService
    ) {}

    ngOnInit() {
        const role = this.encrypt.getItem('role');
        this.loadSidebarData();
        // console.log("asdas")
    }

    isActive(route: string): boolean {
        return this.router.url === route;
    }

    loadSidebarData() {
        const siderole = this.encrypt.getItem('role');
        if (siderole !== null) {
            this.asidebar.getSidebarModule(siderole).subscribe((res: any) => {
                const ds = res;
                this.sideCategory = ds.map((category: { category_name: any; items: any }) => ({
                    category_name: category.category_name,
                    sidebarLinks: category.items, // Restructure items as sidebarLinks
                }));
                this.asideFunction();
            });
        } else {
            console.error("'role' not found in localStorage");
        }
    }

    asideFunction() {
        this.sidebarLinks = []; // Initialize sidebarLinks as an empty array
        for (let aside of this.sideCategory) {
            for (let asideItems of aside.sidebarLinks) {
                // Access sidebarLinks instead of items
                // console.log(asideItems);
                this.sidebarLinks.push(asideItems); // Push each item to the sidebarLinks array
            }
        }
    }
}
