import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default leaflet icons not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map data for Udaipur hotels
export const hotelCoordinates: Record<string, [number, number]> = {
  "udaipur-1": [24.5770592, 73.6695341],
  "udaipur-4": [24.5978, 73.6832],
  "udaipur-5": [24.5785, 73.6635],
  "udaipur-6": [24.5892494, 73.6827214],
  "udaipur-7": [24.5793587, 73.6801082],
  "udaipur-8": [24.590831, 73.6813459],
  "udaipur-9": [24.6075, 73.6698],
  "udaipur-10": [24.5606, 73.6633],
  "udaipur-11": [24.5677, 73.6746],
  "udaipur-12": [24.5807336, 73.6822393],
  "udaipur-13": [24.5731376, 73.8109847],
  "udaipur-14": [24.603, 73.6727],
  "udaipur-15": [24.594, 73.661],
  "udaipur-16": [24.5791, 73.6685],
  "udaipur-17": [24.6003, 73.6847],
  "udaipur-18": [24.5771831, 73.6725331],
  "udaipur-19": [24.6048, 73.679],
  "udaipur-21": [24.5781589, 73.677216],
  "udaipur-22": [24.5754426, 73.6801244],
  "udaipur-23": [24.5604, 73.6611],
  "udaipur-24": [24.5771, 73.6951],
  "udaipur-25": [24.5851, 73.6935],
  "udaipur-26": [24.5869, 73.6858],
  "udaipur-27": [24.5793, 73.6677],
  "udaipur-28": [24.5865, 73.6913],
  "udaipur-29": [24.5883, 73.6761],
  "udaipur-30": [24.5945, 73.6939],
  "udaipur-31": [24.5727, 73.6684],
  "udaipur-32": [24.5643, 73.6976],
  "udaipur-33": [24.58, 73.6694],
  "udaipur-34": [24.582, 73.7018]
};

interface UdaipurMapProps {
  hotels: any[];
}

const UdaipurMap: React.FC<UdaipurMapProps> = ({ hotels }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter only Udaipur hotels that we have coordinates for
  const mapHotels = hotels.filter(h => hotelCoordinates[h.id]);

  if (mapHotels.length === 0) return null;

  // Restrict bounds to Udaipur region
  const udaipurBounds: L.LatLngBoundsExpression = [
    [24.15, 73.50], // Southwest (covers Jaisamand)
    [24.75, 74.05]  // Northeast
  ];

  return (
    <>
      {/* Small Sidebar Map */}
      <div 
        style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', zIndex: 1, position: 'relative', border: '1px solid #e2e8f0', cursor: 'pointer' }}
      >
        <button 
          onClick={() => setIsExpanded(true)}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: 'rgba(0,0,0,0)', border: 'none', cursor: 'pointer' }}
        />
        <MapContainer 
          center={[24.5854, 73.6811]} 
          zoom={12} 
          minZoom={10}
          maxBounds={udaipurBounds}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapHotels.map((hotel) => (
            <Marker key={hotel.id} position={hotelCoordinates[hotel.id]} />
          ))}
        </MapContainer>
      </div>
      
      {/* Fullscreen Map Portal */}
      {isExpanded && createPortal(
        <div className="mmt-map-fullscreen" onClick={() => setIsExpanded(false)}>
          <div className="mmt-map-modal-content" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsExpanded(false)}
              className="close-modal-btn"
              style={{ top: '-15px', right: '-15px', zIndex: 10001, background: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              &times;
            </button>
            <MapContainer 
              center={[24.5854, 73.6811]} 
              zoom={12} 
              minZoom={10}
              maxBounds={udaipurBounds}
              maxBoundsViscosity={1.0}
              style={{ height: '100%', width: '100%', borderRadius: '12px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapHotels.map((hotel) => (
                <Marker key={`fs-${hotel.id}`} position={hotelCoordinates[hotel.id]}>
                  <Popup>
                    <strong>{hotel.name}</strong><br />
                    {hotel.rating}<br />
                    ₹{hotel.price} / night
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default UdaipurMap;
