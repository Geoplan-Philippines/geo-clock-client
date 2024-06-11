import { Component, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "app-maintenance",
    templateUrl: "./maintenance.component.html",
    styleUrls: ["./maintenance.component.scss"],
})
export class MaintenanceComponent {
    formData!: FormGroup; // Using definite assignment assertion
    constructor(
        private el: ElementRef,
        private fb: FormBuilder,
    ) {}
    ngOnInit(): void {}

    scrollToSection(sectionId: string) {
        const element = this.el.nativeElement.querySelector(`#${sectionId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }
    submitForm(): void {}
}
