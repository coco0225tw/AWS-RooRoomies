import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";

import { createGlobalStyle } from "styled-components";

import store from "./redux/store";
import { firebase, auth, onAuthStateChanged, db } from "./utils/firebase";
import { RootState } from "./redux/rootReducer";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatRooms from "./components/ChatRooms/ChatRooms";
import Alert from "./components/Alert";

import { groupType } from "./redux/Group/GroupType";
import userType from "./redux/GetAuth/GetAuthType";
import roomDetailsType from "./redux/UploadRoomsDetails/UploadRoomsDetailsType";
import roommatesConditionType from "./redux/UploadRoommatesCondition/UploadRoommatesConditionType";
import facilityType from "./redux/UploadFacility/UploadFacilityType";
import { alertActionType } from "./redux/Alert/AlertAction";
import { chatRoomAction } from "./redux/ChatRoom/ChatRoomAction";
import { getAuthAction } from "./redux/GetAuth/GetAuthAction";

import PingFangTCRegular from "./fonts/PingFang-TC-Regular-2.otf";
import PingFangTCThin from "./fonts/PingFang-TC-Thin-2.otf";
import NotoSansTCRegular from "./fonts/NotoSansTC-Regular.otf";
import NotoSansTCBold from "./fonts/NotoSansTC-Bold.otf";

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: PingFangTC;
  src: url(${PingFangTCRegular}) format('opentype');
  font-weight: normal;
}

@font-face {
  font-family: PingFangTC;
  src: url(${PingFangTCThin}) format('opentype');
  font-weight: 100;
}

@font-face {
  font-family: NotoSansTC;
  src: url(${NotoSansTCRegular}) format('opentype');
  font-weight: normal;
}

@font-face {
  font-family: NotoSansTC;
  src: url(${NotoSansTCBold}) format('opentype');
  font-weight: bold;
}
  * {
    box-sizing: border-box;
   // border: solid 1px black;
    position: relative;
    letter-spacing: 0.4px;
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
    position: relative;
    display: flex;
    flex-direction: column;
  }
  a {
    color: inherit; /* blue colors for links too */
    text-decoration: none
  }
  ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
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

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUser();
      } else {
        dispatch({ type: getAuthAction.RETURN_INITIAL_GET_USER });
        dispatch({ type: "RETURN_INITIAL_AUTH" });
        dispatch({ type: "RETURN_INITIAL_COMPARELISTS" });
        dispatch({ type: "RETURN_INITIAL_DNDLISTS" });
        dispatch({ type: "RETURN_INITIAL_FAVORITELISTS" });
        //group
        //lastdoc
        //listingdocumentforhomepage
        dispatch({ type: "RETURN_INITIAL_TAB" });
        dispatch({ type: "RETURN_INITIAL_ADDR" });
        dispatch({ type: "RETURN_INITIAL_BOOKINGTIMES" });
        dispatch({ type: "RETURN_INITIAL_FACILITY" });
        dispatch({ type: "RETURN_INITIAL_LISTING_IMAGES" });
        dispatch({ type: "RETURN_INITIAL_ROOMMATES_CONDITION" });
        dispatch({ type: "RETURN_INITIAL_ROOM_DETAILS" });
        dispatch({ type: "RETURN_INITIAL_TITLE" });
        dispatch({ type: "RETURN_INITIAL_MEASROOMMATE" });
        dispatch({ type: "RETURN_INITIAL_IMAGE" });
        dispatch({ type: "RETURN_INITIAL_OTHER_IMAGES" });
        dispatch({ type: alertActionType.RETURN_INITIAL_ALERT });
        dispatch({ type: "RETURN_INITIAL_SUB_TAB" });
        dispatch({ type: chatRoomAction.CLOSE_CHATROOM_STATE });
      }
      async function getUser() {
        let data = await firebase.getUserDocFromFirebase(
          currentUser?.uid as string
        );
        const user: userType = {
          uid: data?.id as string,
          email: data?.data().email,
          image: data?.data().image,
          name: data?.data().name,
          userListingId: data?.data().userListingId,
        };

        const compareLists = data?.data().compareLists;
        const favoriteLists = data?.data().favoriteLists;
        const dndLists = data?.data().dndLists;
        dispatch({
          type: "GET_COMPARELISTS_FROM_FIREBASE",
          payload: { compareLists },
        });
        dispatch({ type: "GET_DNDLISTS_FROM_FIREBASE", payload: { dndLists } });
        dispatch({
          type: "GET_FAVORITELISTS_FROM_FIREBASE",
          payload: { favoriteLists },
        });
        dispatch({
          type: getAuthAction.GET_USER_FROM_FIREBASE,
          payload: { user },
        });
        if (data?.data().userAsRoommatesConditions) {
          dispatch({
            type: "GET_USER_AS_ROOMMATES_FROM_FIREBASE",
            payload: {
              meAsRoommatesState: data?.data().userAsRoommatesConditions,
            },
          });
        }

        dispatch({ type: "AUTH_CHANGE" });
        if (data?.data().userListingId.length !== 0) {
          async function getListing() {
            type ListingType = {
              mainImage: string;
              images: string[];
              title: string;
              countyName: string;
              townName: string;
              form: string;
              environmentDescription: string;
              roommatesConditions: roommatesConditionType;
              facility: facilityType;
              rentRoomDetails: roomDetailsType;
              peopleAmount: number;
              matchGroup: Array<groupType>;
              listingTitle: string;
              totalSq: number;
            };

            const listingData = await firebase.getListing(
              data?.data().userListingId
            );
            let listingTitle = {
              title: listingData?.title,
              totalSq: listingData?.totalSq,
              form: listingData?.form,
            };

            dispatch({
              type: "GET_LISTING_TITLE_FROM_FIREBASE",
              payload: { listingTitle },
            });
            dispatch({
              type: "GET_ROOMMATESCONDITION_FROM_FIREBASE",
              payload: { roommatesState: listingData?.roommatesConditions },
            });
            dispatch({
              type: "GET_FACILITY_FROM_FIREBASE",
              payload: { facilityState: listingData?.facility },
            });
          }
          async function promise() {
            await Promise.all([getListing()]);
          }

          promise();
        }
      }
    });
  }, []);
  return null;
}

function AlertInfo() {
  const alertInfo = useSelector((state: RootState) => state.AlertReducer);
  return (
    <Alert
      alertType={alertInfo.alertType}
      alertMessage={alertInfo.alertMessage}
      isAlert={alertInfo.isAlert}
    />
  );
}
function App() {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <ChatRooms />
      <AlertInfo />
      <Header />
      <User />
      <Outlet />
      <Footer />
    </Provider>
  );
}
export default App;
