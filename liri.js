require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var requestType = process.argv[2];
var searchItem = process.argv[3];
var output = "";


function runLiri(requestType, searchItem) {
  outputToFile(">> node liri.js " + requestType + ' "' + searchItem + '"\n');
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
                  if (data.tracks.items[i].preview_url != null) {
                      var previewURL = "\nListen to a bit of the song: " + 
                      data.tracks.items[i].preview_url;
                    } else {
                      previewURL = "\nNo song preview is available.";
                    }
                  output = "  ------------  \nSong Name: " + data.tracks.items[i].name + 
                  "\nArtist: " + data.tracks.items[i].artists[0].name + "\nAlbum: " + 
                  data.tracks.items[i].album.name + previewURL + "\n  ------------  \n";
                  outputToFile(output);
                  console.log(output);
                  return false;
                }
              }
              output = "  ------------  \nThere was no exact match to that song name.\n  ------------  \n";
              outputToFile(output);
              console.log(output);
            });
          break;

      case "concert-this":
          if (searchItem === undefined) {
            searchItem = "Taylor Swift";
        }

          var queryURL = "https://rest.bandsintown.com/artists/" + searchItem + "/events?app_id=codingbootcamp";
          axios.get(queryURL).then(function(response) {
            if (response.data[0] != undefined) {
              output = "  ------------  \nArtist: " + response.data[0].lineup[0] +
              "\nVenue Name: " + response.data[0].venue.name + 
              "\nVenue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country + 
              "\nVenue Date: " + moment(response.data[0].datetime).format("MM/DD/YYYY") + 
              "\n  ------------  \n";

              outputToFile(output);
              console.log(output);
            } else {
              output = ("  ------------  \nYour band is not touring right now.\n  ------------  \n");
              outputToFile(output);
              console.log(output);
            }
          }).catch(function (error) {
            if (error) {
              console.log("  ------------  \nThere was an error returning your query.\n  ------------  \n")
            }
          });

          break;

      case "movie-this":
        // if no movie was entered, default to Mr. Nobody
        if (searchItem === undefined) {
          searchItem = "Mr. Nobody";
        }

        var queryURL = "http://www.omdbapi.com/?apikey=" + keys.omdb_key + "&t=" + searchItem;

        axios.get(queryURL).then(function(response) {
          if (response.data.Error) {
            output = "  ------------  \n" + response.data.Error + "\n  ------------  \n";
            console.log(output)
            outputToFile(output);
            return false;
          }
          var tomRating = "";
          if (response.data.Ratings[0]) {
            response.data.Ratings.forEach(element => {
              if (element.Source === "Rotten Tomatoes") {
                tomRating = "\nRotten Tomatoes Rating: " + element.Value;
              } else if (tomRating === "") {
                tomRating = "\nRotten Tomatoes rating doesn't exist!";
              }
            });
          } else {
              tomRating = "\nRotten Tomatoes rating doesn't exist!";
          }

          output = "  ------------  \nMovie Title: " + response.data.Title + 
          "\nYear Released: " + moment(response.data.Released, "DD MMM YYYY").format("YYYY") + 
          "\nRating: " + response.data.Rated.toUpperCase() + 
          "\nIMDB Rating: " + response.data.imdbRating + tomRating + 
          "\nCountry Produced: " + response.data.Country +
          "\nLanguage: " + response.data.Language + 
          "\nPlot: " + response.data.Plot + 
          "\nActors: " + response.data.Actors +
          "\n  ------------  \n";

          outputToFile(output);
          console.log(output);
        }).catch(function (error) {
          if (error) {
            console.log("  ------------  \nThere was an error returning your query.\n  ------------  \n")
          }
        });
        break;
      
      case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function(err, data) {
          if (err) {
            console.log("Error reading the file.")
            return false;
          }
          var textInputArray = data.split(',"');
          textInputArray[1] = textInputArray[1].substring(0, textInputArray[1].length - 1);
          runLiri(textInputArray[0], textInputArray[1]);
        }); 
          break;

      default:
          break;
  }
}

function outputToFile(str) {
  fs.appendFile("log.txt", str, function(err) {
    if (err) {
      console.log("There was an error writing to log.txt")
    }
  });
}

runLiri(requestType, searchItem);
