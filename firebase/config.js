import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC5_wIJT5yhiN8IwfZPiwWGieYfE64utFA',
  authDomain: 'gymtracker-a6331.firebaseapp.com',
  databaseURL: 'https://gymtracker-a6331.firebaseio.com',
  projectId: 'gymtracker-a6331',
  storageBucket: 'gymtracker-a6331.appspot.com',
  messagingSenderId: '551908913886',
  appId: '1:551908913886:android:f50db7cc70b08ebf24084f',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };