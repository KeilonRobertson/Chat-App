import React, { Component } from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import firebaseConfig from '../db';

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      loggedIn: false,
    };
    this.user = null;
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loaded: true,
          loggedIn: false,
        });
      } else {
        this.user = firebase.auth().currentUser;
        this.setState({
          loaded: true,
          loggedIn: true,
        });
      }
    });
  }

  onSignOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert('You Have been signed out successfully');
      })
      .catch((error) => {
        var errMsg = error.toString();
        alert(errMsg);
      });
  }

  render() {
    const { loaded, loggedIn } = this.state;
    if (!loaded) {
      return (
        <div>
          <h1 style={{ textAlign: 'center' }}>LOADING....</h1>
        </div>
      );
    } else {
      if (!loggedIn) {
        return (
          <div
            style={{
              textAlign: 'center',
              alignItems: 'center',
              marginTop: '200px',
            }}
          >
            <h1>Welcome to Alpha Chatter</h1>

            <Login />
            <Signup />
          </div>
        );
      } else {
        return <Dashboard />;
      }
    }
  }
}
export default App;
