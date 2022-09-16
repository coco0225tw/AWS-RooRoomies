import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

type Action =
  | {
      type: 'GET_LISTINGDOC_FROM_FIREBASE';
      payload: { listingDocData: QueryDocumentSnapshot<DocumentData>[] };
    }
  | {
      type: 'GET_NEXTPAGE_LISTINGDOC_FROM_FIREBASE';
      payload: { listingDocData: QueryDocumentSnapshot<DocumentData>[] };
    };
const emptyListingDocData: QueryDocumentSnapshot<DocumentData>[] = [];

export default function GetListingInHomePage(state = emptyListingDocData, action: Action) {
  switch (action.type) {
    case 'GET_LISTINGDOC_FROM_FIREBASE': {
      return action.payload.listingDocData;
    }
    case 'GET_NEXTPAGE_LISTINGDOC_FROM_FIREBASE': {
      return [...state, ...action.payload.listingDocData];
    }
    default:
      return state;
  }
}
