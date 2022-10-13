import userType from "./GetAuthType";
enum getAuthAction {
  GET_USER_FROM_FIREBASE = "GET_USER_FROM_FIREBASE",
  RETURN_INITIAL_GET_USER = "RETURN_INITIAL_GET_USER",
}

interface getUserFromFirebase {
  type: getAuthAction.GET_USER_FROM_FIREBASE;
  payload: { user: userType };
}

interface returnInitialGetUser {
  type: getAuthAction.RETURN_INITIAL_GET_USER;
}

type getAuthActionType = getUserFromFirebase | returnInitialGetUser;

export { getAuthAction, getAuthActionType };
