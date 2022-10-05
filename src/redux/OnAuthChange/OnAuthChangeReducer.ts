import onAuthChangeType from "./OnAuthChangeType";
import {
  onAuthChangeActionType,
  onAuthChangeAction,
} from "./OnAuthChangeAction";
const userInitialState = true;

export default function AuthChange(
  state = userInitialState,
  action: onAuthChangeActionType
) {
  switch (action.type) {
    case onAuthChangeAction.AUTH_TRUE:
      return true;
    case onAuthChangeAction.RETURN_INITIAL_AUTH:
      return false;
    default:
      return state;
  }
}
