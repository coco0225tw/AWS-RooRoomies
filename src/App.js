import { initializeApp } from 'firebase/app';
import { query, getFirestore, getDocs, collection } from 'firebase/firestore';
import React, { useEffect } from 'react';
const firebaseConfig = {
  apiKey: 'AIzaSyDxZxLUfOcXF0TTHQr7QJlOmtFNUhH_w2Q',
  authDomain: 'rooroomies.firebaseapp.com',
  projectId: 'rooroomies',
  storageBucket: 'rooroomies.appspot.com',
  messagingSenderId: '902090494840',
  appId: '1:902090494840:web:b89eee21700f2fb39e2e8d',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    <div className="App">
      <header className="App-header">
        <p>successfully build</p>
      </header>
    </div>
  );
}

export default App;
