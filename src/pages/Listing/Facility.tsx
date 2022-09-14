import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { firebase } from '../../utils/firebase';
import roommatesConditionType from '../../redux/UploadRoommatesCondition/UploadRoommatesConditionType';
import facilityType from '../../redux/UploadFacility/UploadFacilityType';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  //   justify-content: center;
  align-items: flex-start;
  width: 100%;
  // height: 100%;
  margin: auto;
`;

const SideBarWrapper = styled.div`
  width: 30%;
  padding: 20px;
`;

const FacilityArea = styled.div`
  display: flex;
  //   flex-direction: column;
  justify-content: space-between;
  width: 80%;
`;
// const RoommatesCond
function Facility(facility: any) {
  const [facilities, setFacilities] = useState<facilityType>();
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    function findObjectKeys() {
      let keys = Object.keys(facility.facility);
      setKeys(keys);
    }
    if (facility?.facility) {
      findObjectKeys();
    }
  }, [facility]);
  const facilityFormGroups = [
    { label: '押金', key: 'deposit' },
    {
      label: '額外費用',
      key: 'extraFee',
      options: [
        {
          label: 'cleanFee',
          text: '清潔費',
          value: 'cleanFee',
        },
        {
          label: 'electricFee',
          text: '電費',
          value: 'electricFee',
        },
        {
          label: 'waterFee',
          text: '水費',
          value: 'waterFee',
        },
        {
          label: 'gasFee',
          text: '瓦斯費',
          value: 'gasFee',
        },
        {
          label: 'wifiFee',
          text: '網路費',
          value: 'wifiFee',
        },
      ],
    },
    {
      label: '設施',
      key: 'facility',
      options: [
        {
          label: 'elevator',
          text: '電梯',
          value: 'elevator',
        },
        {
          label: 'fogDetector',
          text: '煙霧偵測器',
          value: 'fogDetector',
        },
        {
          label: 'extinguisher',
          text: '滅火器',
          value: 'extinguisher',
        },
        {
          label: 'natureGas',
          text: '天然氣',
          value: 'natureGas',
        },
        {
          label: 'liquifiedGas',
          text: '桶裝瓦斯',
          value: 'liquifiedGas',
        },
        {
          label: 'waterHeater',
          text: '熱水器',
          value: 'waterHeater',
        },
        {
          label: 'kitchen',
          text: '廚房',
          value: 'kitchen',
        },
        {
          label: 'washingMachine',
          text: '洗衣機',
          value: 'washingMachine',
        },
        {
          label: 'wifi',
          text: '網路',
          value: 'wifi',
        },
      ],
    },
    {
      label: '家俱',
      key: 'furniture',
      options: [
        {
          label: 'airConditioner',
          text: '冷氣',
          value: 'airConditioner',
        },
        {
          label: 'bed',
          text: '床',
          value: 'bed',
        },
        {
          label: 'bedding',
          text: '床俱',
          value: 'bedding',
        },
        {
          label: 'table',
          text: '桌子',
          value: 'table',
        },
        {
          label: 'chair',
          text: '椅子',
          value: 'chair',
        },
      ],
    },
    {
      label: '停車位',
      key: 'parking',
      options: [
        {
          label: 'scooterParkingLot',
          text: '機車停車位',
          value: 'scooterParkingLot',
        },
        {
          label: 'carParkingLot',
          text: '汽車停車位',
          value: 'carParkingLot',
        },
        {
          label: 'none',
          text: '無',
          value: 'none',
        },
      ],
    },
    {
      label: '規則',
      key: 'rules',
      options: [
        {
          label: 'fire',
          text: '可以開火',
          value: 'fire',
        },
      ],
    },
  ];
  // console.log(facility.facility);
  return (
    <Wrapper>
      <h1>設施條件</h1>
      {keys &&
        keys.map((el, index) => (
          <FacilityArea key={`facility${index}`}>
            <div>{el}: </div>
            {typeof facility.facility[el] == 'string' ? (
              <div>{facility.facility[el]}</div>
            ) : (
              <div>
                {facility.facility[el].map((i: any, index: any) => (
                  <div key={`facilities${index}`}>{i}</div>
                ))}
              </div>
            )}
          </FacilityArea>
        ))}
    </Wrapper>
  );
}

export default Facility;
