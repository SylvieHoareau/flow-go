"use client";
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// On définit la structure des données reçues de l'API (Contrat)
interface ApiBusRoute {
  route_long_name: string;
  route_color: string;
  shape: {
    geometry: GeoJSON.MultiLineString; // C'est un MultiLineString ici
  };
}

interface ApiBusStop {
  stop_id: string;
  stop_name: string;
  stop_coordinates: { lon: number; lat: number };
}

interface ApiBusStopResponse {
  results: ApiBusStop[];
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
        // ---- PARTIE LIGNE DE BUS ----
        const response = await fetch('https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/gtfs-routes-cars-jaunes-lareunion/records?limit=20');
        
        if (!response.ok) throw new Error("Erreur lors de la récupération des données");

        const data: ApiResponse = await response.json();

        // Transformation typée
        const features = data.results
            .filter(route => route.shape && route.shape.geometry) // On s'assure d'avoir les données nécessaires
            .map((route) => ({
                type: 'Feature' as const, // Force le type literal
                geometry: route.shape.geometry,
                properties: {
                    name: route.route_long_name,
                    // Sécurité : si route_color est vide, on met du gris par défaut
                    color: route.route_color || '#FF0000'
                }
            }));

        const geojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: features as GeoJSON.Feature[]
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
            'line-color': ['get', 'color'], // Utilise la couleur définie dans les propriétés
            'line-width': 4
          }
        });

        // --- PARTIE ARRÊTS (STOPS) ---
        const stopsResponse = await fetch('https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/gtfs-stops-cars-jaunes-lareunion/records?limit=100');
        const stopsData: ApiBusStopResponse = await stopsResponse.json();

        const stopFeatures: GeoJSON.Feature<GeoJSON.Point, { name: string }>[] = stopsData.results.map((stop) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [stop.stop_coordinates.lon, stop.stop_coordinates.lat]
            },
            properties: {
                name: stop.stop_name
            }
        }));

        // Ajout de la source des arrêts
        map.addSource('bus-stops', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: stopFeatures
            }
        });

        // Ajout de la couche visuelle (des cercles blancs avec un bord noir)
        map.addLayer({
            id: 'stop-circles',
            type: 'circle',
            source: 'bus-stops',
            paint: {
                'circle-radius': 5,
                'circle-color': '#FFFFFF',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#000000'
            }
        });

        // Ajout d'un popup au clic sur un arrêt
        map.on('click', 'stop-circles', (e) => {
            // Empêche le clic de se propager à la ligne en dessous
            e.originalEvent.stopPropagation();

            const properties = e.features![0].properties;
    
            new maplibregl.Popup()
                .setLngLat((e.features![0].geometry as any).coordinates)
                .setHTML(`<b style="color: #333;">Arrêt : ${properties?.name}</b>`)
                .addTo(map);
                
            const coordinates = (e.features![0].geometry as GeoJSON.Point).coordinates.slice();
            const description = e.features![0].properties?.name;

            alert("Arrêt : " + description);
        });

        // Change le curseur en pointeur quand on survole un arrêt
        map.on('mouseenter', 'stop-circles', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Réinitialise le curseur quand on quitte l'arrêt
        map.on('mouseleave', 'stop-circles', () => {
            map.getCanvas().style.cursor = '';
        });

        // Détection du clic sur les lignes de bus
        map.on('click', 'route-line', (e) => {
            if (!e.features || e.features.length === 0) return;

            const feature = e.features[0];
            const lineName = feature.properties?.name;
            const lineColor = feature.properties?.color;

            // Création d'une popup élégante au point de clic
            new maplibregl.Popup({ className: 'flowgo-popup' })
                .setLngLat(e.lngLat)
                .setHTML(`
                    <div style="padding: 5px;">
                        <strong style="color: ${lineColor}">Ligne : ${lineName}</strong>
                        <p style="margin: 5px 0 0 0; font-size: 12px;">Réseau Cars Jaunes</p>
                    </div>
                `)
                .addTo(map);
        });

        // Amélioration de l'UX : Changement du curseur au survol des lignes
        map.on('mouseenter', 'route-line', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Réinitialisation du curseur au départ des lignes
        map.on('mouseleave', 'route-line', () => {
            map.getCanvas().style.cursor = '';
        });
      } catch (error) {
        console.error("Erreur FlowGo :", error instanceof Error ? error.message : String(error));
        console.error("Erreur FlowGo lors du chargement des arrêts :", error);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-[600px]" />;
}