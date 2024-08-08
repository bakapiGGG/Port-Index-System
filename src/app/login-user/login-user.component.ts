import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent implements AfterViewInit {

  @ViewChild('successModal') successModal!: ElementRef;
  modal !: Modal;

  constructor(private fb: FormBuilder, private authService: AuthenticationService) { }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.successModal.nativeElement);
  }

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

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  

  onSubmit() {
    const { email, password } = this.loginForm.value;

    console.log("The form value is:", this.loginForm.value)

    this.authService.login(email, password).subscribe(
      user => {
        if (user) {
          // Login successful
          // Display success modal and nvaigate to another account
          this.modal.show();
          console.log('Login successful:', user);
        }

        else {
          // Login failed
          // Display error modal
          console.log('Login failed:', user);
        }

      },
      error => {
        console.error('Error:', error);
        // Display error modal
      }
    );
  }

}
