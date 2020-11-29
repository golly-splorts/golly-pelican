import os, re, glob

SITEURL = ''

AUTHOR = u'Ch4zm of Hellmouth'
SITENAME = u'Golly'

PATH = 'content'
THEME = 'golly-pelican-theme'

# Don't try to turn HTML files into pages
READERS = {'html': None}

# Static stuff
STATIC_PATHS = ['img']


# --------------------
# plugins

PLUGIN_PATHS = [os.path.join(os.environ['HOME'], 'codes', 'pelican-plugins')]
PLUGINS = ['render_math']



# --------------------
# Map template pages to their final file name

TEMPLATE_PAGES = {}
TEMPLATE_PAGES['index.html'] = 'index.html'

TEMPLATE_PAGES['landing.html'] = 'landing.html'
TEMPLATE_PAGES['landing.js'] = 'landing.js'

TEMPLATE_PAGES['season.html'] = 'season.html'
TEMPLATE_PAGES['season.js'] = 'season.js'

TEMPLATE_PAGES['postseason.html'] = 'postseason.html'
TEMPLATE_PAGES['postseason.js'] = 'postseason.js'

TEMPLATE_PAGES['league.html'] = 'league.html'
TEMPLATE_PAGES['league.js'] = 'league.js'

TEMPLATE_PAGES['maps.html'] = 'maps.html'

TEMPLATE_PAGES['siteMode_0009.html'] = 'siteMode_0009.html'
TEMPLATE_PAGES['siteMode_1019.html'] = 'siteMode_1019.html'
TEMPLATE_PAGES['siteMode_21.html'] = 'siteMode_21.html'
TEMPLATE_PAGES['siteMode_22.html'] = 'siteMode_22.html'
TEMPLATE_PAGES['siteMode_23.html'] = 'siteMode_23.html'
TEMPLATE_PAGES['siteMode_31.html'] = 'siteMode_31.html'
TEMPLATE_PAGES['siteMode_32.html'] = 'siteMode_32.html'
TEMPLATE_PAGES['siteMode_33.html'] = 'siteMode_33.html'
TEMPLATE_PAGES['siteMode_40plus.html'] = 'siteMode_40plus.html'

TEMPLATE_PAGES['allGames.html'] = 'allGames.html'

TEMPLATE_PAGES['miniplayer.html'] = 'miniplayer.html'

# --------------------
# Add custom routes

THEME_TEMPLATES_OVERRIDES = []

THEME_TEMPLATES_OVERRIDES.append('simulator')
TEMPLATE_PAGES['simulator/binary_life.html'] = 'simulator/index.html'
TEMPLATE_PAGES['simulator/binary_life.js']   = 'simulator/binary_life.js'

THEME_TEMPLATES_OVERRIDES.append('player_viewer')
TEMPLATE_PAGES['player_viewer/player_viewer.html'] = 'player_viewer/index.html'
TEMPLATE_PAGES['player_viewer/player_viewer.js']   = 'player_viewer/player_viewer.js'

# minilife app is used on multiple pages,
# so it lives in golly-pelican-theme

# How to add an app route:
### THEME_TEMPLATES_OVERRIDES.append('foobar')
### TEMPLATE_PAGES['foobar.html'] = 'foobar/index.html'
### TEMPLATE_PAGES['foobar.css']  = 'foobar/foobar.css'
### TEMPLATE_PAGES['foobar.json'] = 'foobar/foobar.json'
### TEMPLATE_PAGES['foobar_modcontrol.js'] = 'foobar/foobar_modcontrol.js'



# --------------------
# SHUT UP

ARCHIVES_SAVE_AS = ''
AUTHOR_SAVE_AS = ''
AUTHORS_SAVE_AS = ''
CATEGORY_SAVE_AS = ''
CATEGORIES_SAVE_AS = ''
DAY_SAVE_AS = ''
INDEX_SAVE_AS = ''
MONTH_ARCHIVE_SAVE_AS = ''
TAGS_SAVE_AS = ''
YEAR_ARCHIVE_SAVE_AS = ''


# ---------------------

# No feeds
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
DEFAULT_PAGINATION = False
TIMEZONE = 'America/Los_Angeles'

