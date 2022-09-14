import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { firebase } from '../../utils/firebase';
import roommatesConditionType from '../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';

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
function RoommatesCondition(roommatesConditions: any) {
  const [keys, setKeys] = useState<string[]>([]);
  const userAsRoommate = useSelector((state: RootState) => state.UserAsRoommateReducer);

  function match() {
    console.log(roommatesConditions.roommatesConditions);
    function getTrueKey(object: any) {
      let keys = ['bringFriendToStay', 'pet', 'smoke'];
      let newObj = { ...object };
      for (let key of keys) {
        if (newObj[key] === 'true') {
          console.log(key);
          newObj[key] = 'unlimited';
          // const newObj = { ...object, [key]: 'unlimited' };
        } else {
        }
      }
      return newObj;
    }
    function getNonUnlimitedKey(object: any, value: any) {
      let unlimitedKey = Object.keys(object).filter((key) => object[key] === value);
      for (let key of unlimitedKey) {
        delete object[key];
      }
      return object;
    }

    function shallowEqual(object1: any, object2: any) {
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);
      for (let key of keys1) {
        if (object1[key] !== object2[key]) {
          window.alert(`${key}: ${object1[key]} ${object2[key]} 不符`);
          return false;
        }
      }
      window.alert('符合');
      return true;
    }

    shallowEqual(
      getNonUnlimitedKey(getTrueKey(roommatesConditions.roommatesConditions), 'unlimited'),
      userAsRoommate.userAsRoommatesConditions
    ); // => true
  }
  useEffect(() => {
    function findObjectKeys() {
      console.log(roommatesConditions.roommatesConditions);
      let keys = Object.keys(roommatesConditions.roommatesConditions);
      console.log(keys);
      setKeys(keys);
    }
    if (roommatesConditions?.roommatesConditions) {
      findObjectKeys();
    }
  }, [roommatesConditions.roommatesConditions]);
  return (
    <Wrapper>
      <SubmitBtn onClick={() => match()}>比對</SubmitBtn>
      <h1>室友條件</h1>

      {keys &&
        keys.map((el, index) => (
          <ConditionArea key={`roommatesCondition${index}`}>
            <div>{el}: </div>
            <div>{roommatesConditions.roommatesConditions[el]}</div>
          </ConditionArea>
        ))}
    </Wrapper>
  );
}

export default RoommatesCondition;
