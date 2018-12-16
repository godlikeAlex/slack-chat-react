import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyAYrVGwk8eECHL0u-c9cntZGukqQRrW99Q",
    authDomain: "react-slack-black.firebaseapp.com",
    databaseURL: "https://react-slack-black.firebaseio.com",
    projectId: "react-slack-black",
    storageBucket: "react-slack-black.appspot.com",
    messagingSenderId: "370536787458"
};

firebase.initializeApp(config);