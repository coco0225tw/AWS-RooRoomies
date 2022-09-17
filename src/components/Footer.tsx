import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { firebase, auth, onAuthStateChanged } from '../utils/firebase';
import { RootState } from '../redux/rootReducer';
import { BtnLink, BtnDiv } from './Button';
import Popup from './Popup';
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  margin: auto;
  background-color: #f3f2ef;
  flex-shrink: 0;
  @media screen and (max-width: 960px) {
    position: fixed;
    bottom: 0px;
  }
`;
const SectionWrapper = styled.div`
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  display: none;
  @media screen and (max-width: 960px) {
    display: flex;
  }
`;
const Title = styled.div`
  font-size: 16px;
  text-align: center;
  @media screen and (max-width: 960px) {
    display: none;
  }
`;
const Profile = styled(Link)<{ img: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: solid 1px #857c7c;
  background-image: url(${(props) => props.img});
  background-size: 40px 40px;
  background-position: cover;
  @media screen and (max-width: 960px) {
    width: 48px;
    height: 48px;
    background-size: 48px 48px;
  }
`;

const Notification = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: solid 1px #857c7c;
  @media screen and (max-width: 960px) {
    width: 48px;
    height: 48px;
    background-size: 48px 48px;
  }
`;
const BtnLinkRwd = styled(BtnLink)`
  display: none;
  font-size: 28px;
  @media screen and (max-width: 960px) {
    display: block;
  }
`;
function Footer() {
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [isShown, setIsShown] = useState<boolean>(false);
  const navigate = useNavigate();
  function clickSingOut() {
    console.log('signout');
    setIsShown(true);
  }
  function clickClose() {
    setIsShown(false);
  }
  async function logOut() {
    await firebase.signOutUser();
    setIsShown(false);
    navigate('/signin');
  }
  return (
    <Wrapper>
      {isShown && (
        <Popup
          msg={`確定要登出嗎?`}
          notDefaultBtn={`取消`}
          defaultBtn={`登出`}
          clickClose={clickClose}
          clickFunction={logOut}
        />
      )}
      <Title>©rooroomies 2022</Title>
      {authChange ? (
        <SectionWrapper>
          <Notification></Notification>
          <Profile to={'/profile'} img={userInfo.image}></Profile>
          {/* <BtnDiv onClick={clickSingOut}>登出</BtnDiv> */}
        </SectionWrapper>
      ) : (
        <SectionWrapper>
          <BtnLinkRwd to={'/signin'}>登入/註冊</BtnLinkRwd>
        </SectionWrapper>
      )}
    </Wrapper>
  );
}

export default Footer;
