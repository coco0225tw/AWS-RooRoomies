import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';

import { firebase, db } from '../../utils/firebase';

import { RootState } from '../../redux/rootReducer';
import { alertActionType } from '../../redux/Alert/AlertAction';
import { groupAction } from '../../redux/Group/GroupAction';
import { selectTabAction } from '../../redux/SelectTab/SelectTabAction';
import { subTabAction } from '../../redux/SubTab/SubTabAction';

import { groupsType, userInfoType } from '../../redux/Group/GroupType';
import { BtnDiv } from '../../components/Button';
import Hr from '../../components/Hr';
import SpanLink from '../../components/SpanLink';
import { PopupComponent } from '../../components/Popup';
import { Loading } from '../../components/Loading';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin: auto;
`;

const SingleGroup = styled.div`
  margin-bottom: 20px;
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
  @media screen and (max-width: 660px) {
    margin-top: 12px;
    display: block;
  }
`;
const Text = styled.div`
  color: grey;
`;

function Group({
  match,
  peopleAmount,
  listingId,
  listingTitle,
  addUserAsRoommatesCondition,

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
  addUserAsRoommatesCondition: boolean;
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
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const getGroup = useSelector((state: RootState) => state.GroupReducer) as groupsType;

  const [isShown, setIsShown] = useState<boolean>(false);
  const [createNewGroup, setCreateNewGroup] = useState<boolean>(false);
  const [firstTimeAddGroupPopup, setFirstTimeAddGroupPopup] = useState<boolean>(false);
  const [otherTimeAddGroupPopup, setOtherTimeAddGroupPopup] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<number>();

  const newGroup = {
    users: Array(peopleAmount).fill(null),
    chatRoomId: '',
    isBooked: false,
  };
  function addGroup() {
    dispatch({ type: groupAction.ADD_GROUP, payload: { newGroup } });
  }
  async function createNewChatRoom(
    uid: string,
    listingId: string,
    listingTitle: string,
    getGroup: groupsType,
    groupId: number
  ) {
    let nullUsersArray = Array(peopleAmount).fill(null);

    nullUsersArray.splice(0, 1, uid);

    dispatch({
      type: groupAction.ADD_USER_TO_GROUP,
      payload: { groupId, userIndex: 0, userInfo },
    });

    setHintTextLoading(true);
    firebase.createChatRoom(nullUsersArray, listingId, listingTitle, getGroup, groupId).then(() => {
      setIsInGroup(true);
      dispatch({
        type: alertActionType.OPEN_SUCCESS_ALERT,
        payload: {
          alertMessage: '成功加入',
        },
      });
      setTimeout(() => {
        dispatch({
          type: alertActionType.CLOSE_ALERT,
        });
      }, 3000);

      setHintTextLoading(false);
    });
  }
  async function addUserToFormerGroup() {
    let userIndex = getGroup[groupId].users.indexOf(null);

    setHintTextLoading(true);
    dispatch({
      type: groupAction.ADD_USER_TO_GROUP,
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
        type: alertActionType.OPEN_SUCCESS_ALERT,
        payload: {
          alertMessage: '成功加入',
        },
      });
      setTimeout(() => {
        setHintTextLoading(false);
        dispatch({
          type: alertActionType.CLOSE_ALERT,
        });
      }, 3000);
      setIsInGroup(true);
    });
  }

  async function addUserToGroup(groupId: number, userId: number) {
    let userState = getGroup[groupId].users;

    setGroupId(groupId);
    if (userState.filter((u) => u !== null).length === 0) {
      setFirstTimeAddGroupPopup(true);
    } else if (userState.filter((u) => u !== null).length !== 0) {
      setOtherTimeAddGroupPopup(true);
    }
  }
  useEffect(() => {
    if (peopleAmount !== undefined) {
      const groupQuery = doc(db, 'listings', listingId);
      const getAllGroup = onSnapshot(groupQuery, (snapshot) => {
        const groups = [...snapshot.data()!.matchGroup];
        dispatch({
          type: groupAction.ADD_GROUP_FROM_FIREBASE,
          payload: { groups },
        });
        let inGroup = groups.some((g) =>
          g.users.filter((u: userInfoType) => u !== null).some((u: userInfoType) => u.userId === userInfo.uid)
        );
        if (inGroup) {
          let findGroup = groups.find((g) => g.users.some((u: userInfoType) => u && u.userId === userInfo.uid));
          setIsInFullGroup(!findGroup.users.includes(null));
          if (!findGroup.users.includes(null)) {
            setCanBook(!findGroup.isBooked);
          }
        }

        setIsInGroup(inGroup);
      });
    }
  }, [peopleAmount, userInfo]);
  return (
    <Wrapper>
      {isShown && (
        <PopupComponent
          msg={`請先進行\n登入註冊進行登入註冊`}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={() => setIsShown(false)}
          clickFunction={() => navigate('/signin')}
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
            createNewChatRoom(userInfo.uid, listingId, listingTitle, getGroup, groupId);
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
            setOtherTimeAddGroupPopup(false);
          }}
        />
      )}
      <Hr style={{ margin: '40px 0px' }} />
      <SubTitle style={{ marginBottom: '32px' }}>
        湊團看房{' '}
        {hintTextLoading ? (
          <Span
            style={{
              position: 'relative',
            }}
          >
            <Loading
              style={{
                left: '0',
                top: '0',
                transform: 'scale(0.1) translate(-400%,-350%)',
                position: 'absolute',
                width: 'auto',
                height: 'auto',
                zIndex: '1',
              }}
            />
          </Span>
        ) : authChange && !addUserAsRoommatesCondition ? (
          <Span>
            尚未填寫條件,到
            <SpanLink
              path={'/profile'}
              msg={'個人頁面'}
              otherFn={() => {
                dispatch({
                  type: selectTabAction.SELECT_TYPE,
                  payload: { tab: 'aboutMe' },
                });
              }}
            />
            更新
          </Span>
        ) : authChange && addUserAsRoommatesCondition && match && isInGroup && !isInFullGroup ? (
          <Span>
            你已加入湊團，到
            <SpanLink
              path={'/profile'}
              msg={'個人頁面'}
              otherFn={() => {
                dispatch({
                  type: selectTabAction.SELECT_TYPE,
                  payload: { tab: 'allHouseHunting' },
                });

                dispatch({
                  type: subTabAction.SELECT_SUB_TAB,
                  payload: {
                    subTab: isInFullGroup ? '尚未預約' : '等待湊團',
                  },
                });
              }}
            />
            查看
          </Span>
        ) : authChange && addUserAsRoommatesCondition && match && isInGroup && isInFullGroup && !canBook ? (
          <Span>
            你已預約，到
            <SpanLink
              path={'/profile'}
              msg={'個人頁面'}
              otherFn={() => {
                dispatch({
                  type: selectTabAction.SELECT_TYPE,
                  payload: { tab: 'allHouseHunting' },
                });

                dispatch({
                  type: subTabAction.SELECT_SUB_TAB,
                  payload: {
                    subTab: '已預約',
                  },
                });
              }}
            />
            查看
          </Span>
        ) : authChange && addUserAsRoommatesCondition && match && isInGroup && isInFullGroup && canBook ? (
          <Span>已湊滿團，可以預約</Span>
        ) : authChange && addUserAsRoommatesCondition && match && !isInGroup ? (
          <Span>符合室友條件</Span>
        ) : (
          authChange && addUserAsRoommatesCondition && !match && <Span>不符合室友條件</Span>
        )}
      </SubTitle>
      {getGroup.length === 0 && match && (
        <Text>
          目前無人湊團
          <span style={{ display: 'inline-block', left: '12px' }}>
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
                        type: alertActionType.OPEN_ERROR_ALERT,
                        payload: {
                          alertMessage: '不可以重新加入',
                        },
                      });
                      setTimeout(() => {
                        dispatch({
                          type: alertActionType.CLOSE_ALERT,
                        });
                      }, 3000);
                    } else if (!match) {
                      dispatch({
                        type: alertActionType.OPEN_ERROR_ALERT,
                        payload: {
                          alertMessage: '不符合室友條件，無法加入',
                        },
                      });
                      setTimeout(() => {
                        dispatch({
                          type: alertActionType.CLOSE_ALERT,
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
          </SingleGroup>
        ))}
      {getGroup.length !== 0 && match && !isInGroup && !createNewGroup && (
        <span style={{ display: 'inline-block' }}>
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
      )}
      {getGroup.length !== 0 && match && !isInGroup && createNewGroup && (
        <span style={{ display: 'inline-block' }}>
          <BtnDiv
            onClick={() => {
              setCreateNewGroup(false);
              dispatch({
                type: groupAction.REMOVE_GROUP,
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
