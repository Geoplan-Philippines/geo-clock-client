pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'geoplanoperation/clockgeo-client'
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
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
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
