import './App.css';
// This uses the pre-built login form
import { StyledFirebaseAuth } from 'react-firebaseui';
// This imports firebase using the Firebase SDK v8 style
import firebase from 'firebase/compat/app'
// This imports the Firebase Auth libraries
import 'firebase/compat/auth'
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from "./components/Navbar";
import Logout from "./pages/Logout";




const firebaseConfig = {
  apiKey: "AIzaSyDChohbk4h-sw7hWmGbb6_AfPiSUHzEIi4",
  authDomain: "dextract-1d40c.firebaseapp.com",
  projectId: "dextract-1d40c",
  storageBucket: "dextract-1d40c.appspot.com",
  messagingSenderId: "821622992810",
  appId: "1:821622992810:web:e5d064b985e43f9d5585d3",
  measurementId: "G-6M1T6CKJVV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};


function App() {
  // State to keep track of signed-in state
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSignedInButtonPressed, setIsSignedInButtonPressed] = useState(false)
  const requiresLogin = Component => {
    return isSignedIn ? Component : <Navigate to="/" />;
  };


  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      // this gets called whenever a user signs in or out
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);
 
  return (
<div>
        <Router>
          <Navbar isSignedIn={isSignedIn} setIsSignedInButtonPressed={setIsSignedInButtonPressed} />

          <Routes>
            <Route exact path="/" element={<Navigate to="/landing" />} />
            <Route path="/home" element={requiresLogin(<Home/>)}/>
            <Route path="/landing" element={<LandingPage isSignedIn={isSignedIn} isSignedInButtonPressed={isSignedInButtonPressed} setIsSignedInButtonPressed={setIsSignedInButtonPressed}/>} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            
            <Route
              path= "/logout"
              element={
                <Logout
                  onLogout={() => {
                    setIsSignedIn(false);
                  //   window.location.href = "/";
                  //   console.log('Does this work?')
                  }}
                />
              }
            />
          </Routes>
        </Router>
      </div>
    
  );
}

export default App;


