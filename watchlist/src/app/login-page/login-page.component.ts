import { Component,  OnDestroy,  OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  constructor(private databaseService : DatabaseService,private router : Router) { }

  state : string = "Sign in";
  opositeState : string ="Register";
  errorMessage ="";
  message = "";
  errorSub !: Subscription;
  messageSub !: Subscription;

  ngOnInit(): void {
    if(localStorage.getItem("watchlistInfo")) {
      this.databaseService.retriveSignUpInfo();
      this.router.navigate(["/search"]);
    }

    this.errorSub = this.databaseService.errorObs
    .subscribe( 
      error => {
        this.errorMessage = error;
      }
    );

    this.messageSub = this.databaseService.messageObs
      .subscribe( 
        mess => {
          this.message= mess;
        }
    );
  }

  onSubmit(form : NgForm) {
    if( this.state === "Sign in") {
      this.onSignIn(form.value);
    } else {
      this.onRegister(form.value);
    }
  }

  onSignIn(data : {username : string, password : string}) {
    this.databaseService.signIn(data);
  }

  onRegister(data : {username : string, password : string}) {
    this.databaseService.register(data);
    this.onChangeState();
  }

  onChangeState() {
    this.errorMessage = ""
    if(this.state === "Sign in") {
      this.state = "Register";
      this.opositeState = "Sign in";
    } else {
      this.state = "Sign in";
      this.opositeState = "Register";
    }
  }
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
    this.messageSub.unsubscribe();
  }
}
