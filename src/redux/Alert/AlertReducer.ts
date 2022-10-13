import alertType from "./AlertType";
import { alertAction, alertActionType } from "./AlertAction";

const alertInitialState = {
  alertType: null,
  alertMessage: null,
  isAlert: false,
} as alertType;

export default function Alert(state = alertInitialState, action: alertAction) {
  switch (action.type) {
    case alertActionType.OPEN_NOTIFY_ALERT:
      return {
        alertType: "notify",
        alertMessage: action.payload.alertMessage,
        isAlert: true,
      };
    case alertActionType.OPEN_SUCCESS_ALERT:
      return {
        alertType: "success",
        alertMessage: action.payload.alertMessage,
        isAlert: true,
      };
    case alertActionType.OPEN_ERROR_ALERT:
      return {
        alertType: "error",
        alertMessage: action.payload.alertMessage,
        isAlert: true,
      };
    case alertActionType.CLOSE_ALERT:
      return { ...state, isAlert: false };
    case alertActionType.RETURN_INITIAL_ALERT:
      return alertInitialState;
    default:
      return state;
  }
}
