## Base API/UI Variable

Note on how base API/UI URL variable is handled:

* In `pelicanconf.py` we check for two environment variables,
  `GOLLY_BASE_UI` and `GOLLY_BASE_API`

* If these environment variables are set, they are turned into
  Jinja variables

* If these environment variables are not set, they are empty strings

* The Pelican theme header references these two variables when
  defining document-wide base UI and base API URL variables

* If the variables are set, they are used as the UI/API base URL.

* If the variables are empty strings, Javascript programmatically gets
  the base URL of the document and uses that as the UI URL. It then
  inserts "api." between the `https://` and rest of the URL and uses
  that as the API URL.

Examples:

* Example: if the user sets env var `GOLLY_BASE_UI` to `http://localhost:8000`
  and env var `GOLLY_BASE_API` to `http://localhost:8989`, those are the
  URLs that will be used on the UI pages.

* Example: if Javascript programmatically detects `https://golly.life` as
  the base URL, it will attempt to use `https://api.golly.life` as the API URL.
