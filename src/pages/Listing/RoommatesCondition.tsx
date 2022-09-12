import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
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
// const RoommatesCond
function RoommatesCondition(roommatesConditions: any) {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    console.log(roommatesConditions.roommatesConditions);
    function findObjectKeys() {
      console.log(roommatesConditions?.roommatesConditions);
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
