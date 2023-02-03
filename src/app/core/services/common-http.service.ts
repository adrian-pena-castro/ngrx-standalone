import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnvironment } from '../config/i-environment';
import { ENVIRONMENT } from '../utils/environment.token';

@Injectable({
  providedIn: 'root',
})
export class CommonHttpService {
  constructor(
    private httpClient: HttpClient,
    @Inject(ENVIRONMENT) readonly environment: IEnvironment
  ) {}

  post<T>(url: string, body: unknown = {}): Observable<T> {
    return this.httpClient.post<T>(`${this.environment.apiUrl}/${url}`, body, {
      headers: this.headers,
    });
  }

  get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(`${this.environment.apiUrl}/${url}`, {
      headers: this.headers,
    });
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }
}
