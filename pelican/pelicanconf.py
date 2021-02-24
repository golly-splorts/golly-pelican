import os, re, glob


GOLLY_PELICAN_VERSION = "12.0.0"


# Yes, this is supposed to be UI not URI...
SITEURL = os.environ.get('GOLLY_BASE_UI', '')

AUTHOR = u'Ch4zm of Hellmouth'

HERE = os.path.abspath(os.path.dirname(__file__))

stage = os.environ.get('GOLLY_STAGE', '')
### if stage=="dev":
###     SITENAME = u'Golly123'
if stage=="integration":
    SITENAME = u'Golly456'
else:
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
TEMPLATE_PAGES['index.js'] = 'index.js'

TEMPLATE_PAGES['season.html'] = 'season.html'
TEMPLATE_PAGES['season.js'] = 'season.js'

TEMPLATE_PAGES['postseason.html'] = 'postseason.html'
TEMPLATE_PAGES['postseason.js'] = 'postseason.js'

TEMPLATE_PAGES['league.html'] = 'league.html'
TEMPLATE_PAGES['league.js'] = 'league.js'

TEMPLATE_PAGES['maps.html'] = 'maps.html'
TEMPLATE_PAGES['maps.js'] = 'maps.js'

# --------------------
# Add custom routes

THEME_TEMPLATES_OVERRIDES = []

THEME_TEMPLATES_OVERRIDES.append('simulator')
TEMPLATE_PAGES['simulator/binary_life.html'] = 'simulator/index.html'
TEMPLATE_PAGES['simulator/binary_life.js']   = 'simulator/binary_life.js'

# minilife app is used on multiple pages,
# so it lives in golly-pelican-theme

# These two env vars are used via Jinja in golly-pelican-theme (header.html) to set API/UI base URLs.
# If they are empty strings, we use Javscript to deduce the base UI URL,
# and insert "api." beteen the protocol and base URL to get the API URL.
GOLLY_BASE_UI = os.environ.get('GOLLY_BASE_UI', '')
GOLLY_BASE_API = os.environ.get('GOLLY_BASE_API', '')


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

