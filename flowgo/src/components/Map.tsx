"use client";
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// On définit la structure des données reçues de l'API (Contrat)
interface ApiBusRoute {
  route_long_name: string;
  route_color: string;
  shape: any; // On peut affiner en GeoJSON.Geometry si besoin
}

interface ApiResponse {
  results: ApiBusRoute[];
}

export default function Map() {
  // On type la référence : elle pointera vers un HTMLDivElement ou null
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    // Sécurité : On vérifie que le container existe avant d'initialiser
    if (!mapContainer.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [55.5364, -21.1151],
      zoom: 9
    });

    const map = mapRef.current;

    map.on('load', async () => {
      try {
        const response = await fetch('https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/gtfs-routes-cars-jaunes-lareunion/records?limit=20');
        
        if (!response.ok) throw new Error("Erreur lors de la récupération des données");

        const data: ApiResponse = await response.json();

        // Transformation typée
        const features = data.results.map((route) => ({
          type: 'Feature' as const, // Force le type literal
          geometry: route.shape,
          properties: {
            name: route.route_long_name,
            color: `#${route.route_color}`
          }
        }));

        const geojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: features as any
        };

        map.addSource('cars-jaunes', {
          type: 'geojson',
          data: geojson
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'cars-jaunes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 4
          }
        });
      } catch (error) {
        console.error("Erreur FlowGo :", error);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-[600px]" />;
}