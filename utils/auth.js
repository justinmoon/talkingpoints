import React, { useState, useEffect, useContext, createContext } from "react"
import firebase from "./firebase"
import { createUser } from "./db"

const authContext = createContext()

export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleUser = async (rawUser) => {
    setLoading(false)
    if (rawUser) {
      const user = await formatUser(rawUser)
      // we don't want to save token in db
      const { token, ...userWithoutToken } = user
      createUser(user.uid, userWithoutToken)
      setUser(user)
      return user
    } else {
      setUser(false)
      return false
    }
  }

  const signinWithGitHub = () => {
    setLoading(true)
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => handleUser(response.user))
  }

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false))
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(handleUser)
    return () => unsubscribe()
    // return unsubscribe;
  }, [])

  return {
    user,
    loading,
    signinWithGitHub,
    signout,
  }
}

const getStripeRole = async () => {
  await firebase.auth().currentUser.getIdToken(true)
  const decodedToken = await firebase.auth().currentUser.getIdTokenResult()
  console.log("token", decodedToken)
  return decodedToken.claims.stripeRole || "free"
}

const formatUser = async (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    token: user.xa,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    stripeRole: await getStripeRole(),
  }
}
