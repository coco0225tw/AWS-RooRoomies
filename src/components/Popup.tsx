import React from 'react';
import styled from 'styled-components';
import { BtnDiv } from './Button';
import bin from '../assets/bin.png';

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;
  justify-content: center;
`;

const Popup = styled.div`
  width: 30%;
  background-color: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 32px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transition-duration: 0.2s;
  @media screen and (max-width: 1260px) {
    width: 50%;
  }
  @media screen and (max-width: 960px) {
    width: 80%;
  }
  @media screen and (max-width: 960px) {
    padding: 40px;
    font-size: 20px;
  }
`;

const Message = styled.div`
  letter-spacing: 8px;

  @media screen and (max-width: 960px) {
    font-size: 28px;
    white-space: break-spaces;
  }
`;
const MessageArea = styled.div`
  text-align: center;
  align-items: center;
  font-size: 32px;
  justify-content: center;
  height: 20vh;
  color: #4f5152;
  display: flex;
  @media screen and (max-width: 960px) {
    height: auto;
    padding: 40px 0 60px;
  }
`;
const BtnArea = styled.div`
  display: flex;
  justify-content: space-around;
`;
const DefaultBtn = styled(BtnDiv)`
  background-color: #ece2d5;
  &:hover {
    background-color: #fff7f4;
  }
`;

const NotDefaultBtn = styled(BtnDiv)`
  &:hover {
    background-color: #fff7f4;
  }
`;
const Close = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50%;
  line-height: 40px;
  transform: translate(100%, -100%);
  cursor: pointer;
  font-size: 20px;

  text-align: center;
  z-index: 1;
  right: 0;
  background-color: #fff7f4;
  transition-duration: 0.2s;
  &:hover {
    transform: scale(1.1) translate(100%, -100%);
  }
`;
const PopImg = styled(Popup)<{ img: string }>`
  width: 50vw;
  height: 50vh;
  background-size: cover;

  background-position: center center;
  background-image: url(${(props) => props.img});
  display: flex;
  padding: 0px;
  @media screen and (max-width: 960px) {
    width: 80%;
  }
  @media screen and (max-width: 660px) {
    width: 70%;
    height: 28%;
  }
`;
const Cross = styled.div`
  background-image: url(${bin});

  position: absolute;
  width: 40px;
  height: 40px;
  text-align: center;
  background-size: 30px 30px;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
  line-height: 40px;
  transform: translate(250%, -100%);
  cursor: pointer;
  font-size: 20px;

  text-align: center;
  z-index: 1;
  right: 0;
  background-color: #fff7f4;
  transition-duration: 0.2s;
  &:hover {
    transform: scale(1.1) translate(250%, -100%);
  }
`;
function PopupComponent({
  msg,
  notDefaultBtn,
  defaultBtn,
  clickClose,
  clickFunction,
}: {
  msg: string;
  notDefaultBtn: string;
  defaultBtn: string;
  clickClose: any;
  clickFunction: any;
}) {
  return (
    <Wrapper>
      <Popup>
        <MessageArea>
          <Message>{msg}</Message>
        </MessageArea>
        <BtnArea>
          <NotDefaultBtn
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              clickClose();
            }}
          >
            {notDefaultBtn}
          </NotDefaultBtn>
          <DefaultBtn
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              clickFunction();
            }}
          >
            {defaultBtn}
          </DefaultBtn>
        </BtnArea>
      </Popup>
    </Wrapper>
  );
}

function PopupImage({ img, clickClose }: { img: string; clickClose: any }) {
  return (
    <Wrapper>
      <PopImg img={img}>
        <Close
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            clickClose();
          }}
        >
          &#10006;
        </Close>
      </PopImg>
    </Wrapper>
  );
}
function PopupImageDelete({ img, clickClose, deleteFn }: { img: string; clickClose: any; deleteFn: any }) {
  return (
    <Wrapper>
      <PopImg img={img}>
        <Close
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            clickClose();
          }}
        >
          &#10006;
        </Close>
        <Cross
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            deleteFn();
            clickClose();
          }}
        />
      </PopImg>
    </Wrapper>
  );
}
export { PopupComponent, PopupImage, PopupImageDelete };
