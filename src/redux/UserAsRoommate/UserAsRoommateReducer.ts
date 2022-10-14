import roommatesConditionType from './UserAsRoommateType';
import { uploadUserAsRoommateAction, uploadUserAsRoommateActionType } from './UserAsRoommateAction';
const roommatesConditionEmptyState: roommatesConditionType = {
  gender: '',
  bringFriendToStay: '',
  hygiene: '',
  livingHabit: '',
  genderFriendly: '',
  pet: '',
  smoke: '',
};
export default function UploadMeAsRoommate(
  state = roommatesConditionEmptyState,
  action: uploadUserAsRoommateActionType
) {
  switch (action.type) {
    case uploadUserAsRoommateAction.UPLOAD_ME_AS_ROOMMATE:
      return action.payload.meAsRoommatesState;
    case uploadUserAsRoommateAction.GET_USER_AS_ROOMMATES_FROM_FIREBASE:
      return action.payload.meAsRoommatesState;
    case uploadUserAsRoommateAction.RETURN_INITIAL_ME_AS_ROOMMATE:
      return roommatesConditionEmptyState;
    default:
      return state;
  }
}
