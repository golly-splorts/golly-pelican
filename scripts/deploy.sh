#!/bin/bash

set -euo pipefail

# This is machine-dependent (SSH config)
GH_URL="ch4zm.github.com"
DRY_RUN=""

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
    else
        echo "Error: unrecognized argument provided."
        echo "Only valid input argument is --dry-run."
        exit 1;
    fi
fi

# Figure out the domain for the given stage
case ${GOLLY_STAGE} in
    dev)
    DOM="${GOLLY_BASE_UI}"
    REPO="golly.life-dev"
    ;;
    integration)
    DOM="${GOLLY_BASE_UI}"
    REPO="golly.life-integration"
    ;;
    prod)
    DOM="${GOLLY_BASE_UI}"
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

rm -fr output/*

echo "Generating pelican content..."
pelican content

(
echo "Committing new content..."
cd output

# Set the username for git commit
git config user.name "Ch4zm of Hellmouth"

# Set the email for git commit
git config user.email "ch4zm.of.hellmouth@gmail.com"

echo $DOM > CNAME

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
    GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_rsa_ch4zm -o IdentitiesOnly=yes -o StrictHostKeyChecking=no" git push origin gh-pages
fi
)

echo "Cleaning up"
rm -fr output
)
