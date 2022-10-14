import roommatesConditionType from './UploadRoommatesConditionType';

enum uploadRoommatesConditionAction {
  UPLOAD_ROOMMATES_CONDITION = 'UPLOAD_ROOMMATES_CONDITION',
  RETURN_INITIAL_ROOMMATES_CONDITION = 'RETURN_INITIAL_ROOMMATES_CONDITION',
  GET_ROOMMATES_CONDITION_FROM_FIREBASE = 'GET_ROOMMATES_CONDITION_FROM_FIREBASE',
}

interface uploadRoommatesCondition {
  type: uploadRoommatesConditionAction.UPLOAD_ROOMMATES_CONDITION;
  payload: { roommatesState: roommatesConditionType };
}

interface returnInitialRoommatesCondition {
  type: uploadRoommatesConditionAction.RETURN_INITIAL_ROOMMATES_CONDITION;
}

interface getRoommatesConditionFromFirebase {
  type: uploadRoommatesConditionAction.GET_ROOMMATES_CONDITION_FROM_FIREBASE;
  payload: { roommatesState: roommatesConditionType };
}
type uploadRoommatesConditionActionType =
  | uploadRoommatesCondition
  | returnInitialRoommatesCondition
  | getRoommatesConditionFromFirebase;
export { uploadRoommatesConditionAction, uploadRoommatesConditionActionType };
