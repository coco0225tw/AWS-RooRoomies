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
  onSnapshot,
  QueryDocumentSnapshot,
  where,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { isCompositeComponent } from 'react-dom/test-utils';
const firebaseConfig = {
  // apiKey: 'AIzaSyA7CjH0CyRg1ICdCKBUbSK8DbcTVXSvyL8',
  // authDomain: 'rooroomies-5c4be.firebaseapp.com',
  // projectId: 'rooroomies-5c4be',
  // storageBucket: 'rooroomies-5c4be.appspot.com',
  // messagingSenderId: '50571848700',
  // appId: '1:50571848700:web:b59e5b8a21ea64b5746079',
  apiKey: 'AIzaSyDxZxLUfOcXF0TTHQr7QJlOmtFNUhH_w2Q',
  authDomain: 'rooroomies.firebaseapp.com',
  projectId: 'rooroomies',
  storageBucket: 'rooroomies.appspot.com',
  messagingSenderId: '902090494840',
  appId: '1:902090494840:web:b89eee21700f2fb39e2e8d',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage);
const homePageListingSize = 8;
const uploadedTimeField = 'uploadedTime';
const descending = 'desc';
const listingId = 'Gxj1G1AFiPZFRzW3gkOq'; //預設
const mainImageRef = ref(storage, `${listingId}/mainImage`);
const listingCollection = collection(db, 'listings');
const userCollection = collection(db, 'users');
const newListingRef = doc(listingCollection);
const newUserRef = doc(userCollection);
const bookingTimesCollection = 'bookingTimes';
const timestamp = serverTimestamp();
const firebase = {
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
    let bookingTimePromises: Promise<void>[] = [];
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

  async getAllListings(county: string | null, town: string | null, startRent: number | null, endRent: number | null) {
    const whereQuery: any[] = [];
    let convertedCounty: string | null = null;
    if (startRent) whereQuery.push(where('startRent', '>=', startRent));
    if (endRent) whereQuery.push(where('startRent', '<=', endRent));
    if (county?.includes('臺')) convertedCounty = county.replace('臺', '台');
    if (county) whereQuery.push(where('countyName', 'in', [county, convertedCounty]));
    if (town) whereQuery.push(where('townName', '==', town));

    let orderByQuery: any[] = [];
    if (startRent || endRent) orderByQuery.push(orderBy('startRent', descending));

    const listingsQuery = query(
      collection(db, 'listings'),
      ...whereQuery,
      ...orderByQuery,
      orderBy(uploadedTimeField, descending),
      limit(homePageListingSize)
    );
    const querySnapshot = await getDocs(listingsQuery);
    return querySnapshot;
  },

  async getNextPageListing(
    lastDoc: DocumentData,
    county: string | null,
    town: string | null,
    startRent: number | null,
    endRent: number | null
  ) {
    const whereQuery: any[] = [];
    let convertedCounty: string | null = null;
    if (startRent) whereQuery.push(where('startRent', '>=', startRent));
    if (endRent) whereQuery.push(where('startRent', '<=', endRent));
    if (county?.includes('臺')) convertedCounty = county.replace('臺', '台');
    if (county) whereQuery.push(where('countyName', 'in', [county, convertedCounty]));
    if (town) whereQuery.push(where('townName', '==', town));

    let orderByQuery: any[] = [];
    if (startRent || endRent) orderByQuery.push(orderBy('startRent', descending));

    const listingsQuery = query(
      collection(db, 'listings'),
      ...whereQuery,
      ...orderByQuery,
      orderBy(uploadedTimeField, descending),
      startAfter(lastDoc),
      limit(homePageListingSize)
    );
    const querySnapshot = await getDocs(listingsQuery);
    return querySnapshot;
  },
  async getListing(listingId: string) {
    const listingRef = doc(db, 'listings', listingId);
    console.log(listingId);
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
  async uploadUserImage(image: Blob, userId: string) {
    const userImagesRef = ref(storage, `${userId}/image`);
    let url = await uploadBytes(userImagesRef, image).then((uploadResult) => {
      return getDownloadURL(uploadResult.ref);
    });
    return url;
  },
  async createNewUser(email: string, password: string) {
    try {
      const newUser = await createUserWithEmailAndPassword(auth, email, password);
      return newUser;
    } catch (error: any) {
      console.log(error.message);
    }
  },
  async signOutUser() {
    await signOut(auth);
  },
  async signInUser(email: string, password: string) {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);

      console.log(user);
    } catch (error: any) {
      console.log(error.message);
    }
  },
  async getBookingTimesSubColForListing(listingId: string) {
    const subColRef = collection(db, 'listings', listingId, 'bookingTimes');
    const querySnapshot = await getDocs(subColRef);
    return querySnapshot;
  },
  async bookedTime(listingId: string, timeDocId: string) {
    const subColRef = doc(db, 'listings', listingId, 'bookingTimes', timeDocId);
    await updateDoc(subColRef, {
      isBooked: true,
    });
  },
  async setNewUserDocField(uid: string, email: string, name: string, image: string) {
    // const url = await this.uploadUserImage(image, uid);
    await setDoc(doc(db, 'users', uid), {
      name: name,
      email: email,
      image: image,
      favoriteLists: [],
      compareLists: [],
      dndLists: [],
      userListingId: '',
    });
  },
  async getUserDocFromFirebase(uid: string) {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      // console.log(docSnap.data());
      return docSnap;
    } else {
      window.alert('No such document!');
    }
  },
  async sendMessage(chatRoomId: string, oldMsg: any, newMsg: any) {
    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
    console.log(chatRoomId);
    await updateDoc(chatRoomRef, {
      msg: [...oldMsg, newMsg],
    });
  },
  async updateUserAsRoommate(uid: string, userAsRoommate: any) {
    await setDoc(
      doc(db, 'users', uid),
      {
        userAsRoommatesConditions: userAsRoommate,
      },
      { merge: true }
    );
  },
  async addUserToGroup(listingId: string, updateGroup: any) {
    console.log(updateGroup);
    console.log(listingId);
    await setDoc(
      doc(db, 'listings', listingId),
      {
        matchGroup: updateGroup,
      },
      { merge: true }
    );
  },
  async createChatRoom(userId: string[], listingId: string, listingTitle: string, updateGroup: any, index: number) {
    const newChatRoomRef = doc(collection(db, 'chatRooms'));
    await setDoc(newChatRoomRef, {
      bookedTime: {},
      isBooked: false,
      listingId: listingId,
      listingTitle: listingTitle,
      userId: [...userId],
      msg: [],
      isFull: false,
    });
    await this.updateChatRoomIdInListing(listingId, updateGroup, index, newChatRoomRef.id);
  },
  async bookedTimeInChatRoom(chatRoomId: string, bookedTime: any) {
    await setDoc(
      doc(db, 'chatRooms', chatRoomId),
      {
        bookedTime: bookedTime,
        isBooked: true,
      },
      { merge: true }
    );
  },
  async createBookedTimeInfo(listingId: string, bookedTimeInfo: any) {
    await setDoc(doc(collection(db, 'listings', listingId, 'bookedTimeInfos')), { ...bookedTimeInfo });
  },
  async getAllHouseHunting(uid: string) {
    const houseHuntingRef = collection(db, 'chatRooms');
    const userChatRef = query(houseHuntingRef, where('userId', 'array-contains', uid));
    const querySnapshot = await getDocs(userChatRef);
    return querySnapshot;
  },
  async checkIfUserCanBook(uid: string, listingId: string) {
    const houseHuntingRef = collection(db, 'chatRooms');
    const userChatRef = query(
      houseHuntingRef,
      where('userId', 'array-contains', uid),
      where('listingId', '==', listingId)
    );
    console.log('check');
    const querySnapshot = await getDocs(userChatRef);
    return querySnapshot;
  },
  async updateChatRoomIdInListing(listingId: string, updateGroup: any, index: number, chatRoomId: string) {
    console.log(updateGroup);
    console.log(listingId);
    updateGroup[index].chatRoomId = chatRoomId;
    console.log(updateGroup[index]);
    await setDoc(
      doc(db, 'listings', listingId),
      {
        matchGroup: updateGroup,
      },
      { merge: true }
    );
  },
  async addToFavoriteLists(uid: string, listingId: string) {
    await updateDoc(doc(db, 'users', uid), {
      favoriteLists: arrayUnion(listingId),
    });
  },
  async removeFromFavoriteLists(uid: string, listingId: string) {
    await updateDoc(doc(db, 'users', uid), {
      favoriteLists: arrayRemove(listingId),
    });
  },
  async addToCompareLists(uid: string, listingId: string) {
    await updateDoc(doc(db, 'users', uid), {
      compareLists: arrayUnion(listingId),
    });
  },
  async removeFromCompareLists(uid: string, listingId: string) {
    await updateDoc(doc(db, 'users', uid), {
      compareLists: arrayRemove(listingId),
    });
  },
  async updateCompareListsField(uid: string, compareLists: any) {
    await setDoc(
      doc(db, 'users', uid),
      {
        compareLists: compareLists,
      },
      { merge: true }
    );
  },
  async updateDndListsField(uid: string, dndLists: any) {
    await setDoc(
      doc(db, 'users', uid),
      {
        dndLists: dndLists,
      },
      { merge: true }
    );
  },
  async removeFromDndLists(uid: string, listingId: string) {
    await updateDoc(doc(db, 'users', uid), {
      dndLists: arrayRemove(listingId),
    });
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
  auth,
  newUserRef,
  onAuthStateChanged,
};
