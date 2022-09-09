import React, { useState, useRef } from 'react';
import styled from 'styled-components';
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
function Footer() {
  return (
    <Wrapper>
      <Title>Footer</Title>
    </Wrapper>
  );
}

export default Footer;
