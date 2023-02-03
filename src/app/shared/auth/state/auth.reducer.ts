import { Action, createFeature, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export interface State {
  id: number | null;
  accessToken: string | null;
  error: string | null;
  loading: boolean;
}
export const initialState: State = {
  id: null,
  accessToken: null,
  error: null,
  loading: false,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.userLogin, (state) => ({ ...state, loading: true })),
    on(AuthActions.loginUserSuccess, (state, action) => ({
      ...state,
      id: action.id,
      accessToken: action.accessToken,
      loading: false,
    })),
    on(AuthActions.loginUserFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    }))
  ),
});
