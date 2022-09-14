import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { query, collection, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import Listing from './Listing';
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
  width: 80%;
  height: 100%;
  margin: auto;
  position: relative;
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

const ListingWrapper = styled(Link)<Props>`
  // position: relative;
  // width: 100%;
  width: 50%;
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
const NextPageBtn = styled(Btn)``;
const PrevPageBtn = styled(Btn)``;
const Page = styled.div`
  padding: 10px;
`;
function Home() {
  interface Props {
    data: DocumentData;
    key: string;
  }

  const [lastListingDocument, setLastListingDocument] = useState<DocumentData>();
  const [listingDocData, setListingDocData] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  useEffect(() => {
    firebase.getAllListings().then((listing) => {
      const lastDoc = listing.docs[listing.docs.length - 1];
      setLastListingDocument(lastDoc);
      let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
      listing.forEach((doc) => {
        listingDocArr.push(doc);
        console.log();
      });
      setListingDocData(listingDocArr);
    });
  }, []);
  const arr = [];

  async function nextPage() {
    firebase.getNextPageListing(lastListingDocument as DocumentData).then((listing) => {
      const lastDoc = listing.docs[listing.docs.length - 1];
      setLastListingDocument(lastDoc);
      let listingDocArr: QueryDocumentSnapshot<DocumentData>[] = [];
      listing.forEach((doc) => {
        listingDocArr.push(doc);
      });
      setListingDocData([...listingDocData, ...listingDocArr]);
    });
  }
  return (
    <Wrapper>
      <HomePageTitle>這裡是homePage</HomePageTitle>
      {listingDocData &&
        listingDocData.map((listingDocData, index) => (
          <ListingWrapper target="_blank" to={`/listing/${listingDocData.id}`} key={`listing_${index}`}>
            <Listing listingDocData={listingDocData}></Listing>
          </ListingWrapper>
        ))}
      <PageArea>
        {/* <PrevPageBtn>上一頁</PrevPageBtn>
        <Page>頁碼</Page> */}
        <NextPageBtn onClick={() => nextPage()}>下一頁</NextPageBtn>
      </PageArea>
    </Wrapper>
  );
}

export default Home;
