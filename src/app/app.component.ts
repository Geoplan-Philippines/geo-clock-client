import { Component } from '@angular/core';

// constants
import { GENERAL } from './shared/constants/general';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = GENERAL.APP_TITLE;
}
