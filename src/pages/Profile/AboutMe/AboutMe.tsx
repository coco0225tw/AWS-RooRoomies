import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';

import { RootState } from '../../../redux/rootReducer';
import { alertActionType } from '../../../redux/Alert/AlertAction';
import { firebase } from '../../../utils/firebase';
import Hr from '../../../components/Hr';
import { Title } from '../../../components/ProfileTitle';
import { Loading } from '../../../components/Loading';
import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormCheckInput,
  FormCheckLabel,
  FormCheck,
  ErrorText,
  LabelArea,
  StyledForm,
} from '../../../components/InputArea';
import { SubmitBtn, BtnDiv } from '../../../components/Button';
import roommatesConditionType from '../../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';

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

const valid = {
  required: {
    value: true,
    message: '※必填欄位',
  },
};
const roommatesConditionFormGroups = [
  {
    label: '性別',
    key: 'gender',
    required: valid.required,
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
    required: valid.required,
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
    ],
  },
  {
    label: '衛生習慣',
    key: 'hygiene',
    required: valid.required,
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
    ],
  },
  {
    label: '生活習慣',
    key: 'livingHabit',
    required: valid.required,
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
    ],
  },
  {
    label: '性別友善',
    key: 'genderFriendly',
    required: valid.required,
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
    ],
  },
  {
    label: '是否養寵物',
    key: 'pet',
    required: valid.required,
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
    ],
  },
  {
    label: '是否抽菸',
    key: 'smoke',
    required: valid.required,
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
    ],
  },
];
interface optionsType {
  (options: { label: string; text: string; value: string }[]): JSX.Element[]; // or JSX.Element[]
}
interface optionType {
  label: string;
  text: string;
  value: string;
}
const CheckedFormCheckLabel = styled(FormCheckLabel)`
  cursor: pointer;
`;
const CheckedFormCheckInput = styled(FormCheckInput)<{ edit: boolean }>`
  &:checked + ${CheckedFormCheckLabel} {
    color: ${(props) => (props.edit ? '#c77155' : 'grey')};
  }
`;
const EditBtn = styled(BtnDiv)`
  align-self: flex-end;
  margin: 20px 12px 0px;
  display: inline-block;

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

  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const userAsRoommate = useSelector((state: RootState) => state.UserAsRoommateReducer);

  const [edit, setEdit] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [houseHuntingData, setHouseHuntingData] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    getValues,
    control,
  } = useForm();
  async function onSubmit(data) {
    setEdit(!edit);
    // submit(data);
    await submit(data);
  }
  async function submit(meAsRoommatesState: roommatesConditionType) {
    if (submitting) return;
    setSubmitting(true);
    firebase.updateUserAsRoommate(userInfo.uid, meAsRoommatesState).then(() => {
      dispatch({
        type: alertActionType.OPEN_SUCCESS_ALERT,
        payload: {
          alertMessage: '更新成功',
        },
      });
      setTimeout(() => {
        dispatch({
          type: alertActionType.CLOSE_ALERT,
        });
      }, 3000);
    });

    dispatch({
      type: 'UPLOAD_MEASROOMMATE',
      payload: { meAsRoommatesState: meAsRoommatesState },
    });
    setSubmitting(false);
  }
  useEffect(() => {
    async function getAllHouseHuntingData() {
      firebase.getAllHouseHunting(userInfo.uid).then((listing) => {
        let houseHuntingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        setLoading(true);
        if (listing.size === 0) {
          setHouseHuntingData(false);
        } else {
          setHouseHuntingData(true);
        }
      });
    }

    if (authChange) getAllHouseHuntingData();
  }, [authChange]);
  useEffect(() => {
    let defaultValues = userAsRoommate as roommatesConditionType;

    reset({ ...defaultValues });

    if (userAsRoommate) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [userAsRoommate]);

  return (
    <Wrapper>
      <Title
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        關於我
        <Span>
          {edit ? (
            <React.Fragment>
              <EditBtn
                onClick={() => {
                  setEdit(false);
                  let defaultValues = userAsRoommate as roommatesConditionType;

                  reset({ ...defaultValues });
                }}
              >
                取消
              </EditBtn>
              <SubmitBtn type="submit" value="儲存變更" form="aboutMeForm" style={{ transform: 'translateY(-4px)' }} />
            </React.Fragment>
          ) : (
            <EditBtn
              onClick={() => {
                if (!houseHuntingData) {
                  setEdit(true);
                } else {
                  dispatch({
                    type: alertActionType.OPEN_ERROR_ALERT,
                    payload: {
                      alertMessage: '已有湊團房源，無法更改',
                    },
                  });
                  setTimeout(() => {
                    dispatch({
                      type: alertActionType.CLOSE_ALERT,
                    });
                  }, 3000);
                }
              }}
            >
              編輯
            </EditBtn>
          )}
        </Span>
      </Title>
      <Hr />
      {loading ? (
        <Loading style={null} />
      ) : (
        <StyledForm id="aboutMeForm" onSubmit={handleSubmit(onSubmit)}>
          {roommatesConditionFormGroups.map(({ label, key, options, required }) => (
            <FormGroup key={key}>
              <LabelArea>
                <FormLabel>{label}</FormLabel>
                <ErrorText>{errors[key] && (errors[key].message as string)}</ErrorText>
              </LabelArea>
              <FormInputWrapper>
                <Controller
                  control={control}
                  name={key}
                  rules={{
                    required: required && required,
                  }}
                  render={({ field: { onChange, ...props } }) =>
                    (options as any).map((o: optionType, oIndex: number) => (
                      <FormCheck key={o.value}>
                        <React.Fragment>
                          <CheckedFormCheckInput
                            edit={edit}
                            id={key + o.value}
                            disabled={!edit}
                            name={label}
                            type="radio"
                            {...props}
                            value={key + o.value}
                            onChange={(e) => {
                              onChange(o.label);
                            }}
                            checked={getValues(key) === o.value}
                          />
                          <CheckedFormCheckLabel htmlFor={`${key + o.value}`}>{o.text}</CheckedFormCheckLabel>
                        </React.Fragment>
                      </FormCheck>
                    ))
                  }
                />
              </FormInputWrapper>
            </FormGroup>
          ))}
        </StyledForm>
      )}
    </Wrapper>
  );
}

export default AboutMe;
