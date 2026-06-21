export {};

declare global {
  namespace kakao.maps {
    class LatLng {
      constructor(lat: number, lng: number);
    }

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
    }

    class Marker {
      constructor(options: { position: LatLng; map?: Map });
      setMap(map: Map | null): void;
    }

    class InfoWindow {
      constructor(options: { content: string | HTMLElement; removable?: boolean });
      open(map: Map, marker: Marker): void;
    }

    interface MapOptions {
      center: LatLng;
      level: number;
    }

    function load(callback: () => void): void;
  }

  interface Window {
    kakao?: {
      maps: typeof kakao.maps;
    };
  }
}
