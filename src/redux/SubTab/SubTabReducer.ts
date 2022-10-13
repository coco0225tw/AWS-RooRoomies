import { subTabAction, subTabActionType } from "./SubTabAction";
import subTabType from "./SubTabType";

const subTabInitialState: subTabType = "已預約";

export default function SubTab(
  state = subTabInitialState,
  action: subTabActionType
) {
  switch (action.type) {
    case subTabAction.SELECT_SUB_TAB:
      return action.payload.subTab;
    case subTabAction.RETURN_INITIAL_SUB_TAB:
      return subTabInitialState;
    default:
      return state;
  }
}
