import userType from './GetAuthType';
enum getAuthAction {
  GET_USER_FROM_FIREBASE = 'GET_USER_FROM_FIREBASE',
  UPLOAD_LISTING = 'UPLOAD_LISTING',
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
interface returnInitialGetUser {
  type: getAuthAction.RETURN_INITIAL_GET_USER;
}

type getAuthActionType = getUserFromFirebase | uploadListing | returnInitialGetUser;

export { getAuthAction, getAuthActionType };
