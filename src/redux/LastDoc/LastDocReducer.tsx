import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

type Action = {
  type: "GET_LAST_LISTING_DOC";
  payload: { lastDocData: QueryDocumentSnapshot<DocumentData> };
};

const emptyLastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

export default function GetLastDoc(state = emptyLastDoc, action: Action) {
  switch (action.type) {
    case "GET_LAST_LISTING_DOC": {
      console.log(action.payload.lastDocData);
      console.log(action.payload.lastDocData.id);
      return action.payload.lastDocData;
    }
    default:
      return state;
  }
}
