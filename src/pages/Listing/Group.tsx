import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { firebase, db, timestamp } from "../../utils/firebase";
import {
  getFirestore,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  collection,
  Timestamp,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  query,
  FieldValue,
  serverTimestamp,
} from "firebase/firestore";
import roommatesConditionType from "../../redux/UploadRoommatesCondition/UploadRoommatesConditionType";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { groupType } from "../../redux/Group/GroupType";
import { Title } from "../../components/ProfileTitle";
import { BtnDiv } from "../../components/Button";
import Hr from "../../components/Hr";
import SpanLink from "../../components/SpanLink";
import { PopupComponent, PopupImage } from "../../components/Popup";
import { Link, useNavigate } from "react-router-dom";
import { connectStorageEmulator } from "firebase/storage";
import { Loading } from "../../components/Loading";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  //   justify-content: center;
  align-items: flex-start;
  width: 100%;
  // height: 100%;
  margin: auto;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const ConditionArea = styled.div`
  display: flex;
  //   flex-direction: column;
  justify-content: space-between;
  width: 80%;
`;
const SubmitBtn = styled.div`
  background-color: grey;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  padding: 4px;
  align-self: flex-end;
  &:hover {
    background-color: #222;
  }
`;
const SingleGroup = styled.div`
  margin-bottom: 20px;
  align-items: center;
  display: flex;
`;
const SingleGroupWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const AddToGroup = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border: solid 1px #4f5152;
  margin-left: 20px;
  cursor: pointer;
  transition-duration: 0.2s;
  &:hover {
    transform: scale(1.1);
    box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  }
`;

const UserPic = styled(AddToGroup)<{ img: string }>`
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-position: center center;
  cursor: default;
  &:hover {
    transform: none;
    box-shadow: none;
  }
`;
const SubTitle = styled.div`
  font-size: 28px;
  letter-spacing: 12px
  font-weight: bold;
  color: #4f5152;
  width: 100%;
`;
const GroupIndex = styled.div`
  font-size: 16px;
`;
const Span = styled.span`
  font-size: 16px;
  letter-spacing: 1.2px;
  color: grey;
`;
const Text = styled.div`
  color: grey;
`;
const HintTextLoading = styled(Loading)`
  transform: scale(0.1);
`;
function Group({
  match,
  setMatch,
  peopleAmount,
  listingId,
  listingTitle,
  addUserAsRoommatesCondition,
  setAddUserAsRoommatesCondition,
  notAddUserAsRoommatesConditionAlert,
  isInGroup,
  setIsInGroup,
  isInFullGroup,
  setIsInFullGroup,
  canBook,
  setCanBook,
  hintTextLoading,
  setHintTextLoading,
}: {
  peopleAmount: number;
  listingId: string;
  listingTitle: string;
  match: boolean;
  setMatch: React.Dispatch<React.SetStateAction<boolean>>;
  addUserAsRoommatesCondition: boolean;
  setAddUserAsRoommatesCondition: React.Dispatch<React.SetStateAction<boolean>>;
  notAddUserAsRoommatesConditionAlert: any;
  isInGroup: boolean;
  setIsInGroup: React.Dispatch<React.SetStateAction<boolean>>;
  isInFullGroup: boolean;
  setIsInFullGroup: React.Dispatch<React.SetStateAction<boolean>>;
  canBook: boolean;
  setCanBook: React.Dispatch<React.SetStateAction<boolean>>;
  hintTextLoading: boolean;
  setHintTextLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const [groups, setGroups] = useState<Array<groupType>>([]);

  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const getGroup = useSelector(
    (state: RootState) => state.GroupReducer
  ) as Array<groupType>;
  const [isShown, setIsShown] = useState<boolean>(false);
  const [createNewGroup, setCreateNewGroup] = useState<boolean>(false);
  const [firstTimeAddGroupPopup, setFirstTimeAddGroupPopup] =
    useState<boolean>(false);
  const [otherTimeAddGroupPopup, setOtherTimeAddGroupPopup] =
    useState<boolean>(false);
  const [groupId, setGroupId] = useState<number>();
  const navigate = useNavigate();
  const newGroup = {
    users: Array(peopleAmount).fill(null),
    chatRoomId: "",
    isBooked: false,
  };
  function addGroup() {
    dispatch({ type: "ADD_GROUP", payload: { newGroup } });
  }
  async function createNewChatRoom(
    uid: string,
    listingId: string,
    listingTitle: string,
    getGroup: any,
    groupId: number
  ) {
    let nullUsersArray = Array(peopleAmount).fill(null);
    console.log(Array(peopleAmount).fill(null));
    console.log(uid);
    nullUsersArray.splice(0, 1, uid);
    console.log(nullUsersArray);
    dispatch({
      type: "ADD_USER_TO_GROUP",
      payload: { groupId, userIndex: 0, userInfo },
    });
    console.log(getGroup);
    setHintTextLoading(true);
    firebase
      .createChatRoom(
        nullUsersArray,
        listingId,
        listingTitle,
        getGroup,
        groupId
      )
      .then(() => {
        setIsInGroup(true);
        dispatch({
          type: "OPEN_SUCCESS_ALERT",
          payload: {
            alertMessage: "成功加入",
          },
        });
        setTimeout(() => {
          dispatch({
            type: "CLOSE_ALERT",
          });
        }, 3000);

        setHintTextLoading(false);
      });
  }
  async function addUserToFormerGroup() {
    let userIndex = getGroup[groupId].users.indexOf(null);
    console.log(userIndex);
    setHintTextLoading(true);
    dispatch({
      type: "ADD_USER_TO_GROUP",
      payload: { groupId, userIndex: userIndex, userInfo },
    });
    let newGroup = [...getGroup];
    Promise.all([
      firebase.updateAddUserToGroup(listingId, getGroup),
      firebase.updateChatRoom(
        newGroup[groupId].chatRoomId,
        userIndex + 1 === peopleAmount,
        newGroup[groupId].users.map((u) => {
          if (u) {
            return u.userId;
          } else {
            return null;
          }
        })
      ),
    ]).then(() => {
      setIsInFullGroup(userIndex + 1 === peopleAmount);
      dispatch({
        type: "OPEN_SUCCESS_ALERT",
        payload: {
          alertMessage: "成功加入",
        },
      });
      setTimeout(() => {
        setHintTextLoading(false);
        dispatch({
          type: "CLOSE_ALERT",
        });
      }, 3000);
      setIsInGroup(true);
    });
  }

  async function addUserToGroup(groupId: number, userId: number) {
    console.log(getGroup);
    let userState = getGroup[groupId].users;
    console.log(groupId);
    setGroupId(groupId);
    if (userState.filter((u) => u !== null).length === 0) {
      setFirstTimeAddGroupPopup(true);
    } else if (userState.filter((u) => u !== null).length !== 0) {
      setOtherTimeAddGroupPopup(true);
    }
  }
  useEffect(() => {
    console.log(peopleAmount);
    if (peopleAmount !== undefined) {
      const groupQuery = doc(db, "listings", listingId);
      const getAllGroup = onSnapshot(groupQuery, (snapshot) => {
        // console.log(snapshot.data()!.matchGroup);
        const groups = [...snapshot.data()!.matchGroup];
        dispatch({ type: "ADD_GROUP_FROM_FIREBASE", payload: { groups } });
        let inGroup = groups.some((g) =>
          g.users
            .filter((u) => u !== null)
            .some((u) => u.userId === userInfo.uid)
        );
        if (inGroup) {
          console.log(groups);
          let findGroup = groups.find((g) =>
            g.users.some((u: any) => u && u.userId === userInfo.uid)
          );
          setIsInFullGroup(!findGroup.users.includes(null));
          if (!findGroup.users.includes(null)) {
            console.log(findGroup);
            console.log(!findGroup.isBooked);
            setCanBook(!findGroup.isBooked);
          }
        }

        console.log(inGroup);
        setIsInGroup(inGroup);
      });
    }
  }, [peopleAmount, userInfo]);
  return (
    <Wrapper>
      {isShown && (
        <PopupComponent
          // style={{ zIndex: '1' }}
          msg={`請先進行登入註冊`}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={() => setIsShown(false)}
          clickFunction={() => navigate("/signin")}
        />
      )}
      {firstTimeAddGroupPopup && (
        <PopupComponent
          msg={`加入新的團?`}
          notDefaultBtn={`取消`}
          defaultBtn={`加入`}
          clickClose={() => {
            setFirstTimeAddGroupPopup(false);
          }}
          clickFunction={() => {
            createNewChatRoom(
              userInfo.uid,
              listingId,
              listingTitle,
              getGroup,
              groupId
            );
            setFirstTimeAddGroupPopup(false);
          }}
        />
      )}
      {otherTimeAddGroupPopup && (
        <PopupComponent
          msg={`確認加入?`}
          notDefaultBtn={`取消`}
          defaultBtn={`加入`}
          clickClose={() => {
            setOtherTimeAddGroupPopup(false);
          }}
          clickFunction={() => {
            addUserToFormerGroup();
            // createNewChatRoom(
            //   userInfo.uid,
            //   listingId,
            //   listingTitle,
            //   getGroup,
            //   groupId
            // );
            setOtherTimeAddGroupPopup(false);
          }}
        />
      )}
      <Hr style={{ margin: "40px 0px" }} />
      <SubTitle style={{ marginBottom: "32px" }}>
        湊團看房{" "}
        {hintTextLoading ? (
          <HintTextLoading />
        ) : authChange && !addUserAsRoommatesCondition ? (
          <Span>
            尚未填寫條件,到
            <SpanLink
              path={"/profile"}
              msg={"個人頁面"}
              otherFn={() => {
                dispatch({
                  type: "SELECT_TYPE",
                  payload: { tab: "aboutMe" },
                });
              }}
            />
            更新
          </Span>
        ) : authChange &&
          addUserAsRoommatesCondition &&
          match &&
          isInGroup &&
          !isInFullGroup ? (
          <Span>
            你已加入湊團，到
            <SpanLink
              path={"/profile"}
              msg={"個人頁面"}
              otherFn={() => {
                dispatch({
                  type: "SELECT_TYPE",
                  payload: { tab: "allHouseHunting" },
                });

                dispatch({
                  type: "SELECT_SUB_TAB",
                  payload: {
                    subTab: isInFullGroup ? "尚未預約" : "等待湊團",
                  },
                });
              }}
            />
            查看
          </Span>
        ) : authChange &&
          addUserAsRoommatesCondition &&
          match &&
          isInGroup &&
          isInFullGroup &&
          !canBook ? (
          <Span>
            你已預約，到
            <SpanLink
              path={"/profile"}
              msg={"個人頁面"}
              otherFn={() => {
                dispatch({
                  type: "SELECT_TYPE",
                  payload: { tab: "allHouseHunting" },
                });

                dispatch({
                  type: "SELECT_SUB_TAB",
                  payload: {
                    subTab: "已預約",
                  },
                });
              }}
            />
            查看
          </Span>
        ) : authChange &&
          addUserAsRoommatesCondition &&
          match &&
          isInGroup &&
          isInFullGroup &&
          canBook ? (
          <Span>已湊滿團，可以預約</Span>
        ) : authChange && addUserAsRoommatesCondition && match && !isInGroup ? (
          <Span>符合室友條件</Span>
        ) : (
          authChange &&
          addUserAsRoommatesCondition &&
          !match && <Span>不符合室友條件</Span>
        )}
        {/* {authChange && !addUserAsRoommatesCondition && (
          <Span>
            尚未填寫條件,到
            <SpanLink
              path={"/profile"}
              msg={"個人頁面"}
              otherFn={() => {
                dispatch({
                  type: "SELECT_TYPE",
                  payload: { tab: "aboutMe" },
                });
              }}
            />
            更新
          </Span>
        )} */}
        {/* {authChange && addUserAsRoommatesCondition && match && !isInGroup && (
          <Span>符合室友條件</Span>
        )} */}
        {/* {authChange &&
          addUserAsRoommatesCondition &&
          match &&
          isInGroup &&
          !isInFullGroup && (
            <Span>
              你已加入湊團，到
              <SpanLink
                path={"/profile"}
                msg={"個人頁面"}
                otherFn={() => {
                  dispatch({
                    type: "SELECT_TYPE",
                    payload: { tab: "allHouseHunting" },
                  });

                  dispatch({
                    type: "SELECT_SUB_TAB",
                    payload: {
                      subTab: isInFullGroup ? "尚未預約" : "等待湊團",
                    },
                  });
                }}
              />
              查看
            </Span>
          )} */}
        {/* {authChange &&
          addUserAsRoommatesCondition &&
          match &&
          isInGroup &&
          isInFullGroup &&
          !canBook && (
            <Span>
              你已預約，到
              <SpanLink
                path={"/profile"}
                msg={"個人頁面"}
                otherFn={() => {
                  dispatch({
                    type: "SELECT_TYPE",
                    payload: { tab: "allHouseHunting" },
                  });

                  dispatch({
                    type: "SELECT_SUB_TAB",
                    payload: {
                      subTab: "已預約",
                    },
                  });
                }}
              />
              查看
            </Span>
          )} */}
        {/* {authChange &&
          addUserAsRoommatesCondition &&
          match &&
          isInGroup &&
          isInFullGroup &&
          canBook && <Span>已湊滿團，可以預約</Span>} */}
        {/* {authChange && addUserAsRoommatesCondition && !match && (
          <Span>不符合室友條件</Span>
        )} */}
      </SubTitle>
      {getGroup.length === 0 && match && (
        <Text>
          目前無人湊團
          <span style={{ display: "inline-block", left: "12px" }}>
            <BtnDiv
              onClick={() => {
                setCreateNewGroup(true);
                if (match) {
                  addGroup();
                }
              }}
            >
              加新的團
            </BtnDiv>
          </span>
        </Text>
      )}

      {getGroup.length !== 0 &&
        getGroup.map((group, gIndex) => (
          <SingleGroup key={`group${gIndex}`}>
            {/* <SingleGroupWrapper> */}
            <GroupIndex>團{gIndex + 1}</GroupIndex>
            {group.users.map((user, index) =>
              user === null ? (
                <AddToGroup
                  onClick={() => {
                    if (!authChange) {
                      setIsShown(true);
                    } else if (!addUserAsRoommatesCondition) {
                      notAddUserAsRoommatesConditionAlert();
                    } else if (match && !isInGroup) {
                      addUserToGroup(gIndex, index);
                    } else if (match && isInGroup) {
                      dispatch({
                        type: "OPEN_ERROR_ALERT",
                        payload: {
                          alertMessage: "不可以重新加入",
                        },
                      });
                      setTimeout(() => {
                        dispatch({
                          type: "CLOSE_ALERT",
                        });
                      }, 3000);
                    } else if (!match) {
                      dispatch({
                        type: "OPEN_ERROR_ALERT",
                        payload: {
                          alertMessage: "不符合室友條件，無法加入",
                        },
                      });
                      setTimeout(() => {
                        dispatch({
                          type: "CLOSE_ALERT",
                        });
                      }, 3000);
                    }
                  }}
                  key={`user${index}`}
                >
                  +
                </AddToGroup>
              ) : (
                <UserPic key={`user${index}`} img={user.userPic}></UserPic>
              )
            )}
            {/* <BtnDiv onClick={() => removeGroup(gIndex)}>刪除團</BtnDiv> */}
            {/* </SingleGroupWrapper> */}
          </SingleGroup>
        ))}
      {getGroup.length !== 0 && match && !isInGroup && !createNewGroup && (
        <span style={{ display: "inline-block" }}>
          <BtnDiv
            onClick={() => {
              setCreateNewGroup(true);
              console.log(getGroup);
              if (match) {
                addGroup();
              }
            }}
          >
            加新的團
          </BtnDiv>
        </span>
      )}
      {getGroup.length !== 0 && match && !isInGroup && createNewGroup && (
        <span style={{ display: "inline-block" }}>
          <BtnDiv
            onClick={() => {
              setCreateNewGroup(false);
              dispatch({
                type: "REMOVE_GROUP",
              });
            }}
          >
            取消
          </BtnDiv>
        </span>
      )}
    </Wrapper>
  );
}

export default Group;
