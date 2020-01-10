pipeline {
  agent any
  stages {
    stage('test') {
      steps {
        sh 'pwd'
        sh 'ls'
      }
    }
    stage('Deploy') {
      steps {
          sshPublisher(
            publishers: [
              sshPublisherDesc(
                configName: 'pyt111_server',
                transfers: [
                  sshTransfer(
                    cleanRemote: false,
                    excludes: '',
                    execCommand: '''
                      cd /root/tt2/public
                      unzip /root/tt2/vue_node_web.zip  /root/tt2/public
                      ''',
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
}
