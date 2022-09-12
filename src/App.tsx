import { initializeApp } from 'firebase/app';
import { query, getFirestore, getDocs, collection } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import store from './redux/store';
import { firebase, auth, onAuthStateChanged } from './utils/firebase';
import { RootState } from './redux/rootReducer';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatRooms from './components/ChatRooms/ChatRooms';
import userType from './redux/GetAuth/GetAuthType';
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    border: solid 1px black;
  }

  body {
    font-family: NotoSansTC;
    overflow-x: hidden;
    padding: 0;
    margin: 0;
  }

  html {
    padding: 0;
    margin: 0;
  }
  #root {
    min-height: 100vh;
    // padding: 140px 0 115px;
    position: relative;
  }
  a {
    color: inherit; /* blue colors for links too */
    text-decoration: none
  }
  ::-webkit-scrollbar {
      width: 5px;
  }
    
  /* Track */
  ::-webkit-scrollbar-track {
      background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: #555;
  } 
`;
function User() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      // console.log(currentUser?.uid);
      if (currentUser) {
        getUser();
      }
      async function getUser() {
        let data = await firebase.getUserDocFromFirebase(currentUser?.uid as string);
        const user: userType = {
          uid: data?.id as string,
          email: data?.data().email,
          image: data?.data().image,
          name: data?.data().name,
        };
        // console.log(user);
        dispatch({ type: 'GETUSER_FROMFIREBASE', payload: { user } });
      }
    });
  }, []);
  return <div>現在登入的是:{userInfo.name}</div>;
}

function App() {
  return (
    <Provider store={store}>
      {/* <Reset /> */}
      <GlobalStyle />
      <User />
      {/* <ChatRooms /> */}
      <Header />
      <Outlet />
      <Footer />
    </Provider>
  );
}
export default App;
