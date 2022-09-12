import userType from './GetAuthType';
type Action = { type: 'GETUSER_FROMFIREBASE'; payload: { user: userType } };
const userInitialState = {
  uid: '',
  email: '',
  image: '',
  name: '',
};

export default function User(state = userInitialState, action: Action) {
  switch (action.type) {
    case 'GETUSER_FROMFIREBASE':
      return action.payload.user;
    default:
      return state;
  }
}
