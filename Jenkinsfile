pipeline {
  agent {
    docker {
      image 'node:alpine'
      args '-p 8089:8089'
    }

  }
  stages {
    stage('error') {
      steps {
        sh 'ls'
      }
    }

  }
}