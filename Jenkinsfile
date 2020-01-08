pipeline {
    agent {
        docker {
            image 'node:alpine'
            args '-p 8089:8089'
        }
    }
    stages {
           stage('pwd') {
               steps {
                    sh 'ls'
               }
           }
//         stage('Build') {
//             steps {
//                 sh 'npm install'
//             }
//         }
    }
}
