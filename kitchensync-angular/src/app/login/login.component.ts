import { Component } from '@angular/core';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginInfo = {};

  constructor(private loginService: LoginService) { }

  login(email: string, password: string) {
    console.log(email, password);
    this.loginService.login(email, password).then(res => {
      console.log(res);
    });
  }


}
