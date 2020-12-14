import firebase from "./firebase"
import getStripe from "./stripe"

const db = firebase.firestore()
const app = firebase.app()

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
      price: process.env.NEXT_PUBLIC_PRICE_ID,
      // This can be removed if you don't want promo codes
      allow_promotion_codes: true,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
      // Don't collect billing address
      billing_address_collection: "auto",
    })
  checkoutSessionRef.onSnapshot(async (snap) => {
    const { sessionId } = snap.data()
    if (sessionId) {
      const stripe = await getStripe()
      stripe.redirectToCheckout({ sessionId })
    }
  })
}

export async function goToBillingPortal() {
  const functionRef = app
    .functions("us-central1")
    .httpsCallable("ext-firestore-stripe-subscriptions-createPortalLink")
  const { data } = await functionRef({
    returnUrl: `${window.location.origin}/account`,
  })
  window.location.assign(data.url)
}
