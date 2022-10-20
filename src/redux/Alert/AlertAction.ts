enum alertActionType {
  OPEN_NOTIFY_ALERT = 'OPEN_NOTIFY_ALERT',
  OPEN_SUCCESS_ALERT = 'OPEN_SUCCESS_ALERT',
  OPEN_ERROR_ALERT = 'OPEN_ERROR_ALERT',
  CLOSE_ALERT = 'CLOSE_ALERT',
  RETURN_INITIAL_ALERT = 'RETURN_INITIAL_ALERT',
}

interface openNotifyAlert {
  type: alertActionType.OPEN_NOTIFY_ALERT;
  payload: { alertMessage: string };
}
interface openSuccessAlert {
  type: alertActionType.OPEN_SUCCESS_ALERT;
  payload: { alertMessage: string };
}

interface openErrorAlert {
  type: alertActionType.OPEN_ERROR_ALERT;
  payload: { alertMessage: string };
}
interface closeAlert {
  type: alertActionType.CLOSE_ALERT;
}
interface returnInitialAlert {
  type: alertActionType.RETURN_INITIAL_ALERT;
}

type alertAction = openNotifyAlert | openSuccessAlert | openErrorAlert | closeAlert | returnInitialAlert;

export { alertActionType, alertAction };
