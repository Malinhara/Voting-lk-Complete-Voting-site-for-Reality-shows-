
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app);
const firestoreInstance = getFirestore(app);
const storageInstance = getStorage(app);
const provider = new GoogleAuthProvider();

export { authInstance as auth, firestoreInstance as firestore, provider, storageInstance as storage };

