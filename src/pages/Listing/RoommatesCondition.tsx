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
  height: 100%;
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
  console.log(userAsRoommate.userAsRoommatesConditions);
  function match() {
    console.log('比對');
    const hero1 = {
      name: 'Joker',
    };
    const hero2 = {
      name: 'Joker',
      realName: 'Bruce Wayne',
    };
    const hero3 = {
      name: 'Batman',
      realName: 'Bruce Wayne',
    };
    function getNonUnlimitedKey(object: any, value: any) {
      console.log(object);
      let unlimitedKey = Object.keys(object).filter((key) => object[key] === value);
      console.log(Object.keys(object).filter((key) => object[key] === value));
      for (let key of unlimitedKey) {
        delete object[key];
        console.log(key);
        console.log(object);
        // const { [key]: _, ...newObj } = object;
        // console.log(newObj);
      }
      return object;
    }
    // getNonUnlimitedKey(roommatesConditions.roommatesConditions, 'unlimited');
    function shallowEqual(object1: any, object2: any) {
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);
      for (let key of keys1) {
        if (object1[key] !== object2[key]) {
          console.log(key);
          console.log(object1[key]);
          console.log(object2[key]);
          console.log('不符');
          window.alert(`${key}: ${object1[key]} ${object2[key]} 不符`);
          return false;
        }
      }
      console.log('符合');
      return true;
    }

    shallowEqual(
      getNonUnlimitedKey(roommatesConditions.roommatesConditions, 'unlimited'),
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
  }, [roommatesConditions]);
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
      <h1>湊團</h1>
    </Wrapper>
  );
}

export default RoommatesCondition;
