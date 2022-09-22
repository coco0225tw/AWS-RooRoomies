import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import styled from 'styled-components';
import roommatesConditionType from '../../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import { firebase } from '../../../utils/firebase';
import Hr from '../../../components/Hr';
import { BtnDiv } from '../../../components/Button';
import { Title } from '../../../components/ProfileTitle';
import {
  FormLegend,
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheck,
  FormCheckLabel,
  FormControl,
} from '../../../components/InputArea';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 70%;
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
    label: '性別',
    key: 'gender',
    options: [
      {
        label: 'female',
        text: '女',
        value: 'female',
      },
      {
        label: 'male',
        text: '男',
        value: 'male',
      },
      {
        label: 'unlimited',
        text: '其他',
        value: 'unlimited',
      },
    ],
  },
  {
    label: '是否會帶朋友過夜',
    key: 'bringFriendToStay',
    options: [
      {
        label: 'true',
        text: '會',
        value: 'true',
      },
      {
        label: 'false',
        text: '不會',
        value: 'false',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
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
        label: 'bad',
        text: '不好',
        value: 'bad',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
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
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
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
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '是否養寵物',
    key: 'pet',
    options: [
      {
        label: 'true',
        text: '有',
        value: 'true',
      },
      {
        label: 'false',
        text: '無',
        value: 'false',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '是否抽菸',
    key: 'smoke',
    options: [
      {
        label: 'true',
        text: '有',
        value: 'true',
      },
      {
        label: 'false',
        text: '無',
        value: 'false',
      },
      //   {
      //     label: 'unlimited',
      //     text: '不限',
      //     value: 'unlimited',
      //   },
    ],
  },
  {
    label: '職業類別',
    key: 'career',
  },
];

const SubmitBtn = styled(BtnDiv)`
  border: solid 1px #4f5152;
  align-self: flex-end;
  margin-top: 20px;
`;
function AboutMe() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const userAsRoommate = useSelector((state: RootState) => state.UserAsRoommateReducer);

  const initialRoommatesState = userAsRoommate
    ? userAsRoommate.userAsRoommatesConditions
    : {
        gender: '',
        bringFriendToStay: '',
        hygiene: '',
        livingHabit: '',
        genderFriendly: '',
        pet: '',
        smoke: '',
        career: '',
      };

  const [meAsRoommatesState, setMeAsRoommatesState] = useState<any>(initialRoommatesState);
  async function submit(meAsRoommatesState: roommatesConditionType) {
    // 先檢查有沒有預約的時間
    // 要做popup
    // dispatch({ type: 'UPLOAD_MEASROOMMATE', payload: { meAsRoommatesState } });
    // await firebase.updateUserAsRoommate(userInfo.uid, meAsRoommatesState);
  }
  return (
    <Wrapper>
      <Title>關於我</Title>
      <Hr />
      {roommatesConditionFormGroups.map(({ label, key, options }) => (
        <FormGroup key={key}>
          <FormLabel>{label}</FormLabel>
          <FormInputWrapper>
            {options ? (
              options.map((option) => (
                <FormCheck key={option.value}>
                  {initialRoommatesState && initialRoommatesState[key] === option.value ? (
                    <>
                      <FormCheckInput
                        // checked
                        defaultChecked
                        onChange={(e) => {
                          if (e.target.checked) setMeAsRoommatesState({ ...meAsRoommatesState, [key]: option.value });
                        }}
                        type="radio"
                        name={label}
                        value={option.value || ''}
                      />
                      <FormCheckLabel>{option.text}</FormCheckLabel>
                    </>
                  ) : (
                    <>
                      <FormCheckInput
                        onChange={(e) => {
                          if (e.target.checked) setMeAsRoommatesState({ ...meAsRoommatesState, [key]: option.value });
                        }}
                        type="radio"
                        value={option.value || ''}
                        name={label}
                      />
                      <FormCheckLabel>{option.text}</FormCheckLabel>
                    </>
                  )}
                </FormCheck>
              ))
            ) : (
              <FormControl />
            )}
          </FormInputWrapper>
        </FormGroup>
      ))}
      <SubmitBtn onClick={() => submit(meAsRoommatesState!)}>儲存變更</SubmitBtn>
      {/* <SubmitBtn onClick={() => submit(meAsRoommatesState!)}>送出</SubmitBtn> */}
      {/* <SubmitBtn>下一頁</SubmitBtn> */}
    </Wrapper>
  );
}

export default AboutMe;
