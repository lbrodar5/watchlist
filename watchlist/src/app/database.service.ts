import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, catchError, throwError } from "rxjs";
import { Movie } from "./movie.model";

@Injectable({providedIn: 'root'})

export class DatabaseService
{
    apiUrl : string = "https://watchlistwebapi.azurewebsites.net"
    apiKey : string = ""
    username : string = ""
    errorObs = new Subject<string>();
    messageObs = new Subject<string>();
    signedOutObs = new Subject<boolean>();
    getMoviesObs = new Subject<Movie []>();
    constructor (private http : HttpClient,private router : Router) {}

    signIn(loginData : {username : string, password : string}) {
        this.messageObs.next("Signing in...");
        this.http.put<number>(this.apiUrl + "/api/Users/login",{name : loginData.username, password : loginData.password})
            .pipe(
                catchError(this.handleError)
            )
            .subscribe(
                {
                    next: data=> {
                        this.apiKey = data.toString();
                        this.username = loginData.username;
                        this.saveSignUpInfo();
                        this.getMovies();
                        this.router.navigate(["/search"]);
                        console.log("Signed in")
                    },
                    error: error => {
                        this.messageObs.next("");
                        this.errorObs.next(error);
                    }
                }
            )
    }
    register(data : {username : string, password : string}) {
        this.messageObs.next("Registering...");
        this.http.post(this.apiUrl + "/api/Users",{name : data.username, password : data.password}, {responseType: 'text'})
        .pipe(
            catchError(this.handleError)
        )
        .subscribe(
            {
                next :() => {
                    this.messageObs.next("Registered. Try signing in :)")
                },
                error: error => {
                    this.messageObs.next("");
                    this.errorObs.next(error);
                }
            }
        )

    }

    signOut() {
        this.http.put<any>(this.apiUrl + "/api/Users/logout?name=" + this.username + "&apiKey="+ this.apiKey,{})
        .pipe(
            catchError(this.handleError)
        )
        .subscribe(
            {
                next: () => {
                    this.apiKey = "",
                    this.username = ""
                    localStorage.removeItem("watchlistInfo");
                    localStorage.removeItem("watchlist");
                    this.signedOutObs.next(true);
                    console.log("Signed out")
                },
                error: error => {
                    this.errorObs.next(error);
                }
            }
        )
    }

    getMovies() {
        this.http.get<Movie []>(this.apiUrl + "/api/Movies/userMovies?name=" + this.username + "&apiKey="+ this.apiKey,{})
        .pipe(
            catchError(this.handleError)
        )
        .subscribe(
            {
                next: data => {
                    let movies : Movie [] = data;
                    movies.forEach(movie => movie.Added = true );
                    this.getMoviesObs.next(data);
                },
                error: error => {
                    this.errorObs.next(error);
                }
            }
        )
    }
    
    addMovie(movie : Movie) {
        this.http.post(this.apiUrl + "/api/Movies?name=" + this.username + "&apiKey="+ this.apiKey,movie, {responseType: 'text'})
        .subscribe(
            {
                next: data => {
                    console.log(data);
                },
                error: error => {
                    this.errorObs.next(error);
                }
            }
        )
    }

    removeMovie(movie : Movie) {
        this.http.delete<any>(this.apiUrl + "/api/Movies?imdbid="+ movie.imdbID +"&name=" + this.username + "&apiKey="+ this.apiKey)
        .pipe(
            catchError(this.handleError)
        )
        .subscribe(
            {
                next: data => {
                        if (data) {
                            console.log(data)
                        }
                    },
                error: error => {
                    this.errorObs.next(error);
                    }
            }
        )
    }

    saveSignUpInfo() {
        localStorage.setItem("watchlistInfo",JSON.stringify({name : this.username, apiKey: this.apiKey}));
    }

    retriveSignUpInfo() {
        if(localStorage.getItem("watchlistInfo")) {
            let watchlistSignUpInfo = JSON.parse(<string>localStorage.getItem("watchlistInfo"));
            this.username = watchlistSignUpInfo.name;
            this.apiKey= watchlistSignUpInfo.apiKey;
        } else {
            this.router.navigate(["/login"]);
        }
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(`Backend returned code ${error.status}, body was: `, error.error);

        }
        if (error.error.message) {
            return throwError(() => new Error(error.error.message[0]));
        } 
        if(error.error) {
            return throwError(() => new Error(JSON.parse(error.error).message[0]));
        }
        return throwError(() => new Error("Someting went wrong!"));
    }
}
