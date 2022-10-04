import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../redux/rootReducer";
import { firebase } from "../utils/firebase";
import { BtnLink, BtnDiv } from "./Button";
import { PopupComponent } from "./Popup";

import Logo from "../assets/logo.png";
import search from "../assets/search.svg";
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0px 40px;
  position: fixed;
  background-color: #f3f2ef;
  z-index: 4;
  top: 0;
  // margin-bottom: 80px;
  // @media screen and (max-width: 960px) {
  //   background-color: white;
  // }
  @media screen and (max-width: 960px) {
  }
`;

const Title = styled.div`
  font-size: 30px;
`;
const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 160px;
  justify-content: space-between;
  @media screen and (max-width: 960px) {
    display: none;
  }
`;
const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
`;
const LogoImg = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${Logo});
  background-size: 40px 40px;
`;
const LogoText = styled.div`
  font-size: 32px;
  letter-spacing: 8px;
  color: #4f5152;
  // margin-left: 20px;
  @media screen and (max-width: 960px) {
    font-size: 28px;
  }
`;

const Profile = styled(Link)<{ img: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  // border: solid 1px #857c7c;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-position: center center;
  background-color: white;
`;

const Notification = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: solid 1px #857c7c;
`;
const BtnLinkRwd = styled(BtnLink)`
  display: block;
  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const Search = styled.div`
  background-image: url(${search});
  width: 40px;
  height: 40px;
  background-size: 40px 40px;
  background-position: cover;
  display: none;
  cursor: pointer;
  @media screen and (max-width: 960px) {
    display: block;
  }
`;
function Header() {
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [isShown, setIsShown] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function clickSingOut() {
    setIsShown(true);
  }
  function clickClose() {
    setIsShown(false);
  }
  async function logOut() {
    firebase.signOutUser().then(() => {
      dispatch({
        type: "OPEN_NOTIFY_ALERT",
        payload: {
          alertMessage: "已登出",
        },
      });
      setTimeout(() => {
        dispatch({
          type: "CLOSE_ALERT",
        });
      }, 3000);
      setIsShown(false);
      navigate("/signin");
    });
  }
  return (
    <Wrapper>
      {isShown && (
        <PopupComponent
          msg={`確定要登出嗎?`}
          notDefaultBtn={`取消`}
          defaultBtn={`登出`}
          clickClose={clickClose}
          clickFunction={logOut}
        />
      )}

      <LogoWrapper to={"./"}>
        {/* <LogoImg /> */}
        <LogoText>rooroomies</LogoText>
      </LogoWrapper>
      <Search />
      {authChange ? (
        <SectionWrapper>
          {/* <Notification></Notification> */}
          <Profile
            to={"/profile"}
            img={userInfo.image}
            onClick={() => {
              dispatch({
                type: "SELECT_TYPE",
                payload: { tab: "aboutMe" },
              });
            }}
          ></Profile>
          <BtnDiv onClick={clickSingOut}>登出</BtnDiv>
        </SectionWrapper>
      ) : (
        <BtnLinkRwd to={"/signin"}>登入/註冊</BtnLinkRwd>
      )}
    </Wrapper>
  );
}

export default Header;
