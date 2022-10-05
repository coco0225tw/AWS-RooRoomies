import FavoriteListingType from "./GetFavoriteListingType";
import {
  getFavoriteAction,
  getFavoriteActionType,
} from "./GetFavoriteListingAction";
const favoriteListsState: FavoriteListingType = [];

export default function GetFavoriteLists(
  state = favoriteListsState,
  action: getFavoriteActionType
) {
  switch (action.type) {
    case getFavoriteAction.GET_FAVORITE_LISTS_FROM_FIREBASE: {
      let newState = action.payload.favoriteLists.reverse();
      return newState;
    }
    case getFavoriteAction.REMOVE_FROM_FAVORITE_LISTS: {
      let newState = [...state];
      return newState.filter((i) => {
        return i !== action.payload.id;
      });
    }
    case getFavoriteAction.ADD_TO_FAVORITE_LISTS: {
      let newState = [...state];
      return [...state, action.payload.id];
    }
    case getFavoriteAction.RETURN_INITIAL_FAVORITE_LISTS: {
      return favoriteListsState;
    }
    default:
      return state;
  }
}
