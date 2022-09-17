import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import UploadMyListing from './UploadMyListing/UploadMyListing';
import Setting from './Setting/Setting';
import FollowedList from './FollowedList/FollowedList';
import CompareList from './CompareList/CompareList';
import AllHouseHunting from './AllHouseHunting/AllHouseHunting';
import AboutMe from './AboutMe/AboutMe';
import SideBarTab from './SideBarTab';
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
  height: 100%;
  margin: auto;
  margin-top: 80px;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
function Profile() {
  const dispatch = useDispatch();
  const getTab = useSelector((state: RootState) => state.SelectTabReducer);
  const tab = getTab.tab;
  // console.log(getTab);
  return (
    <Wrapper>
      <SideBarWrapper>
        <SideBarTab />
      </SideBarWrapper>
      {getTab.tab === 'aboutMe' && <AboutMe />}
      {getTab.tab === 'allHouseHunting' && <AllHouseHunting />}
      {getTab.tab === 'compareList' && <CompareList />}
      {getTab.tab === 'followedList' && <FollowedList />}
      {getTab.tab === 'uploadMyListing' && <UploadMyListing />}
      {getTab.tab === 'setting' && <Setting />}
    </Wrapper>
  );
}

export default Profile;
