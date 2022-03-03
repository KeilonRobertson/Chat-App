import React from 'react';
import '../App.css';
import 'firebase/auth';
import 'firebase/firestore';
import { Link } from 'react-router-dom';

const ConversationBox = ({ name, time, isUser1 }) => {
  return (
    <Link
      to="/conversation"
      params={{ name: name }}
      style={{ textDecoration: 'none', color: 'black' }}
    >
      <div className="convoBox">
        <h1>{name}</h1>
        <p>{time.toDate().toString()}</p>
      </div>
    </Link>
  );
};

export default ConversationBox;
