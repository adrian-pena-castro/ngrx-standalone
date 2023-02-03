import { createAction, props } from '@ngrx/store';

export const userLogin = createAction(
  '[Login Page] Login User',
  props<{ email: string; password: string }>()
);

export const loginUserSuccess = createAction(
  '[Auth API] Login User Success',
  props<{ id: number; accessToken: string }>()
);

export const loginUserFailure = createAction(
  '[Auth API] Login User  Failure',
  props<{ error: any }>()
);