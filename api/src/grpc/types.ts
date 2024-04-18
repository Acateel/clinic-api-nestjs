import { Observable } from 'rxjs';

export interface Auth {
  login(t: object): Observable<any>;
}
