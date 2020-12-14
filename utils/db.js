import firebase from "./firebase"
import getStripe from "./stripe"

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

export function deleteFeedback(id) {
  return db.collection("feedback").doc(id).delete()
}

export async function createCheckoutSession(uid) {
  const checkoutSessionRef = await db
    .collection("users")
    .doc(uid)
    .collection("checkout_sessions")
    .add({
      // this can be removed if you don't want promo codes
      allow_promotion_codes: true,
      // FIXME: better redirect locations ?
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    })

  checkoutSessionRef.onSnapshot(async (snap) => {
    const { sessionId } = snap.data()

    if (sessionId) {
      const stripe = await getStripe()
      stripe.redirectToCheckout({ sessionId })
    }

    // FIXME: what about if there is no session id?
  })
}
