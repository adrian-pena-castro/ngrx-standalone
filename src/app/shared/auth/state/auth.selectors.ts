import { authFeature } from './auth.reducer';

export const {
  selectAccessToken,
  selectError,
  selectId,
  selectLoading,
  selectAuthState,
} = authFeature;
