import FavoriteListingType from './GetFavoriteListingType';
type Action =
  | { type: 'GET_FAVORITELISTS_FROM_FIREBASE'; payload: { favoriteLists: Array<string> } }
  | { type: 'REMOVE_FROM_FAVORITELISTS'; payload: { id: string } }
  | { type: 'ADD_TO_FAVORITELISTS'; payload: { id: string } };
const favoriteListsState: Array<string> = [];

export default function GetFavoriteLists(state = favoriteListsState, action: Action) {
  switch (action.type) {
    case 'GET_FAVORITELISTS_FROM_FIREBASE': {
      let newState = action.payload.favoriteLists.reverse();
      return newState;
    }
    case 'REMOVE_FROM_FAVORITELISTS': {
      let newState = [...state];
      return newState.filter((i) => {
        return i !== action.payload.id;
      });
    }
    case 'ADD_TO_FAVORITELISTS': {
      let newState = [...state];
      return [...state, action.payload.id];
    }
    default:
      return state;
  }
}
