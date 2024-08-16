import { Component } from '@angular/core';
import { TrainingService } from './_service/training.service';
import { EmployeeModel } from '../models/employee.model';
import { MatDialog } from '@angular/material/dialog';
import { AddTrainingComponent } from './_components/add-training/add-training.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-training',
    templateUrl: './training.component.html',
    styleUrls: ['./training.component.scss'],
    animations: [
        trigger('buttonMove', [
            state('inactive', style({ right: '0rem' })), // Initial state
            state('active', style({ right: '3rem' })), // Animated state
            transition('inactive <=> active', animate('200ms ease-in-out')), // Animation details
        ]),
    ],
})
export class TrainingComponent {
    constructor(
        private trainingService: TrainingService,
        public dialog: MatDialog
    ) {}
    trainingEntry: any = [];

    ngOnInit() {
        this.loadTimesheet();
    }

    loadTimesheet() {
        this.trainingService.getAllTrainingData().subscribe((res: any) => {
            const ds = res;
            this.trainingEntry = ds;
            // console.log(this.trainingEntry[0].employee_code);
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddTrainingComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }
}
