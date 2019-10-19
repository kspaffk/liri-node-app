require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");

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
          { type: "track", query: searchItem, limit: 10 },
          function(err, data) {
            if (err) {
              return console.log("Error occurred: " + err);
            }
            
            for (var i = 0; i < data.tracks.items.length; i++) {
              if (data.tracks.items[i].name.toLowerCase() === searchItem.toLowerCase()) {
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
                console.log(" --------------------------- ");
                return false;
              }
            }
            console.log("There was no exact match to that song name.")
          });
        break;

    case "concert-this":
        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        break;

    case "movie-this":
        break;
    
    case "do-what-it-says":
        break;

    default:
        break;
}
