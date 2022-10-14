import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';

import Hr from '../../components/Hr';
import roommatesConditionType from '../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin: auto;
`;

const ConditionArea = styled.div`
  display: flex;
  justify-content: space-between;
  width: 45%;
  margin-bottom: 40px;
  align-items: center;
  @media screen and (max-width: 700px) {
    width: 50%;
  }
  @media screen and (max-width: 550px) {
    margin-bottom: 20px;
    width: 48%;
  }
`;

const Label = styled.div`
  font-size: 16px;
  // letter-spacing: 32px;
  padding-bottom: 4px;
  border-bottom: solid 0.5px #c77155;
`;
const Condition = styled.div`
  font-size: 16px;
  padding-right: 120px;
  @media screen and (max-width: 700px) {
    padding-right: 40px;
  }
  @media screen and (max-width: 420px) {
    padding-right: 20px;
  }
`;

const Conditions = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;
const SubTitle = styled.div`
  font-size: 28px;
  color: #4f5152;
  width: 100%;
`;
const roommatesConditionFormGroups = [
  {
    label: '性別',
    key: 'gender',
    options: [
      {
        label: 'female',
        text: '限女',
        value: 'female',
      },
      {
        label: 'male',
        text: '限男',
        value: 'male',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '帶朋友過夜',
    key: 'bringFriendToStay',
    options: [
      {
        label: 'true',
        text: '可以',
        value: 'true',
      },
      {
        label: 'false',
        text: '不行',
        value: 'false',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '衛生習慣',
    key: 'hygiene',
    options: [
      {
        label: 'good',
        text: '良好',
        value: 'good',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '生活習慣',
    key: 'livingHabit',
    options: [
      {
        label: 'sleepEarly',
        text: '早睡',
        value: 'sleepEarly',
      },
      {
        label: 'nightCat',
        text: '夜貓子',
        value: 'nightCat',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '性別友善',
    key: 'genderFriendly',
    options: [
      {
        label: 'true',
        text: '是',
        value: 'true',
      },
      {
        label: 'false',
        text: '不是',
        value: 'false',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '養寵物',
    key: 'pet',
    options: [
      {
        label: 'true',
        text: '可以',
        value: 'true',
      },
      {
        label: 'false',
        text: '不行',
        value: 'false',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '抽菸',
    key: 'smoke',
    options: [
      {
        label: 'true',
        text: '可以',
        value: 'true',
      },
      {
        label: 'false',
        text: '不行',
        value: 'false',
      },
      {
        label: 'unlimited',
        text: '不限',
        value: 'unlimited',
      },
    ],
  },
];
function RoommatesCondition({
  roommatesConditions,
  setMatch,
  setAddUserAsRoommatesCondition,
}: {
  roommatesConditions: roommatesConditionType;
  setMatch: React.Dispatch<React.SetStateAction<boolean>>;
  setAddUserAsRoommatesCondition: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userAsRoommate = useSelector((state: RootState) => state.UserAsRoommateReducer);
  const [keys, setKeys] = useState<string[]>([]);

  function checkMatch() {
    function getTrueKey(object: roommatesConditionType) {
      let keys = ['bringFriendToStay', 'pet', 'smoke'];
      let newObj = { ...object };
      for (let key of keys) {
        if (newObj[key] === 'true') {
          newObj[key] = 'unlimited';
        }
      }
      return newObj;
    }
    function getNonUnlimitedKey(object: roommatesConditionType, value: string) {
      let unlimitedKey = Object.keys(object).filter((key) => object[key] === value);
      for (let key of unlimitedKey) {
        delete object[key];
      }
      return object;
    }

    function shallowEqual(object1: roommatesConditionType, object2: roommatesConditionType) {
      const keys1 = Object.keys(object1);

      for (let key of keys1) {
        if (object1[key] !== object2[key]) {
          setMatch(false);
          return false;
        }
      }
      setMatch(true);
      return true;
    }

    shallowEqual(getNonUnlimitedKey(getTrueKey(roommatesConditions), 'unlimited'), userAsRoommate);
  }

  useEffect(() => {
    function checkIfUserConditionIsEmpty(userAsRoommate: roommatesConditionType) {
      for (const key in userAsRoommate) {
        if (userAsRoommate[key] === '') {
          return false;
        }
        return true;
      }
    }
    if (roommatesConditions) {
      let keys = Object.keys(roommatesConditions);
      if (checkIfUserConditionIsEmpty(userAsRoommate)) {
        setAddUserAsRoommatesCondition(true);

        setKeys(keys);
        checkMatch();
      } else {
        setAddUserAsRoommatesCondition(false);
      }
    }
  }, [roommatesConditions, userAsRoommate]);
  return (
    <Wrapper>
      <Hr style={{ margin: '40px 0px' }} />
      <SubTitle style={{ marginBottom: '32px' }}>室友條件</SubTitle>
      <Conditions>
        {keys &&
          roommatesConditions &&
          roommatesConditionFormGroups.map((el, index) => (
            <ConditionArea key={`roommatesCondition${index}`}>
              <Label>{el.label}</Label>
              <Condition>
                {el.options &&
                  (el.options.filter((o) => {
                    return o.value === roommatesConditions[el.key as keyof typeof keys];
                  })[0]?.text as string)}
              </Condition>
            </ConditionArea>
          ))}
      </Conditions>
    </Wrapper>
  );
}

export default RoommatesCondition;
