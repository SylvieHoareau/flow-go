// Structure pour les Routes (Lignes)
export interface ApiBusRoute {
  route_long_name: string;
  route_color: string;
  shape: {
    geometry: GeoJSON.MultiLineString;
  };
}

// Structure pour les Stops (Arrêts)
export interface ApiBusStop {
  stop_id: string;
  stop_name: string;
  stop_coordinates: {
    lon: number;
    lat: number;
  };
}

// Enveloppes de réponse de l'API Region Reunion
export interface ApiResponse<T> {
  total_count: number;
  results: T[];
}