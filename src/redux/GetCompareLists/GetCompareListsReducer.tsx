type Action = { type: 'GET_COMPARELISTS_FROM_FIREBASE'; payload: { compareLists: Array<string> } };
const compareListsState: Array<string> = [];

export default function GetCompareLists(state = compareListsState, action: Action) {
  switch (action.type) {
    case 'GET_COMPARELISTS_FROM_FIREBASE':
      return action.payload.compareLists;
    default:
      return state;
  }
}
