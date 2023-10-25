import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  @Input() index !: number;
  @Input() movie !: Movie;

  constructor( private movieService : MovieService) {}

  ngOnInit(): void {}

  onAddMovieToTheWatchlist() {
    this.movieService.addMovieToTheWatchlist(this.movie);
  }


  onRemoveMovie() {
    this.movieService.removeMovie(this.movie);
  }
  
  onSeeDetails() {
    this.movieService.seeDetails(this.movie); 
  }

}
