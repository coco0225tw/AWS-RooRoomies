import tabType from "./SelectTabType";
type Action =
  | { type: "SELECT_TYPE"; payload: { tab: tabType } }
  | { type: "RETURN_INITIAL_TAB" };
const tabInitialState = "aboutMe";

export default function Tab(state = tabInitialState, action: Action) {
  switch (action.type) {
    case "SELECT_TYPE":
      console.log(action.payload);
      return action.payload.tab;
    case "RETURN_INITIAL_TAB":
      return tabInitialState;
    default:
      return state;
  }
}
