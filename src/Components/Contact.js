import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Button } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';

const Contact = ({ name, isUser1 }) => {
  const displayName = localStorage.getItem('name');
  const docID = getID(); //get the document ID
  const [unread, setUnread] = useState(0); //state of total unread
  const convoRef = firebase.firestore().collection('conversations'); //get a reference to all conversations

  useEffect(() => {
    getUnread();
  });

  function getUnread() {
    convoRef
      .doc(docID)
      .get()
      .then((doc) => {
        var unread = 0;
        unread = doc.data()[displayName];
        setUnread(unread);
      });
  }

  function getID() {
    return isUser1 ? displayName + name : name + displayName;
  }

  function passProps() {
    localStorage.setItem('receiver', name); //passes the contact's name into localstorage
    localStorage.setItem('isUser1', isUser1); 
    firebase
      .firestore()
      .collection('users')
      .doc(name)
      .get()
      .then((doc) => {
        (async () => {
          const photo = await doc.data().photo; //wait until photo url is received
          localStorage.setItem('photo', photo); // store user's photo id to display in the chat
          window.location.reload(); // refresh the page to load the contact's component
        })();
      });
  }

  return (
    <li style={{ maxWidth: '100%' }}>
      <Badge badgeContent={unread} color="primary">
        <Button
          onClick={passProps}
          style={{ textTransform: 'none', maxWidth: '100%' }}
        >
          <div>
            <strong>
              <p>{name}</p>
            </strong>
          </div>
        </Button>
      </Badge>
    </li>
  );
};

export default Contact;
