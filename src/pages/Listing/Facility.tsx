import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Icons from '../../assets/facility/Icon';
import Hr from '../../components/Hr';
import facilityType from '../../redux/UploadFacility/UploadFacilityType';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin: auto;
`;

const FacilityArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0px 40px;
  align-items: flex-start;
  @media screen and (max-width: 550px) {
    margin-bottom: 0px;
  }
`;
const FacilityIcons = styled.div`
  display: flex;
  width: 70%;
  flex-wrap: wrap;
`;
const Label = styled.div`
  font-size: 16px;
  padding: 12px 0 4px;
  border-bottom: solid 0.5px #c77155;
  flex-shrink: 0;
`;

const FacilityText = styled.div`
  font-size: 16px;
  text-align: center;
  padding: 8px;
  white-space: nowrap;
`;
const FacilityContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-basis: calc(100% / 3);
  margin-bottom: 12px;
`;
const FacilityIcon = styled.div<{ img: string }>`
  width: 50px;
  height: 50px;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-position: center center;
`;
const Facilities = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;
const SubTitle = styled.div`
  font-size: 28px;
  /* letter-spacing: 12px; */
  /* font-weight: bold; */
  color: #4f5152;
  width: 100%;
`;
function Facility(facility: any) {
  const [keys, setKeys] = useState<string[]>([]);

  const facilityFormGroups = [
    { label: '押金', key: 'deposit', value: Icons.deposit },
    {
      label: '額外費用',
      key: 'extraFee',
      options: [
        {
          label: 'administratorFee',
          text: '管理費',
          value: Icons.extraFee.administratorFee,
        },
        {
          label: 'cleanFee',
          text: '清潔費',
          value: Icons.extraFee.cleanFee,
        },
        {
          label: 'electricFee',
          text: '電費',
          value: Icons.extraFee.electricFee,
        },
        {
          label: 'waterFee',
          text: '水費',
          value: Icons.extraFee.waterFee,
        },
        {
          label: 'gasFee',
          text: '瓦斯費',
          value: Icons.extraFee.gasFee,
        },
        {
          label: 'wifiFee',
          text: '網路費',
          value: Icons.extraFee.wifiFee,
        },
      ],
    },
    {
      label: '設施',
      key: 'facility',
      options: [
        {
          label: 'fridge',
          text: '冰箱',
          value: Icons.facility.fridge,
        },
        {
          label: 'elevator',
          text: '電梯',
          value: Icons.facility.elevator,
        },

        {
          label: 'extinguisher',
          text: '滅火器',
          value: Icons.facility.extinguisher,
        },
        {
          label: 'natureGas',
          text: '天然氣',
          value: Icons.facility.natureGas,
        },

        {
          label: 'waterHeater',
          text: '熱水器',
          value: Icons.facility.waterHeater,
        },
        {
          label: 'kitchen',
          text: '廚房',
          value: Icons.facility.kitchen,
        },
        {
          label: 'washingMachine',
          text: '洗衣機',
          value: Icons.facility.washingMachine,
        },
        {
          label: 'wifi',
          text: '網路',
          value: Icons.facility.wifi,
        },
        {
          label: 'garbage',
          text: '代收垃圾',
          value: Icons.facility.garbage,
        },
        {
          label: 'fogDetector',
          text: '煙霧偵測器',
          value: Icons.facility.fogDetector,
        },
        {
          label: 'liquifiedGas',
          text: '桶裝瓦斯',
          value: Icons.facility.liquifiedGas,
        },
      ],
    },
    {
      label: '家俱',
      key: 'furniture',
      options: [
        {
          label: 'sofa',
          text: '沙發',
          value: Icons.furniture.sofa,
        },
        {
          label: 'airConditioner',
          text: '冷氣',
          value: Icons.furniture.airConditioner,
        },
        {
          label: 'wardrobe',
          text: '衣櫃',
          value: Icons.furniture.wardrobe,
        },
        {
          label: 'bed',
          text: '床',
          value: Icons.furniture.bed,
        },
        {
          label: 'bedding',
          text: '床俱',
          value: Icons.furniture.bedding,
        },
        {
          label: 'table',
          text: '桌子',
          value: Icons.furniture.table,
        },
        {
          label: 'chair',
          text: '椅子',
          value: Icons.furniture.chair,
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
          value: Icons.parking.motorbike,
        },
        {
          label: 'carParkingLot',
          text: '汽車停車位',
          value: Icons.parking.car,
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
          value: Icons.fire,
        },
      ],
    },
  ];
  useEffect(() => {
    function findObjectKeys() {
      let keys = Object.keys(facility.facility);
      setKeys(keys);
    }
    if (facility?.facility) {
      findObjectKeys();
    }
  }, [facility]);
  return (
    <Wrapper>
      <Hr style={{ margin: '40px 0px' }} />
      <SubTitle style={{ marginBottom: '32px' }}>設施條件</SubTitle>
      <Facilities>
        {keys &&
          facility.facility &&
          facilityFormGroups.map((el, index) => (
            <FacilityArea key={`facility${index}`}>
              <Label>{el.label}</Label>
              <FacilityIcons>
                {typeof facility.facility[el.key] === 'string' && (
                  <FacilityContainer>
                    <FacilityIcon img={Icons.deposit} />
                    <FacilityText>{facility.facility[el.key]}個月</FacilityText>
                  </FacilityContainer>
                )}
                {el.options &&
                el.options.filter((o) => {
                  return facility.facility[el.key as keyof typeof keys].includes(o.label);
                }).length !== 0
                  ? el.options
                      .filter((o) => {
                        return facility.facility[el.key as keyof typeof keys].includes(o.label);
                      })
                      .map((i: any, index: any) => (
                        <FacilityContainer key={`facilities${index}`}>
                          <FacilityIcon img={i.value} />
                          <FacilityText>{i.text}</FacilityText>
                        </FacilityContainer>
                      ))
                  : typeof facility.facility[el.key] !== 'string' && <FacilityText>無</FacilityText>}
              </FacilityIcons>
            </FacilityArea>
          ))}
      </Facilities>
    </Wrapper>
  );
}

export default Facility;
