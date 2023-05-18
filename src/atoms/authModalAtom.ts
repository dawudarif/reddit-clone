import { atom } from 'recoil';

export interface AuthModalState {
  open: boolean;
  view: 'login' | 'signup' | 'resetPassword';
  // string can also be used and we are defining specific strings
}

const defaultModalState: AuthModalState = {
  open: false,
  view: 'login',
};

export const AuthModalState = atom<AuthModalState>({
  // atom is of type AuthModalState
  key: 'authModalState',
  // key is required / unique identifier
  default: defaultModalState,
});
