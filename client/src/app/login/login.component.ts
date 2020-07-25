import { Component, OnInit } from '@angular/core';
import {LoginService} from '../service/login.service'
import { User } from '../models/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  user: User;

  constructor(private loginService : LoginService, private router : Router){ 
    this.user = new User();
  }

  ngOnInit(): void {
  }
  validateLogin(){
    if(this.user.email && this.user.password){
      this.loginService.validateLogin(this.user).subscribe(response => {
        console.log("result is", response);
        if(response['status'] == 'success'){
            this.router.navigate(['/home']);
        }
        else if (response['message'] =='Incorrect Username or Password'){
            alert("Invalid Credentials")
        }
      })
      
    }
    else{
      alert("Please enter credentials")
    }

  }
  
}
