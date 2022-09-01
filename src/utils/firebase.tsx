import { initializeApp } from 'firebase/app';
import { query, getFirestore, getDocs, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
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
const storage = getStorage(app);
const storageRef = ref(storage);
const listingId = 'Gxj1G1AFiPZFRzW3gkOq'; //預設
const mainImageRef = ref(storage, `${listingId}/mainImage`);

const firebase = {
  async getListing(listingId: string) {
    const listingRef = doc(db, 'listings', listingId);
    const docSnap = await getDoc(listingRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      window.alert('No such document!');
    }
  },
  async uploadMainImage(mainImgBlob: Blob) {
    const listingRef = doc(db, 'listings', listingId); //預設
    let url = await uploadBytes(mainImageRef, mainImgBlob).then((uploadResult) => {
      return getDownloadURL(uploadResult.ref);
    });
    await updateDoc(listingRef, {
      mainImage: url,
    });
  },
  async uploadImages(imagesBlob: []) {
    const listingRef = doc(db, 'listings', listingId); //預設
    let promises: Promise<string>[] = [];
    imagesBlob.map((file, index) => {
      const imagesRef = ref(storage, `${listingId}/images/image${index + 1}`);
      promises.push(
        uploadBytes(imagesRef, imagesBlob[index]).then((uploadResult) => {
          return getDownloadURL(uploadResult.ref);
        }),
      );
    });
    Promise.all(promises).then(async (res) => {
      await updateDoc(listingRef, {
        images: res,
      });
    });
  },
};

export default firebase;
