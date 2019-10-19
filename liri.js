require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var requestType = process.argv[2];
var searchItem = process.argv[3];

switch (requestType) {
    case "spotify-this-song":
        // if song wasn't entered in arguments - default to "The Sign"
        if (searchItem === undefined) {
            searchItem = "The Sign";
        }

        spotify.search(
          { type: "track", query: searchItem, limit: 30 },
          function(err, data) {
            if (err) {
              return console.log("Error occurred: " + err);
            }
            
            for (var i = 0; i < data.tracks.items.length; i++) {
              if (data.tracks.items[i].name.toLowerCase() === searchItem.toLowerCase()) {
                console.log("  ------------  ");
                console.log("Song Name: " + data.tracks.items[i].name);
                console.log(
                    "Artist: " + data.tracks.items[i].artists[0].name
                );
                console.log("Album: " + data.tracks.items[i].album.name);
                if (data.tracks.items[i].preview_url != null) {
                    console.log(
                        "Listen to a bit of the song: " +
                            data.tracks.items[i].preview_url
                    );
                } else {
                    console.log("No song preview is available.");
                }
                console.log("  ------------  ");
                return false;
              }
            }
            console.log("There was no exact match to that song name.")
          });
        break;

    case "concert-this":
        var queryURL = "https://rest.bandsintown.com/artists/" + searchItem + "/events?app_id=codingbootcamp";
        axios.get(queryURL).then(function(response) {
          if (response.data[0] != undefined) {
            console.log("  ------------  ")
            console.log("Venue Name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("Venue Name: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));
            console.log("  ------------  ");
            return false;
          }
          console.log("Your band is not touring right now.")
        });

        break;

    case "movie-this":
      // if no movie was entered, default to Mr. Nobody
      if (searchItem === undefined) {
        searchItem = "Mr. Nobody";
      }

      var queryURL = "http://www.omdbapi.com/?apikey=" + keys.obdb_key + "&t=" + searchItem;

      axios.get(queryURL).then(function(response) {
        if (response.data.Error) {
          console.log(response.data.Error);
          return false;
        }
        console.log("  ------------  ");
        console.log("Movie Title: " + response.data.Title);
        console.log("Year Released: " + moment(response.data.Released, "DD MMM YYYY").format("YYYY"));
        console.log("Rating: " + response.data.Rated.toUpperCase());
        console.log("IMDB Rating: " + response.data.imdbRating)
        response.data.Ratings.forEach(element => {
          if (element.Source === "Rotten Tomatoes") {
            console.log("Rotten Tomatoes Rating: " + element.Value);
          }
        });
        console.log("Country Produced: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("  ------------  ");
      });
        break;
    
    case "do-what-it-says":

        break;

    default:
        break;
}
