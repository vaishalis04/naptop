import { CanActivateFn } from '@angular/router';
import { roleWiseAccess } from '../app.config';

export const authGuard: CanActivateFn = (route, state) => {

  const userStringObj = localStorage.getItem('user');
  if (!userStringObj) {
    return false;
  }
  const user = JSON.parse(userStringObj);
  const userRole = user.role;
  const page = state.url.split('/')[1];
  const pageAccess = roleWiseAccess.find((p) => p.page === page);
  if (!pageAccess) {
    return false;
  }
  const roles = pageAccess.roles;
  if (!roles.includes(userRole)) {
    return false;
  }
  return true;
};
