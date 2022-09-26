import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { firebase } from "../../utils/firebase";
import { RootState } from "../../redux/rootReducer";
import { BtnDiv } from "../../components/Button";
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
  // width: ${(props) => (props.isShowTab ? "100%" : "0%")};
  border-radius: 12px;
  background-color: ${(props) => (props.isChoose ? "#c77155 " : "#ffffff")};
  color: ${(props) => (props.isChoose ? "#ffffff " : "#4f5152")};
  // display: ${(props) => (props.isShowTab ? "flex" : "none")};
  transition-duration: 0.2s;
  &:hover {
    background-color: #f3f2ef;
    color: #4f5152;
    // color: ${(props) => (props.isChoose ? "#4f5152 " : "#ffffff")};
  }
  @media screen and (max-width: 960px) {
    padding: 4px;
  }
`;
const Tab = styled.div<{ isShowTab: boolean }>`
  font-size: 20px;
  letter-spacing: 4px;
  margin-left: 8px;
  color: inherit;
  // display: block;
  // display: ${(props) => (props.isShowTab ? "block" : "none")};
  &:hover {
  }
  @media screen and (max-width: 960px) {
    font-size: 16px;
  }
`;
const Img = styled.img<{ img: string; isShowTab: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  // display: ${(props) => (props.isShowTab ? "block" : "none")};
  @media screen and (max-width: 960px) {
    width: 20px;
    height: 20px;
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
    { key: "aboutMe", img: "", label: "關於我" },
    { key: "allHouseHunting", img: "", label: "所有看房消息" },
    // { key: "compareList", img: "", label: "比較列表" },
    { key: "followedList", img: "", label: "喜歡列表" },
    { key: "uploadMyListing", img: "", label: "管理物件" },
    { key: "setting", img: "", label: "設定" },
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
          <Img isShowTab={showTab} img={options.img}></Img>
          <Tab isShowTab={showTab}>{options.label}</Tab>
        </TabWrapper>
      ))}
    </Wrapper>
  );
}

export default SideBarTab;
