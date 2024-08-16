// external dependencies
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { HeaderComponent } from './layout/_components/header/header.component';
import { FooterComponent } from './layout/_components/footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { ButtonComponent } from './ui/button/button.component';
import { CardComponent } from './ui/card/card.component';
import { AsideComponent } from './layout/_components/aside/aside.component';
import { BreadcrumbsComponent } from './ui/breadcrumbs/breadcrumbs.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { HeadsupDialogComponent } from './ui/headsup-dialog/headsup-dialog.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        LayoutComponent,
        ButtonComponent,
        CardComponent,
        AsideComponent,
        BreadcrumbsComponent,
        HeadsupDialogComponent,
        SpinnerComponent,
    ],
    imports: [CommonModule, MaterialModule, RouterModule],
    exports: [
        HeaderComponent,
        FooterComponent,
        LayoutComponent,
        ButtonComponent,
        AsideComponent,
        BreadcrumbsComponent,
        CardComponent,
        SpinnerComponent,
    ],
})
export class SharedModule {}
