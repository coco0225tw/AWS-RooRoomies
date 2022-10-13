import tabType from "./SelectTabType";
import { selectTabAction, selectTabActionType } from "./SelectTabAction";

const tabInitialState = "aboutMe";

export default function Tab(
  state = tabInitialState,
  action: selectTabActionType
) {
  switch (action.type) {
    case selectTabAction.SELECT_TYPE:
      console.log(action.payload.tab);
      return action.payload.tab;
    case selectTabAction.RETURN_INITIAL_TAB:
      return tabInitialState;
    default:
      return state;
  }
}
