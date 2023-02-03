import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { LoginUserRequest } from './models/login-user-request.model';
import { LoginUserResponse } from './models/login-user-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: CommonHttpService) {}

  loginUser(loginUserRequest: LoginUserRequest): Observable<LoginUserResponse> {
    return this.http.post<LoginUserResponse>(
      'login',
      loginUserRequest
    );
  }
}
