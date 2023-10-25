import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit, OnDestroy {

  movie !: Movie;
  movieSub !: Subscription;

  constructor( private movieService : MovieService, private router : Router, private route : ActivatedRoute){ }

  ngOnInit(): void {
    this.movieSub = this.movieService.detailsObs.subscribe(
      (movie : Movie) => {
        this.movie = movie;
      }
    );
  }


  onAddMovieToTheWatchlist() {
    this.movieService.addMovieToTheWatchlist(this.movie);
    this.onGoBack();
  }


  onRemoveMovie() {
    this.movieService.removeMovie(this.movie);
    this.onGoBack();
  }

  onGoBack() {
    this.router.navigate(["../"],{relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.movieSub.unsubscribe()
  }
}
