import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/rootReducer";
import styled from "styled-components";
import roommatesConditionType from "../../../redux/UploadRoommatesCondition/UploadRoommatesConditionType";
import { firebase } from "../../../utils/firebase";
import Hr from "../../../components/Hr";
import { BtnDiv } from "../../../components/Button";
import { Title } from "../../../components/ProfileTitle";
import { Loading } from "../../../components/Loading";
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from "../../../components/InputArea";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 80%;
  height: 100%;
  color: #4f5152;
  margin-top: 20px;
`;

const FormText = styled.div`
  line-height: 19px;
  font-size: 16px;
  color: #8b572a;
  margin-top: 10px;
  width: 100%;
  text-align: right;
`;
const roommatesConditionFormGroups = [
  {
    label: "性別",
    key: "gender",
    options: [
      {
        label: "female",
        text: "女",
        value: "female",
      },
      {
        label: "male",
        text: "男",
        value: "male",
      },
      {
        label: "unlimited",
        text: "其他",
        value: "unlimited",
      },
    ],
  },
  {
    label: "是否會帶朋友過夜",
    key: "bringFriendToStay",
    options: [
      {
        label: "true",
        text: "會",
        value: "true",
      },
      {
        label: "false",
        text: "不會",
        value: "false",
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
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
        label: "bad",
        text: "不好",
        value: "bad",
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
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
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
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
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: "是否養寵物",
    key: "pet",
    options: [
      {
        label: "true",
        text: "有",
        value: "true",
      },
      {
        label: "false",
        text: "無",
        value: "false",
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: "是否抽菸",
    key: "smoke",
    options: [
      {
        label: "true",
        text: "有",
        value: "true",
      },
      {
        label: "false",
        text: "無",
        value: "false",
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  // {
  //   label: "職業類別",
  //   key: "career",
  // },
];
const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;

  // display: flex;
`;
const CheckedFormCheckInput = styled(FormCheckInput)<{ edit: boolean }>`
  // display: none;

  &:checked + ${CheckedFormCheckLabel} {
    // background: #c77155;
    color: ${(props) => (props.edit ? "#c77155" : "grey")};
    // color: #c77155;
  }
`;
const SubmitBtn = styled(BtnDiv)`
  border: solid 1px #4f5152;
  align-self: flex-end;
  margin-top: 20px;
  display: inline-block;
  margin-left: 12px;
  transform: translateY(-4px);
`;
const Span = styled.span`
  align-self: flex-end;
`;
function AboutMe({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const userAsRoommate = useSelector(
    (state: RootState) => state.UserAsRoommateReducer
  );
  const [edit, setEdit] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const initialRoommatesState = userAsRoommate.userAsRoommatesConditions
    ? userAsRoommate.userAsRoommatesConditions
    : {
        gender: "",
        bringFriendToStay: "",
        hygiene: "",
        livingHabit: "",
        genderFriendly: "",
        pet: "",
        smoke: "",
        // career: "",
      };
  console.log(userAsRoommate.userAsRoommatesConditions);
  const [meAsRoommatesState, setMeAsRoommatesState] = useState<any>(
    initialRoommatesState
  );
  async function submit(meAsRoommatesState: roommatesConditionType) {
    setSubmitting(true);
    firebase.updateUserAsRoommate(userInfo.uid, meAsRoommatesState).then(() => {
      dispatch({
        type: "UPLOAD_MEASROOMMATE",
        payload: { meAsRoommatesState },
      });
      dispatch({
        type: "OPEN_SUCCESS_ALERT",
        payload: {
          alertMessage: "更新成功",
        },
      });
      setTimeout(() => {
        dispatch({
          type: "CLOSE_ALERT",
        });
      }, 3000);
    });
    setSubmitting(false);
  }
  useEffect(() => {
    if (userAsRoommate.userAsRoommatesConditions)
      setMeAsRoommatesState(userAsRoommate.userAsRoommatesConditions);
  }, [userAsRoommate]);
  return (
    <Wrapper>
      <Title
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        關於我
        <Span>
          {edit ? (
            <React.Fragment>
              <SubmitBtn
                onClick={() => {
                  setEdit(false);
                  setMeAsRoommatesState(initialRoommatesState);
                }}
              >
                取消
              </SubmitBtn>
              <SubmitBtn
                onClick={() => {
                  if (!submitting) {
                    setEdit(false);
                    submit(meAsRoommatesState!);
                  }
                }}
              >
                儲存變更
              </SubmitBtn>
            </React.Fragment>
          ) : (
            <SubmitBtn onClick={() => setEdit(true)}>編輯</SubmitBtn>
          )}
        </Span>
      </Title>
      <Hr />
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          {roommatesConditionFormGroups.map(({ label, key, options }) => (
            <FormGroup key={key}>
              <FormLabel>{label}</FormLabel>
              <FormInputWrapper>
                {options.map((option) => (
                  <FormCheck key={option.value}>
                    {meAsRoommatesState[key] === option.value ? (
                      <React.Fragment>
                        <CheckedFormCheckInput
                          edit={edit}
                          id={key + option.value}
                          checked
                          disabled={!edit}
                          // defaultChecked
                          onChange={(e) => {
                            if (e.target.checked)
                              setMeAsRoommatesState({
                                ...meAsRoommatesState,
                                [key]: option.value,
                              });
                          }}
                          type="radio"
                          name={label}
                          value={option.value || ""}
                        />
                        <CheckedFormCheckLabel
                          // edit={!edit}
                          htmlFor={key + option.value}
                        >
                          {option.text}
                        </CheckedFormCheckLabel>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <CheckedFormCheckInput
                          id={key + option.value}
                          edit={edit}
                          disabled={!edit}
                          onChange={(e) => {
                            if (e.target.checked)
                              setMeAsRoommatesState({
                                ...meAsRoommatesState,
                                [key]: option.value,
                              });
                          }}
                          type="radio"
                          value={option.value || ""}
                          name={label}
                        />
                        <CheckedFormCheckLabel
                          // edit={edit}
                          htmlFor={key + option.value}
                        >
                          {option.text}
                        </CheckedFormCheckLabel>
                      </React.Fragment>
                    )}
                  </FormCheck>
                ))}
              </FormInputWrapper>
            </FormGroup>
          ))}
        </React.Fragment>
      )}
    </Wrapper>
  );
}

export default AboutMe;
