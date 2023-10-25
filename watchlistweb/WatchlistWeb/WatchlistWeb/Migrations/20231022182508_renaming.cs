using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchlistWeb.Migrations
{
    /// <inheritdoc />
    public partial class renaming : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImdbRating",
                table: "Movies",
                newName: "imdbRating");

            migrationBuilder.RenameColumn(
                name: "ImdbID",
                table: "Movies",
                newName: "imdbID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "imdbRating",
                table: "Movies",
                newName: "ImdbRating");

            migrationBuilder.RenameColumn(
                name: "imdbID",
                table: "Movies",
                newName: "ImdbID");
        }
    }
}
