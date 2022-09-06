import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import firebase from '../../utils/firebase';
import UploadMyListing from './UploadMyListing/UploadMyListing';
import SideBarTab from './SideBarTab';
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 100%;
  margin: auto;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
function Profile() {
  return (
    <Wrapper>
      <SideBarWrapper>
        <SideBarTab />
      </SideBarWrapper>

      <UploadMyListing />
    </Wrapper>
  );
}

export default Profile;
