
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';
import { DatabaseService } from '../database.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchTerm = "";
  foundMovies : Movie []  = [];
  error = false;
  errorMessage = "";
  
  

  movieSub !: Subscription;
  errorSub !: Subscription;
  signedOutSub !: Subscription;
  getMoviesSub !:Subscription;
  

  constructor(private movieServce : MovieService, private databaseService : DatabaseService,private router : Router, private route : ActivatedRoute){}

  ngOnInit(): void 
  {
    this.databaseService.retriveSignUpInfo();
    this.databaseService.getMovies();
    this.foundMovies = this.movieServce.getFoundMovies();
    this.movieSub =  this.movieServce.movieObs
      .subscribe(
        () => {
          this.foundMovies = this.movieServce.getFoundMovies();
        }
      );
    this.errorSub =  this.movieServce.errorObs
        .subscribe (
          errorMsg => {
            this.errorMessage = errorMsg;
            this.error = true;
          }
        );
    this.signedOutSub = this.databaseService.signedOutObs
      .subscribe(
        () => {
          this.router.navigate(["/login"]);
        }
      );
      this.getMoviesSub = this.databaseService.getMoviesObs
        .subscribe(
          (movies : Movie []) => {
            this.movieServce.setMovies(movies);
            console.log(movies);
          }
        );
  }

  onSearch() {
    this.error = false;
    this.movieServce.search(this.searchTerm);
  }
  

  thereIsMore() {
    return this.foundMovies.length === 10*this.movieServce.pages;
  }

  onShowMore() {
    this.movieServce.showMore();
  }

  onSignOut() {
    this.databaseService.signOut();
    this.movieServce.foundMovies = [];
  }

  
  ngOnDestroy(): void {
    this.movieSub.unsubscribe();
    this.signedOutSub.unsubscribe();
    this.getMoviesSub.unsubscribe();
  }
  
}
