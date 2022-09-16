import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Logo from '../assets/logo.png';
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 0px 40px;
`;

const Title = styled.div`
  font-size: 30px;
`;
const SectionWrapper = styled.div`
  display: flex;
`;
const LogoWrapper = styled(Link)`
  display: flex;
`;
const LogoImg = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${Logo});
  background-size: 40px 40px;
`;
const LogoText = styled.div``;
const NavBtn = styled.div``;
const SignInBtn = styled(Link);
const LogoutBtn = styled.div``;
// const Notification = styled.div``;
function Header() {
  return (
    <Wrapper>
      <LogoWrapper to={'./'}>
        <LogoImg />
      </LogoWrapper>
      <SectionWrapper></SectionWrapper>
    </Wrapper>
  );
}

export default Header;
