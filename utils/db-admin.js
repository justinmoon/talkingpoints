import firebase from "./firebase-admin";

export async function getAllFeedback(siteId) {
  try {
    const snapshot = await firebase
      .collection("feedback")
      .where("siteId", "==", siteId)
      .get();
    const feedback = [];
    snapshot.forEach((doc) => {
      feedback.push({ id: doc.id, ...doc.data() });
    });
    return { feedback };
  } catch (error) {
    return { error };
  }
}
