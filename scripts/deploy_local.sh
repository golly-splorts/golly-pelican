#!/bin/bash

set -euo pipefail

if [ -z ${GOLLY_PELICAN_HOME+x} ]; then
	echo 'You must set the $GOLLY_PELICAN_HOME environment variable to proceed.'
    echo 'Try sourcing environment.{STAGE}'
	exit 1
else 
	echo "\$GOLLY_PELICAN_HOME is set to '$GOLLY_PELICAN_HOME'"
fi

(
cd ${GOLLY_PELICAN_HOME}/pelican
rm -fr output
echo "Generating pelican content..."
pelican content
(
cd output
python -m http.server $GOLLY_UI_PORT
)
)
