import React, { useState } from 'react';
import { Grid, Avatar, TextField, Button } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import COLOUR from '../Colour';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const Signup = () => {
  const avatarStyle = { backgroundColor: COLOUR.accentColour };
  const btnstyle = { margin: '8px 0', backgroundColor: COLOUR.accentColour };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vpassword, setVPassword] = useState('');
  const [signUp, setSignUp] = useState(false);

  const openSignUp = () => {
    setSignUp(true);
  };

  const closeSignUp = () => {
    setSignUp(false);
    window.location.reload();
  };

  const emailChanged = (event) => {
    setEmail(event.target.value);
  };

  const nameChanged = (event) => {
    setName(event.target.value);
  };

  const passwordChanged = (event) => {
    setPassword(event.target.value);
  };

  const vPasswordChanged = (event) => {
    setVPassword(event.target.value);
  };

  function onSignUp() {
    if (!name) {
      alert('Please enter a display name');
    } else if (password !== vpassword) {
      alert('Passwords do not match!!!');
    } else {
      const usersRef = firebase.firestore().collection('users');
      usersRef
        .where('displayName', '==', name)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password) // firebase authentication function
              .then((result) => {
                var user = firebase.auth().currentUser;
                usersRef.doc(name).set({
                  displayName: name,
                  photo:
                    'https://firebasestorage.googleapis.com/v0/b/alpha-chatter.appspot.com/o/avatar.jpg?alt=media&token=1e2e2878-6c97-4d49-b3d6-95b40497fe3c',
                });

                user
                  .updateProfile({
                    displayName: name,
                    photoURL:
                      'https://firebasestorage.googleapis.com/v0/b/alpha-chatter.appspot.com/o/avatar.jpg?alt=media&token=1e2e2878-6c97-4d49-b3d6-95b40497fe3c',
                  })
                  .then(function () {
                    // Update successful.
                    console.log('Your account has been created!!');
                    localStorage.setItem('name', user.displayName);
                    localStorage.setItem(
                      'userPhoto',
                      'https://firebasestorage.googleapis.com/v0/b/alpha-chatter.appspot.com/o/avatar.jpg?alt=media&token=1e2e2878-6c97-4d49-b3d6-95b40497fe3c',
                    );
                    closeSignUp();
                  })
                  .catch(function (error) {
                    var errMsg = error.toString();
                    alert(errMsg);
                  });
              })
              .catch((error) => {
                var errMsg = error.toString();
                alert(errMsg);
              });
          } else {
            alert('Display Name already taken');
          }
        });
    }
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <Button
        variant="contained"
        onClick={openSignUp}
        style={{
          color: 'white',
          backgroundColor: COLOUR.accentColour,
          marginTop: '10px',
        }}
      >
        Create Account
      </Button>
      <Dialog open={signUp} onClose={closeSignUp}>
        <DialogContent>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <AccountCircle />
            </Avatar>
            <h2>Sign Up</h2>
          </Grid>
          <TextField
            required
            id="standard-required"
            onChange={nameChanged}
            label="Display Name"
            variant="outlined"
            fullWidth
            value={name}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            required
            id="standard-required"
            onChange={emailChanged}
            label="Email Address"
            type="email"
            variant="outlined"
            value={email}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            id="standard-password-input"
            label="Password"
            onChange={passwordChanged}
            type="password"
            autoComplete="current-password"
            variant="outlined"
            value={password}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            id="standard-password-input"
            onChange={vPasswordChanged}
            label="Retype Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            fullWidth
            value={vpassword}
            style={{ marginBottom: '10px' }}
          />
          <Button
            type="submit"
            onClick={onSignUp}
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
          >
            CREATE ACCOUNT
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSignUp} style={{ color: COLOUR.accentColour }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Signup;
