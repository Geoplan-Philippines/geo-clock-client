import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {
  formData!: FormGroup; // Using definite assignment assertion

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.formData = this.fb.group({
      employeeCode: ['', Validators.required],
      type: ['', Validators.required],
      cover: ['', Validators.required],
      date: ['', Validators.required],
      duration: ['', Validators.required],
      districtPartner: ['', Validators.required],
      details: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.formData.valid) {
      console.log('Form submitted with data:', this.formData.value);
      // You can now send the form data to your backend or perform further actions.
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
      // Provide user feedback about invalid form.
    }
  }
}
