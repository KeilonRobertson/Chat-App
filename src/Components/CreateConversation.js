import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import COLOUR from '../Colour';
import '../App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const CreateConversation = () => {
  const [createConvo, setCreateConvo] = useState(false);

  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');

  const openCreateConvo = () => {
    setCreateConvo(true);
  };

  const closeCreateConvo = () => {
    setCreateConvo(false);
  };

  const receiverChanged = (event) => {
    setReceiver(event.target.value);
  };

  const messageChanged = (event) => {
    setMessage(event.target.value);
  };

  const onSubmit = () => {
    const userRef = firebase.firestore().collection('users');
    const displayName = localStorage.getItem('name');

    const query = userRef.where('displayName', '==', receiver); // check if the person exists in the database
    query
      .get()
      .then((snap) => {
        if (snap.docs[0].exists) {
          firebase
            .firestore()
            .collection('conversations')
            .doc(displayName + receiver)
            .set({
              chatters: [displayName, receiver],
              lastMessage: firebase.firestore.Timestamp.now(),
              [receiver]: 1,
              [displayName]: 0,
            })
            .then(() => {
              console.log('Conversation created');
            })
            .catch((error) => {
              alert('Please check your internet connection');
            });
          firebase
            .firestore()
            .collection('conversations')
            .doc(displayName + receiver)
            .collection('messages')
            .add({
              //add the messages collection and creates the initial message
              from: displayName,
              liked: false,
              message: message,
              seen: false,
              timeSent: firebase.firestore.Timestamp.now(),
            })
            .then(() => {
              alert(
                'Conversation has been created and message sent to ' + receiver,
              );
              closeCreateConvo(); //close the dialog
            })
            .catch((error) => {
              alert('Please check your internet connection');
            });
        }
      })
      .catch((err) => {
        alert('That user does not exist');
      });
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <Button
        color="primary"
        style={{
          backgroundColor: COLOUR.accentColour,
          color: 'white',
          marginTop: '20px',
        }}
        component="span"
        onClick={openCreateConvo}
      >
        Add Friend
      </Button>

      <Dialog open={createConvo} onClose={closeCreateConvo}>
        <DialogContent>
          <Grid align="center">
            <h2>Add a contact</h2>
          </Grid>

          <TextField
            required
            id="standard-required"
            onChange={receiverChanged}
            label="Contact's Display Name"
            variant="outlined"
            value={receiver}
            style={{ marginBottom: '10px' }}
            fullWidth
          />
          <TextField
            id="outlined-textarea"
            required
            label="Initial Message"
            onChange={messageChanged}
            placeholder="Hi my name is John Wick!"
            multiline
            variant="outlined"
            value={message}
            fullWidth
          />
          <Button
            type="submit"
            onClick={onSubmit}
            color="primary"
            variant="contained"
            style={{ backgroundColor: COLOUR.accentColour, marginTop: '20px' }}
            fullWidth
          >
            Add Contact
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeCreateConvo}
            style={{ color: COLOUR.accentColour, marginTop: '10px' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateConversation;
