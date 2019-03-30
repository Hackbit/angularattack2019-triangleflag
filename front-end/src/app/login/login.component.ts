import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  name: string
  constructor() {}

  ngOnInit() {
    this.name = ''
  }

  login() {
    console.log(this.name)
  } 
}
