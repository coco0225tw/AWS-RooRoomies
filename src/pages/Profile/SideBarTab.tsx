import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { firebase } from '../../utils/firebase';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

const TabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;
const Tab = styled.div``;
const Img = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
function SideBarTab() {
  const dispatch = useDispatch();
  function clickTab(tabString: string) {
    const tab = {
      tab: tabString,
    };
    dispatch({ type: 'SELECT_TYPE', payload: { tab } });
  }
  return (
    <Wrapper>
      <TabWrapper>
        <Img></Img>
        <Tab onClick={() => clickTab('aboutMe')}>關於我</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab onClick={() => clickTab('allHouseHunting')}>所有看房消息</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab onClick={() => clickTab('compareList')}>比較列表</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab onClick={() => clickTab('followedList')}>追蹤列表</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab onClick={() => clickTab('uploadMyListing')}>管理物件</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab onClick={() => clickTab('setting')}>設定</Tab>
      </TabWrapper>
    </Wrapper>
  );
}

export default SideBarTab;
