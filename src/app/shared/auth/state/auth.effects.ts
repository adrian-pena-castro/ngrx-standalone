import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  loginUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.userLogin),
      switchMap((action) =>
        this.authService
          .loginUser({ email: action.email, password: action.password })
          .pipe(
            map((response) =>
              AuthActions.loginUserSuccess({
                id: response.user.id,
                accessToken: response.accessToken,
              })
            ),
            catchError((error) => of(AuthActions.loginUserFailure({ error })))
          )
      )
    );
  });

  navigateToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginUserSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
