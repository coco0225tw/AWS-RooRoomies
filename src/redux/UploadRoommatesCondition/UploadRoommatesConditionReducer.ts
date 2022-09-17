import roommatesConditionType from './UploadRoommatesConditionType';
type Action =
  | { type: 'UPLOAD_ROOMMATESCONDITION'; payload: { roommatesState: roommatesConditionType } }
  | { type: 'RETURN_INITIAL_ROOMMATES_CONDITION' };
const roommatesConditionEmptyState = {
  gender: '',
  bringFriendToStay: '',
  hygiene: '',
  livingHabit: '',
  genderFriendly: '',
  pet: '',
  smoke: '',
  career: '',
};
export default function UploadRoommatesCondition(state = roommatesConditionEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_ROOMMATESCONDITION':
      return action.payload.roommatesState;
    case 'RETURN_INITIAL_ROOMMATES_CONDITION':
      return roommatesConditionEmptyState;
    default:
      return state;
  }
}
