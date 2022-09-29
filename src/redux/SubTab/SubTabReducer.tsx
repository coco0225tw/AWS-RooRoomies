type Action =
  | { type: "SELECT_SUB_TAB"; payload: { subTab: string } }
  | { type: "RETURN_INITIAL_SUB_TAB" };
const subTabInitialState = "已預約";

export default function SubTab(state = subTabInitialState, action: Action) {
  switch (action.type) {
    case "SELECT_SUB_TAB":
      console.log(action.payload);
      return action.payload.subTab;
    case "RETURN_INITIAL_SUB_TAB":
      return subTabInitialState;
    default:
      return state;
  }
}
