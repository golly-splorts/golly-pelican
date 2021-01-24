include common.mk

MODULES=tests

CB := $(shell git branch --show-current)

all:
	@echo "no default make rule defined"

help:
	cat Makefile

lint:
	flake8 $(MODULES)

rosters:
	scripts/make_roster_pages.py

requirements:
	python3 -m pip install --upgrade -r requirements.txt

test:
	pytest -sv

# Procedure:
# - run make release_X command
# - this will look for environment.X
# - if found, source it and run make deploy

release_main:
	scripts/release.sh $(CB) main

release_dev:
	scripts/release.sh $(CB) dev

release_integration:
	scripts/release.sh dev integration

release_prod:
	scripts/release.sh integration prod

test_deploy:
	scripts/deploy.sh --dry-run

deploy_local:
	scripts/deploy_local.sh

deploy:
	scripts/deploy.sh
