import listingDocDataType from './ListingDocumentForHomePageType';
enum listingForHomePageAction {
  GET_LISTING_DOCS_FROM_FIREBASE = 'GET_LISTING_DOCS_FROM_FIREBASE',
  GET_NEXT_PAGE_LISTING_DOCS_FROM_FIREBASE = 'GET_NEXT_PAGE_LISTING_DOCS_FROM_FIREBASE',
}

interface getListingDocsFromFirebase {
  type: listingForHomePageAction.GET_LISTING_DOCS_FROM_FIREBASE;
  payload: { listingDocData: listingDocDataType };
}

interface getNextPageListingDocsFromFirebase {
  type: listingForHomePageAction.GET_NEXT_PAGE_LISTING_DOCS_FROM_FIREBASE;
  payload: { listingDocData: listingDocDataType };
}
type listingForHomePageActionType = getListingDocsFromFirebase | getNextPageListingDocsFromFirebase;

export { listingForHomePageAction, listingForHomePageActionType };
