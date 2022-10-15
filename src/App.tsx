import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { createGlobalStyle } from 'styled-components';

import store from './redux/store';
import { firebase, auth, onAuthStateChanged } from './utils/firebase';
import { RootState } from './redux/rootReducer';

import Header from './components/Header';
import Footer from './components/Footer';
import ChatRooms from './components/ChatRooms/ChatRooms';
import Alert from './components/Alert';

import userType from './redux/GetAuth/GetAuthType';
import { alertActionType } from './redux/Alert/AlertAction';
import { chatRoomAction } from './redux/ChatRoom/ChatRoomAction';
import { getAuthAction } from './redux/GetAuth/GetAuthAction';
import { getFavoriteAction } from './redux/GetFavoriteListing/GetFavoriteListingAction';
import { onAuthChangeAction } from './redux/OnAuthChange/OnAuthChangeAction';
import { previewMainImageAction } from './redux/PreviewMainImage/PreviewMainImageAction';
import { previewOtherImagesAction } from './redux/PreviewOtherImages/PreviewOtherImagesAction';
import { selectTabAction } from './redux/SelectTab/SelectTabAction';
import { subTabAction } from './redux/SubTab/SubTabAction';
import { uploadAddrAction } from './redux/UploadAddr/UploadAddrAction';
import { uploadBookingTimesAction } from './redux/UploadBookingTimes/UploadBookingTimesAction';
import { uploadFacilityAction } from './redux/UploadFacility/UploadFacilityAction';
import { uploadImagesAction } from './redux/UploadMainImageAndImages/UploadMainImageAndImagesAction';
import { uploadRoommatesConditionAction } from './redux/UploadRoommatesCondition/UploadRoommatesConditionReducerAction';
import { uploadRoomDetailsAction } from './redux/UploadRoomsDetails/UploadRoomsDetailsAction';
import { uploadTitleAction } from './redux/UploadTitle/UploadTitleAction';
import { uploadUserAsRoommateAction } from './redux/UserAsRoommate/UserAsRoommateAction';
import PingFangTCRegular from './fonts/PingFang-TC-Regular-2.otf';
import PingFangTCThin from './fonts/PingFang-TC-Thin-2.otf';
import NotoSansTCRegular from './fonts/NotoSansTC-Regular.otf';
import NotoSansTCBold from './fonts/NotoSansTC-Bold.otf';

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
   //border: solid 1px black;
    position: relative;
    letter-spacing: 0.4px;
  }

  body {
    font-family: NotoSansTC;
    /* overflow-x: hidden; */
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  html {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
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
        dispatch({ type: onAuthChangeAction.RETURN_INITIAL_AUTH });
        dispatch({ type: getFavoriteAction.RETURN_INITIAL_FAVORITE_LISTS });
        //group
        //lastdoc
        //listingdocumentforhomepage
        dispatch({ type: selectTabAction.RETURN_INITIAL_TAB });
        dispatch({ type: uploadAddrAction.RETURN_INITIAL_ADDR });
        dispatch({
          type: uploadBookingTimesAction.RETURN_INITIAL_BOOKING_TIMES,
        });
        dispatch({ type: uploadFacilityAction.RETURN_INITIAL_FACILITY });
        dispatch({ type: uploadImagesAction.RETURN_INITIAL_LISTING_IMAGES });
        dispatch({ type: uploadRoommatesConditionAction.RETURN_INITIAL_ROOMMATES_CONDITION });
        dispatch({ type: uploadRoomDetailsAction.RETURN_INITIAL_ROOM_DETAILS });
        dispatch({ type: uploadTitleAction.RETURN_INITIAL_TITLE });
        dispatch({ type: uploadUserAsRoommateAction.RETURN_INITIAL_ME_AS_ROOMMATE });
        dispatch({ type: previewMainImageAction.RETURN_INITIAL_IMAGE });
        dispatch({
          type: previewOtherImagesAction.RETURN_INITIAL_OTHER_IMAGES,
        });
        dispatch({ type: alertActionType.RETURN_INITIAL_ALERT });
        dispatch({ type: subTabAction.RETURN_INITIAL_SUB_TAB });
        dispatch({ type: chatRoomAction.CLOSE_CHATROOM_STATE });
      }
      async function getUser() {
        let data = await firebase.getUserDocFromFirebase(currentUser?.uid as string);
        const user: userType = {
          uid: data?.id as string,
          email: data?.data().email,
          image: data?.data().image,
          name: data?.data().name,
          userListingId: data?.data().userListingId,
        };

        const favoriteLists = data?.data().favoriteLists;

        dispatch({
          type: getFavoriteAction.GET_FAVORITE_LISTS_FROM_FIREBASE,
          payload: { favoriteLists },
        });
        dispatch({
          type: getAuthAction.GET_USER_FROM_FIREBASE,
          payload: { user },
        });
        if (data?.data().userAsRoommatesConditions) {
          dispatch({
            type: uploadUserAsRoommateAction.GET_USER_AS_ROOMMATES_FROM_FIREBASE,
            payload: {
              meAsRoommatesState: data?.data().userAsRoommatesConditions,
            },
          });
        }

        dispatch({ type: onAuthChangeAction.AUTH_TRUE });
        if (data?.data().userListingId.length !== 0) {
          async function getListing() {
            const listingData = await firebase.getListing(data?.data().userListingId);
            let listingTitle = {
              title: listingData?.title,
              totalSq: listingData?.totalSq,
              form: listingData?.form,
            };

            dispatch({
              type: uploadTitleAction.GET_LISTING_TITLE_FROM_FIREBASE,
              payload: { listingTitle },
            });
            dispatch({
              type: uploadRoommatesConditionAction.GET_ROOMMATES_CONDITION_FROM_FIREBASE,
              payload: { roommatesState: listingData?.roommatesConditions },
            });
            dispatch({
              type: uploadFacilityAction.GET_FACILITY_FROM_FIREBASE,
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
  return <Alert alertType={alertInfo.alertType} alertMessage={alertInfo.alertMessage} isAlert={alertInfo.isAlert} />;
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
