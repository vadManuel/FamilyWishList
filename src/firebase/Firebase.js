import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import config from './firebaseConfig'

firebase.initializeApp(config)
const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export {
    db,
    timestamp
}