import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const username = environment.JIRA_USERNAME;
  const password = environment.JIRA_PASSWORD;
  const authToken = 'Basic ' + btoa(username + ':' + password);

  const authReq = req.clone({
    setHeaders: {
      Authorization: authToken
    }
  });

  return next(authReq);
};
