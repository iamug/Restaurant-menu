// import React, { Component }  from 'react';
// import GoogleMapReact from 'google-map-react';
// import {  googleAPIKey } from "../controllers/fetchdata";
// import { Icon } from 'rsuite';

// const Map = ({ location , center, zoom}) => {

//     center = { lat: location.coordinates[0] , lng: location.coordinates[1] }
//     console.table(center)
//     return (
//         <div className="map">
//             <GoogleMapReact
//           bootstrapURLKeys={{ key: googleAPIKey }}
//           defaultCenter={ center }
//           defaultZoom={  zoom }
//         >

//             <Icon icon='map-marker' size="3x" lat={center.lat}
//             lng={center.lng} style={{ color: '#f44336' }}  />

//         </GoogleMapReact>
//         </div>
//     )
// }

// Map.defaultProps = {
//     center: {
//         lat:  42.3265,
//         lng:  -122.8756
//       },
//       zoom : 7
// }

// export default Map
