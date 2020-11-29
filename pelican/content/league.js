(function () {

  // standings-header-season-number 

  var baseApiUrl = 'http://192.168.30.20:8989';
  var baseUIUrl  = 'http://192.168.30.20:8001';

  var LeaguePage = {

    baseApiUrl : baseApiUrl,
    baseUIUrl : baseUIUrl,

    season : null,

    init : function() {
      this.loadConfig();
    },

    loadConfig : function() {

      //// Get season url parameter
      //this.season = this.helpers.getUrlParameter('season');

      // Check current season and day
      let url = this.baseApiUrl + '/today';
      fetch(url)
      .then(res => res.json())
      .then((todayApiResult) => {

        this.currentSeason = todayApiResult[0];
        this.currentDay = todayApiResult[1];

        if (this.season==null) {
          this.season = this.currentSeason;
        }

        if (this.season <= this.currentSeason) {
          this.updateSeasonHeader(this.season);
          this.processStandingsData(this.season);
        }
      })
      .catch(err => { throw err });
    },

    updateSeasonHeader : function(season0) {

      var seasonHeaderContainer = document.getElementById('league-standings-container');

      // get element by id "landing-header-season" and change innerHTML to current season
      var seasonHead = document.getElementById('standings-header-season-number');
      if (seasonHead != null) {
        var sp1 = parseInt(season0) + 1;
        seasonHead.innerHTML = sp1;
      }

      seasonHeaderContainer.classList.remove('invisible');

    },

    processStandingsData : function(season0) {

      // TODO: /leagueStructure should take a season parameter

      // Load the league standings
      let recordsUrl = this.baseApiUrl + '/standings';
      fetch(recordsUrl)
      .then(res => res.json())
      .then((standingsApiResult) => {
        console.log('---');
        console.log(standingsApiResult);

        // /records should return a list of dictionaries
        // containing team info, plus win-loss records

        // Use league/division info to figure out where to update league/division names
        for (var iL in standingsApiResult.leagues) {
          var iLp1 = parseInt(iL) + 1;
          var league = standingsApiResult.leagues[iL];

          // Set the league name on the page
          var leagueNameId = 'league-' + iLp1 + '-name';
          var leagueNameElem = document.getElementById(leagueNameId);
          leagueNameElem.innerHTML = league;

          for (var iD in standingsApiResult.divisions) {
            var iDp1 = parseInt(iD) + 1;
            var division = standingsApiResult.divisions[iD];

            // Set the division name on the page
            var divisionNameId = 'league-' + iLp1 + '-division-' + iDp1 + '-name';
            var divisionNameElem = document.getElementById(divisionNameId);
            divisionNameElem.innerHTML = division;

            // Create the <ul> and <li> elements for the division team ranking list
            var ulElemId = 'league-' + iLp1 + '-division-' + iDp1 + '-ul';
            var ulElem = document.getElementById(ulElemId);

            // This is where we need to figure out what the heck to do
            teamStandingsItems = standingsApiResult.rankings[league][division];

            var iS;
            for (iS = 0; iS < teamStandingsItems.length; iS++) {
              var teamStandings = teamStandingsItems[iS];

              // Add an li element for this team
              var liElem = document.createElement('li');
              liElem.classList.add('list-group-item');
              liElem.classList.add('d-flex');
              liElem.classList.add('justify-content-between');
              liElem.classList.add('align-items-center');
              liElem.classList.add('team-color');
              liElem.innerHTML = teamStandings.teamName;

              // Add win loss span to the document
              var spanElem = document.createElement('span');
              spanElem.classList.add('standings-record');
              var winLossStr = teamStandings.teamWinLoss[0] + "-" + teamStandings.teamWinLoss[1];
              spanElem.innerHTML = winLossStr;

              // Set color of li element
              liElem.style.color = teamStandings.teamColor;

              liElem.appendChild(spanElem);
              ulElem.appendChild(liElem);
            } // finishj for each team in the standings

            iD++;
          } // end each division loop

          iL++;
        } // end each league loop

      })
      .catch(err => {
        console.log(err);
        //this.error(-1);
      }); // end API /standings

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

  LeaguePage.registerEvent(window, 'load', function () {
    LeaguePage.init();
  }, false);

}());
