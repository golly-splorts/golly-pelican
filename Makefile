include common.mk

CB := $(shell git branch --show-current)

all:
	@echo "no default make rule defined"

# Procedure:
# - run make release_X command
# - this will look for environment.X
# - if found, source it and run make deploy

release_dev:
	scripts/release.sh $(CB) dev

release_integration:
	scripts/release.sh dev integration

release_prod:
	scripts/release.sh staging prod

test_deploy:
	scripts/deploy.sh --dry-run

deploy:
	scripts/deploy.sh
