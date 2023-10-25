export class Movie{
    constructor(
        public Id : number,
        public Title : string,
        public Poster : string,
        public Year : string,
        public imdbID : string,
        public imdbRating : string = "N/A",
        public Plot : string = "",
        public Genre : string ="",
        public Added : boolean = false
        )
        {
        this.imdbRating = "N/A",
        this.Plot  = "",
        this.Genre ="",
        this.Added  = false,
        this.Id = 0
        }
}