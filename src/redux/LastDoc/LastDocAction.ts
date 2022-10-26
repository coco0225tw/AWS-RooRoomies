import lastDocType from './LastDocType';
enum lastDocAction {
  GET_LAST_LISTING_DOC = 'GET_LAST_LISTING_DOC',
}

interface getLastListingDoc {
  type: lastDocAction.GET_LAST_LISTING_DOC;
  payload: { lastDocData: lastDocType };
}

type lastDocActionType = getLastListingDoc;
export { lastDocActionType, lastDocAction };
