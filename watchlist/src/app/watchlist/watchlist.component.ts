import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy {

  movieWatchlist : Movie[] = [];

  movieWatchlistChangedSub !: Subscription;
  getMoviesSub !: Subscription;


  constructor(private movieService : MovieService, private databaseService : DatabaseService) {}

  ngOnInit(): void {
    this.databaseService.retriveSignUpInfo();
    this.databaseService.getMovies();
    this.getMoviesSub = this.databaseService.getMoviesObs
    .subscribe(
      (movies : Movie []) => {
        this.movieService.setMovies(movies);
        this.movieWatchlist = this.movieService.getMovies();
        console.log(movies);
      }
    );

    this.movieWatchlistChangedSub = this.movieService.movieWarchlistChangedObs
    .subscribe(
      () => {
        this.movieWatchlist = this.movieService.getMovies();
      }
    );

  }

  ngOnDestroy(): void {
    this.movieWatchlistChangedSub.unsubscribe();
    this.getMoviesSub.unsubscribe();
  }
}
