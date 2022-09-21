import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import Listing from './Listing';
import Search from './Search';
import { RootState } from '../../redux/rootReducer';
import { useSelector, useDispatch } from 'react-redux';
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
  margin: 80px auto 160px;
  padding-bottom: 20px;
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
  justify-content: flex-start;
  // background-color: grey;
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
  width: 25%;
  height: 100%;
`;
const NextPageBtn = styled(Btn)``;
const PrevPageBtn = styled(Btn)``;
const Page = styled.div`
  padding: 10px;
`;
function Home() {
  const dispatch = useDispatch();
  interface Props {
    data: DocumentData;
    key: string;
  }
  const listingDocData = useSelector((state: RootState) => state.GetListingInHomePageReducer);
  const lastDocData = useSelector((state: RootState) => state.GetLastDocReducer);

  // console.log(listingDocData);
  useEffect(() => {
    // console.log('homeFromUseEffect');
    // firebase.getAllListings(null, null).then((listing) => {
    //   const lastDoc = listing.docs[listing.docs.length - 1];
    //   dispatch({ type: 'GET_LAST_LISTING_DOC', payload: { lastDocData: lastDoc } });
    //   let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
    //   listing.forEach((doc) => {
    //     listingDocArr.push(doc);
    //   });
    //   dispatch({ type: 'GET_LISTINGDOC_FROM_FIREBASE', payload: { listingDocData: listingDocArr } });
    // });
  }, []);
  const arr = [];

  // async function nextPage() {
  //   firebase.getNextPageListing(lastDocData as DocumentData).then((listing) => {
  //     const lastDoc = listing.docs[listing.docs.length - 1];
  //     dispatch({ type: 'GET_LAST_LISTING_DOC', payload: { lastDocData: lastDoc } });
  //     let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
  //     listing.forEach((doc) => {
  //       listingDocArr.push(doc);
  //     });
  //     dispatch({ type: 'GET_NEXTPAGE_LISTINGDOC_FROM_FIREBASE', payload: { listingDocData: listingDocArr } });
  //   });
  // }
  return (
    <Wrapper>
      <Search></Search>
      <ListingWrapper>
        {listingDocData &&
          listingDocData.map((listingDocData: DocumentData, index: number) => (
            <ListingLink key={`listing_${index}`} target="_blank" to={`/listing/${listingDocData.id}`}>
              <Listing listingDocData={listingDocData}></Listing>
            </ListingLink>
          ))}
      </ListingWrapper>
      <PageArea>
        {/* <PrevPageBtn>上一頁</PrevPageBtn>
        <Page>頁碼</Page> */}
        {/* <NextPageBtn onClick={() => nextPage()}>下一頁</NextPageBtn> */}
      </PageArea>
    </Wrapper>
  );
}

export default Home;
