import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, SubmitHandler, RegisterOptions } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../../redux/rootReducer';
import { alertActionType } from '../../redux/Alert/AlertAction';

import { firebase, auth, onAuthStateChanged } from '../../utils/firebase';
import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormControl,
  ErrorText,
  LabelArea,
  StyledForm,
} from '../../components/InputArea';
import { BtnDiv, InputBtn } from '../../components/Button';
import loginPage from '../../assets/loginPage.png';
import userDefaultPic from '../../assets/user2.png';

interface IsActiveBtnProps {
  $isActive: boolean;
}

const Wrapper = styled.div`
  background-image: url(${loginPage});
  width: 100%;
  height: calc(100vh - 160px);
  background-size: cover;
  background-position: right;
  position: fixed;
  overflow-y: hidden;
  top: 80px;
  @media screen and (max-width: 1279px) {
    width: 100vw;
  }
`;
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 40px 28px;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  @media screen and (max-width: 960px) {
    /* padding-bottom: 40px; */
  }
`;

const Form = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: start;
  border-radius: 20px;
  align-items: center;
  width: 30vw;
  left: 50%;
  top: 20%;
  transition-duration: 0.2s;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  min-width: 300px;
  @media screen and (max-width: 1440px) {
    width: 45vw;
  }
  @media screen and (max-width: 960px) {
    transform: translateX(-50%);
  }
`;

const FormControlFullWidth = styled(FormControl)`
  width: 100%;
`;

const SwitchBtns = styled.div`
  width: 100%;
`;
const SwitchBtn = styled(BtnDiv)<IsActiveBtnProps>`
  box-sizing: border-box;
  display: inline-block;
  width: 50%;
  padding: 10px;
  border: none;
  text-align: center;
  cursor: pointer;
  transition-duration: 0.2s;
  color: ${(props) => (props.$isActive ? '#fff7f4 ' : '#4f5152')};
  background-color: ${(props) => (props.$isActive ? '#c77155 ' : '#ffffff')};
  &:hover {
    color: ${(props) => (props.$isActive ? '#c77155 ' : 'ece2d5')};
    background-color: ${(props) => (props.$isActive ? '#fff7f4 ' : '#ece2d5')};
  }
`;

const Text = styled.div`
  color: grey;
  font-size: 16px;
  letter-spacing: 1.2px;
  align-self: flex-end;
  border-bottom: solid 1px grey;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  @media screen and (max-width: 960px) {
    font-size: 12px;
    /* align-self: center; */
    transform: translateY(120%);
  }
`;

const RegForm = styled(StyledForm)``;
const SignInForm = styled(StyledForm)``;
const LoginOptionGroup = ['登入', '建立新帳號'];

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);
  interface signInType {
    signInEmail: string;
    signInPassword: string;
  }
  interface regType {
    regName: string;
    regPassword: string;
    regEmail: string;
  }
  const {
    register: registerSignIn,
    formState: { errors: errorsSignIn },
    handleSubmit: handleSignInSubmit,
  } = useForm<signInType>({
    mode: 'onBlur',
  });

  const {
    register: registerReg,
    formState: { errors: errorsReg },
    handleSubmit: handleRegSubmit,
  } = useForm<regType>({
    mode: 'onBlur',
  });
  const valid = {
    required: {
      value: true,
      message: '※必填欄位',
    },
    email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
  };
  const signInGroup = [
    {
      label: '信箱',
      key: 'signInEmail',
      required: valid.required,
      pattern: {
        value: valid.email,
        message: '※請輸入正確的信箱格式',
      },
    },
    {
      label: '密碼',
      key: 'signInPassword',
      required: valid.required,
    },
  ];
  const regGroup = [
    {
      label: '使用者名稱',
      key: 'regName',
      required: valid.required,
      minLength: {
        value: 2,
        message: '※至少2個字元',
      },
      maxLength: {
        value: 10,
        message: '※不可超過10個字元',
      },
    },
    {
      label: '信箱',
      key: 'regEmail',
      required: valid.required,
      pattern: {
        value: valid.email,
        message: '※請輸入正確的信箱格式',
      },
    },
    {
      label: '密碼',
      key: 'regPassword',
      required: valid.required,
      pattern: {
        value: /^([^0-9]*[^A-Z]*[^a-z]*[a-zA-Z0-9])$/,
        message: '※請輸入正確的密碼格式',
      },
      minLength: {
        value: 2,
        message: '※至少2個字元',
      },
      maxLength: {
        value: 10,
        message: '※不可超過10個字元',
      },
    },
  ];
  const testAccount = {
    account: process.env.REACT_APP_TEST_ACCOUNT,
    password: process.env.REACT_APP_TEST_PASSWORD,
  };
  const onSubmitReg = (regInfo: regType) => {
    regSubmit(regInfo);
  };
  const regSubmit = async function (regInfo: regType) {
    let newUser = await firebase.createNewUser(regInfo.regEmail, regInfo.regPassword);
    firebase
      .setNewUserDocField(newUser?.user.uid as string, regInfo.regEmail, regInfo.regName, userDefaultPic)
      .then(() => {
        navigate('/');
        dispatch({
          type: alertActionType.OPEN_SUCCESS_ALERT,
          payload: {
            alertMessage: '註冊成功',
          },
        });
        setTimeout(() => {
          dispatch({
            type: alertActionType.CLOSE_ALERT,
          });
        }, 3000);
      });
  };
  const onSubmitSignIn = (signInInfo: signInType) => {
    signInSubmit(signInInfo);
  };
  const signInSubmit = async function (signInInfo: signInType) {
    firebase.signInUser(signInInfo.signInEmail, signInInfo.signInPassword).then(() => {
      navigate('/');
      dispatch({
        type: alertActionType.OPEN_SUCCESS_ALERT,
        payload: {
          alertMessage: '登入成功',
        },
      });
      setTimeout(() => {
        dispatch({
          type: alertActionType.CLOSE_ALERT,
        });
      }, 3000);
    });
  };
  const signInWithTestAccount = async function () {
    firebase.signInUser(testAccount.account, testAccount.password).then(() => {
      navigate('/');
      dispatch({
        type: alertActionType.OPEN_SUCCESS_ALERT,
        payload: {
          alertMessage: '登入成功',
        },
      });
      setTimeout(() => {
        dispatch({
          type: alertActionType.CLOSE_ALERT,
        });
      }, 3000);
    });
  };

  useEffect(() => {
    if (authChange) {
      onAuthStateChanged(auth, (currentUser) => {});
      navigate('/profile');
    }
  }, [authChange]);
  return (
    <Wrapper>
      <Form>
        <SwitchBtns>
          {LoginOptionGroup.map((option, index) => (
            <SwitchBtn
              key={`switchBtn${index}`}
              $isActive={index === activeOptionIndex}
              onClick={() => {
                setActiveOptionIndex(index);
              }}
            >
              {option}
            </SwitchBtn>
          ))}
        </SwitchBtns>
        <FormWrapper>
          {activeOptionIndex === 0 && (
            <SignInForm onSubmit={handleSignInSubmit(onSubmitSignIn)}>
              {signInGroup.map((signIn) => (
                <FormGroup style={{ marginTop: '0px', marginBottom: '20px' }} key={signIn.key}>
                  <LabelArea>
                    <FormLabel htmlFor={signIn.key}>{signIn.label}</FormLabel>
                    <ErrorText>{errorsSignIn[signIn.key] && (errorsSignIn[signIn.key].message as string)}</ErrorText>
                  </LabelArea>
                  <FormInputWrapper>
                    <FormControlFullWidth
                      id={`${signIn.key}`}
                      type={signIn.key.includes('Password') ? 'password' : 'input'}
                      onKeyDown={(e) => {
                        if (e.key == ' ') {
                          e.preventDefault();
                        }
                      }}
                      {...registerSignIn(signIn.key as 'signInEmail' | 'signInPassword', {
                        required: signIn.required && signIn.required,
                        pattern: signIn.pattern && signIn.pattern,
                      })}
                      aria-invalid={errorsSignIn[signIn.key] ? 'true' : 'false'}
                    />
                  </FormInputWrapper>
                </FormGroup>
              ))}
              <Text onClick={() => signInWithTestAccount()}>用測試帳號登入</Text>
              <InputBtn value="送出" type="submit" />
            </SignInForm>
          )}

          {activeOptionIndex === 1 && (
            <RegForm onSubmit={handleRegSubmit(onSubmitReg)}>
              {regGroup.map((reg) => (
                <FormGroup style={{ marginTop: '0px', marginBottom: '20px' }} key={reg.key}>
                  <LabelArea>
                    <FormLabel htmlFor={reg.key}>{reg.label}</FormLabel>
                    <ErrorText>{errorsReg[reg.key] && (errorsReg[reg.key].message as string)}</ErrorText>
                  </LabelArea>
                  <FormInputWrapper>
                    <FormControlFullWidth
                      id={`${reg.key}`}
                      type={reg.key.includes('Password') ? 'password' : 'input'}
                      onKeyDown={(e) => {
                        if (e.key == ' ') {
                          e.preventDefault();
                        }
                      }}
                      {...registerReg(reg.key as 'regName' | 'regEmail' | 'regPassword', {
                        required: reg.required && reg.required,
                        pattern: reg.pattern && reg.pattern,
                        maxLength: reg.maxLength && reg.maxLength,
                        minLength: reg.minLength && reg.minLength,
                      })}
                      aria-invalid={errorsReg[reg.key] ? 'true' : 'false'}
                    />
                  </FormInputWrapper>
                </FormGroup>
              ))}
              <InputBtn value="送出" type="submit" />
            </RegForm>
          )}
        </FormWrapper>
      </Form>
    </Wrapper>
  );
}

export default SignIn;
