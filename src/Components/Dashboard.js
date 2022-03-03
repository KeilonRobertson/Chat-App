import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import ProfilePic from './ProfilePic';
import COLOUR from '../Colour';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { Link } from 'react-router-dom';
import CreateConversation from './CreateConversation';
import Badge from '@material-ui/core/Badge';

const Dashboard = () => {
  const user = firebase.auth().currentUser;
  const [username, setUser] = useState('');
  const [unread, setUnread] = useState(0);
  const convoRef = firebase.firestore().collection('conversations');

  useEffect(() => {
    setUser(user.displayName);
    convoRef
      .where('chatters', 'array-contains', username) //check documents where user is apart of a conversation
      .onSnapshot((querySnapshot) => {
        //orders the documents by last Message Sent
        /* initialize an empty local array to store all conversations to pass as 
         props into ConversationBox component */
        var unread = 0;
        //loop function for each document and add conversation information
        querySnapshot.forEach((doc) => {
          //loop through results and add all conversation information
          unread += doc.data()[username];
        });
        setUnread(unread);
      });
  }, [username, setUnread, setUser, convoRef, user.displayName]); // <-- empty array means 'run once'

  function onSignOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert('You Have been signed out successfully');
        localStorage.clear();
      })
      .catch((error) => {
        var errMsg = error.toString();
        alert(errMsg);
      });
  }

  return (
    <div
      style={{
        textAlign: 'center',
        alignItems: 'center',
        marginTop: '100px',
      }}
    >
      <ProfilePic />
      <img
        className="picture"
        src={user.photoURL}
        alt="profile pic"
        style={{
          textAlign: 'center',
          alignItems: 'center',
          marginTop: '10px',
          maxWidth: '250px',
          maxHeight: '250px',
        }}
      ></img>
      <h1>{username}</h1>

      <Badge badgeContent={unread} color="primary">
        <Link to="/messages" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            style={{
              color: 'white',
              backgroundColor: COLOUR.accentColour,
              marginTop: '10px',
              margin: '10px',
            }}
          >
            Friends
          </Button>
        </Link>
      </Badge>

      <Button
        variant="contained"
        style={{
          color: 'white',
          backgroundColor: 'red',
          marginTop: '10px',
          margin: '10px',
        }}
        colour="danger"
        onClick={onSignOut}
      >
        SIGN OUT
      </Button>
      <CreateConversation />
    </div>
  );
};

export default Dashboard;
