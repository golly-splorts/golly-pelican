(function () {

  var MapsPage = {

    baseApiUrl : getBaseApiUrl(),
    baseUIUrl : getBaseUIUrl(),

    loadingElem : null,

    containers : [
      'container-maps-header',
      'container-maps'
    ],

    init : function() {
      this.loading();
      this.populateMapCards();
    },

    /**
     * Handle the case of an error, tell the user something is wrong
     */
    error : function(mode) {
      // Hide elements
      this.loadingElem.classList.add('invisible');
      for (var c in this.containers) {
        var elem = document.getElementById(this.containers[c]);
        elem.classList.add('invisible');
      }

      // Show error elements
      var container = document.getElementById('container-error');
      container.classList.remove("invisible");
    },

    /**
     * Show the loading message while loading API data.
     */
    loading : function() {
      this.loadingElem = document.getElementById('container-loading');
      this.loadingElem.classList.remove('invisible');
    },

    /**
     * Load map data from /maps endpoint, and use it to populate map cards.
     */
    populateMapCards : function() {

      var mapRowElem = document.getElementById('row-maps');

      let mapsUrl = this.baseApiUrl + '/maps';
      fetch(mapsUrl)
      .then(res => res.json())
      .then((mapsApiResult) => {

        this.loadingElem.classList.add('invisible');
        var mapsContainer = document.getElementById('container-maps');
        mapsContainer.classList.remove('invisible');

        var iM;
        for (iM = 0; iM < mapsApiResult.length; iM++) {
          thisMap = mapsApiResult[iM];

          // Create a clone of the map card template
          var mapCardTemplate = document.getElementById('map-card-template');
          var cloneFragment = mapCardTemplate.content.cloneNode(true);

          // Add the map pattern name as the id
          if (thisMap.hasOwnProperty('patternName')) {
            cloneFragment.querySelector(".card").setAttribute("id", thisMap.patternName);
          }

          // Add the template map card to the page
          mapRowElem.appendChild(cloneFragment);

          // Get a reference to the card we just added
          var mapCard = document.getElementById(thisMap.patternName);

          // Set the title of the map card to the map name
          var mapCardTitleElems = mapCard.getElementsByClassName('map-card-map-name');
          var iE;
          for (iE = 0; iE < mapCardTitleElems.length; iE++) {
            var elem = mapCardTitleElems[iE];
            elem.innerHTML = thisMap.mapName;
          }

          // Set img src
          var imgElems = mapCard.getElementsByClassName('map-card-image');
          var ii;
          for (ii = 0; ii < imgElems.length; ii++) {
            var imgElem = imgElems[ii];
            imgElem.setAttribute('src', this.baseUIUrl + '/img/' + thisMap.patternName + '.png');
          }

          // Set map description
          var descElems = mapCard.getElementsByClassName('map-card-description');
          var iD;
          for (iD = 0; iD < descElems.length; iD++) {
            var descElem = descElems[iD];
            if (thisMap.hasOwnProperty('mapDescription')) {
              descElem.innerHTML = thisMap.mapDescription;
            } else {
              descElem.innerHTML = "(No description found)";
            }
          }

          /*
           * set inner html of map season badge, and make it visible
           */

          // Set simulate button
          var simElems = mapCard.getElementsByClassName('simulate');
          var iS;
          for (iS = 0; iS < simElems.length; iS++) {
            var simElem = simElems[iS];
            if (thisMap.hasOwnProperty('patternName')) {
              simElem.setAttribute('href', this.baseUIUrl + '/simulator/index.html?patternName=' + thisMap.patternName);
            }
          }

        }

      })
      .catch(err => {
        console.log(err);
        this.error(-1);
      }); // end API /maps
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

  MapsPage.registerEvent(window, 'load', function () {
    MapsPage.init();
  }, false);

}());
