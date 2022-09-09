import { initializeApp } from 'firebase/app';
import { query, getFirestore, getDocs, collection } from 'firebase/firestore';
import React, { useEffect, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import store from './redux/store';

import Header from './components/Header';
import Footer from './components/Footer';
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
function App() {
  useEffect(() => {}, []);
  return (
    <Provider store={store}>
      {/* <Reset /> */}
      <GlobalStyle />
      <Header />
      <Outlet />
      <Footer />
    </Provider>
  );
}

export default App;
