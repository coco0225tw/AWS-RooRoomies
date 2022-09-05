import roommatesConditionType from './UploadRoommatesConditionType';
type Action = { type: 'UPLOAD_ROOMMATESCONDITION'; payload: { roommatesState: roommatesConditionType } };
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
    default:
      return state;
  }
}
