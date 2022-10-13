import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
type listingDocDataType = QueryDocumentSnapshot<DocumentData>[];
export default listingDocDataType;
