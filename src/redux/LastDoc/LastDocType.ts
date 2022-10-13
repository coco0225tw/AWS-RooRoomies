import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
type lastDocType = QueryDocumentSnapshot<DocumentData> | null;
export default lastDocType;
