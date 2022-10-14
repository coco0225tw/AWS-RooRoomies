import roommatesConditionType from './UserAsRoommateType';

enum uploadUserAsRoommateAction {
  UPLOAD_ME_AS_ROOMMATE = 'UPLOAD_ME_AS_ROOMMATE',
  GET_USER_AS_ROOMMATES_FROM_FIREBASE = 'GET_USER_AS_ROOMMATES_FROM_FIREBASE',
  RETURN_INITIAL_ME_AS_ROOMMATE = 'RETURN_INITIAL_ME_AS_ROOMMATE',
}

interface uploadMeAsRoommate {
  type: uploadUserAsRoommateAction.UPLOAD_ME_AS_ROOMMATE;
  payload: { meAsRoommatesState: roommatesConditionType };
}

interface getUserAsRoomMatesFromFirebase {
  type: uploadUserAsRoommateAction.GET_USER_AS_ROOMMATES_FROM_FIREBASE;
  payload: { meAsRoommatesState: roommatesConditionType };
}

interface returnInitialMeAsRoomMate {
  type: uploadUserAsRoommateAction.RETURN_INITIAL_ME_AS_ROOMMATE;
}
type uploadUserAsRoommateActionType = uploadMeAsRoommate | getUserAsRoomMatesFromFirebase | returnInitialMeAsRoomMate;

export { uploadUserAsRoommateAction, uploadUserAsRoommateActionType };
