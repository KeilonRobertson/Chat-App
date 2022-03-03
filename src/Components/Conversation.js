import React, { useState } from 'react';
import firebase from 'firebase/app';
import { TextField, Button } from '@material-ui/core';
import 'firebase/auth';
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Message from './Message';
import SendIcon from '@material-ui/icons/Send';

const Conversation = () => {
  const displayName = localStorage.getItem('name');
  const isUser1 = localStorage.getItem('isUser1');
  const receiver = localStorage.getItem('receiver');
  const docID = getID(isUser1, receiver, displayName);
  const [message, setMessage] = useState('');
  const conversationRef = firebase
    .firestore()
    .collection('conversations')
    .doc(docID)
    .collection('messages');

  function getID(isUser1, receiver, displayName) {
    // gets the document id based on which user created the conversation
    return isUser1 === 'true' ? displayName + receiver : receiver + displayName;
  }

  function getTime(timestamp) {
    var date = timestamp.toDate();
    var hours = date.getHours();
    const isAfterNoon = hours >= 12 && hours !== 0 ? true : false;
    hours = isAfterNoon && hours !== 12 ? hours - 12 : hours;
    hours = hours === 0 ? 12 : hours;
    const meridian = isAfterNoon ? 'PM' : 'AM'; //Display proper time convention

    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ':' + minutes + meridian;
  }

  const updateMessage = (event) => setMessage(event.target.value);
  // update Message

  function sendMessage(e) {
    if (message !== '') {
      const conversationRef = firebase
        .firestore()
        .collection('conversations')
        .doc(docID);
      const timeStamp = firebase.firestore.Timestamp.now();

      conversationRef.collection('messages').add({
        from: displayName,
        liked: false,
        message: message,
        seen: false,
        timeSent: timeStamp,
      });

      conversationRef.update({
        lastMessage: timeStamp,
        [receiver]: firebase.firestore.FieldValue.increment(1),
      });
      setMessage('');
    }
  }

  function keyPress(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      //will send message if the enter key is pressed
      sendMessage();
    }
  }

  const [messages] = useCollectionData(
    conversationRef.orderBy('timeSent', 'desc'),
    { idField: 'id' },
  ); // listen to realtime changes to the messages collection of the conversation
  // sorted based on the timeSent

  if (localStorage.getItem('receiver')) {
    return (
      <div className="convo-container">
        <h1>{receiver}</h1>

        <div className="conversation-area">
          {messages &&
            messages.map(
              (
                message, //Dynamically render all messages into message components
              ) => (
                <Message
                  text={message.message}
                  liked={message.liked}
                  sender={message.from}
                  seen={message.seen}
                  timeSent={getTime(message.timeSent)}
                  messageDesignClass={
                    displayName === message.from ? 'sender' : 'recipient'
                  }
                  docID={docID}
                  messageID={message.id}
                />
              ),
            )}
        </div>
        <div style={{ margin: '10px' }}>
          <TextField
            onChange={updateMessage}
            style={{ width: '89%' }}
            id="outlined-textarea"
            placeholder="Type your message here"
            defaultValue=""
            value={message}
            multiline
            variant="outlined"
            required
            onKeyDown={keyPress}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon></SendIcon>}
            style={{
              backgroundColor: '#0081cb',
              margin: '10px',
              padding: '10px',
            }}
            onClick={sendMessage}
          >
            SEND
          </Button>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Conversation;
