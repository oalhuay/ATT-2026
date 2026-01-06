"use client";

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  OverlayView,
} from "@react-google-maps/api";
import { useState, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -34.6037,
  lng: -58.3816,
};

export default function GoogleMapWrapper() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("lavadero");

  if (!isLoaded) return <p>Cargando mapa…</p>;

  /* ---------------- BUSCADOR DE TIENDAS ---------------- */

  const searchNearby = () => {
    if (!mapRef.current) return;

    const service = new window.google.maps.places.PlacesService(
      mapRef.current
    );

    service.nearbySearch(
      {
        location: center,
        radius: 3000, // metros
        keyword: query, // lavadero, car wash, etc
      },
      (places, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setResults(places);
        }
      }
    );
  };

  return (
    <div className="rounded-xl shadow-lg bg-white">
      {/* MAPA */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {/* MARKERS DE RESULTADOS */}
        {results.map((place) => (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
            onClick={() => setSelected(place)}
          />
        ))}

        {/* OVERLAY REACT */}
        {selected && (
          <OverlayView
            position={{
              lat: selected.geometry.location.lat(),
              lng: selected.geometry.location.lng(),
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <MapCard
              place={selected}
              onClose={() => setSelected(null)}
            />
          </OverlayView>
        )}
      </GoogleMap>

      {/* BUSCADOR ABAJO */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tiendas cercanas (lavadero, car wash...)"
            className="flex-1 border rounded px-3 py-2"
          />

          <button
            onClick={searchNearby}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>

        {/* LISTADO */}
        <ul className="mt-4 space-y-2 max-h-48 overflow-auto">
          {results.map((place) => (
            <li
              key={place.place_id}
              className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setSelected(place);
                mapRef.current.panTo(
                  place.geometry.location
                );
              }}
            >
              <p className="font-medium">{place.name}</p>
              <p className="text-sm text-gray-500">
                {place.vicinity}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- CARD SOBRE EL MAPA ---------------- */

function MapCard({ place, onClose }) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 w-64 -translate-x-1/2 -translate-y-full">
      <h3 className="font-bold text-lg">{place.name}</h3>
      <p className="text-sm text-gray-600">{place.vicinity}</p>

      <div className="flex gap-2 mt-3">
        <button
          className="bg-black text-white px-3 py-1 rounded"
          onClick={() => alert(`Ver ${place.name}`)}
        >
          Ver tienda
        </button>

        <button
          className="text-sm text-gray-500"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
