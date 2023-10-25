import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject} from "rxjs";
import { Movie } from "./movie.model";
import { DatabaseService } from "./database.service";

@Injectable({providedIn: 'root'})

export class MovieService
{
    apiKey : string = "2969bcba";
    foundMovies : Movie [] = [];
    movieWatchlist : Movie[] = [];
    searchTerm = "";
    pages = 1;

    movieObs = new Subject<boolean>();
    movieWarchlistChangedObs = new Subject<boolean>();
    detailsObs = new Subject<Movie>();
    errorObs = new Subject<string>();


    constructor(private http : HttpClient, private databaseService : DatabaseService){}


    addMovieToTheWatchlist(movie : Movie) {
        movie.Added = true;
        this.movieWatchlist.push(movie);
        this.databaseService.addMovie(movie);
        this.movieObs.next(true);
    }

    setMovies(movies : Movie []) {
        this.movieWatchlist = movies.slice();
    }

    getMovies() {
        return this.movieWatchlist.slice();
    }

    removeMovie(movie : Movie) {
        for(let i = 0; i < this.foundMovies.length; i++) {
            if(this.foundMovies[i].imdbID === movie.imdbID) {
                this.foundMovies[i].Added = false;
          }
        }
        for(let i = 0; i < this.movieWatchlist.length; i++) {
            if(this.movieWatchlist[i].imdbID === movie.imdbID) {
                this.movieWatchlist[i].Added = false;
                this.movieWatchlist.splice(i,1);
                this.movieWarchlistChangedObs.next(true);
          }
        }
        this.databaseService.removeMovie(movie);
    }

    search( searchTerm : string) {
        if(this.searchTerm != searchTerm) {
            this.foundMovies = [];
            this.pages = 1;
            this.searchTerm = searchTerm;
        };

        if(searchTerm != "")
        {
         this.http.get<{Response : boolean, Search ?: Movie [], totalResults ?: number, Error ?: string}>("https://www.omdbapi.com/?s=" + searchTerm + "&page=" + this.pages + "&apikey=" + this.apiKey)
            .subscribe(
                data => {
                    this.saveFoundMovies(data);
                    if(data.Error) {
                        this.errorObs.next(data.Error);
                        throw data.Error;
                    }
                }
            );
        }
    }


    getFoundMovies() {
        return this.foundMovies.slice();
    }

    saveFoundMovies(data : {Response : boolean, Search ?: Movie [], totalResults ?: number, Error ?: string}) {
        if(data.Search) {
            for(let i = 0; i < data.Search.length; i++) {
                for(let j = 0; j < this.movieWatchlist.length; j++) {
                    if(data.Search[i].imdbID === this.movieWatchlist[j].imdbID) {
                        data.Search[i].Added = true;
                    }
                }
            }

            for(let i = 0; i < data.Search.length; i++) {
                data.Search[i] = this.getMovieDetail(data.Search[i]);
            }

            if(this.foundMovies.length < 10*this.pages) {
                this.foundMovies.push(...data.Search);
            }

            this.movieObs.next(true);
            console.log(this.foundMovies);
        }
    }

    getMovieDetail(movie : Movie) {
        this.http.get<{imdbRating : string, Genre : string, Plot : string}>("https://www.omdbapi.com/?i=" + movie.imdbID + "&apikey=" + this.apiKey)
            .subscribe (
                (details) => {
                    movie.imdbRating = details.imdbRating;
                    movie.Genre = details.Genre;
                    movie.Plot = details.Plot;
                }
            );
        return movie;
    }

    showMore() {
        this.pages++;
        this.search(this.searchTerm);
    }

    seeDetails(movie : Movie) {
        setTimeout(()=>{this.detailsObs.next(movie)},1);
    }
}