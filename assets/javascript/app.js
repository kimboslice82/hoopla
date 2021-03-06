// Initialize Firebase
var config = {
  apiKey: "AIzaSyBVdl2rA2nKOz4OSGuftySdI4B9mvAfPQ4",
  authDomain: "second-screen-sports.firebaseapp.com",
  databaseURL: "https://second-screen-sports.firebaseio.com",
  projectId: "second-screen-sports",
  storageBucket: "second-screen-sports.appspot.com",
  messagingSenderId: "910265912496"
};
firebase.initializeApp(config);

//variable to reference database
var database = firebase.database();
//database values
var team = "";
//store user input in database
$("#search").on("click", function(event) {
  event.preventDefault();
  team = $(".search-term:selected").val();

  database.ref().push({
    team: team,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

});


//vars for queryUrl parameters

var todayDate = moment().format("YYYY" + "MM" + "DD");
var previousDate = moment().add(-1, 'days').format("YYYY" + "MM" + "DD");
console.log(todayDate);
console.log(previousDate);
//////////////////////////////////
//ajax to get sports api data/////
//////////////////////////////////
function sportsData() {
  var queryUrl = "https://www.mysportsfeeds.com/api/feed/pull/nba/2017-playoff/scoreboard.json?fordate=" + todayDate;
  $.ajax({
    method: "GET",
    url: queryUrl,
    dataType: 'json',
    headers: {
      "Authorization": "Basic " + btoa("joecabralez" + ":" + "twattwat!3")
    },
  }).done(function(SportsData) {

    console.log(SportsData);

    var awayTeamCity1 = SportsData.scoreboard.gameScore[0].game.awayTeam.Abbreviation
    var awayTeamName1 = SportsData.scoreboard.gameScore[0].game.awayTeam.Name
    var awayTeamScore1 = SportsData.scoreboard.gameScore[0].awayScore

    var homeTeamCity1 = SportsData.scoreboard.gameScore[0].game.homeTeam.Abbreviation
    var homeTeamName1 = SportsData.scoreboard.gameScore[0].game.homeTeam.Name
    var homeTeamScore1 = SportsData.scoreboard.gameScore[0].homeScore

    var awayTeamCity2 = SportsData.scoreboard.gameScore[1].game.awayTeam.Abbreviation
    var awayTeamName2 = SportsData.scoreboard.gameScore[1].game.awayTeam.Name
    var awayTeamScore2 = SportsData.scoreboard.gameScore[1].awayScore

    var homeTeamCity2 = SportsData.scoreboard.gameScore[1].game.homeTeam.Abbreviation
    var homeTeamName2 = SportsData.scoreboard.gameScore[1].game.homeTeam.Name
    var homeTeamScore2 = SportsData.scoreboard.gameScore[1].homeScore

    var gamedate = SportsData.scoreboard.gameScore[0].game.awayTeam.date

    if (!homeTeamScore1) {
      homeTeamScore1 = 0;
    }

    if (!homeTeamScore2) {
      homeTeamScore2 = 0;
    }

    if (!awayTeamScore1) {
      awayTeamScore1 = 0;
    }

    if (!awayTeamScore2) {
      awayTeamScore2 = 0;
    }



    $("#away-team-city1").html(awayTeamCity1);
    $("#away-team-name1").html(awayTeamName1);
    $("#away-team-score1").html(awayTeamScore1);

    $("#home-team-city1").html(homeTeamCity1);
    $("#home-team-name1").html(homeTeamName1);
    $("#home-team-score1").html(homeTeamScore1);

    $("#away-team-city2").html(awayTeamCity2);
    $("#away-team-name2").html(awayTeamName2);
    $("#away-team-score2").html(awayTeamScore2);

    $("#home-team-city2").html(homeTeamCity2);
    $("#home-team-name2").html(homeTeamName2);
    $("#home-team-score2").html(homeTeamScore2);



  });
}

sportsData();

setInterval(function() {
  sportsData()
}, 60000);


////////////////////////////////////////////
/////WIKIPEDIA FUNCTION WITH AJAX CALL//////
////////////////////////////////////////////

var searchData = "";

function wikipediaBox(search) {
  var RRsearchKey = search;
  var RRqueryURL = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + RRsearchKey + "&callback=?";
  $.ajax({
    type: "GET",
    url: RRqueryURL,
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function(data) {

      console.log(data);

      var markup = data.parse.text["*"];
      var blurb = $('<div></div>').html(markup);

      // remove links as they will not work
      blurb.find('a').each(function() {
        $(this).replaceWith($(this).html());
      });

      // remove cite error
           blurb.find('.mw-ext-cite-error').remove();
           $('#article').html($(blurb).find('p'));

           //$('#wikipedia').html($(blurb).find('p'));
           
           // remove any references
           blurb.find('sup').remove();

      $('#wikipedia').html($(blurb).find('p'));

    },
    error: function(errorMessage) {}
  });
}

////////////////////////////////////////
/////GIPHY FUNCTION WITH AJAX CALL//////
////////////////////////////////////////

function displayGifs() {

  //the URL to search the site and grab 10 results
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchData + "&api_key=dc6zaTOxFJmzC&limit=5";

  //ajax function that gets a response from the site
  $.ajax({
    url: queryURL,
    method: "GET",
  }).done(function(response) {
    console.log(response);
    for (var i = 0; i < response.data.length; i++) {
      var gifs = response.data[i].images.downsized.url;
      $("#gifs").prepend("<img src='" + gifs + " '>");
    }


  });
};

$("#search").on("click", function(event) {

    event.preventDefault();
    searchData = $(".search-term:selected").val();

    console.log(searchData);
    displayGifs();
    wikipediaBox(searchData);
  })
  ////////////////////////////////////////
  ///////////////TWITTER//////////////////
  ////////////////////////////////////////



/*function showTweets() {
  var searchData = $(".search-term:selected").val();
  var tweetQueryURL = "https://api.twitter.com/1.1/search/tweets.json?q=" + searchData + "&result_type=recent"
  $.ajax({
      url: tweetQueryURL,
      method:"GET",
      dataType: "json",
    }).done(function(tweets) {
      console.log(tweets);

    });
}; */