import roommatesConditionType from './UserAsRoommateType';
type Action =
  | { type: 'UPLOAD_MEASROOMMATE'; payload: { meAsRoommatesState: any } }
  | { type: 'RETURN_INITIAL_MEASROOMMATE' };
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
export default function UploadMeAsRoommate(state = roommatesConditionEmptyState, action: Action) {
  switch (action.type) {
    case 'UPLOAD_MEASROOMMATE':
      console.log(action.payload.meAsRoommatesState);
      return action.payload.meAsRoommatesState;
    case 'RETURN_INITIAL_MEASROOMMATE':
      return roommatesConditionEmptyState;
    default:
      return state;
  }
}
