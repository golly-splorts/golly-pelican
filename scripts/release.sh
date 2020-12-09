#!/bin/bash

set -euo pipefail

if [ -z "${GOLLY_PELICAN_HOME}" ]; then
	echo 'You must set the $GOLLY_PELICAN_HOME environment variable to proceed.'
	exit 1
fi

# This block discovers the command line flags `--force` and  `--no-deploy`,
# and passes on positional arguments as $1, $2, etc.
if [[ $# > 0 ]]; then
    FORCE=
    POSITIONAL=()
    while [[ $# > 0 ]]; do
        key="$1"
        case $key in
            --force)
            FORCE="--force"
            shift
            ;;
            *)
            POSITIONAL+=("$1")
            shift
            ;;
        esac
    done
    set -- "${POSITIONAL[@]}" # restore positional parameters
fi

if [[ $# != 2 ]]; then
    echo "Given a source (pre-release) branch and a destination (release) branch,"
	echo "this script does the following:"
	echo " - create a git tag"
	echo " - reset head of destination branch to head of source branch"
	echo " - push result to git repo"
	echo " - if environment.${DEST} is found, source it and run make deploy"
    echo
    echo "If the --force flag is given, deployment will proceed regardless of warnings."
    echo
    echo "If the --no-deploy flag is given, the deployment step will be skipped."
    echo
    echo "Usage: $(basename $0) source_branch dest_branch [--force] [--no-deploy]"
    echo "Example: $(basename $0) development dev"
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    if [[ $FORCE == "--force" ]]; then
        echo "You have uncommitted files in your Git repository. Forcing deployment anyway."
    else
        echo "You have uncommitted files in your Git repository. Please commit or stash them, or run $0 with --force."
        exit 1
    fi
fi

export PROMOTE_FROM_BRANCH=$1 PROMOTE_DEST_BRANCH=$2

RELEASE_TAG=$(date -u +"%Y-%m-%d-%H-%M-%S")-${PROMOTE_DEST_BRANCH}.release

if [[ "$(git --no-pager log --graph --abbrev-commit --pretty=oneline --no-merges -- $PROMOTE_DEST_BRANCH ^$PROMOTE_FROM_BRANCH)" != "" ]]; then
    echo "Warning: The following commits are present on $PROMOTE_DEST_BRANCH but not on $PROMOTE_FROM_BRANCH"
    git --no-pager log --graph --abbrev-commit --pretty=oneline --no-merges $PROMOTE_DEST_BRANCH ^$PROMOTE_FROM_BRANCH
    if [[ $FORCE == "--force" ]]; then
        echo -e "\nThey will be overwritten on $PROMOTE_DEST_BRANCH and discarded."
    else
        echo -e "\nRun with --force to overwrite and discard these commits from $PROMOTE_DEST_BRANCH."
        exit 1
    fi
fi

if ! git --no-pager diff --ignore-submodules=untracked --exit-code; then
    echo "Working tree contains changes to tracked files. Please commit or discard your changes and try again."
    exit 1
fi

git fetch --all
git -c advice.detachedHead=false checkout origin/$PROMOTE_FROM_BRANCH
git checkout -B $PROMOTE_DEST_BRANCH
git tag $RELEASE_TAG
git push --force origin $PROMOTE_DEST_BRANCH
git push --tags

if [[ -e "${GOLLY_PELICAN_HOME}/environment.${PROMOTE_DEST_BRANCH}" ]]; then
    source "${GOLLY_PELICAN_HOME}/environment.${PROMOTE_DEST_BRANCH}"
    make -C "$GOLLY_PELICAN_HOME" deploy
else
    echo "Error: Could not find environment config file ${GOLLY_PELICAN_HOME}/environment.${PROMOTE_DEST_BRANCH}. Unable to deploy."
    exit 1
fi

