import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
interface listingDocDataType extends Array<QueryDocumentSnapshot<DocumentData>> {}
export default listingDocDataType;
