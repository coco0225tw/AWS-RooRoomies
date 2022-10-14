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
  where,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  Timestamp,
  DocumentReference,
  QueryConstraint,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import firebaseConfig from './firebaseConfig';
import { bookingTimesType, bookTimeType } from '../redux/UploadBookingTimes/UploadBookingTimesType';
import roommatesConditionType from '../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import { groupsType } from '../redux/Group/GroupType';
interface Msg {
  userMsg: string;
  sendTime: number;
  userName: string;
  userId: string;
  userPic: string;
}
type selectDateTimeType = {
  date: Timestamp;
  startTime: string;
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
    newListingRef: DocumentReference,
    fieldData: any,
    bookingTimes: bookingTimesType,
    mainImgBlob: Blob,
    imagesBlob: Blob[],
    uid: string
  ) {
    const mainImageUrl = await this.uploadMainImage(mainImgBlob, newListingRef.id);
    const imagesUrl = await this.uploadImages(imagesBlob, newListingRef.id);

    await setDoc(newListingRef, {
      ...fieldData,
      mainImage: mainImageUrl,
      images: imagesUrl,
    });
    let bookingTimePromises: Promise<void>[] = [];

    bookingTimes.map((bookingTime: bookTimeType, index: number) => {
      bookingTimePromises.push(
        setDoc(doc(collection(db, 'listings', newListingRef.id, bookingTimesCollection)), { ...bookingTime })
      );
    });
    await this.updateUserListingId(uid, newListingRef.id);
    await Promise.all(bookingTimePromises);
  },

  async getAllListings(county: string | null, town: string | null, startRent: number | null, endRent: number | null) {
    const whereQuery: QueryConstraint[] = [];
    let convertedCounty: string | null = null;
    if (startRent) whereQuery.push(where('startRent', '>=', startRent));
    if (endRent) whereQuery.push(where('startRent', '<=', endRent));
    if (county?.includes('臺')) convertedCounty = county.replace('臺', '台');
    if (county) whereQuery.push(where('countyName', 'in', [county, convertedCounty]));
    if (town) whereQuery.push(where('townName', '==', town));

    let orderByQuery: QueryConstraint[] = [];
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
    const whereQuery: QueryConstraint[] = [];
    let convertedCounty: string | null = null;
    if (startRent) whereQuery.push(where('startRent', '>=', startRent));
    if (endRent) whereQuery.push(where('startRent', '<=', endRent));
    if (county?.includes('臺')) convertedCounty = county.replace('臺', '台');
    if (county) whereQuery.push(where('countyName', 'in', [county, convertedCounty]));
    if (town) whereQuery.push(where('townName', '==', town));

    let orderByQuery: QueryConstraint[] = [];
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

    const docSnap = await getDoc(listingRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
    }
  },
  async getListingDoc(listingId: string) {
    const listingRef = doc(db, 'listings', listingId);

    const docSnap = await getDoc(listingRef);
    if (docSnap.exists()) {
      return docSnap;
    } else {
    }
  },
  async getFavoriteListing(listingId: string) {
    const listingRef = doc(db, 'listings', listingId);

    const docSnap = await getDoc(listingRef);
    if (docSnap.exists()) {
      return docSnap;
    } else {
    }
  },

  async uploadMainImage(mainImgBlob: Blob, listingRefId: string) {
    const imagesRef = ref(storage, `${listingRefId}/images/main_image`);
    let url = await uploadBytes(imagesRef, mainImgBlob).then((uploadResult) => {
      return getDownloadURL(uploadResult.ref);
    });
    return url;
  },
  async uploadImages(imagesBlob: [], listingRefId: string) {
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
    } catch (error) {
      let message: string;
      if (error instanceof Error) message = error.message;
    }
  },
  async signOutUser() {
    await signOut(auth);
  },
  async signInUser(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
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
  async updateUserInfo(uid: string, name: string) {
    await setDoc(
      doc(db, 'users', uid),
      {
        name: name,
      },
      { merge: true }
    );
  },
  async updateUserListingId(uid: string, userListingId: string) {
    await setDoc(
      doc(db, 'users', uid),
      {
        userListingId: userListingId,
      },
      { merge: true }
    );
  },
  async updateUserPic(uid: string, img: Blob) {
    const url = await this.uploadUserImage(img, uid);
    await setDoc(
      doc(db, 'users', uid),
      {
        image: url,
      },
      { merge: true }
    );
  },
  async getUserDocFromFirebase(uid: string) {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap;
    } else {
    }
  },
  async sendMessage(chatRoomId: string, oldMsg: Msg[], newMsg: Msg) {
    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);

    await updateDoc(chatRoomRef, {
      msg: [...oldMsg, newMsg],
    });
  },
  async updateUserAsRoommate(uid: string, userAsRoommate: roommatesConditionType) {
    await setDoc(
      doc(db, 'users', uid),
      {
        userAsRoommatesConditions: userAsRoommate,
      },
      { merge: true }
    );
  },
  async addUserToGroupAndCreateChatRoom(
    //空的組加入
    listingId: string,
    updateGroup: groupsType,
    chatRoomId: string,
    index: number
  ) {
    let newGroup = [...updateGroup];
    newGroup[index].chatRoomId = chatRoomId;
    await setDoc(
      doc(db, 'listings', listingId),
      {
        matchGroup: newGroup,
      },
      { merge: true }
    );
  },
  async updateAddUserToGroup(
    //既有的組加入(match)
    listingId: string,
    updateGroup: groupsType
  ) {
    await setDoc(
      doc(db, 'listings', listingId),
      {
        matchGroup: updateGroup,
      },
      { merge: true }
    );
  },
  async updateChatRoom(
    //既有的組加入(chatRoom)
    chatId: string,
    isFull: boolean,
    userId: (string | null)[]
  ) {
    await setDoc(
      doc(db, 'chatRooms', chatId),
      {
        userId: [...userId],
        isFull: isFull,
      },
      { merge: true }
    );
  },

  async createChatRoom(
    //開新的聊天室
    userId: string | null[],
    listingId: string,
    listingTitle: string,
    updateGroup: groupsType,
    index: number
  ) {
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
    await this.addUserToGroupAndCreateChatRoom(listingId, updateGroup, newChatRoomRef.id, index);
  },

  async findChatId(listingId: string) {
    const chatIdRef = collection(db, 'chatRooms');
    const userChatRef = query(
      chatIdRef,
      // where("userId", "in", uids),
      where('listingId', '==', listingId)
    );
    const querySnapshot = await getDocs(userChatRef);
    return querySnapshot;
  },
  async bookedTimeInChatRoom(chatRoomId: string, bookedTime: selectDateTimeType) {
    await setDoc(
      doc(db, 'chatRooms', chatRoomId),
      {
        bookedTime: bookedTime,
        isBooked: true,
      },
      { merge: true }
    );
  },
  async bookedTimeInMatch(
    //既有的組加入(match)
    listingId: string,
    updateGroup: groupsType
  ) {
    await setDoc(
      doc(db, 'listings', listingId),
      {
        matchGroup: updateGroup,
      },
      { merge: true }
    );
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

    const querySnapshot = await getDocs(userChatRef);
    return querySnapshot;
  },
  async updateChatRoomIdInListing(listingId: string, updateGroup: groupsType, index: number, chatRoomId: string) {
    updateGroup[index].chatRoomId = chatRoomId;

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

  async updateFavoriteLists(uid: string, listingArray: string[]) {
    const reverseArray = listingArray.reverse();
    await setDoc(
      doc(db, 'users', uid),
      {
        favoriteLists: reverseArray,
      },
      { merge: true }
    );
  },

  // cancelBookTime

  async cancelBookedTimeInChatRoom(chatRoomId: string) {
    await setDoc(
      doc(db, 'chatRooms', chatRoomId),
      {
        bookedTime: {},
        isBooked: false,
      },
      { merge: true }
    );
  },
  async cancelBookedTimeInMatch(listingId: string, updateGroup: groupsType) {
    await setDoc(
      doc(db, 'listings', listingId),
      {
        matchGroup: updateGroup,
      },
      { merge: true }
    );
  },
  async cancelBookedTime(listingId: string, date: Timestamp, time: string) {
    const bookedRef = collection(db, 'listings', listingId, 'bookingTimes');
    const bookedTimeRef = query(bookedRef, where('date', '==', date), where('startTime', '==', time));
    const querySnapshot = await getDocs(bookedTimeRef);
    let bookTimeId: string | null;
    querySnapshot.forEach((listing) => (bookTimeId = listing.id));

    await updateDoc(doc(db, 'listings', listingId, 'bookingTimes', bookTimeId), {
      isBooked: false,
    });
  },
  //退團
  async removeUserFromGroupInMatch(listingId: string, updateGroup: groupsType) {
    await setDoc(
      doc(db, 'listings', listingId),
      {
        matchGroup: updateGroup,
      },
      { merge: true }
    );
  },
  async removeUserInChatRoom(chatId: string, userId: (string | null)[]) {
    await setDoc(
      doc(db, 'chatRooms', chatId),
      {
        userId: [...userId],
        isFull: false,
      },
      { merge: true }
    );
  },
  async removeChatRoom(chatRoomId: string) {
    await deleteDoc(doc(db, 'chatRooms', chatRoomId));
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
