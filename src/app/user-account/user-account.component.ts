import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { count } from 'ag-grid-enterprise/dist/lib/ag-charts-community/module-support';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})
export class UserAccountComponent implements OnInit {

  constructor(config: NgbTooltipConfig) {
    // customize default values of tooltips used by this component tree
    config.placement = 'top';
    config.triggers = 'hover';
  }

  tooltipText = 'Number of years: 0';


  userForm = new FormGroup({
    name: new FormControl(''),
    salutation: new FormControl(''),
    designation: new FormControl(''),
    industry: new FormControl(''),
    role: new FormControl(''),
    experience: new FormControl(''),
    businessEmail: new FormControl(''),
    country: new FormControl(''),
  });

  ngOnInit() {
    // This method is called when the component is initialized
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.userForm.value);
  }

  updateTooltip(input: any) {
    this.tooltipText = `Number of years: ${input.value}`;
  }

}
