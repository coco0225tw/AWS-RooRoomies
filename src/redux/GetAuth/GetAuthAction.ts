import userType from './GetAuthType';
enum getAuthAction {
  GET_USER_FROM_FIREBASE = 'GET_USER_FROM_FIREBASE',
  UPLOAD_LISTING = 'UPLOAD_LISTING',
  UPLOAD_USER_IMAGE = 'UPLOAD_USER_IMAGE',
  RETURN_INITIAL_GET_USER = 'RETURN_INITIAL_GET_USER',
}

interface getUserFromFirebase {
  type: getAuthAction.GET_USER_FROM_FIREBASE;
  payload: { user: userType };
}
interface uploadListing {
  type: getAuthAction.UPLOAD_LISTING;
  payload: { userListingId: string };
}
interface uploadUserImage {
  type: getAuthAction.UPLOAD_USER_IMAGE;
  payload: { image: string };
}
interface returnInitialGetUser {
  type: getAuthAction.RETURN_INITIAL_GET_USER;
}

type getAuthActionType = getUserFromFirebase | uploadListing | uploadUserImage | returnInitialGetUser;

export { getAuthAction, getAuthActionType };
