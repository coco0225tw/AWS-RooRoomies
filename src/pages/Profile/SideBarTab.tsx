import React, { useState, useRef } from 'react';
import styled from 'styled-components';
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
  return (
    <Wrapper>
      <TabWrapper>
        <Img></Img>
        <Tab>關於我</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab>所有看房消息</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab>比較列表</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab>追蹤列表</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab>管理物件</Tab>
      </TabWrapper>
      <TabWrapper>
        <Img></Img>
        <Tab>設定</Tab>
      </TabWrapper>
    </Wrapper>
  );
}

export default SideBarTab;
