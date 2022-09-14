import FavoriteListingType from './GetFavoriteListingType';
type Action = { type: 'GET_FAVORITELISTS_FROM_FIREBASE'; payload: { favoriteLists: Array<string> } };
const favoriteListsState: Array<string> = [];

export default function GetFavoriteLists(state = favoriteListsState, action: Action) {
  switch (action.type) {
    case 'GET_FAVORITELISTS_FROM_FIREBASE':
      return action.payload.favoriteLists;
    default:
      return state;
  }
}
