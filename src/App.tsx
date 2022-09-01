import { initializeApp } from 'firebase/app';
import { query, getFirestore, getDocs, collection } from 'firebase/firestore';
import React, { useEffect, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

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
    padding: 140px 0 115px;
    position: relative;
`;
function App() {
  useEffect(() => {
    // async function getDoc() {
    //   const q = query(collection(db, 'users'));
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.id, ' => ', doc.data());
    //   });
    // }
    // getDoc();
  }, []);
  return (
    <Fragment>
      {/* <Reset /> */}
      <GlobalStyle />
      <Outlet />
    </Fragment>
  );
}

export default App;
