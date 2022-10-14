import roommatesConditionType from './UploadRoommatesConditionType';
import {
  uploadRoommatesConditionAction,
  uploadRoommatesConditionActionType,
} from './UploadRoommatesConditionReducerAction';

const roommatesConditionEmptyState: roommatesConditionType = {
  gender: '',
  bringFriendToStay: '',
  hygiene: '',
  livingHabit: '',
  genderFriendly: '',
  pet: '',
  smoke: '',
};
export default function UploadRoommatesCondition(
  state = roommatesConditionEmptyState,
  action: uploadRoommatesConditionActionType
) {
  switch (action.type) {
    case uploadRoommatesConditionAction.UPLOAD_ROOMMATES_CONDITION:
      return action.payload.roommatesState;
    case uploadRoommatesConditionAction.GET_ROOMMATES_CONDITION_FROM_FIREBASE:
      return action.payload.roommatesState;
    case uploadRoommatesConditionAction.RETURN_INITIAL_ROOMMATES_CONDITION:
      return roommatesConditionEmptyState;
    default:
      return state;
  }
}
