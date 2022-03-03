import React, { useState, useEffect } from 'react';
import Contact from './Contact';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Conversation from './Conversation';

const Messages = () => {
  const displayName = localStorage.getItem('name');
  const [conversations, setConversation] = useState([]);

  const convoRef = firebase.firestore().collection('conversations'); //get a reference to all conversations
  const query = convoRef
    .where('chatters', 'array-contains', displayName) //check documents where user is apart of a conversation
    .orderBy('lastMessage', 'desc');

  useEffect(() => {
    getConversations();
  }, []);

  // get all conversations the user is in
  function getConversations() {
    //firebase built in function to get a snapshot of the current state of the query results
    query.onSnapshot((querySnapshot) => {
      //orders the documents by last Message Sent
      /* initialize an empty local array to store all conversations to pass as 
         props into ConversationBox component */
      var items = [];
      //loop function for each document and add conversation information
      querySnapshot.forEach((doc) => {
        //loop through results and add all conversation information
        if (doc.data().chatters[0] === displayName) {
          //add the correct name of the other chatter
          items.push({
            name: doc.data().chatters[1],
            time: doc.data().lastMessage,
            isUser1: true,
          });
        } else {
          items.push({
            name: doc.data().chatters[0],
            time: doc.data().lastMessage,
            isUser1: false,
          });
        }
      });
      setConversation(items);
    });
  }

  return (
    <div>
      <div className="chat-page">
        <span>
          <strong style={{ textAlign: 'center' }}>
            <p>FRIENDS</p>
          </strong>
          <div className="contacts">
            {conversations.map((convo) => (
              <Contact name={convo.name} isUser1={convo.isUser1} />
            ))}
          </div>
        </span>
        <Conversation />
        <span></span>
      </div>
    </div>
  );
};

export default Messages;
