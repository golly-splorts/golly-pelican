/**
 * Golly Player Viewer App
 * Ch4zm of Hellmouth
 * 16 November 2020
 */

(function () {

  // The logic to parse what input parameters the user provided
  // lives in loadConfig()


  // Constants

  var baseApiUrl = 'http://localhost:8989';
  var baseUrl = 'http://localhost:8000/player_viewer/index.html';

  // Colors
  var realBackgroundColor = "#272b30";
  var gridStrokeColor     = "#666666";
  var mapZoneStrokeColor  = "#dddddd";
  var grays = ["#3a3a3a", "#404040"];

  var GOL = {

    columns : 120,
    rows : 100,
    cellSize : 7,

    // Store data about the active (selected) team
    activeTeamAbbr : null,
    activeTeam : {},

    // Store data about the active cell
    activeRow : null,
    activeCol : null,

    // Store data about the active player
    // so methods can share.
    activePlayerData : {},

    // DOM elements
    element : {
      playerName : null,
      playerRow : null,
      playerCol : null,
      playerTeam: null,
      playerLeague: null,
      playerDivision: null,
    },

    // Cell colors
    colors : {
      dead: '#272b30',
      alive: '#eee',
      grid: '#3a3a3a',
    },

    /**
     * On Load Event
     */
    init : function() {
      try {
        this.readConfig();
        this.keepDOMElements();
        this.loadState();
        console.log(this.activeCol);
        console.log(this.activeRow);

        ////// // Load team data and update elements
        ////// this.loadTeamsData();

        ////// // Set the state of the player viewer from config vars
        ////// this.setState();

        ////// // Initialize the canvas GUI
        ////// this.canvas.init();

        ////// // Register events that happen, after the canvas init
        ////// this.registerEvents();

        ////// // Hold on to your butts
        ////// this.prepare();

      } catch (e) {
        console.log(e);
      }
    },

    /**
     * Read configuration variables from URL, store for later processing
     */
    readConfig : function() {
      // Store user-specified team abbreviation, validate later
      this.activeTeamAbbr = this.helpers.getUrlParameter('team');

      // Validate row/col, and store it
      row = this.helpers.getUrlParameter('row');
      col = this.helpers.getUrlParameter('col');

      var nrows, ncols;
      nrows = this.rows;
      ncols = this.columns;

      // Pare out invalid row/col values, then set active row/col
      if (row != null) {
        if (row < 0 || row >= nrows) {
          row = null;
          col = null;
        }
      }
      if (col != null) { 
        if (col < 0 || col >= ncols) {
          row = null;
          col = null;
        }
      }
      if (row != null && col != null) {
        this.activeRow = row;
        this.activeCol = col;
      }
    },

    /**
     * keepDOMElements
     * Save DOM references for this session (one time execution)
     */
    keepDOMElements : function() {
      this.element.playerName     = document.getElementById('player-viewer-name');
      this.element.playerRow      = document.getElementById('player-viewer-row'); 
      this.element.playerCol      = document.getElementById('player-viewer-col');
      this.element.playerTeam     = document.getElementById('player-viewer-team');
      this.element.playerLink     = document.getElementById('player-viewer-link');
      this.element.playerLeague   = document.getElementById('player-viewer-league');
      this.element.playerDivision = document.getElementById('player-viewer-division');

      this.element.teamDropdown = document.getElementById('team-selector');
    },

    /**
     * Load the state of the player viewer
     * from user-specified variables (if any)
     * and other files...
     *
     * If user has selected a team, load team data.
     *
     * If user has selected a row and column,
     * select that tile on the grid,
     * and load and show the player data.
     */
    loadState : function() {

      this.loadTeamsData();

      // schematic:
      //
      // load teams data
      //  \--> update all teams elements
      //  \--> validate active team
      //  \--> load active team data
      //        \--> update active team elements
      //        \--> load player data
      //              \--> update active player elements
      //                    \--> finish setup
      //        \--> (if no player data) finish setup
      //  \--> (if no active team data) finish setup
      //
      // finish setup
      //  \--> highlight cell, init canvas, prep

    },

    loadTeamsData : function() {

      // Load team data
      let url = 'http://localhost:8989/teams';
      fetch(url)
      .then(res => res.json())
      .then((teamsApiResult) => {

        // Save team data for other methods to use
        this.teamsApiResult = teamsApiResult;

        // Update the drop down and anything else
        this.updateTeamsElements();

        if (this.activeTeamAbbr == null) {
          this.activeTeamAbbr = teamsApiResult[0].teamAbbr;
        }

        // Check if current (user-specified) active team abbrev is valid
        if (this.validateActiveTeamAbbr()) {
          // Load the active team data, update elements
          // (also does active player load/update)
          this.loadActiveTeamData(true);
        }

      })
    },

    /**
     * Call this function when the teams are loaded,
     * to update elements on the page that require
     * all teams data.
     */
    updateTeamsElements : function() {
      // Populate team options in dropdown list
      this.updateTeamsDropdown();
    },

    /**
     * Update the teams drop-down menu item.
     * If there is an active team selected,
     * make it the selected item in the drop down.
     */
    updateTeamsDropdown : function() {
      var i;
      for (i = 0; i < this.teamsApiResult.length; i++) {
        var tn = this.teamsApiResult[i].teamName;
        var ta = this.teamsApiResult[i].teamAbbr;
        var node = document.createElement("option");
        node.setAttribute("value", ta);
        node.innerHTML = tn;
        if (ta===this.activeTeamAbbr) {
          node.setAttribute("selected", "selected");
        }
        this.element.teamDropdown.appendChild(node)
      }
    },

    /**
     * Once we have loaded the response from the teams API,
     * check that the user-specified team abbreviation is valid,
     * and if it is, populate the activeTeam variable.
     */
    validateActiveTeamAbbr : function() {
      var validTeamAbbr = false;
      var i;
      for (i = 0; i < this.teamsApiResult.length; i++) {
        if (this.activeTeamAbbr === this.teamsApiResult[i].teamAbbr) {
          validTeamAbbr = true;
          this.activeTeamName = this.teamsApiResult[i].teamName;
          this.activeTeam = this.teamsApiResult[i];
        }
      }
      return validTeamAbbr;
    },

    loadActiveTeamData : function(firstTime) {
      // Update active team elements
      this.updateActiveTeamElements(firstTime);

      // Load player data
      this.loadPlayerData(firstTime);
    },

    /**
     * Update any elements that involve the active team.
     */
    updateActiveTeamElements : function() {
      this.colors.alive = this.activeTeam.teamColor;

      this.element.playerLeague.innerHTML = this.activeTeam.league;
      this.element.playerDivision.innerHTML = this.activeTeam.division;
      this.element.playerTeam.innerHTML = this.activeTeam.teamName;

    },

    /**
     * Get the player corresponding to the active cell,
     * and populate the activePlayerData container.
     * Don't forget to call updatePlayerElements().
     */
    loadPlayerData : function(firstTime) {
      var row, col, team;
      row = this.activeRow;
      col = this.activeCol;
      team = this.activeTeamName;
      if ((row != null) && (col != null)) {
        // load json for player at this row and column
        let url = 'http://localhost:8989/roster/' + this.activeTeamAbbr + '/' + row + '/' + col;
        fetch(url)
        .then(res => res.json())
        .then((playerApiResult) => {

          this.activePlayerData = playerApiResult;
          this.updatePlayerElements();
          if (firstTime) {
            this.finishSetup()
          }

        });
      } else {
        if (firstTime) {
          this.finishSetup();
        }
      }

    },

    /**
     * Update all HTML elements related to the player.
     */
    updatePlayerElements : function() {
      // Update the text of the player info elements
      this.element.playerName.innerHTML = this.activePlayerData.name;
      this.element.playerRow.innerHTML = this.activePlayerData.row + 1;
      this.element.playerCol.innerHTML = this.activePlayerData.column + 1;

      // Handle assembling and adding player link
      var linkElem = document.createElement("a");
      var linkHref = baseUrl + '?team=' + this.activeTeamAbbr + '&row=' + this.activePlayerData.row + '&col=' + this.activePlayerData.column;
      linkElem.setAttribute("href", linkHref);
      linkElem.classList.add("player-viewer-link");
      linkElem.innerHTML = "permalink";

      // it should also be in an <a> tag.
      // remove prior <a> tag
      while (this.element.playerLink.hasChildNodes()) {
        this.element.playerLink.removeChild(this.element.playerLink.childNodes[0]);
      }
      this.element.playerLink.appendChild(linkElem);
    },

    finishSetup : function() {
      this.canvas.init();
      this.registerEvents();
      this.prepare();
    },

    /**
     * Prepare DOM elements and Canvas for a new run
     */
    prepare : function() {
      this.mouseDown = false;
      this.canvas.clearWorld(); // Reset GUI
      this.canvas.drawWorld(); // Draw State
    },

    /**
     * registerEvents
     * Register event handlers for this session (one time execution)
     */
    registerEvents : function() {
      this.helpers.registerEvent(this.element.teamDropdown, 'change', this.handlers.dropdownChange, false);
    },


    /** ****************************************************************************************************************************
     * Event Handlers
     */
    handlers : {

      mouseDown : false,
      lastX : 0,
      lastY : 0,

      /**
       * When user changes dropdown, use it to set active team.
       */
      dropdownChange : function(event) {
        GOL.activeTeamAbbr = event.target.value;
        if (GOL.validateActiveTeamAbbr()) {
          GOL.loadActiveTeamData(false);
        }
        GOL.canvas.updateActiveCell(GOL.activeCol, GOL.activeRow);
      },

      /**
       * When user clicks down, set mouse down state.
       */
      canvasMouseDown : function(event) {
        var position = GOL.helpers.mousePosition(event);
        GOL.handlers.lastX = position[0];
        GOL.handlers.lastY = position[1];
        GOL.canvas.updateActiveCell(position[0], position[1]);
      },

      ///**
      // * Handle user mouse up instance.
      // */
      //canvasMouseUp : function() {
      //  GOL.handlers.mouseDown = false;
      //  // Store the last mouse position as the
      //  // new active row and column
      //  GOL.activeCol = GOL.handlers.lastX;
      //  GOL.activeRow = GOL.handlers.lastY;
      //  GOL.canvas.updateSelectedCell(position[0], position[1]);
      //  // and probably re-load data, hmm?
      //},

      ///**
      // * If we have captured a mouse down event,
      // * track where the mouse is going and update
      // * mouse location.
      // */
      //canvasMouseMove : function(event) {
      //  if (GOL.handlers.mouseDown) {
      //    var position = GOL.helpers.mousePosition(event);
      //    if ((position[0] !== GOL.handlers.lastX) || (position[1] !== GOL.handlers.lastY)) {
      //      GOL.handlers.lastX = position[0];
      //      GOL.handlers.lastY = position[1];
      //    }
      //  }
      //},

    },


    /** ****************************************************************************************************************************
     * The Canvas
     */
    canvas: {

      context : null,
      width : null,
      height : null,
      cellSize : null,
      cellSpace : null,

      /**
       * init
       */
      init : function() {

        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');

        this.cellSize = GOL.cellSize;
        this.cellSpace = 1;

        // register the mousedown/mouseup/mousemove events with function callbacks
        GOL.helpers.registerEvent(this.canvas, 'mousedown', GOL.handlers.canvasMouseDown, false);
        GOL.helpers.registerEvent(document, 'mouseup', GOL.handlers.canvasMouseUp, false);
        GOL.helpers.registerEvent(this.canvas, 'mousemove', GOL.handlers.canvasMouseMove, false);
      },

      /**
       * clearWorld
       */
      clearWorld : function () {
        // Draw cells
        for (i = 0 ; i < GOL.columns; i++) {
          for (j = 0 ; j < GOL.rows; j++) {
            this.drawCell(i, j, false);
          }
        }
      },

      /**
       * drawWorld
       */
      drawWorld : function() {
        var i, j;

        // set grid
        this.width = this.height = 1;
        this.cellSize = GOL.cellSize;
        this.cellSpace = 1;

        // Dynamic canvas size
        this.width = this.width + (this.cellSpace * GOL.columns) + (this.cellSize * GOL.columns);
        this.canvas.setAttribute('width', this.width);
        this.height = this.height + (this.cellSpace * GOL.rows) + (this.cellSize * GOL.rows);
        this.canvas.setAttribute('height', this.height);

        // Fill background
        this.context.fillStyle = GOL.colors.grid;
        this.context.fillRect(0, 0, this.width, this.height);

        // Draw cells
        for (i = 0 ; i < GOL.columns; i++) {
          for (j = 0 ; j < GOL.rows; j++) {
            if ((i==GOL.activeRow) && (j==GOL.activeCol)) {
              this.drawCell(i, j, true);
            } else {
              this.drawCell(i, j, false);
            }
          }
        }
      },

      /**
       * drawCell
       */
      drawCell : function (i, j, alive) {

        if (alive) {
          this.context.fillStyle = GOL.colors.alive;
        } else {
          this.context.fillStyle = GOL.colors.dead;
        }

        this.context.fillRect(this.cellSpace + (this.cellSpace * i) + (this.cellSize * i), this.cellSpace + (this.cellSpace * j) + (this.cellSize * j), this.cellSize, this.cellSize);

        // Draw light strokes cutting the canvas through the middle
        if (i===parseInt(GOL.columns/2)) {
          this.context.fillStyle = mapZoneStrokeColor;
          this.context.fillRect(
            (this.cellSpace * i+1) + (this.cellSize * i+1) - 2*this.cellSpace,
            (this.cellSpace * j) + (this.cellSize * j) + this.cellSpace,
            this.cellSpace,
            this.cellSize,
          );
        }

        if (j===parseInt(GOL.rows/2)) {
          this.context.fillStyle = mapZoneStrokeColor;
          this.context.fillRect(
            (this.cellSpace * i+1) + (this.cellSize * i+1) - 2*this.cellSpace,
            (this.cellSpace * j) + (this.cellSize * j) + this.cellSpace,
            this.cellSize,
            this.cellSpace,
          );
        }

      },

      /**
       * Update the active cell.
       * When a user clicks on a cell, we get the row/col
       * from the mouse position, then pass them here.
       */
      updateActiveCell : function(i, j) {
        if (i >= 0 && i < GOL.columns && j >= 0 && j < GOL.rows) {
          if ((GOL.activeCol != null) && (GOL.activeRow != null)) {
            // Turn off current active cell
            this.clearWorld();
          }

          if ((i != null) && (j != null)) {
            // Turn on new cell
            this.drawCell(i, j, true);
          }

          // Update active row and column
          GOL.activeCol = i;
          GOL.activeRow = j;

          // Update player data
          GOL.loadPlayerData(false);
        } else {
          GOL.activeCol = null;
          GOL.activeRow = null;
        }
      },

    },


    /** ****************************************************************************************************************************
     * The Helpers
     */
    helpers : {
      urlParameters : null, // Cache


      /**
       * Return a random integer from [min, max]
       */
      random : function(min, max) {
        return min <= max ? min + Math.round(Math.random() * (max - min)) : null;
      },


      /**
       * Get URL Parameters
       */
      getUrlParameter : function(name) {
        if (this.urlParameters === null) { // Cache miss
          var hash, hashes, i;

          this.urlParameters = [];
          hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

          for (i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            this.urlParameters.push(hash[0]);
            this.urlParameters[hash[0]] = hash[1];
          }
        }

        return this.urlParameters[name];
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


      /**
       *
       */
      mousePosition : function (e) {
        // http://www.malleus.de/FAQ/getImgMousePos.html
        // http://www.quirksmode.org/js/events_properties.html#position
        var event, x, y, domObject, posx = 0, posy = 0, top = 0, left = 0, cellSize = GOL.cellSize + 1;

        event = e;
        if (!event) {
          event = window.event;
        }

        if (event.pageX || event.pageY)     {
          posx = event.pageX;
          posy = event.pageY;
        } else if (event.clientX || event.clientY)  {
          posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        domObject = event.target || event.srcElement;

        while ( domObject.offsetParent ) {
          left += domObject.offsetLeft;
          top += domObject.offsetTop;
          domObject = domObject.offsetParent;
        }

        domObject.pageTop = top;
        domObject.pageLeft = left;

        x = Math.ceil(((posx - domObject.pageLeft)/cellSize) - 1);
        y = Math.ceil(((posy - domObject.pageTop)/cellSize) - 1);

        return [x, y];
      }
    }

  };


  /**
   * Init on 'load' event
   */
  GOL.helpers.registerEvent(window, 'load', function () {
    GOL.init();
  }, false);

}());
