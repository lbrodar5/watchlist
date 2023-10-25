import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MovieDetailComponent } from "./movie-detail/movie-detail.component";
import { SearchComponent } from "./search/search.component";
import { WatchlistComponent } from "./watchlist/watchlist.component";
import { LoginPageComponent } from "./login-page/login-page.component";

const appRoutes : Routes = 
[
    {path:"", redirectTo:"/login", pathMatch : "full"},
    {path:"login",component:LoginPageComponent},
    {path :"search", component: SearchComponent},
    {path :"watchlist", component: WatchlistComponent},
    {path :"watchlist/:id", component: MovieDetailComponent},
    {path :"search/:id", component: MovieDetailComponent},
]

@NgModule(
    {
     imports: [RouterModule.forRoot(appRoutes)],
     exports: [RouterModule]
    }
)

export class AppRoutingModule
{
}