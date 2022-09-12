import tabType from './SelectTabType';
type Action = { type: 'SELECT_TYPE'; payload: { tab: tabType } };
const tabInitialState = {
  tab: 'aboutMe',
};

export default function Tab(state = tabInitialState, action: Action) {
  switch (action.type) {
    case 'SELECT_TYPE':
      return action.payload.tab;
    default:
      return state;
  }
}
