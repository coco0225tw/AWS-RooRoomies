import { initializeApp } from 'firebase/app';
import {
  query,
  getFirestore,
  getDocs,
  collection,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
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
const homePageListingSize = 4;
const uploadedTimeField = 'uploadedTime';
const descending = 'desc';
const listingId = 'Gxj1G1AFiPZFRzW3gkOq'; //預設
const mainImageRef = ref(storage, `${listingId}/mainImage`);
const listingCollection = collection(db, 'listings');
const newListingRef = doc(listingCollection);

const bookingTimesCollection = 'bookingTimes';
const timestamp = serverTimestamp();
const firebase = {
  // latestDoc: null,
  async setNewListingDocField(
    newListingRef: any,
    fieldData: any,
    bookingTimes: any,
    mainImgBlob: Blob,
    imagesBlob: []
  ) {
    const mainImageUrl = await this.uploadMainImage(mainImgBlob, newListingRef.id);
    const imagesUrl = await this.uploadImages(imagesBlob, newListingRef.id);
    console.log(newListingRef.id);

    await setDoc(newListingRef, {
      ...fieldData,
      mainImage: mainImageUrl,
      images: imagesUrl,
    });
    const bookingTimesDocRef = doc(collection(db, 'listings', newListingRef.id, bookingTimesCollection));
    let bookingTimePromises: any = [];
    console.log(bookingTimes);
    bookingTimes.map((bookingTime: any, index: number) => {
      console.log(newListingRef.id);
      bookingTimePromises.push(
        setDoc(doc(collection(db, 'listings', newListingRef.id, bookingTimesCollection)), { ...bookingTime })
      );
      console.log(bookingTimePromises);
    });
    await Promise.all(bookingTimePromises);
  },

  async getAllListings() {
    const listingsQuery = query(
      collection(db, 'listings'),
      orderBy(uploadedTimeField, descending),
      limit(homePageListingSize)
    );
    const querySnapshot = await getDocs(listingsQuery);
    return querySnapshot;
  },

  async getNextPageListing(lastDoc: DocumentData) {
    const listingsQuery = query(
      collection(db, 'listings'),
      orderBy(uploadedTimeField, descending),
      startAfter(lastDoc),
      limit(homePageListingSize)
    );
    const querySnapshot = await getDocs(listingsQuery);
    return querySnapshot;
  },
  async getListing(listingId: string) {
    const listingRef = doc(db, 'listings', listingId);
    const docSnap = await getDoc(listingRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      window.alert('No such document!');
    }
  },
  async uploadMainImage(mainImgBlob: Blob, listingRefId: any) {
    const imagesRef = ref(storage, `${listingRefId}/images/main_image`);
    let url = await uploadBytes(imagesRef, mainImgBlob).then((uploadResult) => {
      return getDownloadURL(uploadResult.ref);
    });
    return url;
  },
  async uploadImages(imagesBlob: [], listingRefId: any) {
    let promises: Promise<string>[] = [];
    imagesBlob.map((file, index) => {
      const imagesRef = ref(storage, `${listingRefId}/images/image${index + 1}`);
      promises.push(
        uploadBytes(imagesRef, imagesBlob[index]).then((uploadResult) => {
          return getDownloadURL(uploadResult.ref);
        })
      );
    });

    let promiseRes = await Promise.all(promises);
    return promiseRes;
  },
};

export {
  app,
  db,
  storage,
  storageRef,
  homePageListingSize,
  uploadedTimeField,
  descending,
  listingId,
  mainImageRef,
  newListingRef,
  firebase,
  timestamp,
};
