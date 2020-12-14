This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Next.js

- React 2025 uses [Nextra](https://github.com/shuding/nextra). We decided not to use this directly, because each post would have to have a ton of JSX boilerplate (video player, navigation, etc). But it looks very nice and we could use this for inspiration.
- [Interesting MDX video player tutorial](https://scotch.io/tutorials/building-a-video-blog-with-gatsby-and-markdown-mdx#toc-summary1) to give you a sense of how ^^ would work

## TODO

- make `client-db` and `server-db` files. Now there is one for client and one for server but it's not so clear this is so and which one is which
- fix navbar on feedback page
- Stripe firestore rules update
- Vercel should use secret variables
- How to actually make the iframe usable? Right now it doesn't really do anything ...

## Old rules

Got the following with these: `FirebaseError: Missing or insufficient permissions.`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if isUser(uid);
    }
    match /feedback/{uid} {
      allow read: if true;
      allow delete: if isOwner() || isSiteOwner();
      allow update: if isOwner() && willBeOwner() || isSiteOwner() && willBeSiteOwner();
      allow create: if willBeOwner();
    }
    match /sites/{uid} {
      allow read: if isOwner();
      allow delete: if isOwner();
      allow update: if isOwner() && willBeOwner();
      allow create: if willBeOwner();
    }
    match /customers/{uid} {
      allow read: if request.auth.uid == uid;
      match /checkout_sessions/{id} {
        allow read, write: if request.auth.uid == uid;
      }
      match /subscriptions/{id} {
        allow read: if request.auth.uid == uid;
      }
    }
    match /products/{id} {
      allow read: if true;
      match /prices/{id} {
        allow read: if true;
      }
      match /tax_rates/{id} {
        allow read: if true;
      }
    }
  }
}
function isUser(uid) {
  return isSignedIn() && request.auth.uid == uid;
}
function isSignedIn() {
  return request.auth.uid != null;
}
function isOwner(){
  return isUser(currentData().authorId);
}
function isSiteOwner(){
  return isUser(currentData().siteAuthorId);
}
function willBeOwner(){
  return isUser(incomingData().authorId);
}
function willBeSiteOwner(){
  return isUser(incomingData().siteAuthorId);
}
function currentData() {
  return resource.data;
}
function incomingData() {
  return request.resource.data;
}
```
