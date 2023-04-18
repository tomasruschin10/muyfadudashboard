REGISTRY=869575750609.dkr.ecr.us-east-1.amazonaws.com
IMAGE=osmosv2-merchant-frontend
IMAGE_TAG=latest
IMAGE_PORT=80
BRANCH=devops
TASK_FAMILY_PROD=osmosis-merch-frontend-prod
SERVICE_NAME_PROD=osmosis-merch-frontend-prod
CLUSTER_NAME_PROD=osmosis-production
TASK_FAMILY_DEV=osmosis-merch-frontend-dev
SERVICE_NAME_DEV=osmosis-dev-merchant-frontend
CLUSTER_NAME_DEV=osmosis-dev

.DEFAULT: all

all: build run

release: build tag push

deploy:    
ifeq ($(BRANCH), master)
deploy: deploy_image_production
else
deploy: deploy_image_development
endif

deploy_image_production:
	@echo "[INFO] Deploying the image to Production"
	./bin/deploy-image.sh $(TASK_FAMILY_PROD) $(SERVICE_NAME_PROD) $(CLUSTER_NAME_PROD) 869575750609.dkr.ecr.us-east-1.amazonaws.com/osmosv2-merchant-frontend:$(GIT_COMMIT)

deploy_image_development:
	@echo "[INFO] Deploying the image to Development"
	./bin/deploy-image.sh $(TASK_FAMILY_DEV) $(SERVICE_NAME_DEV) $(CLUSTER_NAME_DEV) 869575750609.dkr.ecr.us-east-1.amazonaws.com/osmosv2-merchant-frontend:$(GIT_COMMIT)

build:
	@echo "[INFO] Building $(IMAGE):$(IMAGE_TAG) docker image"
	docker build -t $(IMAGE):$(IMAGE_TAG) .

run:
	@echo "[INFO] Running $(IMAGE):$(IMAGE_TAG) docker image"
	docker run \
		--rm \
		--detach=true \
		--name $(IMAGE) \
		--publish $(IMAGE_PORT):$(IMAGE_PORT) \
		$(IMAGE)

tag:
	@echo "[INFO] Tagging $(IMAGE) docker image to $(IMAGE_TAG)"
	docker tag $(IMAGE):$(IMAGE_TAG) $(REGISTRY)/$(IMAGE):$(IMAGE_TAG)

push:
	@echo "[INFO] Pushing $(REGISTRY)/$(IMAGE)/$(IMAGE_TAG)"
	bash -c 'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 869575750609.dkr.ecr.us-east-1.amazonaws.com'
	docker push $(REGISTRY)/$(IMAGE):$(IMAGE_TAG)

clean:
	@echo "[INFO] Removing $(IMAGE):$(IMAGE_TAG) docker image"
	docker rmi $(IMAGE):$(IMAGE_TAG)
	docker rmi $(REGISTRY)/$(IMAGE):$(IMAGE_TAG)
