import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../../redux/rootReducer";
import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from "../../../components/InputArea";
import { BtnDiv } from "../../../components/Button";
import roommatesConditionType from "../../../redux/UploadRoommatesCondition/UploadRoommatesConditionType";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 100%;
  height: 100%;
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
];

const SubmitBtn = styled(BtnDiv)`
  margin-top: 20px;
  align-self: flex-end;
`;
function RoommatesCondition({
  setClickTab,
}: {
  setClickTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const roommatesConditionsInfo = useSelector(
    (state: RootState) => state.UploadRoommatesConditionReducer
  );
  const initialRoommatesState = roommatesConditionsInfo;

  const [roommatesState, setRoommatesStateState] =
    useState<roommatesConditionType>(initialRoommatesState);
  function submit(roommatesState: roommatesConditionType) {
    dispatch({
      type: "UPLOAD_ROOMMATESCONDITION",
      payload: { roommatesState },
    });
  }
  return (
    <Wrapper>
      {roommatesConditionFormGroups.map(({ label, key, options }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormInputWrapper>
            {options ? (
              options.map((option) => (
                <FormCheck key={option.value}>
                  {initialRoommatesState &&
                  initialRoommatesState[key as keyof roommatesConditionType] ===
                    option.value ? (
                    <FormCheckInput
                      defaultChecked
                      onChange={(e) => {
                        if (e.target.checked)
                          setRoommatesStateState({
                            ...roommatesState,
                            [key]: option.value,
                          });
                      }}
                      type="radio"
                      name={label}
                    />
                  ) : (
                    <FormCheckInput
                      onChange={(e) => {
                        if (e.target.checked)
                          setRoommatesStateState({
                            ...roommatesState,
                            [key]: option.value,
                          });
                      }}
                      type="radio"
                      value={option.value || ""}
                      name={label}
                    />
                  )}
                  <FormCheckLabel>{option.text}</FormCheckLabel>
                </FormCheck>
              ))
            ) : (
              <FormControl />
            )}
          </FormInputWrapper>
        </FormGroup>
      ))}
      <SubmitBtn
        onClick={() => {
          submit(roommatesState!);
          setClickTab("設施");
        }}
      >
        儲存
      </SubmitBtn>
    </Wrapper>
  );
}

export default RoommatesCondition;
