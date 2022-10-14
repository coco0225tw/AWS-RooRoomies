import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import styled from 'styled-components';

import logo from '../../assets/searchHouse.png';
const style = [
  {
    featureType: 'administrative',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        hue: '#0066ff',
      },
      {
        saturation: 74,
      },
      {
        lightness: 100,
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
      {
        weight: 0.6,
      },
      {
        saturation: -85,
      },
      {
        lightness: 61,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        color: '#5f94ff',
      },
      {
        lightness: 26,
      },
      {
        gamma: 5.86,
      },
    ],
  },
];
function Map({ latLng }: { latLng: { lat: number; lng: number } }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  });
  const mapStyles = {
    height: '50vh',
    width: '100%',
  };
  const Wrapper = styled.div`
    width: 100vw;
    overflow: show;

    margin: 80px 0px 0px;
    transform: translateX(-10vw);
    @media screen and (max-width: 1460px) {
      transform: translateX(-5vw);
    }
  `;

  return (
    <Wrapper>
      {isLoaded && (
        <GoogleMap options={{ styles: style }} mapContainerStyle={mapStyles} zoom={14} center={latLng}>
          <Marker
            icon={{
              url: logo,
              scaledSize: new google.maps.Size(28, 28), // scaled size
              origin: new google.maps.Point(0, 0), // origin
              anchor: new google.maps.Point(0, 0), // anchor
            }}
            position={latLng}
          />
        </GoogleMap>
      )}
    </Wrapper>
  );
}
export default Map;
