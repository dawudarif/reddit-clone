import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// export const createUserDocument = functions.auth
//   .user()
//   .onCreate(async (user) => {
//     db.collection('users')
//       .doc(user.uid)
//       .set(JSON.parse(JSON.stringify(user)));
//   });

export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    const newUser = {
      uid: user.uid,
      emial: user.email,
      displayName: user.displayName,
      providerData: user.providerData,
    };
    db.collection('users').doc(user.uid).set(newUser);
  });
