import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000/users'; // Fake API URL

  constructor(
    private http: HttpClient,
  ) {}

  register(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  login(email: any, password: any): Observable<any> {
    console.log("Username and password:", email, password);
    return this.http.get<any[]>(this.apiUrl).pipe(
      // Log the users array that you get from the API
      tap(users => console.log('Users from API:', users)),
      map(users => users.find(user => user.email === email && user.password === password))
    );
  }
}
