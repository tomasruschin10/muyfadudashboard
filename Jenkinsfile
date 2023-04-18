pipeline {
  agent { label 'aws' }

  environment {
    COMMIT_ID = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
  }

  parameters {
    choice(
        name: 'deployprod',
        choices: "NO\nYES",
        description: 'do you want to deploy to Production?' )
  }

  stages {
    stage('Build') {
      steps {
        sh 'make build IMAGE_TAG=$GIT_COMMIT'
      }
    }

    stage('CodeReview') {
      steps {
        sh '/usr/local/bin/codacy-analysis-cli analyze --directory $PWD --project-token c5345e09a6884813be37444345ee62ad --allow-network --upload --verbose || exit 0'
      }
    }

    stage('Archive') {
      steps {
        sh 'make tag IMAGE_TAG=$GIT_COMMIT'
        sh 'make push IMAGE_TAG=$GIT_COMMIT'
      }
    }

    stage('Cleanup') {
      steps {
        sh 'make clean IMAGE_TAG=$GIT_COMMIT'
      }
    }

    stage('DevDeployment') {
      when {
        branch 'develop'
      }
      steps {
        sh 'sleep 3'
        echo 'Deploying to develop branch.'
        sh 'make deploy BRANCH=$GIT_BRANCH'
      }
    }

    stage('ProdDeployment') {
      when {
        allOf {
          branch 'master';
          environment name: 'deployprod', value: 'YES'
        }
      }
      steps {
        sh 'sleep 3'
        echo 'PRODUCTION Deployment approved.'
        sh 'make deploy BRANCH=$GIT_BRANCH'
      }
    }
  }
  
  post {
        success {
            slackSend (
        color: '#00ff00',
        channel: 'builds',
        message: "merch-front - Completed:  '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
      )
        }
        failure {
            slackSend (
        color: '#ff0000',
        channel: 'builds',
        message: "merch-front - Failed:  '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
      )
        }
  }
}