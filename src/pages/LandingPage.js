import React from "react";
// import isSignedIn variable value from Login.js
import { StyledFirebaseAuth } from 'react-firebaseui';
import { useEffect, useState } from 'react';
import '../App.css';
import firebase from 'firebase/compat/app'
import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";



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
  

function LandingPage(props) {
    const isSignedIn = props.isSignedIn;
    const isSignedInButtonPressed = props.isSignedInButtonPressed;
  return (
    <section className="hero is-large main-banner">
    <div className="container">
      <div className="columns">
        <div className='column hero-body'>
          <figure className="image dextract-logo">
            {/* removed viewbox #svgView(viewBox(390, 460, 310, 180)) */}
            <img src="../dextract-logos/svg/dextract-logo-black-transparent.svg" alt="logo"/>
          </figure>
        </div>
        <div className='column hero-body'>
          { (!isSignedInButtonPressed || isSignedIn)
          ? (<div className='has-text-justified'>
              <p className='dextract-text dextract-description pb-5'> 
              Dextract makes Venture Capital startup screening more efficient by extracting relevant 
              data from slide decks, allowing analysts to filter and evaluate startups in their intake pipeline. 
               <br/>
               <br/>
                Join the investment revolution today!
              </p>
              { isSignedIn 
                ? (
                  <Link to="/home">
                    <button className = 'button dextract-btn' href = "/home">Home</button>
                    </Link>
                ) 
                : ( 
                  <button className = 'button dextract-btn' onClick={() => props.setIsSignedInButtonPressed(true)}> Get Started </button>
                )
              }
            </div>
          )
          : <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          }
        </div>
      </div>
    </div>
  </section>
  );
}

export default LandingPage;
