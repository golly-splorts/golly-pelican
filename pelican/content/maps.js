(function () {

  var baseApiUrl = 'http://192.168.30.20:8989';
  var baseUIUrl  = 'http://192.168.30.20:8001';

  mapDescriptions = {
    'random' : 'A completely random map layout, territory split 50/50.',
    'twoacorn': 'Two fast-growing acorn metheuselas placed in the top and bottom halves of the grid.',
    'timebomb': 'Three quadruple burloaferimeters holding defensive positions against a timebomb metheusela.',
    'fourrabbits': 'Four fast-growing rabbits, one in each quadrant.',
    'twospaceshipgenerators': 'Two spaceship generators sending spaceships across fields of boxes.',
    'eightr': 'A row of eight R pentominos with some vertical jitter.',
    'eightpi': 'A row of eight Pi pentominos with some vertical jitter.',
    'twomultum': 'Two <i>multum in parvo</i> metheuselas performing acts of reverse disappearing.',
  };

  var MapsPage = {

    baseApiUrl : baseApiUrl,
    baseUIUrl : baseUIUrl,

    init : function() {

      var mapContainerElem = document.getElementById('maps-container');

      let mapsUrl = this.baseApiUrl + '/maps';
      fetch(mapsUrl)
      .then(res => res.json())
      .then((mapsApiResult) => {

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
          mapContainerElem.appendChild(cloneFragment);

          // Get a reference to the card we just added
          var mapCard = document.getElementById(thisMap.patternName);

          // Set the title of the map card to the map name
          var mapCardTitleElems = mapCard.getElementsByClassName('map-card-map-name');
          var iE;
          for (iE = 0; iE < mapCardTitleElems.length; iE++) {
            var elem = mapCardTitleElems[iE];
            elem.innerHTML = thisMap.mapName;
          }

          //// Set the img link to the simulator
          //var imgLinkElems = mapCard.getElementsByClassName('map-card-simulator-link');
          //var iL;
          //for (iL = 0; iL < imgLinkElems.length; iL++) {
          //  var imgLinkElem = imgLinkElems[iL];
          //  imgLinkElem.setAttribute('href', this.baseUIUrl + '/simulator/index.html?patternName=' + thisMap.patternName);
          //}

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
            descElem.innerHTML = mapDescriptions[thisMap.patternName];
          }

          // Set simulate button
          var simElems = mapCard.getElementsByClassName('simulate');
          var iS;
          for (iS = 0; iS < simElems.length; iS++) {
            var simElem = simElems[iS];
            simElem.setAttribute('href', this.baseUIUrl + '/simulator/index.html?patternName=' + thisMap.patternName);
          }

        }

      })
      .catch(err => {
        console.log(err);
        //this.error(-1);
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
