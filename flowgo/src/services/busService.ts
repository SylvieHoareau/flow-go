// Importation des types (on suppose qu'ils sont dans src/types/bus.ts)
import { ApiBusRoute, ApiBusStop, ApiResponse } from '../types/bus';

export const busService = {
    // Récupérer et transformer les lignes de bus
    async getRoutes(): Promise<GeoJSON.FeatureCollection> {
        const response = await fetch('https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/gtfs-routes-cars-jaunes-lareunion/records?limit=20');
        if (!response.ok) throw new Error("Erreur API Routes");
        
        // Typage de la réponse
        const data: ApiResponse<ApiBusRoute> = await response.json();
        
        const features: GeoJSON.Feature[] = data.results
            .filter((route: ApiBusRoute) => route.shape && route.shape.geometry)
            .map((route: ApiBusRoute) => ({
                type: 'Feature' as const,
                geometry: route.shape.geometry,
                properties: {
                    name: route.route_long_name,
                    color: route.route_color || '#FF0000'
                }
            }));

        return {
            type: 'FeatureCollection',
            features: features
        };
    },

    // Récupérer et transformer les arrêts
    async getStops(): Promise<GeoJSON.FeatureCollection> {
        const response = await fetch('https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/gtfs-stops-cars-jaunes-lareunion/records?limit=100');
        if (!response.ok) throw new Error("Erreur API Stops");

        const data: ApiResponse<ApiBusStop> = await response.json();

        const features: GeoJSON.Feature[] = data.results.map((stop) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [stop.stop_coordinates.lon, stop.stop_coordinates.lat]
            },
            properties: {
                name: stop.stop_name
            }
        }));

        return {
            type: 'FeatureCollection',
            features: features
        };
    }
};