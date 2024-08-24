import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update-holiday-modal',
  templateUrl: './update-holiday-modal.component.html',
  styleUrls: ['./update-holiday-modal.component.scss']
})
export class UpdateHolidayModalComponent {
formData!: FormGroup<any>;

submitForm() {
throw new Error('Method not implemented.');
}

}
