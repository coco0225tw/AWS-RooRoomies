import subTabType from "./SubTabType";

enum subTabAction {
  SELECT_SUB_TAB = "SELECT_SUB_TAB",
  RETURN_INITIAL_SUB_TAB = "RETURN_INITIAL_SUB_TAB",
}
interface selectSubTab {
  type: subTabAction.SELECT_SUB_TAB;
  payload: { subTab: subTabType };
}
interface returnInitialSubTab {
  type: subTabAction.RETURN_INITIAL_SUB_TAB;
}

type subTabActionType = selectSubTab | returnInitialSubTab;
export { subTabAction, subTabActionType };
