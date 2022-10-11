import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { RootState } from '../../redux/rootReducer';
import { PopupComponent } from '../../components/Popup';

import UploadMyListing from './UploadMyListing/UploadMyListing';
import Setting from './Setting/Setting';
import FollowedList from './FollowedList/FollowedList';
import AllHouseHunting from './AllHouseHunting/AllHouseHunting';
import AboutMe from './AboutMe/AboutMe';
import SideBarTab from './SideBarTab';
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  margin: 80px auto;
  padding: 20px 0px;
  flex-grow: 1;
  height: 100%;
  position: relative;
  align-items: flex-start;
`;

const SideBarWrapper = styled.div<{ isShowTab: boolean }>`
  width: 28%;
  padding: 20px;
  background-color: #f3f2ef;
  border-radius: 12px;
  ${(props) => !props.isShowTab && 'display: none'};
  transition-duration: 0.2s;
  @media screen and (max-width: 960px) {
    width: 40%;
  }
  @media screen and (max-width: 425px) {
    position: absolute;
    width: 100%;
  }
`;
const SectionWrapper = styled.div<{ isShowTab: boolean }>`
  transition: 0.2s;
  flex-grow: 1;
  width: 100%;
  align-self: flex-start;
  @media screen and (max-width: 960px) {
    ${(props) => (props.isShowTab ? 'width: 60%' : 'width: 100%')};
  }
  @media screen and (max-width: 425px) {
    top: 0;
    ${(props) => (props.isShowTab ? 'width: 100%' : 'width: 60%')};
  }
`;

const Arrow = styled.div<{ isShowTab: boolean; windowState: boolean }>`
  left: 0px;
  background-color: #f3f2ef;
  height: 50px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 20px;
  line-height: 50px;
  transition-duration: 0.2s;
  &:hover {
    color: #f3f2ef;
    background-color: #4f5152;
  }
`;
const ArrowWrap = styled.div`
  color: inherit;
`;
function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getTab = useSelector((state: RootState) => state.SelectTabReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [loading, setLoading] = useState(false);
  const [windowState, setWindowState] = useState<boolean>(false);
  const [showTab, setShowTab] = useState<boolean>(true);
  const [isShown, setIsShown] = useState<boolean>(false);

  function clickClose() {
    setIsShown(false);
    navigate('/');
  }
  function clickFunction() {
    navigate('/signin');
  }
  useEffect(() => {
    if (!authChange) {
      navigate('/signin');
    }
  }, [authChange]);
  return (
    <Wrapper>
      {!authChange && isShown ? (
        <PopupComponent
          msg={`請先進行\n登入註冊`}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={clickClose}
          clickFunction={clickFunction}
        />
      ) : (
        <React.Fragment>
          <SideBarWrapper isShowTab={showTab}>
            <SideBarTab showTab={showTab} setShowTab={setShowTab} setLoading={setLoading} loading={loading} />
          </SideBarWrapper>
          <Arrow
            windowState={windowState}
            isShowTab={showTab}
            onClick={() => (showTab ? setShowTab(false) : setShowTab(true))}
          >
            {showTab ? <ArrowWrap>&#171;</ArrowWrap> : <ArrowWrap>&#187;</ArrowWrap>}
          </Arrow>
          <SectionWrapper isShowTab={showTab}>
            {getTab === 'aboutMe' && <AboutMe setLoading={setLoading} loading={loading} />}
            {getTab === 'allHouseHunting' && <AllHouseHunting setLoading={setLoading} loading={loading} />}
            {getTab === 'followedList' && <FollowedList setLoading={setLoading} loading={loading} />}
            {getTab === 'uploadMyListing' && <UploadMyListing setLoading={setLoading} loading={loading} />}
            {getTab === 'setting' && <Setting setLoading={setLoading} loading={loading} />}
          </SectionWrapper>
        </React.Fragment>
      )}
    </Wrapper>
  );
}

export default Profile;
