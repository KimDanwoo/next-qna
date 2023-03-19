import * as admin from 'firebase-admin'

interface Config {
  // databaseurl: string
  credential: {
    privateKey: string
    clientEmail: string
    projectId: string
  }
}

export default class FirebaseAdmin { 
  public static instance: FirebaseAdmin

  private init = false

  public static getInstance(): FirebaseAdmin {
    if (FirebaseAdmin.instance === undefined || FirebaseAdmin.instance === null) {
      FirebaseAdmin.instance = new FirebaseAdmin()
      FirebaseAdmin.instance.bootstrap()
    }
    return FirebaseAdmin.instance
  }

  /** firestore */
  public get Firestore(): FirebaseFirestore.Firestore {
    if (this.init === false) {
      this.bootstrap()
    }
    return admin.firestore()
  }

  public get Auth(): admin.auth.Auth {
    if (this.init === false) {
      this.bootstrap()
    }
    return admin.auth()
  }

  private bootstrap(): void {
    const haveApp = admin.apps.length !== 0
    if (haveApp) {
      this.init = true
      return
    }
    const config: Config = {
      // databaseurl: process.env.databaseurl || '',
      credential: {
        // privateKey: (process.env.privateKey || '').replace(/\\n/g, '\n'),
        projectId: process.env.projectId || '',
        clientEmail: process.env.clientEmail || '',
        privateKey: (process.env.privateKey || '').replace(/\\n/g, '\n'),
      },
    }

    admin.initializeApp({
      // databaseURL: config.databaseurl,
      credential: admin.credential.cert(config.credential),
    })
    console.log('bootstrap end')
  }
}
