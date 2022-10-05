import FavoriteListingType from "./GetFavoriteListingType";
enum getFavoriteAction {
  GET_FAVORITE_LISTS_FROM_FIREBASE = "GET_FAVORITE_LISTS_FROM_FIREBASE",
  REMOVE_FROM_FAVORITE_LISTS = "REMOVE_FROM_FAVORITE_LISTS",
  ADD_TO_FAVORITE_LISTS = "ADD_TO_FAVORITE_LISTS",
  RETURN_INITIAL_FAVORITE_LISTS = "RETURN_INITIAL_FAVORITE_LISTS",
}
interface getFavoriteListsFromFirebase {
  type: getFavoriteAction.GET_FAVORITE_LISTS_FROM_FIREBASE;
  payload: { favoriteLists: FavoriteListingType };
}

interface removeFromFavoriteLists {
  type: getFavoriteAction.REMOVE_FROM_FAVORITE_LISTS;
  payload: { id: string };
}
interface addToFavoriteLists {
  type: getFavoriteAction.ADD_TO_FAVORITE_LISTS;
  payload: { id: string };
}

interface returnInitialFavoriteLists {
  type: getFavoriteAction.RETURN_INITIAL_FAVORITE_LISTS;
}

type getFavoriteActionType =
  | getFavoriteListsFromFirebase
  | removeFromFavoriteLists
  | addToFavoriteLists
  | returnInitialFavoriteLists;

export { getFavoriteAction, getFavoriteActionType };
