//get the keys from the keys.js document	
var apiKeys = require("./keys.js");

var twitterKeys = apiKeys.twitterKeys;

var fs = require('fs');
var Spotify = require('spotify');
var request = require('request');
var colors = require('colors');

// Takes in all of the command line arguments
var inputString = process.argv;

// Parses the command line argument to capture the data
var userSelection = inputString[2];
var infoFromUserInput = process.argv[3];

// check seletion to run correct statement
if (userSelection == "my-tweets"){
	userTweets();
} else if (userSelection == "spotify-this-song"){
	mySpotify(infoFromUserInput);
} else if (userSelection == "movie-this"){
	omdb(infoFromUserInput);
} else if (userSelection == "do-what-it-says"){
	doWhatItSays();
}

//switch function as well, either will work: 

function switchRouting(userSelection, infoFromUserInput){
  switch (userSelection) {
    case "my-tweets":
      TwitterCall();
      break;
    case "spotify-this-song":
      SpotifyCall(infoFromUserInput);
      break;
    case "movie-this":
      MovieCall(infoFromUserInput);
      break;
    case "do-what-it-says":
      WhatitSaysCall();
      break;
    default:
      userSelection = "No Command";
      infoFromUserInput = "no arguments";
      console.log("invalid command. Valid commands consist of: ");
  }
};
switchRouting(userSelection, infoFromUserInput);


// twitter function 
function userTweets() {
	var client = twitterKeys;
	var params = {screen_name: 'scentfinder'};

	// twitter api call
	client.get('statuses/user_timeline', params, function(error, timeline, response) {	
		if (!error) {
			for (tweet in timeline) {
				if (tweet < 10) { 
					// get tweet date
					var tweetDate = new Date(timeline[tweet].created_at);

					// log out the date and text of our latest tweets.
					console.log("Tweet #".green + (parseInt(tweet) + 1) + " Date: ".green + tweetDate.toString().slice(0, 24)); 
					console.log(timeline[tweet].text);
		   			console.log("\n");

					fs.appendFile('log.txt', " Tweet #" + (parseInt(tweet) + 1) + " Date: " + tweetDate.toString().slice(0, 24)); 
					fs.appendFile('log.txt', timeline[tweet].text);
				}
				else {
					return true;
				}
			}
		}
		else {
			console.log(error);
		}
	});
}

// spotify
function mySpotify(infoFromUserInput){
	if(infoFromUserInput === undefined){
	 	infoFromUserInput = "What's my age again";
	 }

	// spotify api call
	Spotify.search({ type: 'track', query: infoFromUserInput }, function(error, data) {
	    if (!error) {	    
		    var items = data.tracks.items;

		    for (i=0; i<items.length; i++){
			 		for (j=0; j<items[i].artists.length; j++){
			    		console.log("Artist: ".green + items[i].artists[j].name);
			    	}
		    	console.log("Song Name: ".green + items[i].name);
		    	console.log("Preview Link of the song from Spotify: ".green + items[i].preview_url);
		    	console.log("Album Name: ".green + items[i].album.name);
				console.log("\n");

			 		for (k=0; k<items[i].artists.length; k++){
			    		fs.appendFile('log.txt', " Artist: " + items[i].artists[k].name);
			    	}
    			fs.appendFile('log.txt', ", Song Name: " + items[i].name);
		    	fs.appendFile('log.txt', ", Preview Link of the song from Spotify: "+items[i].preview_url);
		    	fs.appendFile('log.txt', ", Album Name: "+items[i].album.name);
			}
		}
	});
};

// omdb
function omdb(infoFromUserInput){
	 if(infoFromUserInput === undefined){
	 	infoFromUserInput = 'Mr. Nobody';
	 }

	// send out the call to the OMDB API
	 request('http://www.omdbapi.com/?t='+infoFromUserInput+'&y=&plot=short&tomatoes=true&r=json', function(error, response, body) {
		if (!error) {
		   var json = JSON.parse(body);

		   console.log("Title: ".green + json.Title);
		   console.log("Year: ".green + json.Year);
		   console.log("IMDB Rating: ".green + json.imdbRating);
		   console.log("Country: ".green + json.Country);
		   console.log("Language: ".green + json.Language);
		   console.log("Plot: ".green + json.Plot);
		   console.log("Actors: ".green + json.Actors);
		   console.log("Rotten Tomatoes rating: ".green + json.tomatoRating);
		   console.log("Rotten Tomatoes URL: ".green + json.tomatoURL);
		   console.log("\n");

		   fs.appendFile('log.txt', "Title: " + json.Title + "\n");
		   fs.appendFile('log.txt', "Year: " + json.Year + "\n");
		   fs.appendFile('log.txt', "IMDB Rating: " + json.imdbRating + "\n");
		   fs.appendFile('log.txt', "Country: " + json.Country + "\n");
		   fs.appendFile('log.txt', "Language: " + json.Language + "\n");
		   fs.appendFile('log.txt', "Plot: " + json.Plot + "\n");
		   fs.appendFile('log.txt', "Actors: " + json.Actors + "\n");
		   fs.appendFile('log.txt', "Rotten Tomatoes rating: " + json.tomatoRating + "\n");
		   fs.appendFile('log.txt', "Rotten Tomatoes URL: " + json.tomatoURL + "\n");
		}
	})
}

// Do what it says function
function doWhatItSays(){
	fs.readFile("random.txt", 'utf8', function(err, data){
		if (err) throw err;

		var things = data.split(',');
		var partTwo = things[1];

		mySpotify(partTwo);	
	});
}