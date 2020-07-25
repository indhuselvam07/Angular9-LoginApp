import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }
  validateLogin(user: User){
    return this.http.post(environment.baseURL + '/api/login',{
        email : user.email,
        password : user.password
    })
}
} 
