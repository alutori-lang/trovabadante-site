import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBb_4f3E7la3zIUkBmC_gbgeF-iUm4JrVc',
  authDomain: 'trovabadante-9d0cb.firebaseapp.com',
  projectId: 'trovabadante-9d0cb',
  storageBucket: 'trovabadante-9d0cb.firebasestorage.app',
  messagingSenderId: '253092823736',
  appId: '1:253092823736:web:138727d395537a32bfaa4d',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
