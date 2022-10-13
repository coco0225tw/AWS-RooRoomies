import listingDocDataType from "./ListingDocumentForHomePageType";
import {
  listingForHomePageAction,
  listingForHomePageActionType,
} from "./ListingDocumentForHomePageAction";

const emptyListingDocData: listingDocDataType = [];

export default function GetListingInHomePage(
  state = emptyListingDocData,
  action: listingForHomePageActionType
) {
  switch (action.type) {
    case listingForHomePageAction.GET_LISTING_DOCS_FROM_FIREBASE: {
      return action.payload.listingDocData;
    }
    case listingForHomePageAction.GET_NEXT_PAGE_LISTING_DOCS_FROM_FIREBASE: {
      return [...state, ...action.payload.listingDocData];
    }
    default:
      return state;
  }
}
