.PHONY: deploy-game-client deploy-game-client-candidate prepare-vercel-build promote-game-client verify-vercel-project

VERCEL_PROJECT := hexarena-game-client

verify-vercel-project:
	@command -v vercel >/dev/null 2>&1 || { echo "Vercel CLI not found. Install and authenticate the system vercel binary."; exit 1; }
	@vercel whoami
	@test -f .vercel/project.json || { echo ".vercel/project.json not found. Run: vercel link --project $(VERCEL_PROJECT)"; exit 1; }
	@linked_project="$$(node -p "require('./.vercel/project.json').projectName")"; \
		test "$$linked_project" = "$(VERCEL_PROJECT)" || { \
			echo "Incorrect Vercel project: $$linked_project. Expected $(VERCEL_PROJECT)."; \
			exit 1; \
		}

prepare-vercel-build: verify-vercel-project
	vercel pull --yes --environment=production

deploy-game-client: prepare-vercel-build
	NODE_OPTIONS=--openssl-legacy-provider vercel build --prod
	vercel deploy --prebuilt --prod

deploy-game-client-candidate: prepare-vercel-build
	NODE_OPTIONS=--openssl-legacy-provider vercel build --prod
	vercel deploy --prebuilt --prod --skip-domain

promote-game-client: verify-vercel-project
	@test -n "$(DEPLOYMENT_URL)" || { echo "DEPLOYMENT_URL not set. Pass the candidate deployment URL."; exit 1; }
	vercel promote "$(DEPLOYMENT_URL)"
