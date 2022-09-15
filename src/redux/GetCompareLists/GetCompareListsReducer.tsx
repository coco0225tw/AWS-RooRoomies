type Action =
  | { type: 'GET_COMPARELISTS_FROM_FIREBASE'; payload: { compareLists: Array<string> } }
  | { type: 'REMOVE_FROM_COMPARELISTS'; payload: { id: string } }
  | { type: 'ADD_TO_COMPARELISTS'; payload: { id: string } }
  | { type: 'REODER_AND_MOVE_COMPARELISTS'; payload: { compareLists: Array<string> } };
const compareListsState: Array<string> = [];

export default function GetCompareLists(state = compareListsState, action: Action) {
  switch (action.type) {
    case 'GET_COMPARELISTS_FROM_FIREBASE': {
      let newState = action.payload.compareLists.reverse();
      return newState;
    }
    case 'REMOVE_FROM_COMPARELISTS': {
      console.log('remove');
      let newState = [...state];
      console.log(
        newState.filter((i) => {
          return i !== action.payload.id;
        })
      );
      return newState.filter((i) => {
        return i !== action.payload.id;
      });
    }
    case 'ADD_TO_COMPARELISTS': {
      let newState = [...state];
      return [...state, action.payload.id];
    }
    case 'REODER_AND_MOVE_COMPARELISTS': {
      return action.payload.compareLists;
    }
    default:
      return state;
  }
}
