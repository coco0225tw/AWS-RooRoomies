import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { firebase } from "../../utils/firebase";
import { RootState } from "../../redux/rootReducer";
import { BtnDiv } from "../../components/Button";
import user from "../../assets/user.png";
import usero from "../../assets/usero.png";
import house from "../../assets/houseo.png";
import houseo from "../../assets/house.png";
import deadline from "../../assets/deadline.png";
import deadlineo from "../../assets/deadlineo.png";
import heart from "../../assets/unHeart.png";
import unHeart from "../../assets/heart.png";
import setting from "../../assets/settingso.png";
import settingo from "../../assets/settings.png";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  position: relative;
`;

const TabWrapper = styled.div<{ isChoose: boolean; isShowTab: boolean }>`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  cursor: pointer;
  align-items: center;
  padding: 8px;
  width: 100%;
  border-radius: 12px;
  color: ${(props) => (props.isChoose ? "#fff " : "#4f5152")};
  background-color: ${(props) => (props.isChoose ? "#c77155 " : "#ffffff")};
  transition-duration: 0.2s;
  &:hover {
    color: ${(props) => (props.isChoose ? "#fff " : "#4f5152")};
  }
`;
const Tab = styled.div<{ isShowTab: boolean; isChoose: boolean }>`
  font-size: 20px;
  letter-spacing: 4px;
  margin-left: 8px;
  color: inherit;
  &:hover {
  }
`;
const Img = styled.div<{
  img: string;
  isShowTab: boolean;
  oimg: string;
  isChoose: boolean;
}>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-image: url(${(props) =>
    props.isChoose ? props.oimg : props.img});
  background-position: center center;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-color: #f3f2ef;
  &:hover {
    background-image: url(${(props) => props.oimg});
  }
`;

const Arrow = styled.div<{ isShowTab: boolean; windowState: boolean }>`
  position: absolute;
  right: 0px;
  transform: translateX(${(props) => (props.windowState ? "180%" : "200%")});
  display: block !important;
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
function SideBarTab({
  showTab,
  setShowTab,
  setLoading,
  loading,
}: {
  showTab: boolean;
  setShowTab: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const dispatch = useDispatch();
  const getTab = useSelector((state: RootState) => state.SelectTabReducer);
  function clickTab(tabString: string) {
    const tab = {
      tab: tabString,
    };
    dispatch({ type: "SELECT_TYPE", payload: { tab } });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  const tabsOptions = [
    { key: "aboutMe", img: usero, label: "關於我", value: user },
    {
      key: "allHouseHunting",
      img: deadlineo,
      label: "所有看房消息",
      value: deadline,
    },
    // { key: "compareList", img: "", label: "比較列表" },
    { key: "followedList", img: unHeart, label: "喜歡列表", value: heart },
    { key: "uploadMyListing", img: houseo, label: "管理物件", value: house },
    { key: "setting", img: settingo, label: "設定", value: setting },
  ];

  return (
    <Wrapper>
      {tabsOptions.map((options, index) => (
        <TabWrapper
          key={options.key}
          isShowTab={showTab}
          isChoose={getTab.tab === options.key}
          onClick={() => {
            clickTab(options.key);
            if (window.innerWidth < 425) {
              setShowTab(false);
            }
          }}
        >
          <Img
            isChoose={getTab.tab === options.key}
            isShowTab={showTab}
            img={options.value}
            oimg={options.img}
          ></Img>
          <Tab isChoose={getTab.tab === options.key} isShowTab={showTab}>
            {options.label}
          </Tab>
        </TabWrapper>
      ))}
    </Wrapper>
  );
}

export default SideBarTab;
