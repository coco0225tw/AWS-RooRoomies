import alertType from "./AlertType";
type Action =
  | { type: "OPEN_ALERT"; payload: { alert: alertType } }
  | { type: "CLOSE_ALERT" }
  | { type: "RETURN_INITIAL_ALERT" };
const alertInitialState = {
  alertType: null,
  alertMessage: null,
  isAlert: false,
};

export default function Alert(state = alertInitialState, action: Action) {
  switch (action.type) {
    case "OPEN_ALERT":
      return action.payload.alert;
    case "CLOSE_ALERT":
      return { ...state, isAlert: false };
    case "RETURN_INITIAL_ALERT":
      return alertInitialState;
    default:
      return state;
  }
}
