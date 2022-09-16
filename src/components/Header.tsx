import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 20vh;
  margin: auto;
`;

const Title = styled.div`
  font-size: 30px;
`;
const SectionWrapper = styled.div``;
const LogoImg = styled.div``;
const LogoText = styled.div``;
const NavBtn = styled.div``;
const SignInBtn = styled(Link);
const LogoutBtn = styled.div``;
// const Notification = styled.div``;
function Header() {
  return (
    <Wrapper>
      <Title>Header</Title>
    </Wrapper>
  );
}

export default Header;
