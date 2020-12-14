import { useAuth } from "utils/auth"
import UpgradeEmptyState from "components/UpgradeEmptyState"

export default function Index() {
  const auth = useAuth()
  const isPaidAccount = auth.user?.stripeRole !== "free"
  return auth.user ? (
    <div>
      <p>Email: {auth.user.email}</p>
      <p>Paid: {isPaidAccount}</p>
      <button onClick={(e) => auth.signout()}>Sign Out</button>
      {!isPaidAccount && <UpgradeEmptyState />}
    </div>
  ) : (
    <button onClick={(e) => auth.signinWithGitHub()}>Sign In</button>
  )
}

// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/8.2.0/firebase-analytics.js"></script>

// <script>
//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   var firebaseConfig = {
//     apiKey: "AIzaSyBuk52JlQEw-VQvMnGpqT5de8t9jLAU5Nw",
//     authDomain: "talkingpoints-58f16.firebaseapp.com",
//     projectId: "talkingpoints-58f16",
//     storageBucket: "talkingpoints-58f16.appspot.com",
//     messagingSenderId: "34057833104",
//     appId: "1:34057833104:web:5c3b93713744abb82a2615",
//     measurementId: "G-N3MPQN0TEM"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
// </script>
