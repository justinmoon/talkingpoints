import { getUserSites } from "utils/db-admin"
import { auth } from "utils/firebase-admin"

export default async (req, res) => {
  try {
    const { uid } = await auth.verifyIdToken(req.headers.token)
    const { sites } = await getUserSites(uid)
    console.log(sites)
    res.status(200).json({ sites })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}
