import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { firebase } from "../../../utils/firebase";
import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import { RootState } from "../../../redux/rootReducer";
import { Title } from "../../../components/ProfileTitle";
import Hr from "../../../components/Hr";
import { PopupComponent, PopupImage } from "../../../components/Popup";
import ListingItem from "../../../components/ListingItem";
import { BtnDiv, BtnLink } from "../../../components/Button";
import chat from "../../../assets/chat.png";
import { Loading } from "../../../components/Loading";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: auto;
  width: 80%;
  height: 100%;
  color: #4f5152;
  margin-top: 20px;
`;
const SectionWrapper = styled(Link)`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;
const ListingWrapper = styled(Link)`
  display: flex;
  flex-direction: row;
  border: solid 1px #f3f2ef;
  width: 100%;
  margin-bottom: 32px;
  padding: 20px;
  border-radius: 12px;
`;
const StyledBtnDiv = styled(BtnDiv)`
  // position: absolute;
`;
const InfoWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  right: 20px;
  top: 40%;
  // transform: translateY(-70%);
  width: 50%;
  align-items: center;
  justify-content: space-between;
`;
const ChatIcon = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${chat});
  background-size: 30px 30px;
  border-radius: 50%;
  background-color: #c77155;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;
const Tab = styled(BtnDiv)<{ isClick: boolean }>`
  border-bottom: ${(props) => (props.isClick ? "solid 3px #c77155 " : "none")};
`;
const TabSelect = ["已預約", "尚未預約", "等待湊團"];
function AllHouseHunting({
  setLoading,
  loading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const userInfo = useSelector((state: RootState) => state.GetAuthReducer);
  const [houseHuntingData, setHouseHuntingData] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [allListingData, setAllListingData] = useState<DocumentData[]>([]);
  const [clickTab, setClickTab] = useState<string>("已預約");
  useEffect(() => {
    async function getAllHouseHuntingData() {
      firebase.getAllHouseHunting(userInfo.uid).then((listing) => {
        let houseHuntingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
        listing.forEach((doc) => {
          houseHuntingDocArr.push(doc);
          console.log(doc.data());
        });
        setHouseHuntingData(houseHuntingDocArr);
        getAllListing(houseHuntingDocArr);
      });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
    async function getAllListing(arr: QueryDocumentSnapshot<DocumentData>[]) {
      // getListing;
      let promise: DocumentData[] = [];
      arr.map((el, index) => {
        promise.push(
          firebase.getFavoriteListing(el.data().listingId) as DocumentData
        );
      });
      let allPromises = await Promise.all(promise);
      let listingDocArr: DocumentData[] = [];
      allPromises.forEach((doc) => {
        listingDocArr.push(doc);
        // console.log(doc.data());
      });

      setAllListingData(listingDocArr);
    }
    getAllHouseHuntingData();
  }, [userInfo]);
  return (
    <Wrapper>
      <Title>我的看房時間</Title>
      <Hr />
      <Tabs>
        {TabSelect.map((el, index) => (
          <Tab
            key={`tab${el}`}
            isClick={el === clickTab}
            onClick={() => {
              setClickTab(el);
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 3000);
            }}
          >
            {el}
          </Tab>
        ))}
      </Tabs>
      {clickTab === "已預約" && loading ? (
        <Loading />
      ) : (
        allListingData.length !== 0 &&
        clickTab === "已預約" &&
        houseHuntingData
          .filter((doc) => doc.data().isBooked !== false)
          .map((doc, id) => (
            <ListingWrapper
              to={`/listing/${doc.data().listingId}`}
              key={`houseHunting${doc.data().listingId}`}
            >
              <ListingItem
                listingDocData={
                  allListingData.find(
                    (el) => el.id === doc.data().listingId
                  ) as DocumentData
                }
              ></ListingItem>
              <InfoWrapper>
                {/* <div> */}
                <div>{`已預約${doc
                  .data()
                  .bookedTime.date.toDate()
                  .toDateString()} ${
                  doc.data().bookedTime.startTime
                }看房`}</div>
                <StyledBtnDiv>取消預約</StyledBtnDiv>
                <ChatIcon></ChatIcon>
                {/* </div> */}
              </InfoWrapper>
            </ListingWrapper>
          ))
      )}
      {clickTab === "尚未預約" && loading ? (
        <Loading />
      ) : (
        allListingData.length !== 0 &&
        clickTab === "尚未預約" &&
        houseHuntingData
          .filter((doc) => doc.data().isBooked === false)
          .map((doc, id) => (
            <ListingWrapper
              to={`/listing/${doc.data().listingId}`}
              key={`houseHunting${doc.data().listingId}`}
            >
              <ListingItem
                listingDocData={
                  allListingData.find(
                    (el) => el.id === doc.data().listingId
                  ) as DocumentData
                }
              ></ListingItem>
              <InfoWrapper>
                {/* <div> */}
                <StyledBtnDiv>去預約</StyledBtnDiv>
                <ChatIcon></ChatIcon>
                {/* </div> */}
              </InfoWrapper>
            </ListingWrapper>
          ))
      )}
      {clickTab === "等待湊團" && loading ? (
        <Loading />
      ) : (
        allListingData.length !== 0 &&
        clickTab === "等待湊團" &&
        houseHuntingData
          .filter((doc) => doc.data().isFull === false)
          .map((doc, id) => (
            <ListingWrapper
              to={`/listing/${doc.data().listingId}`}
              key={`houseHunting${doc.data().listingId}`}
            >
              <ListingItem
                listingDocData={
                  allListingData.find(
                    (el) => el.id === doc.data().listingId
                  ) as DocumentData
                }
              ></ListingItem>
              <InfoWrapper>
                {/* <div> */}
                <StyledBtnDiv>退團</StyledBtnDiv>
                <ChatIcon></ChatIcon>
                {/* </div> */}
              </InfoWrapper>
            </ListingWrapper>
          ))
      )}
    </Wrapper>
  );
}

export default AllHouseHunting;
