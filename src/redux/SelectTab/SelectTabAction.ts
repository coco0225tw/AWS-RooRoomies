import tabType from './SelectTabType';
enum selectTabAction {
  SELECT_TYPE = 'SELECT_TAB',
  RETURN_INITIAL_TAB = 'RETURN_INITIAL_TAB',
}

interface selectTab {
  type: selectTabAction.SELECT_TYPE;
  payload: { tab: tabType };
}

interface returnInitialTab {
  type: selectTabAction.RETURN_INITIAL_TAB;
}

type selectTabActionType = selectTab | returnInitialTab;
export { selectTabAction, selectTabActionType };
