import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import COLOUR from '../Colour';
import styles from '../styles.module.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const ProfilePic = () => {
  const [profile, setProfile] = useState(false);

  const user = firebase.auth().currentUser;
  const storageRef = firebase.storage().ref();

  const [fileUrl, setFileUrl] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setFileUrl(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!fileUrl) {
      return;
    }

    const fileRef = storageRef.child(fileUrl.name);
    await fileRef.put(fileUrl);
    const photo = await fileRef.getDownloadURL();

    user
      .updateProfile({
        photoURL: photo,
      })
      .then(function () {
        alert('Picture Changed Successfully');
        localStorage.setItem('userPhoto', photo)
        closeProfile(); //close the dialog after picture has been changed
      })
      .catch(function (error) {
        alert(error.toString());
      });
    const ref = firebase.firestore().collection('users').doc(localStorage.getItem('name'));

    ref.update({
      photo: photo,
    });
  };

  const openProfile = () => {
    setProfile(true);
  };

  const closeProfile = () => {
    setProfile(false);
    window.location.reload();
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <IconButton
        color="primary"
        aria-label="upload picture"
        style={{
          color: COLOUR.accentColour,
          marginTop: '20px',
        }}
        component="span"
        onClick={openProfile}
      >
        <PhotoCamera />
      </IconButton>
      <Dialog open={profile} onClose={closeProfile}>
        <DialogContent>
          <Grid align="center">
            <h2>Update Profile Picture</h2>
          </Grid>
          <input type="file" onChange={onFileChange} />
          <Button
            onClick={onSubmit}
            startIcon={
              <CloudUploadIcon style={{ color: COLOUR.accentColour }} />
            }
          >
            Submit
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeProfile}
            style={{ color: COLOUR.accentColour, marginTop: '10px' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePic;
