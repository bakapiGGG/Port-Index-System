import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrl: './join-us.component.css',
})
export class JoinUsComponent implements OnInit {
  registerForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = ''; 

  constructor(private router: Router,
      private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        // If the request is successful
        () => {
          // Display success message and login button
          this.successMessage = 'Account created. Please sign in to build your expert profile.';
          this.errorMessage = '';
        },
        // If the requets fails
        () => {
          // Display error message
          this.errorMessage = 'Please enter a valid email and password';
          this.successMessage = '';
        }
      );
    }
    else {
      // Display error message
      this.errorMessage = 'Please enter a valid email and password';
      this.successMessage = '';
    }
  }

  onClose() {
    this.registerForm.reset();
  }

  onSignIn() {
    this.router.navigate(['/login-user']);
  }

  onNoClick() {
    this.router.navigate(['/user-account']);
  }

  
}
