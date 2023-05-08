import React from "react";
// import firebase from "firebase/app";
import "firebase/storage";
import firebase from 'firebase/compat/app';
import logo from '../logo.svg';
import { useState, useEffect } from 'react';
import '../App.css';

import { getUserId, get } from '../helpers';

function Home() {

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [data, setData] = useState([]);

  const getPitchDecks = async () => {
    const value1 = getUserId();
    get('api/decks', { param1: value1 })
    .then((res) => {
      console.log("response", res)
      if (res[0] === null) {
        console.log("No pitch decks found")
      }
      else {
        setData(res);
      }
      // If null needs to be handled

    })
    .catch((err) => console.log("Error: ", err));
  };

  const handleFileUpload = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

  const handleInvestmentMemo = (item) => {
    console.log("Investment memo generated!")
  }

  const handleSubmission = () => {
    console.log("Submitted!", selectedFile);
    const formData = new FormData();
    formData.set('fileName', selectedFile.name);
    formData.set('fileData', selectedFile);
    formData.set('userId', getUserId());

    fetch("api/upload-pdf", {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data'
      },
      body: formData
    }).then(response =>{ 
      if (response.ok) {
        response.json().then(data => {

          // This contains file-path URL which is sent to another API
          console.log('data: ', data);
          let file_path = data.file_url;
          fetch('api/process-pdf', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({filePath: file_path, userId: getUserId()})
          }).then(response => {
            if (response.ok) {
              console.log("response OK", response);
              getPitchDecks();
            }
          })
        })
      }
    })
    .catch((error) => console.log("Error: ", error))

  };

  useEffect(() => {
    getPitchDecks();
  }, []);

  const [profileData, setProfileData] = useState(null)

  function getData() {
    fetch("/api/profile")
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            console.log(data);
            setProfileData({
              profile_name: data.name,
              about_me: data.about
            });
          });
        }
      });
  }

  return (
    <div>
    <section className="hero secondary-banner">
      <div className="container">
        <h1 className="section-title dextract-text"> Pitch Deck Upload</h1>
        <hr className="section-hr"></hr>
        <div className="columns">
          <div className='column hero-body'>
            <div className="home">
              <p className="dextract-text is-size-5">Upload your pitch-decks here in PDF format and let us handle the heavy work!</p>
            </div>
          </div>
          <div className='column hero-body'>
              <div>
                <input type="file" name="file" onChange={handleFileUpload} />
                <button className = 'button dextract-btn' onClick={handleSubmission}>Submit</button>
              </div>
          </div>
        </div>
      </div>
    </section>


    <div className="container hero is-large">
        <h1 className="section-title dextract-text"> Pitch Decks</h1>
        <br/>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Company Description </th>
              <th>Industry</th>
            </tr>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.LongText}</td>
                <td>{item.industry}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
</div>
  );
}

export default Home;

