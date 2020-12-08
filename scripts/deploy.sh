#!/bin/bash

set -euo pipefail

# This is machine-dependent (SSH config)
GH_URL="ch4zm.github.com"

if [ -z ${GOLLY_PELICAN_HOME+x} ]; then
	echo 'You must set the $GOLLY_PELICAN_HOME environment variable to proceed.'
    echo 'Try sourcing environment.{STAGE}'
	exit 1
else 
	echo "\$GOLLY_PELICAN_HOME is set to '$GOLLY_PELICAN_HOME'"
fi

if [ -z ${GOLLY_STAGE+x} ]; then
	echo 'You must set the $GOLLY_STAGE environment variable to proceed.'
    echo 'Try sourcing environment.{STAGE}'
	exit 1
else 
	echo "\$GOLLY_STAGE is set to '$GOLLY_STAGE'"
fi

# Check for command line flag `--dry-run`
if [[ $# > 0 ]]; then
    if [[ "$1" == "--dry-run" ]]; then
        DRY_RUN="--dry-run"
    fi
fi

# Figure out the domain for the given stage
case ${GOLLY_STAGE} in
    dev)
    DOM="golly123.life"
    REPO="golly.life-dev"
    ;;
    integration)
    DOM="golly456.life"
    REPO="golly.life-integration"
    ;;
    prod)
    DOM="golly.life"
    REPO="golly.life"
    ;;
    *)
    echo "Unrecognized stage: ${GOLLY_STAGE}"
    echo "Must be: dev, integration, prod"
    exit 1
    ;;
esac

echo "Cloning repo ${GH_URL}/golly-splorts/${REPO}"

(
cd ${GOLLY_PELICAN_HOME}/pelican
rm -fr output
git clone -b gh-pages git@${GH_URL}:golly-splorts/${REPO}.git output

echo "Generating pelican content..."
pelican content

(
echo "Committing new content..."
cd output
git add -A .

git commit -a -m "Automatic deploy of ${GOLLY_STAGE} at $(date -u +"%Y-%m-%d-%H-%M-%S")"
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "Git commit step succeeded"
else
    echo "Git commit step failed"
    echo "Cleaning up"
    echo rm -fr output
    exit 1
fi

if [[ $DRY_RUN == "--dry-run" ]]; then
    echo "Skipping push step, --dry-run flag present"
else
    echo "Pushing to remote"
    git push origin gh-pages
fi
)

echo "Cleaning up"
rm -fr output
)