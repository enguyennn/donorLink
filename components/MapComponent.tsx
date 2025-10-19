import React, { useEffect, useRef, useMemo } from 'react';
import { Shelter, Need, Urgency, Status } from '../types';

interface MapComponentProps {
  shelters: Shelter[];
  needs: Need[];
}

const MapComponent: React.FC<MapComponentProps> = ({ shelters, needs }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const L = (window as any).L;
      if (!L) {
        console.error("Leaflet is not loaded");
        return;
      }
      
      mapRef.current = L.map(mapContainerRef.current).setView([47.6062, -122.3321], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }
  }, []);

  const sheltersWithActiveNeeds = useMemo(() => {
    const activeNeedShelterIds = new Set(needs.filter(n => n.status === Status.Active).map(n => n.shelterId));
    return shelters.filter(s => activeNeedShelterIds.has(s.id));
  }, [shelters, needs]);


  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    const highUrgencyIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const defaultIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    sheltersWithActiveNeeds.forEach(shelter => {
      const shelterNeeds = needs
        .filter(n => n.shelterId === shelter.id && n.status === Status.Active)
        .sort((a, b) => {
            const urgencyOrder = { [Urgency.High]: 1, [Urgency.Medium]: 2, [Urgency.Low]: 3 };
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        });

      if (shelterNeeds.length === 0) return;

      const hasHighUrgency = shelterNeeds.some(n => n.urgency === Urgency.High);

      const marker = L.marker([shelter.lat, shelter.lng], { icon: hasHighUrgency ? highUrgencyIcon : defaultIcon })
        .addTo(mapRef.current);

      const popupContent = `
        <div class="font-sans">
          <h3 class="font-bold text-lg text-gray-800 mb-1">${shelter.name}</h3>
          <p class="text-xs text-gray-500 mb-3">${shelter.address}</p>
          <div class="space-y-2 max-h-40 overflow-y-auto pr-2">
            ${shelterNeeds.map(need => `
              <div class="text-sm border-l-4 p-2 bg-gray-50 rounded-r-sm ${need.urgency === Urgency.High ? 'border-red-500' : need.urgency === Urgency.Medium ? 'border-yellow-500' : 'border-green-500'}">
                <p class="font-semibold text-gray-700">${need.name} <span class="font-normal">(${need.quantity} needed)</span></p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup'
      });
      
      markersRef.current.push(marker);
    });

  }, [sheltersWithActiveNeeds, needs]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default MapComponent;