pipeline {
  agent {
    docker {
      image 'node:alpine'
      args '-p 8089:8089'
    }

  }
  stages {
    stage('test') {
      steps {
        sh 'pwd'
        sh 'ls'
      }
    }
    stage('Deploy') {
      sshPublisher(
        publishers: [
          sshPublisherDesc(
            configName: 'pyt111_server',
            transfers: [
              sshTransfer(
                cleanRemote: false,
                excludes: '',
                execCommand: '''
                  cd /root/tt2/public tar xzf /root/tt2/vue_node_web.zip -C /root/tt2/public ''',
                  execTimeout: 120000,
                  flatten: false,
                  makeEmptyDirs: false,
                  noDefaultExcludes: false,
                  patternSeparator: '[, ]+',
                  remoteDirectory: 'tt2/public',
                  remoteDirectorySDF: false,
                  removePrefix: '',
                  sourceFiles: 'vue_node_web.zip'
              )
            ],
            usePromotionTimestamp: false,
            useWorkspaceInPromotion: false,
            verbose: false
          )
        ]
      )
    }
  }
}
