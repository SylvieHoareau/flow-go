"use client";
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { busService } from '../services/busService';

// Fonction pour annoncer aux lecteurs d'écran
const announceToAccessibility = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};

export default function Map() {
  // On type la référence : elle pointera vers un HTMLDivElement ou null
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Fonction pour gérer les interactions (clics, survols)
  const setupInteractions = (map: maplibregl.Map) => {
    // Clic sur un arrêt
    map.on('click', 'stop-circles', (e) => {
      e.originalEvent.stopPropagation();
      const feature = e.features?.[0];
      if (!feature) return;

      // On vérifie que c'est bien un point avant d'afficher le popup
      if (feature.geometry.type === 'Point') {
        const coords = feature.geometry.coordinates as [number, number];
        const stopName = feature.properties?.name || 'Arrêt inconnu';
        new maplibregl.Popup({ focusAfterOpen: true })
          .setLngLat(coords)
          .setHTML(`<div class="p-2"><b>Arrêt :</b> ${stopName}</div>`)
          .addTo(map);
        // Annoncer au lecteur d'écran
        announceToAccessibility(`Arrêt ${stopName} sélectionné.`);
      }
    });

    // Clic sur une ligne
    map.on('click', 'route-line', (e) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const lineName = feature.properties?.name || 'Ligne inconnue';

      new maplibregl.Popup({ focusAfterOpen: true })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="border-left: 5px solid ${feature.properties?.color}; padding-left: 8px;">
            <strong>${lineName}</strong><br/>
            <small>Réseau Cars Jaunes</small>
          </div>
        `)
        .addTo(map);
      // Annoncer au lecteur d'écran
      announceToAccessibility(`Ligne ${lineName} sélectionnée.`);
    });

    // Curseur pointer au survol
    const layers = ['stop-circles', 'route-line'];
    layers.forEach(layer => {
      map.on('mouseenter', layer, () => map.getCanvas().style.cursor = 'pointer');
      map.on('mouseleave', layer, () => map.getCanvas().style.cursor = '');
    });
  };

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
        // On lance les deux appels en parallèle (Optimisation Performance !)
        const [routesGeojson, stopsGeojson] = await Promise.all([
            busService.getRoutes(),
            busService.getStops()
        ]);

        // Ajout des sources
        map.addSource('cars-jaunes', { type: 'geojson', data: routesGeojson });
        map.addSource('bus-stops', { type: 'geojson', data: stopsGeojson });

        // Ajout des layers (lignes puis points pour qu'ils soient au-dessus)
        map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'cars-jaunes',
            paint: { 
                'line-color': ['get', 'color'], 
                'line-width': 4, 
                'line-opacity': 0.8
            }
        });

        map.addLayer({
            id: 'stop-circles',
            type: 'circle',
            source: 'bus-stops',
            paint: { 
                'circle-radius': 5, 
                'circle-color': '#FFFFFF', 
                'circle-stroke-width': 2,
                'circle-stroke-color': '#333333',
            }
        });

        // Gestion des Interactions (UI/UX)
        setupInteractions(map);

        } catch (error) {
            console.error("Erreur FlowGo Service:", error);
            announceToAccessibility("Erreur lors du chargement de la carte. Veuillez rafraîchir la page.");
        }
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg shadow-inner"
      role="region"
      aria-label="Carte interactive des lignes de bus"
      tabIndex={0}
    />
  );
}