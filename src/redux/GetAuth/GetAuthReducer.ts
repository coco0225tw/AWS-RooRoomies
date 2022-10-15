import userType from './GetAuthType';
import { getAuthAction, getAuthActionType } from './GetAuthAction';

const userInitialState = {
  uid: '',
  email: '',
  image: '',
  name: '',
  userListingId: '',
};

export default function User(state = userInitialState, action: getAuthActionType) {
  switch (action.type) {
    case getAuthAction.GET_USER_FROM_FIREBASE:
      return action.payload.user;
    case getAuthAction.UPLOAD_LISTING:
      return { ...state, userListingId: action.payload.userListingId };
    case getAuthAction.RETURN_INITIAL_GET_USER:
      return userInitialState;
    default:
      return state;
  }
}
