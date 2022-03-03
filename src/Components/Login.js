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

const Login = () => {
  const avatarStyle = { backgroundColor: COLOUR.accentColour };
  const btnstyle = { margin: '8px 0', backgroundColor: COLOUR.accentColour };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signIn, setSignIn] = useState(false);

  const openSignIn = () => {
    setSignIn(true);
  };

  const closeSignIn = () => {
    setSignIn(false);
  };

  const emailChanged = (event) => {
    setEmail(event.target.value);
  };

  const passwordChanged = (event) => {
    setPassword(event.target.value);
  };

  function onLogin() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password) // firebase authentication function
      .then((result) => {
        alert('You have been signed in successfully');
        setSignIn(false); //exit Dialog
        localStorage.setItem('name', firebase.auth().currentUser.displayName);
        localStorage.setItem('userPhoto', firebase.auth().currentUser.photoURL);
      })
      .catch((error) => {
        var errMsg = error.toString();
        alert(errMsg);
      });
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <Button
        variant="outlined"
        onClick={openSignIn}
        style={{
          color: COLOUR.accentColour,
          marginTop: '20px',
        }}
      >
        LOGIN
      </Button>
      <Dialog open={signIn} onClose={closeSignIn}>
        <DialogContent>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <AccountCircle />
            </Avatar>
            <h2>Sign In</h2>
          </Grid>
          <TextField
            required
            onChange={emailChanged}
            value={email}
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            onChange={passwordChanged}
            value={password}
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <Button
            type="submit"
            onClick={onLogin}
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
          >
            Sign in
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeSignIn}
            style={{ color: COLOUR.accentColour, marginTop: '10px' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
