import alertType from "./AlertType";
type Action =
  | { type: "OPEN_NOTIFY_ALERT"; payload: { alertMessage: string } }
  | { type: "OPEN_SUCCESS_ALERT"; payload: { alertMessage: string } }
  | { type: "OPEN_ERROR_ALERT"; payload: { alertMessage: string } }
  | { type: "CLOSE_ALERT" }
  | { type: "RETURN_INITIAL_ALERT" };
const alertInitialState = {
  alertType: null,
  alertMessage: null,
  isAlert: false,
};

export default function Alert(state = alertInitialState, action: Action) {
  switch (action.type) {
    case "OPEN_NOTIFY_ALERT":
      return {
        alertType: "notify",
        alertMessage: action.payload.alertMessage,
        isAlert: true,
      };
    case "OPEN_SUCCESS_ALERT":
      return {
        alertType: "success",
        alertMessage: action.payload.alertMessage,
        isAlert: true,
      };
    case "OPEN_ERROR_ALERT":
      return {
        alertType: "error",
        alertMessage: action.payload.alertMessage,
        isAlert: true,
      };
    case "CLOSE_ALERT":
      return { ...state, isAlert: false };
    case "RETURN_INITIAL_ALERT":
      return alertInitialState;
    default:
      return state;
  }
}
