
require("dotenv").config();
var Twitter = require('twitter');

const myKeys = require("./keys");

// var twitterKeys = myKeys.twitter;
var spotifyId = myKeys.spotify.id;
var spotifySecret = myKeys.spotify.secret;
var value = process.argv[2];
var value2 = process.argv[3];

//Start app
whatToDo(value, value2);


function whatToDo(value, value2) {
  switch (value) {
    case "my-tweets":
      value2 = "@donzarrillojr";
      getMyTweets(value2);

      break;
    case "spotify-this-song":
      // node liri.js spotify-this-song "viva la vida"
      
      if (value2 === undefined) {
        value2 = "The Sign";
      }
      console.log("Get Song - " + value2);
      getMusic(value2);
      break;
    case "movie-this":
      // node liri.js movie-this jaws
      // console.log("Get Movie");
      // var movieName = process.argv[3];
      //   * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
      //  * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>
      //  * It's on Netflix!
      if (value2 === undefined) {
        value2 = "Mr. Nobody";
        console.log("If you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix");
      }
      getMovie(value2);
      break;
    case "do-what-it-says":
      // node liri.js do-what-it-says
      console.log("do-what-it-says");
      doReadFile();

      break;
    default:
      console.log("In default");

      break;
  }
}

function getMyTweets(value2) {
  // Setting up twitter package as per docs
  var client = new Twitter({
    consumer_key: myKeys.twitter.consumer_key,
    consumer_secret: myKeys.twitter.consumer_secret,
    access_token_key: myKeys.twitter.access_token_key,
    access_token_secret: myKeys.twitter.access_token_secret
  });
  
  var params = {
    screen_name: value2,
    count: 20
  };
  
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
      
    // if no error, display the 20 most recent tweets & creation date - or less tweets if there aren't 20
    if (!error) {
      console.log("Tweets");
      for (var key in tweets) {
        console.log("\n" + tweets[key].text);
        console.log(tweets[key].created_at);
      }

      var myLog = "\r\n my-tweets " + "Tweeted " + tweets[key].text;
      myLog += " Created: " + tweets[key].created_at;
      writeToLog(myLog);
    }
    // if an error returns, log it to the console
    else {
      console.log("Error: " + error);
    }
  });

 
}

function writeToLog(myLog) {
  // Core node package for reading and writing files
  var fs = require("fs");

  // We then store the textfile filename given to us from the command line
  var textFile = "log.txt";

  // We then append the contents "Hello Kitty" into the file
  // If the file didn't exist then it gets created on the fly.
  fs.appendFile(textFile, myLog, function (err) {

    // If an error was experienced we say it.
    if (err) {
      console.log(err);
    }

  });
}

function doReadFile() {
  var fs = require("fs");
  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    console.log("In read " + dataArr[0]);
    whatToDo(dataArr[0], dataArr[1]);
  });
}

function getMusic(mySong) {
  var Spotify = require('node-spotify-api');

  var spotify = new Spotify({
    id: spotifyId,
    secret: spotifySecret
  });

  spotify.search({ type: "track", query: '"' + mySong + '"' }, function (err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    } else {
      var info = data.tracks.items[0];
      console.log("Song name: " + info.name);
      console.log("Artist: " + info.artists[0].name);
      console.log("Album: " + info.album.name);
      console.log("Preview: " + info.preview_url);

      var myLog = "\r\n spotify-this-song " + "Song name: " + info.name;
      myLog += " Artist: " + info.artists[0].name;
      myLog += " Album: " + info.album.name
      myLog += " Preview: " + info.preview_url;
      writeToLog(myLog);
    }
  });

}

function getMovie(movieName) {
  // * Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
  var request = require("request");
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  // console.log(queryUrl);
  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      var title = JSON.parse(body).Title;
      var year = JSON.parse(body).Year;
      // var rottenTomatoRating = data.Rating[1] ? data.Rating[1].Value : 'N/A';
      var imdbRatings = JSON.parse(body).imdbRating;

      var rottenRatings = JSON.parse(body).Ratings[1].Value;
      if (rottenRatings === undefined) { rottenRatings = "n/a" }

      var country = JSON.parse(body).Country;
      var language = JSON.parse(body).Language;
      var plot = JSON.parse(body).Plot;
      var actors = JSON.parse(body).Actors;
      // `data.Ratings[1] ? data.Ratings[1].Value : 'N/A',` where data is `JSON.parse(body)`

      //   console.log(`Ratings ${Ratings}`);
      console.log(`Title ${title}`);
      console.log(`Year ${year}`);
      console.log(`IMDB Rating ${imdbRatings}`);
      console.log(`Rotten Tomatoes Rating ${imdbRatings}`);
      console.log(`Country is ${country}`);
      console.log(`Language is ${language}`);
      console.log(`Plot: ${plot}`);
      console.log(`Actors are ${actors}`);

      var myLog = "\r\n movie-this " + "Title: " + title;
      myLog += " Year: " + year;
      myLog += " IMDB Rating: " + imdbRatings;
      myLog += " Rotten Tomatoes Rating: " + rottenRatings;
      myLog += " Country: " + country;
      myLog += " Language: " + language;
      myLog += " Plot: " + plot;
      myLog += " Actors: " + actors;
      writeToLog(myLog);

    }
  });
}





