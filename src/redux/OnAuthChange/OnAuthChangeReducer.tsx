type Action = { type: "AUTH_CHANGE" } | { type: "RETURN_INITIAL_AUTH" };
const userInitialState = true;

export default function AuthChange(state = userInitialState, action: Action) {
  switch (action.type) {
    case "AUTH_CHANGE":
      return true;
    case "RETURN_INITIAL_AUTH":
      return false;
    default:
      return state;
  }
}
