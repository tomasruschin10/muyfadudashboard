#!/bin/bash
TASK_FAMILY=$1
SERVICE_NAME=$2
CLUSTER_NAME=$3
NEW_DOCKER_IMAGE="$4"
#ENVIRONMENT=$5

REGION=us-east-1

OLD_TASK_DEF=$(aws --region $REGION ecs describe-task-definition --task-definition $TASK_FAMILY --output json)
NEW_TASK_DEF=$(echo $OLD_TASK_DEF | jq --arg NDI $NEW_DOCKER_IMAGE '.taskDefinition.containerDefinitions[0].image=$NDI')
FINAL_TASK=$(echo $NEW_TASK_DEF | jq '.taskDefinition|{volumes: .volumes, containerDefinitions: .containerDefinitions}')

echo $FINAL_TASK > finaltask.json
#python bin/parse_properties.py -e $ENVIRONMENT
FINAL_TASK=`cat finaltask.json`

aws --region $REGION ecs register-task-definition --family $TASK_FAMILY --cli-input-json "$(echo $FINAL_TASK)"
aws --region $REGION ecs update-service --service $SERVICE_NAME --task-definition $TASK_FAMILY --cluster $CLUSTER_NAME

rm finaltask.json

# sample
# ./bin/deploy-image.sh  osmoscloudv20-dev osmosisv2-development  osmosisv2-dev-development-ecs-cluster 869575750609.dkr.ecr.us-east-1.amazonaws.com/osmoscloud-2.0:276531e240f4e54ea1eb2055fe7c247a97064e3c
