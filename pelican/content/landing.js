(function () {

  var LandingPage = {

    // example: http://localhost:8989/endpoint
    //          ^^^^^^^^^^^^^^^^^^^^^
    //               baseUrl
    baseApiUrl : 'http://192.168.30.20:8989',

    landingDivIds : [
      'container-error',
      'container-mode0009',
      'container-mode1019',
      'container-mode21',
      'container-mode22',
      'container-mode23',
      'container-mode31',
      'container-mode32',
      'container-mode33',
      'container-mode40plus'
    ],

    init : function() {

      // Load a game from the /game API endpoint
      let url = this.baseApiUrl + '/mode';
      fetch(url)
      .then(res => res.json())
      .then((apiResult) => {

        var mode = apiResult.mode;

        if (mode < 0) {
          this.error(mode);
        } else if (mode < 10) {
          this.mode0009(mode);
        } else if (mode < 20) {
          this.mode1019(mode);
        } else if (mode < 30) {
          this.mode2029(mode);
        } else if (mode < 40) {
          this.mode3039(mode);
        } else {
          this.mode40plus(mode);
        }
      })
      .catch(err => { 
        console.log(err);
        this.error(-1); 
      });
      // Done loading game from /game API endpoint
    },

    /**
     * Handle the case of an error, tell the user something is wrong
     */
    error : function(mode) {
      var container = document.getElementById('container-error');
      container.classList.remove("invisible");
    },

    /**
     * Given a container div id, remove all other container divs
     */
    filterContainers : function(saveid) {
      var ix = this.landingDivIds.indexOf(saveid);
      if (ix<0) {
        this.error();
      }
      var i;
      for (i=0; i<this.landingDivIds.length; i++) {
        if (i!=ix) {
          // Remove every div except the one with specified id
          var e = document.getElementById(this.landingDivIds[i]);
          e.parentNode.removeChild(e);
        }
      }
      var container = document.getElementById(saveid);
      container.classList.remove("invisible");
      return container
    },

    /**
     * Function called if site is in mode 0-9 (pre-season)
     */
    mode0009 : function(mode) {
      var container = this.filterContainers('container-mode0009');
      this.minilife(container);
    },

    /**
     * Function called if site is in mode 10-19 (season underway)
     */
    mode1019 : function(mode) {
      var container = this.filterContainers('container-mode1019');
      this.populateSeasonGames(mode, container);
    },

    /**
     * Function called if site is in mode 20-29 (waiting for postseason)
     */
    mode2029 : function(mode) {

      // Handle special cases
      var container;
      if (mode==21) {
        container = this.filterContainers('container-mode21');
      } else if (mode==22) {
        container = this.filterContainers('container-mode22');
      } else if (mode==23) {
        container = this.filterContainers('container-mode23');
      } else {
        this.error();
      }
      //this.populatePostseasonWaiting(mode, container);

    },

    /**
     * Function called if site is in mode 30-39 (postseason underway)
     */
    mode3039 : function(mode) {

      // Handle special cases
      var container;
      if (mode==31) {
        container = this.filterContainers('container-mode31');
      } else if (mode==32) {
        container = this.filterContainers('container-mode32');
      } else if (mode==33) {
        container = this.filterContainers('container-mode33');
      } else {
        this.error();
      }
      //this.populatePostseasonOngoing(mode, container);

    },

    /**
     * Function called if site is in mode 40+ (season and postseason over)
     */
    mode40plus : function(mode) {
      container = this.filterContainers('container-mode40plus');
      this.minilife(container);
    },

    /**
     * Add the minilife player to the appropriate <div> element
     */
    minilife : function(elem) {
      var minilife = document.getElementById('minilife-player');
      var template = document.getElementById('minilife-template');
      var clone = template.content.cloneNode(true);
      elem.appendChild(clone);
      
      var bod = document.getElementsByTagName('body')[0];
      var jsfiles = ['json-sans-eval.js', 'minilife.js'];
      for (let j in jsfiles) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', this.baseUrl + '/theme/js/' + jsfiles[j]);
        bod.append(script);
        if (j==1) {
          script.onload = () => {
            GOL.init();
          }
        }
      }
    },

    /**
     * Use the golly API to get the current games for this regular season day,
     * and populate the league divs with games.
     */
    populateSeasonGames : function(mode, container) {
      // get the league names from the games
      let url = this.baseApiUrl + '/currentGames';
      fetch(url)
      .then(res => res.json())
      .then((apiResult) => {

        // Assemble a sorted list of leagues
        var leaguesSet = new Set();
        for (let g in apiResult) {
          leaguesSet.add(apiResult[g].league);
        }
        var leagues = Array.from(leaguesSet);
        leagues.sort();

        var leagueContainers = [
          document.getElementById("league-1-container"),
          document.getElementById("league-2-container"),
        ];
        var leagueNames = [
          document.getElementById("league-1-name"),
          document.getElementById("league-2-name"),
        ]

        // Loop over each league and populate its coresponding div with games
        for (let i in leagues) {

          // This is the container we will add each game to
          var leagueContainerElem = leagueContainers[i];
          var leagueNameElem = leagueNames[i];

          leagueNameElem.innerHTML = leagues[i];

          // Create divs for all of the games in this league
          for (let g in apiResult) {
            var game = apiResult[g];
            if (game.league==leagues[i]) {

              // Create a clone of the template
              var gametemplate = document.getElementById('inprogress-game-template');
              var cloneFragment = gametemplate.content.cloneNode(true);

              // Add the game id to the template game id
              if (game.hasOwnProperty('id')) {
                cloneFragment.querySelector(".card").setAttribute("id", game.id);
              }

              // Add the template game div to the page
              leagueContainerElem.appendChild(cloneFragment);
            }
          }

          // Now populate each div
          for (let g in apiResult) {
            var game = apiResult[g];
            if (game.league==leagues[i]) {

              var elem = document.getElementById(game.id);

              // Team name labels
              if (game.hasOwnProperty('team1Name') && game.hasOwnProperty('team2Name')) {
                var t1tags = elem.getElementsByClassName('team1name');
                var t2tags = elem.getElementsByClassName('team2name');
                var t;
                for (t = 0; t < t1tags.length; t++) {
                  teamNameElem = t1tags[t];
                  teamNameElem.innerHTML = game.team1Name;
                }
                for (t = 0; t < t2tags.length; t++) {
                  teamNameElem = t2tags[t];
                  teamNameElem.innerHTML = game.team2Name;
                }
              }

              // Team colors
              if (game.hasOwnProperty('team1Color') && game.hasOwnProperty('team2Color')) {
                var t1tags = elem.getElementsByClassName('team1colors');
                var t2tags = elem.getElementsByClassName('team2colors');
                var t;
                for (t = 0; t < t1tags.length; t++) {
                  teamColorElem = t1tags[t];
                  teamColorElem.style.color = game.team1Color;
                }
                for (t = 0; t < t2tags.length; t++) {
                  teamColorElem = t2tags[t];
                  teamColorElem.style.color = game.team2Color;
                }
              }

              // Assemble team W-L records
              if (game.hasOwnProperty('team1WinLoss') && game.hasOwnProperty('team2WinLoss')) {
                var wlstr1 = game.team1WinLoss[0] + "-" + game.team1WinLoss[1];
                var wlstr2 = game.team2WinLoss[0] + "-" + game.team2WinLoss[1];
                var t1tags = elem.getElementsByClassName('team1record');
                var t2tags = elem.getElementsByClassName('team2record');
                var t;
                for (t = 0; t < t1tags.length; t++) {
                  teamWinLossElem = t1tags[t];
                  teamWinLossElem.innerHTML = wlstr1;
                }
                for (t = 0; t < t2tags.length; t++) {
                  teamWinLossElem = t2tags[t];
                  teamWinLossElem.innerHTML = wlstr2;
                }
              }

              // Update map pattern name
              console.log(game);
              if (game.hasOwnProperty('mapName')) {
                var mapName = game.mapName;
                var mapTags = elem.getElementsByClassName('map-name');
                var mt;
                for (mt = 0; mt < mapTags.length; mt++) {
                  mapNameElem = mapTags[mt];
                  mapNameElem.innerHTML = mapName;
                }
              }

              // // End: Populate game template with game info
              // // --------------------

            } // end if game in league
          } // end for each game
        } // end for each league

      })
      .catch(err => { 
        console.log(err);
        this.error(-1); 
      });
    },

    /**
     * Register Event
     */
    registerEvent : function (element, event, handler, capture) {
      if (/msie/i.test(navigator.userAgent)) {
        element.attachEvent('on' + event, handler);
      } else {
        element.addEventListener(event, handler, capture);
      }
    },

  };

  LandingPage.registerEvent(window, 'load', function () {
    LandingPage.init();
  }, false);

}());
