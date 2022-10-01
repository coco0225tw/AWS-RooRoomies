import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import styled from "styled-components";
import { firebase } from "../../utils/firebase";
import Listing from "./Listing";
import Search from "./Search";
import { RootState } from "../../redux/rootReducer";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../../components/Loading";
import Logo from "../../assets/noHouse.png";
import NoListing from "../../components/NoData";
interface Props {
  key: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  // margin: auto;
  position: relative;
  margin: 80px auto 0px;
  // padding-bottom: 20px;
`;

const HomePageTitle = styled.div`
  width: 100%;
  font-size: 30px;
  text-align: center;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const ListingWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 32px auto;
  // justify-content: flex-start;
  // background-color: grey;
  // justify-content: space-between;
  column-gap: 1.25%;
`;

const Btn = styled.div`
  cursor: pointer;
  padding: 10px;
  &:hover {
    color: white;
    background-color: grey;
    transition: 0.2s;
  }
`;
const PageArea = styled.div`
  display: flex;
`;
const ListingLink = styled(Link)`
  width: 24%;
  height: 100%;
  // flex-basis: 20px;
`;
const NextPageBtn = styled(Btn)``;
const PrevPageBtn = styled(Btn)``;
const Page = styled.div`
  padding: 10px;
`;
const NoLogo = styled.div`
  width: 10vw;
  // top: 10vh;
  aspect-ratio: 1/1;
  background-image: url(${Logo});
  background-size: cover;
  background-position: center center;
`;
const NoText = styled.div`
  font-size: 28px;
  letter-spacing: 2px;
  color: #d7d7d7;
  margin-left: 20px;
  font-weight: bold;
`;
const NoArea = styled.div`
  margin: auto;
  margin-top: 10vh;
  display: flex;
  align-items: center;
  // flex-direction: column;
`;
const ScrollComponent = styled.div`
  position: absolute;
  // border: solid 1px orange;
  width: 10vw;
  bottom: 32px;
`;
function Home() {
  const dispatch = useDispatch();
  interface Props {
    data: DocumentData;
    key: string;
  }
  const listingDocData = useSelector(
    (state: RootState) => state.GetListingInHomePageReducer
  );
  const lastDocData = useSelector(
    (state: RootState) => state.GetLastDocReducer
  );

  const arr = [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadFirstPage, setLoadFirstPage] = useState(false);
  const [loadNextPage, setLoadNextPage] = useState(false);
  useEffect(() => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 3000);
  }, []);
  return (
    <Wrapper>
      <Search
        loading={loading}
        setLoading={setLoading}
        loadNextPage={loadNextPage}
        loadFirstPage={loadFirstPage}
        setLoadFirstPage={setLoadFirstPage}
        scrollRef={scrollRef}
      ></Search>
      <ListingWrapper>
        {listingDocData.length === 0 && !loading && (
          <NoListing msg="沒有符合的物件" />
        )}
        {listingDocData.length !== 0 &&
          listingDocData.map((listingDocData: DocumentData, index: number) => (
            <ListingLink
              key={`listing_${index}`}
              target="_blank"
              to={`/listing/${listingDocData.id}`}
            >
              <Listing listingDocData={listingDocData}></Listing>
            </ListingLink>
          ))}
      </ListingWrapper>
      {loading && <Loading />}
      {listingDocData && <ScrollComponent ref={scrollRef} />}

      {/* <PageArea></PageArea> */}
    </Wrapper>
  );
}

export default Home;
