// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'mern-estate-3f294.firebaseapp.com',
    projectId: 'mern-estate-3f294',
    storageBucket: 'mern-estate-3f294.appspot.com',
    messagingSenderId: '1092786459165',
    appId: '1:1092786459165:web:49a9bd4556d52606e42cf4',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
