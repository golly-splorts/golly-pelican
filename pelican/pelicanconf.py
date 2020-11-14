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
# Map template pages to their final file name

TEMPLATE_PAGES = {}
TEMPLATE_PAGES['index.html'] = 'index.html'
TEMPLATE_PAGES['season.html'] = 'season.html'
TEMPLATE_PAGES['postseason.html'] = 'postseason.html'

# --------------------
# Add custom routes

THEME_TEMPLATES_OVERRIDES = []

# How to add an app route:
### THEME_TEMPLATES_OVERRIDES.append('foobar')
### TEMPLATE_PAGES['foobar.html'] = 'foobar/index.html'
### TEMPLATE_PAGES['foobar.css']  = 'foobar/foobar.css'
### TEMPLATE_PAGES['foobar.json'] = 'foobar/foobar.json'
### TEMPLATE_PAGES['foobar_modcontrol.js'] = 'foobar/foobar_modcontrol.js'


# ---------------------

# No feeds
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
DEFAULT_PAGINATION = False
TIMEZONE = 'America/Los_Angeles'

