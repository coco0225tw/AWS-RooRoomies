import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { firebase } from "../../utils/firebase";
import roommatesConditionType from "../../redux/UploadRoommatesCondition/UploadRoommatesConditionType";
import { Title } from "../../components/ProfileTitle";
import Hr from "../../components/Hr";
import { BtnDiv } from "../../components/Button";
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
  width: 45%;
  margin-bottom: 40px;
  align-items: center;
  // flex-wrap: wrap;
`;
const SubmitBtn = styled(BtnDiv)`
  // background-color: grey;
  // color: white;
  cursor: pointer;
  // border-radius: 10px;
  // padding: 4px;
  align-self: flex-end;
  &:hover {
    // background-color: #222;
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
`;

const Conditions = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  // align-items: center;
`;
const SubTitle = styled.div`
  font-size: 28px;
  letter-spacing: 12px
  font-weight: bold;
  color: #4f5152;
  width: 100%;
`;
const roommatesConditionFormGroups = [
  {
    label: "性別",
    key: "gender",
    options: [
      {
        label: "female",
        text: "限女",
        value: "female",
      },
      {
        label: "male",
        text: "限男",
        value: "male",
      },
      {
        label: "unlimited",
        text: "不限",
        value: "unlimited",
      },
    ],
  },
  {
    label: "帶朋友過夜",
    key: "bringFriendToStay",
    options: [
      {
        label: "true",
        text: "可以",
        value: "true",
      },
      {
        label: "false",
        text: "不行",
        value: "false",
      },
      {
        label: "unlimited",
        text: "不限",
        value: "unlimited",
      },
    ],
  },
  {
    label: "衛生習慣",
    key: "hygiene",
    options: [
      {
        label: "good",
        text: "良好",
        value: "good",
      },
      {
        label: "unlimited",
        text: "不限",
        value: "unlimited",
      },
    ],
  },
  {
    label: "生活習慣",
    key: "livingHabit",
    options: [
      {
        label: "sleepEarly",
        text: "早睡",
        value: "sleepEarly",
      },
      {
        label: "nightCat",
        text: "夜貓子",
        value: "nightCat",
      },
      {
        label: "unlimited",
        text: "不限",
        value: "unlimited",
      },
    ],
  },
  {
    label: "性別友善",
    key: "genderFriendly",
    options: [
      {
        label: "true",
        text: "是",
        value: "true",
      },
      {
        label: "false",
        text: "不是",
        value: "false",
      },
      {
        label: "unlimited",
        text: "不限",
        value: "unlimited",
      },
    ],
  },
  {
    label: "養寵物",
    key: "pet",
    options: [
      {
        label: "true",
        text: "可以",
        value: "true",
      },
      {
        label: "false",
        text: "不行",
        value: "false",
      },
      {
        label: "unlimited",
        text: "不限",
        value: "unlimited",
      },
    ],
  },
  {
    label: "抽菸",
    key: "smoke",
    options: [
      {
        label: "true",
        text: "可以",
        value: "true",
      },
      {
        label: "false",
        text: "不行",
        value: "false",
      },
      {
        label: "unlimited",
        text: "不限",
        value: "unlimited",
      },
    ],
  },
  // {
  //   label: '職業類別',
  //   key: 'career',
  // },
];
function RoommatesCondition({
  roommatesConditions,
  match,
  setMatch,
}: {
  roommatesConditions: any;
  match: boolean;
  setMatch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [keys, setKeys] = useState<string[]>([]);
  const userAsRoommate = useSelector(
    (state: RootState) => state.UserAsRoommateReducer
  );

  function checkMatch() {
    function getTrueKey(object: any) {
      let keys = ["bringFriendToStay", "pet", "smoke"];
      let newObj = { ...object };
      for (let key of keys) {
        if (newObj[key] === "true") {
          console.log(key);
          newObj[key] = "unlimited";
          // const newObj = { ...object, [key]: 'unlimited' };
        } else {
        }
      }
      return newObj;
    }
    function getNonUnlimitedKey(object: any, value: any) {
      let unlimitedKey = Object.keys(object).filter(
        (key) => object[key] === value
      );
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
          // window.alert(`${key}: ${object1[key]} ${object2[key]} 不符`);
          setMatch(false);
          return false;
        }
      }
      // window.alert("符合");
      setMatch(true);
      return true;
    }

    shallowEqual(
      getNonUnlimitedKey(getTrueKey(roommatesConditions), "unlimited"),
      userAsRoommate.userAsRoommatesConditions
    ); // => true
  }
  useEffect(() => {
    function findObjectKeys() {
      console.log(roommatesConditions);
      let keys = Object.keys(roommatesConditions);
      console.log(keys);
      setKeys(keys);
      // console.log()
    }
    if (roommatesConditions?.roommatesConditions) {
      findObjectKeys();
    }
  }, [roommatesConditions]);
  return (
    <Wrapper>
      <Hr style={{ margin: "40px 0px" }} />

      <SubTitle style={{ marginBottom: "32px" }}>室友條件</SubTitle>

      <Conditions>
        {keys &&
          roommatesConditions &&
          roommatesConditionFormGroups.map((el, index) => (
            <ConditionArea key={`roommatesCondition${index}`}>
              <Label>{el.label}</Label>
              <Condition>
                {el.options
                  ? (el.options.filter((o) => {
                      return (
                        o.value ===
                        roommatesConditions[el.key as keyof typeof keys]
                      );
                    })[0]?.text as string)
                  : ""}
              </Condition>
            </ConditionArea>
          ))}
      </Conditions>
      <SubmitBtn onClick={() => checkMatch()}>比對</SubmitBtn>
    </Wrapper>
  );
}

export default RoommatesCondition;
