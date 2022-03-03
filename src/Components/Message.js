import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import '../App.css';
import 'firebase/auth';
import 'firebase/firestore';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Avatar from '@material-ui/core/Avatar';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CheckIcon from '@material-ui/icons/Check';

const Message = ({
  text,
  sender,
  timeSent,
  messageDesignClass,
  liked,
  seen,
  docID,
  messageID,
}) => {
  const displayName = localStorage.getItem('name');
  const containerClass = 'message-container-' + messageDesignClass;
  const avatarClass = 'avatar-' + messageDesignClass;
  const heartColor = liked ? 'secondary' : 'gray';
  var [photo, setPhoto] = useState('');
  const docRef = firebase.firestore().collection('conversations').doc(docID);

  useEffect(() => {
    sender === displayName
      ? setPhoto(localStorage.getItem('userPhoto'))
      : setPhoto(localStorage.getItem('photo'));

    if (sender !== displayName) {
      if (!seen) {
        docRef.collection('messages').doc(messageID).update({ seen: true });
      }
    }
    if (sender === displayName) {
      docRef.get().then((doc) => {
        if (doc.data()[displayName] > 0) {
          docRef.update({
            [displayName]: 0,
          });
        }
      });
    }
  }, [heartColor, displayName, sender, seen, messageID, docRef]);

  const documentRef = firebase
    .firestore()
    .collection('conversations')
    .doc(docID)
    .collection('messages')
    .doc(messageID);
  const canDelete = displayName === sender ? true : false;

  async function deleteMessage() {
    await docRef.collection('messages').doc(messageID).delete();
    window.location.reload(); //may have trouble re-rendering updated state of messages, reload the page to render properly
  }

  function updateLiked() {
    liked
      ? documentRef.update({
          liked: false,
        })
      : documentRef.update({
          liked: true,
        });
  }

  return (
    <div className={containerClass}>
      <Avatar className={avatarClass} alt="user" src={photo}></Avatar>
      <div className={messageDesignClass}>
        {text}
        <span className="time">{timeSent}</span>

        {canDelete ? (
          <div>
            <IconButton variant="contained" onClick={deleteMessage}>
              <DeleteIcon />
            </IconButton>
            {liked ? (
              <IconButton variant="contained" color={heartColor}>
                <ThumbUpIcon />
              </IconButton>
            ) : (
              ''
            )}
            {seen ? (
              <Icon variant="contained">
                <DoneAllIcon />
              </Icon>
            ) : (
              <Icon variant="contained">
                <CheckIcon />
              </Icon>
            )}
          </div>
        ) : (
          <IconButton
            variant="contained"
            color={heartColor}
            onClick={updateLiked}
          >
            <ThumbUpIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Message;
