import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { keyframes } from "styled-components";
import { RootState } from "../../redux/rootReducer";

import { firebase, auth, onAuthStateChanged } from "../../utils/firebase";
import {
  FormGroup,
  FormLabel,
  FormInputWrapper,
  FormControl,
} from "../../components/InputArea";
import { BtnDiv } from "../../components/Button";
import loginPage from "../../assets/loginPage.png";
import userDefaultPic from "../../assets/user2.png";

interface IsActiveBtnProps {
  $isActive: boolean;
}

const Wrapper = styled.div`
  flex-grow: 1;
  background-image: url(${loginPage});
  width: 100%;
  height: calc(100vh - 80px);
  background-size: cover;
  background-position: right;
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
`;

const Form = styled.form.attrs({})`
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
`;

const FormInput = styled.input`
  margin-left: 20px;
  height: 40px;
  border-radius: 6px;
  text-indent: 6px;
  width: 80%;
  font-size: 18px;
  @media screen and (max-width: 1279px) {
    margin-left: 0px;
    width: 100%;
  }
`;

const FormControlFullWidth = styled(FormControl)`
  width: 100%;
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
const SwitchBtn = styled(BtnDiv)<IsActiveBtnProps>`
  box-sizing: border-box;
  display: inline-block;
  width: 50%;
  padding: 10px;
  border: none;
  text-align: center;
  cursor: pointer;
  transition-duration: 0.2s;
  color: ${(props) => (props.$isActive ? "#fff7f4 " : "#4f5152")};
  background-color: ${(props) => (props.$isActive ? "#c77155 " : "#ffffff")};
  &:hover {
    color: ${(props) => (props.$isActive ? "#c77155 " : "ece2d5")};
    background-color: ${(props) => (props.$isActive ? "#fff7f4 " : "#ece2d5")};
  }
`;

const LoginOptionGroup = ["登入", "建立新帳號"];
const registerFormGroup = [
  { label: "使用者名稱", key: "regName" },
  { label: "信箱", key: "regEmail" },
  { label: "密碼", key: "regPassword" },
];
const signInFormGroup = [
  { label: "信箱", key: "signInEmail" },
  { label: "密碼", key: "signInPassword" },
];

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);
  const [user, setUser] = useState<User>();

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

  const initialRegInfo = { regEmail: "", regPassword: "" };

  const initialSignInInfo = { signInEmail: "", signInPassword: "" };

  const regInfoRef = useRef<HTMLInputElement[]>([]);
  const signInInfoRef = useRef<HTMLInputElement[]>([]);

  const [regInfo, setRegInfo] = useState<regInfoType>(initialRegInfo);
  const [signInInfo, setSignInInfo] =
    useState<signInInfoType>(initialSignInInfo);

  const regSubmit = async function () {
    setRegInfo({
      regEmail: regInfoRef.current[1].value,
      regPassword: regInfoRef.current[2].value,
    });
    let newUser = await firebase.createNewUser(
      regInfoRef.current[1].value,
      regInfoRef.current[2].value
    );
    firebase
      .setNewUserDocField(
        newUser?.user.uid as string,
        regInfoRef.current[1].value,
        regInfoRef.current[0].value,
        userDefaultPic
      )
      .then(() => {
        navigate("/");
        dispatch({
          type: "OPEN_SUCCESS_ALERT",
          payload: {
            alertMessage: "註冊成功",
          },
        });
        setTimeout(() => {
          dispatch({
            type: "CLOSE_ALERT",
          });
        }, 3000);
      });
  };
  const signInSubmit = async function () {
    setSignInInfo({
      signInEmail: signInInfoRef.current[0].value,
      signInPassword: signInInfoRef.current[1].value,
    });
    firebase
      .signInUser(
        signInInfoRef.current[0]!.value,
        signInInfoRef.current[1]!.value
      )
      .then(() => {
        navigate("/");
        dispatch({
          type: "OPEN_SUCCESS_ALERT",
          payload: {
            alertMessage: "登入成功",
          },
        });
        setTimeout(() => {
          dispatch({
            type: "CLOSE_ALERT",
          });
        }, 3000);
      });
  };

  useEffect(() => {
    if (authChange) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser as User);
      });
      navigate("/profile");
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
            <React.Fragment>
              {signInFormGroup.map(({ label, key }, index) => (
                <FormGroup
                  style={{ marginTop: "0px", marginBottom: "20px" }}
                  key={key}
                >
                  <FormLabel>{label}</FormLabel>
                  <FormInputWrapper>
                    <FormControlFullWidth
                      type={key.includes("Password") ? "password" : "input"}
                      ref={(el) => ((signInInfoRef.current[index] as any) = el)}
                    />
                  </FormInputWrapper>
                </FormGroup>
              ))}
              <BtnDiv onClick={() => signInSubmit()}>登入</BtnDiv>
            </React.Fragment>
          )}

          {activeOptionIndex === 1 && (
            <React.Fragment>
              {registerFormGroup.map(({ label, key }, index) => (
                <FormGroup
                  style={{ marginTop: "0px", marginBottom: "20px" }}
                  key={key}
                >
                  <FormLabel>{label}</FormLabel>
                  <FormInputWrapper>
                    <FormControlFullWidth
                      type={
                        key.includes("Password")
                          ? "password"
                          : key.includes("Picture")
                          ? "file"
                          : "input"
                      }
                      ref={(el) => ((regInfoRef.current[index] as any) = el)}
                    />
                  </FormInputWrapper>
                </FormGroup>
              ))}
              <BtnDiv onClick={() => regSubmit()}>註冊</BtnDiv>
            </React.Fragment>
          )}
        </FormWrapper>
      </Form>
    </Wrapper>
  );
}

export default SignIn;
