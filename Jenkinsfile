pipeline {
    agent any

    environment {
        DOCKER_USERNAME = 'geoplanoperation'
        DOCKER_IMAGE = 'clockgeo-client'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh "docker tag ${DOCKER_IMAGE} ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker stop clock-geo-client || true && docker rm clock-geo-client || true'
                    sh "docker run -d --name clock-geo-client --network vultr-network --ip 172.18.0.20 --restart always ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }

        success {
            echo 'Build succeeded!'
        }

        failure {
            echo 'Build failed!'
        }
    }
}
