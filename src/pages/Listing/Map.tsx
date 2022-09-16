import { GoogleMap, useJsApiLoader, useLoadScript, Marker } from '@react-google-maps/api';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import GoogleMapKey from '../../key';
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
function Map() {
  let map: google.maps.Map;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GoogleMapKey,
    // libraries: ['places'],
  });
  const mapStyles = {
    height: '50vh',
    width: '100%',
  };

  const chineseAddr = '台灣台北市信義區吳興街220巷73弄5號';
  const getGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${chineseAddr}&key=${GoogleMapKey}`;
  const keyword = '學校';
  const radius = 1000;
  const LatLng = { lat: 25.026221, lng: 121.560623 };

  const getRestaurantUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LatLng.lat},${LatLng.lng}&radius=${radius}&keyword=${keyword}&language=zh-TW&key=${GoogleMapKey}`;
  const [allRestaurants, setAllRestaurants] = useState<{ lat: number; lng: number }[]>();
  const addrs = useMemo(() => ({ lat: 25.026221, lng: 121.560623 }), []);
  type YourType = { geometry: { location: { lat: number; lng: number } } };
  const addrsRef = useRef<{ lat: number; lng: number }>();
  const [addrState, setAddrState] = useState();
  useEffect(() => {
    async function getGeocode() {
      await fetch(getGeocodeUrl).then((res) => {
        res.json().then((data) => {
          // const coordinates = new google.maps.LatLng({
          //   lat: data.results[0].geometry.location.lat as number,
          //   lng: data.results[0].geometry.location.lng as number,
          // });
          //   setAddrState(coordinates);
        });
      });
    }
    // getGeocode();

    async function getRestaurant() {
      await fetch(
        `https://us-central1-rooroomies.cloudfunctions.net/googleMap?lat=${LatLng.lat}&lng=${LatLng.lng}&keyword=${keyword}`
      ).then((res) => {
        console.log(res);
        res.json().then((data) => {
          console.log(data.results);
          let allRestaurants: [] = [];
          let allLatLng = data.results.map((p, index) => {
            return p.geometry.location;
          });
          setAllRestaurants(allLatLng);
        });
      });
    }
    getRestaurant();
  }, []);
  return (
    <>
      {isLoaded && (
        <GoogleMap options={{ styles: style }} mapContainerStyle={mapStyles} zoom={14} center={addrs}>
          {allRestaurants && allRestaurants.map((l, index) => <Marker position={l}></Marker>)}
        </GoogleMap>
      )}
    </>
  );
}
export default Map;
