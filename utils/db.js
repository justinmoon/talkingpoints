import firebase from "./firebase"

const db = firebase.firestore()

export function updateUser(uid, data) {
  return db.collection("users").doc(uid).update(data)
}

export function createUser(uid, data) {
  return db
    .collection("users")
    .doc(uid)
    .set({ uid, ...data }, { merge: true })
}

export function createFeedback(data) {
  return db.collection("feedback").add(data)
}

export function createSite(data) {
  const site = db.collection("sites").doc()
  site.set(data)
  return site
}
