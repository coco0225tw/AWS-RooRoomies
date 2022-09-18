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
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: flex-start;
  width: 80%;
  height: 100%;
  margin: auto;
  margin-top: 80px;
  padding: 20px 0px;
  overflow: hidden;
  position: relative;
  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

const SideBarWrapper = styled.div<{ isShowTab: boolean }>`
  width: 28%;
  padding: 20px;
  display: inline-block;
  background-color: #f3f2ef;
  border-radius: 12px;
  ${(props) => (props.isShowTab ? null : 'transform: translateX(calc(-100% + 10px))')};
  transition-duration: 0.2s;
  @media screen and (max-width: 960px) {
    width: 40%;
  }
  @media screen and (max-width: 425px) {
    width: 100%;
    // ${(props) => (props.isShowTab ? 'width: 60%' : 'width: 100%')};
  }
`;
// <{ isShowTab: boolean }>
const SectionWrapper = styled.div<{ isShowTab: boolean }>`
  display: inline-block;
  ${(props) => (props.isShowTab ? 'width: 72%' : 'width: 100%')};
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.2s;
  z-index: -1;
  @media screen and (max-width: 960px) {
    ${(props) => (props.isShowTab ? 'width: 60%' : 'width: 100%')};
  }
  @media screen and (max-width: 425px) {
    width: 100%;
    // ${(props) => (props.isShowTab ? 'width: 100%' : 'width: 60%')};
  }
`;
function Profile() {
  const dispatch = useDispatch();
  const [showTab, setShowTab] = useState<boolean>(true);
  const getTab = useSelector((state: RootState) => state.SelectTabReducer);
  const tab = getTab.tab;
  // console.log(getTab);
  return (
    <Wrapper>
      <SideBarWrapper isShowTab={showTab}>
        <SideBarTab showTab={showTab} setShowTab={setShowTab} />
      </SideBarWrapper>
      <SectionWrapper isShowTab={showTab}>
        {getTab.tab === 'aboutMe' && <AboutMe />}
        {getTab.tab === 'allHouseHunting' && <AllHouseHunting />}
        {getTab.tab === 'compareList' && <CompareList />}
        {getTab.tab === 'followedList' && <FollowedList />}
        {getTab.tab === 'uploadMyListing' && <UploadMyListing />}
        {getTab.tab === 'setting' && <Setting />}
      </SectionWrapper>
    </Wrapper>
  );
}

export default Profile;
