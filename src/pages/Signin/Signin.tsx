import React, { useEffect, useState, useContext, useRef } from 'react';
// import ProfileLogin from "./ProfileLogin";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { keyframes } from 'styled-components';

import { firebase, auth, onAuthStateChanged } from '../../utils/firebase';

interface IsActiveBtnProps {
  $isActive: boolean;
}
const showInfoInputAni = keyframes`
 0% { height: 0; opacity: 0 ;}
 100% { height: 100%; opacity: 1; }
`;
const Wrapper = styled.div`
  // padding: 130px 0px;
  margin: 80px auto;
  flex-grow: 1;
  ${'' /* border: solid 5px brown; */}
  width: 960px;
  @media screen and (max-width: 1279px) {
    width: 100vw;
  }
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
  width: 50vw;
  ${'' /* padding: 10px; */}
  padding: 0px 30px;
  justify-content: space-between;
  animation-name: ${showInfoInputAni};
  animation-duration: 1s;
  animation-iteration-count: 1;
  @media screen and (max-width: 1279px) {
    width: 100%;
    padding: 0px 15px;

    flex-direction: column;
  }
`;

const Form = styled.form.attrs({})`
  display: flex;
  flex-direction: column;
  justify-content: start;
  border: solid 1px #82542b;
  align-items: center;
  width: 100%;
`;
const FormLabel = styled.label`
  line-height: 19px;
  font-size: 18px;
  color: #3f3a3a;
  display: block;

  @media screen and (max-width: 1279px) {
    margin-bottom: 4px;
    align-self: start;
    ${'' /* font-size: 14px; */}
  }
`;
const FormInput = styled.input.attrs((props) => ({
  // type: props.id.includes("Picture")
  //   ? "file"
  //   : props.id.includes("Password")
  //   ? "password"
  //   : "text",
  // ${props.id.includes("Password") && 'autocomplete: off'}
}))`
  margin-left: 20px;
  height: 40px;
  border-radius: 6px;
  text-indent: 6px;
  width: 80%;
  font-size: 18px;
  @media screen and (max-width: 1279px) {
    margin-left: 0px;
    width: 100%;
    ${'' /* height: 26px; */}
  }
`;

const SubmitBtn = styled.div`
  border: solid 1px #82542b;
  border-radius: 6px;
  background-color: #ffffff;
  padding: 8px 20px;
  color: #82542b;
  margin: 20px 0px 20px;
  cursor: pointer;
  transition-duration: 0.2s;
  font-size: 20px;
  &:hover {
    background-color: #82542b;
    color: #ffffff;
  }
`;

const SwitchBtns = styled.div`
  width: 100%;
`;
const SwitchBtn = styled.div<IsActiveBtnProps>`
  box-sizing: border-box;
  display: inline-block;
  width: 50%;
  padding: 10px;

  text-align: center;
  cursor: pointer;
  transition-duration: 0.2s;
  background-color: ${(props) => (props.$isActive ? '#8b572a' : '#ffffff')};
`;

const LoginOptionGroup = ['登入', '建立新帳號'];
const registerFormGroup = [
  { label: '使用者名稱', key: 'regName' },
  { label: '信箱', key: 'regEmail' },
  { label: '密碼', key: 'regPassword' },
  { label: '上傳使用者照片', key: 'regPicture' },
];
const signInFormGroup = [
  { label: '信箱', key: 'signInEmail' },
  { label: '密碼', key: 'signInPassword' },
];
const FormGroups = [signInFormGroup, registerFormGroup];

const submitBtnGroups = ['登入', '註冊', '登出'];

function SignIn() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as User);
    });
  }, []);
  interface User {
    email: string;
  }
  interface regInfoType {
    regEmail: string;
    regPassword: string;
  }
  interface signInInfoType {
    signInEmail: string;
    signInPassword: string;
  }

  const initialRegInfo = { regEmail: '', regPassword: '' };

  const initialSignInInfo = { signInEmail: '', signInPassword: '' };

  const regInfoRef = useRef<HTMLInputElement[]>([]);
  const signInInfoRef = useRef<HTMLInputElement[]>([]);

  const [regInfo, setRegInfo] = useState<regInfoType>(initialRegInfo);
  const [signInInfo, setSignInInfo] = useState<signInInfoType>(initialSignInInfo);

  const regSubmit = async function () {
    setRegInfo({ regEmail: regInfoRef.current[1].value, regPassword: regInfoRef.current[2].value });
    let newUser = await firebase.createNewUser(regInfoRef.current[1].value, regInfoRef.current[2].value);
    await firebase.setNewUserDocField(
      newUser?.user.uid as string,
      regInfoRef.current[1].value,
      regInfoRef.current[0].value,
      regInfoRef.current[3].files![0]
    );
  };
  const signInSubmit = async function () {
    setSignInInfo({ signInEmail: signInInfoRef.current[0].value, signInPassword: signInInfoRef.current[1].value });
    let newUser = await firebase.signInUser(signInInfoRef.current[0]!.value, signInInfoRef.current[1]!.value);
    console.log('登入');
  };

  const handleLogout = async function () {
    await firebase.signOutUser();
    console.log('登出');
  };

  async function getProfile() {
    let jwtToken = window.localStorage.getItem('Authorization'); //之後要打開
  }

  const validationForInput = {
    validRegEmail: /(^\S[a-zA-Z0-9_.+-]+)\S@\S(\S[\Da-zA-Z])+\.(\S[\Da-zA-Z])+\S$/,
    validRegName: /\s*[\u4e00-\u9FFFa-zA-Z]+\s*/,
    validRegPassword: /(\S[a-zA-Z0-9_.+-]*)(\d\-*)*$/,
    validRegConfirm_Password: /(\S[a-zA-Z0-9_.+-]*)(\d\-*)*$/,
    validUserEmail: /(^\S[a-zA-Z0-9_.+-]+)\S@\S(\S[\Da-zA-Z])+\.(\S[\Da-zA-Z])+\S$/,
    validUserPassword: /(\S[a-zA-Z0-9_.+-]*)(\d\-*)*$/,
  };

  return (
    <Wrapper>
      <Form>
        <div>現在登入的人：{user?.email}</div>
        <h1>登入</h1>
        {signInFormGroup.map(({ label, key }, index) => (
          <FormGroup key={key}>
            <FormLabel>{label}</FormLabel>
            <FormInput ref={(el) => ((signInInfoRef.current[index] as any) = el)}></FormInput>
          </FormGroup>
        ))}
        <SubmitBtn onClick={() => signInSubmit()}>登入</SubmitBtn>
        <h1>註冊</h1>
        {registerFormGroup.map(({ label, key }, index) => (
          <FormGroup key={key}>
            <FormLabel>{label}</FormLabel>

            {key.includes('Picture') ? (
              <FormInput type="file" ref={(el) => ((regInfoRef.current[index] as any) = el)}></FormInput>
            ) : (
              <FormInput ref={(el) => ((regInfoRef.current[index] as any) = el)}></FormInput>
            )}
          </FormGroup>
        ))}
        <SubmitBtn onClick={() => regSubmit()}>註冊</SubmitBtn>
      </Form>
      <SubmitBtn onClick={() => handleLogout()}>登出</SubmitBtn>
    </Wrapper>
  );
}

export default SignIn;
