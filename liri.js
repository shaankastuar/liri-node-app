// psueodcode: 
// 1)get all required keys and store, make it accessible to this file 
// 2) get the user input from the console
// 3) create the functions to run the api calls and console.log the information (and append to log.txt)
// 4) use either an if or switch function in order to run the correct function based on the user input

//get the keys from the keys.js document	
var apiKeys = require("./keys.js");


//tried to store twitter keys in a variable on this file locally, but it was't working, so trying without.
// var twitterKeys = apiKeys.twitterKeys;

var fs = require('fs');
var Spotify = require('spotify');
var request = require('request');
//use for colors -- cool thing found from classmates
var colors = require('colors');

// takes user inputted information from console
var userSelection = process.argv[2];
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

// function switchRouting(userSelection, infoFromUserInput){
//   switch (userSelection) {
//     case "my-tweets":
//       TwitterCall();
//       break;
//     case "spotify-this-song":
//       SpotifyCall(infoFromUserInput);
//       break;
//     case "movie-this":
//       MovieCall(infoFromUserInput);
//       break;
//     case "do-what-it-says":
//       WhatitSaysCall();
//       break;
//     default:
//       userSelection = "No Command";
//       infoFromUserInput = "no arguments";
//       console.log("you have entered an invalid command");
//   }
// };
// switchRouting(userSelection, infoFromUserInput);


// twitter function 
function userTweets() {
	var client = new Twitter(apiKeys.twitterKeys);
	var params = {screen_name: 'skastuarz', count: 20};

	// twitter api call
	client.get('statuses/user_timeline', params, function(error, timeline, response) {	
		if (!error) {
			for (tweet in timeline) {
				if (tweet < 10) { 
					// get tweet date
					var tweetDate = new Date(timeline[tweet].created_at);

					// log out the date and text of our latest tweets.
					console.log("Tweet #".blue + (parseInt(tweet) + 1) + " Date: ".blue + tweetDate.toString().slice(0, 24) + " "); 
					console.log(timeline[tweet].text);
		   			console.log("\n");

		   			//adds to log.txt
		   			fs.appendFile('log.txt', "Tweet #: " + (parseInt(tweet)+1) + "\n");
		   			fs.appendFile('log.txt', timeline[tweet].text + "\n");
		   			fs.appendFile('log.txt', "\n");
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
	//default blink 182 -- great choice for a default
	if(infoFromUserInput === undefined){
	 	infoFromUserInput = "What's my age again";
	 }

	// spotify api call for other song requst
	Spotify.search({ type: 'track', query: infoFromUserInput }, function(error, data) {
	    if (!error) {	    
		    var items = data.tracks.items;

		    for (i=0; i<items.length; i++){
			 		for (j=0; j<items[i].artists.length; j++){
			    		console.log("Artist: ".blue + items[i].artists[j].name);
			    	}
		    	console.log("Song Name: ".blue + items[i].name);
		    	console.log("Preview Link of the song from Spotify: ".blue + items[i].preview_url);
		    	console.log("Album Name: ".blue + items[i].album.name);
				console.log("\n");

			 		for (k=0; k<items[i].artists.length; k++){
			    		fs.appendFile('log.txt', " Artist: " + items[i].artists[k].name);
			    	}
			    	//apend to log.txt
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

		   console.log(colors.blue('Title: ') + json.Title);
		   console.log(colors.blue('Year: ') + json.Year);
		   console.log(colors.blue('Rated: ') + json.Rated);
		   console.log(colors.blue('Country: ') + json.Country);
		   console.log(colors.blue('Language: ') + json.Language);
		   console.log(colors.blue('Director: ') + json.Director);
		   console.log(colors.blue('Actors: ') + json.Actors);
		   console.log(colors.blue('Plot: ') + json.Plot);
		   console.log(colors.blue('imdbRating: ') + json.imdbRating);
		   console.log(colors.blue('Rotten Tomatoes Rating: ') + json.tomatoRating);
		   console.log(colors.blue('Rotten Tomatoes URL: ') + json.tomatoURL);
		   console.log("\n");
		   //apend to log.txt
		   	fs.appendFile('log.txt', "\n");
		   	fs.appendFile("log.txt", "\n" + "Title: " + json.Title + "\n");
	  		fs.appendFile("log.txt", "Year: " + json.Year + "\n");
	 		fs.appendFile("log.txt", "Rated: " + json.Rated + "\n");
		   	fs.appendFile("log.txt", "Country: " + json.Country + "\n");
		   	fs.appendFile("log.txt", "Language: " + json.Language + "\n");
		   	fs.appendFile("log.txt", "Director: " + json.Director + "\n");
		   	fs.appendFile("log.txt", "Actors: " + json.Actors + "\n");
		   	fs.appendFile("log.txt", "Plot: " + json.Plot + "\n");
		   	fs.appendFile("log.txt", "imdbRating: " + json.imdbRating + "\n");
		   	fs.appendFile("log.txt", "Rotten Tomatoes Rating: " + json.tomatoRating + "\n");
		   	fs.appendFile("log.txt", "Rotten Tomatoes URL: " + json.tomatoURL + "\n");
		}
	})
}

// Do what it says function
function doWhatItSays(){
	fs.readFile("random.txt", 'utf8', function(err, data){
		if (err) throw err;
//need to split the data at the comma to run it through spotify
		var stuffFromRandom = data.split(',');

		//grab the song from the newly created array
		var runThruSpotify = stuffFromRandom[1];
//run the song through spotify api call function
		mySpotify(runThruSpotify);	
	});
}