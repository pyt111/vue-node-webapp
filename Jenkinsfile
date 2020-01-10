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
        sshPublisher(publishers: [
                                  sshPublisherDesc(
                                        configName: 'pyt111_server',
                                        transfers: [
                                              sshTransfer(
                                                    cleanRemote: false,
                                                    excludes: '',
                                                    execCommand: '''
                      cd /root/tt2/public
                      unzip -o -v vue_node_web.zip -d vue-webapp 
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
                                            ])
              }
            }

            stage('s') {
              steps {
                build 'jenkins_node_server_ pipeline'
              }
            }

          }
        }
