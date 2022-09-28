import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import UploadMyListing from "./UploadMyListing/UploadMyListing";
import Setting from "./Setting/Setting";
import FollowedList from "./FollowedList/FollowedList";
import CompareList from "./CompareList/CompareList";
import AllHouseHunting from "./AllHouseHunting/AllHouseHunting";
import AboutMe from "./AboutMe/AboutMe";
import SideBarTab from "./SideBarTab";
import { BtnDiv } from "../../components/Button";
import { PopupComponent, PopupImage } from "../../components/Popup";
import { useNavigate } from "react-router-dom";
const Wrapper = styled.div`
  display: flex;
  // display:
  flex-direction: row;
  // justify-content: center;
  // align-items: flex-start;
  width: 80%;
  // height: 100%;
  margin: 80px auto;
  padding: 20px 0px;
  // overflow-x: hidden;
  // overflow-y: visible;
  flex-grow: 1;
  height: 100%;
  position: relative;
  align-items: flex-start;
  // @media screen and (max-width: 960px) {
  //   width: 100%;
  // }
`;

const SideBarWrapper = styled.div<{ isShowTab: boolean }>`
  width: 28%;
  padding: 20px;
  // display: inline-block;
  background-color: #f3f2ef;
  border-radius: 12px;
  // ${(props) =>
    props.isShowTab ? null : "transform: translateX(calc(-100% + 10px))"};
  ${(props) => (props.isShowTab ? null : "display: none")};
  transition-duration: 0.2s;
  z-index: 2;
  @media screen and (max-width: 960px) {
    width: 40%;
  }
  @media screen and (max-width: 425px) {
    position: absolute;
    width: 100%;
    // ${(props) => (props.isShowTab ? "width: 60%" : "width: 100%")};
  }
`;
// <{ isShowTab: boolean }>
const SectionWrapper = styled.div<{ isShowTab: boolean }>`
  // display: inline-block;
  // ${(props) => (props.isShowTab ? "width: 72%" : "width: 100%")};
  // position: absolute;
  // right: 0;
  // top: 0;
  transition: 0.2s;
  // z-index: 2;
  flex-grow: 1;
  // width: 200%;
  width: 100%;
  align-self: flex-start;
  @media screen and (max-width: 960px) {
    ${(props) => (props.isShowTab ? "width: 60%" : "width: 100%")};
  }
  @media screen and (max-width: 425px) {
    // width: 100%;
    // position: absolute;
    top: 0;
    ${(props) => (props.isShowTab ? "width: 100%" : "width: 60%")};
  }
`;

const Arrow = styled.div<{ isShowTab: boolean; windowState: boolean }>`
  position: ${(props) => (props.isShowTab ? "static" : "absolute")};
  left: 0px;
  // transform: translateX(${(props) => (props.windowState ? "180%" : "200%")});
  // display: block !important;
  background-color: #f3f2ef;
  height: 50px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 20px;
  line-height: 50px;
  transition-duration: 0.2s;
  border: solid 1px #4f5152;
  z-index: 3;
  &:hover {
    color: #f3f2ef;
    background-color: #4f5152;
  }
`;
const ArrowWrap = styled.div`
  color: inherit;
`;
function Profile() {
  const [loading, setLoading] = useState(false);
  const [windowState, setWindowState] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [showTab, setShowTab] = useState<boolean>(true);
  const getTab = useSelector((state: RootState) => state.SelectTabReducer);
  const authChange = useSelector((state: RootState) => state.AuthChangeReducer);
  const [isShown, setIsShown] = useState<boolean>(false);
  const navigate = useNavigate();
  const tab = getTab.tab;
  function clickClose() {
    setIsShown(false);
    navigate("/");
  }
  function clickFunction() {
    navigate("/signin");
  }
  useEffect(() => {
    // console.log(authChange);
    // if (!authChange) {
    //   setIsShown(true);
    //   // navigate("/");
    // }
  }, []);
  return (
    <Wrapper>
      {!authChange && isShown ? (
        <PopupComponent
          // style={{ zIndex: '1' }}
          msg={`請先進行登入註冊`}
          notDefaultBtn={`取消`}
          defaultBtn={`登入`}
          clickClose={clickClose}
          clickFunction={clickFunction}
        />
      ) : (
        <React.Fragment>
          {" "}
          <SideBarWrapper isShowTab={showTab}>
            <SideBarTab
              showTab={showTab}
              setShowTab={setShowTab}
              setLoading={setLoading}
              loading={loading}
            />
          </SideBarWrapper>
          <Arrow
            windowState={windowState}
            isShowTab={showTab}
            onClick={() => (showTab ? setShowTab(false) : setShowTab(true))}
          >
            {showTab ? (
              <ArrowWrap>&#171;</ArrowWrap>
            ) : (
              <ArrowWrap>&#187;</ArrowWrap>
            )}
          </Arrow>
          <SectionWrapper isShowTab={showTab}>
            {getTab.tab === "aboutMe" && (
              <AboutMe setLoading={setLoading} loading={loading} />
            )}
            {getTab.tab === "allHouseHunting" && (
              <AllHouseHunting setLoading={setLoading} loading={loading} />
            )}
            {/* {getTab.tab === "compareList" && (
          <CompareList setLoading={setLoading} loading={loading} />
        )} */}
            {getTab.tab === "followedList" && (
              <FollowedList setLoading={setLoading} loading={loading} />
            )}
            {getTab.tab === "uploadMyListing" && (
              <UploadMyListing setLoading={setLoading} loading={loading} />
            )}
            {getTab.tab === "setting" && (
              <Setting setLoading={setLoading} loading={loading} />
            )}
          </SectionWrapper>
        </React.Fragment>
      )}
    </Wrapper>
  );
}

export default Profile;
