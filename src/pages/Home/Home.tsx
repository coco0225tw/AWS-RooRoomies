import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { DocumentData } from "firebase/firestore";

import { RootState } from "../../redux/rootReducer";

import Listing from "./Listing";
import Search from "./Search";
import NoListing from "../../components/NoData";

import { Loading } from "../../components/Loading";

import Logo from "../../assets/noHouse.png";
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
  position: relative;
  margin: 80px auto 0px;
`;

const ListingWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 32px auto;
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

const ListingLink = styled(Link)`
  width: 24%;
  height: 100%;
`;

const ScrollComponent = styled.div`
  position: absolute;
  width: 10vw;
  bottom: 32px;
`;
function Home() {
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
  const [loading, setLoading] = useState<boolean>(false);
  const [loadFirstPage, setLoadFirstPage] = useState<boolean>(false);
  const [loadNextPage, setLoadNextPage] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);

  return (
    <Wrapper>
      <Search
        loading={loading}
        setLoading={setLoading}
        loadNextPage={loadNextPage}
        loadFirstPage={loadFirstPage}
        setLoadFirstPage={setLoadFirstPage}
        scrollRef={scrollRef}
        noData={noData}
        setNoData={setNoData}
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
      {loading && <Loading style={null} />}
      {listingDocData && <ScrollComponent ref={scrollRef} />}
    </Wrapper>
  );
}

export default Home;
