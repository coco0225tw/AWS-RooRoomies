import userType from './GetAuthType';
type Action = { type: 'GETUSER_FROMFIREBASE'; payload: { user: userType } } | { type: 'RETURN_INITIAL_GETUSER' };
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
    case 'RETURN_INITIAL_GETUSER':
      return userInitialState;
    default:
      return state;
  }
}
