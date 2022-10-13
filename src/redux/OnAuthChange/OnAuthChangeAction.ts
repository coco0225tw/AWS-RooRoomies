import onAuthChangeType from "./OnAuthChangeType";
enum onAuthChangeAction {
  AUTH_TRUE = "AUTH_TRUE",
  RETURN_INITIAL_AUTH = "RETURN_INITIAL_AUTH",
}

interface authTrue {
  type: onAuthChangeAction.AUTH_TRUE;
}
interface returnInitialAuth {
  type: onAuthChangeAction.RETURN_INITIAL_AUTH;
}

type onAuthChangeActionType = authTrue | returnInitialAuth;
export { onAuthChangeActionType, onAuthChangeAction };
