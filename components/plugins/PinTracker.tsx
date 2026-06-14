'use client';

import { useEffect, useState } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { Chat, Message, supabase } from '@/lib/supabase';

interface PinTrackerProps {
  activeChat: Chat | null;
}

interface LocationPin {
  lat: number;
  lng: number;
  source: string;
}

// Extract lat/lng from a message body
function extractLocation(body: string): LocationPin | null {
  // WhatsApp location share format from webhook: may come as plain coords
  // Match patterns like: -26.2041,28.0473 or lat:-26.2041 lng:28.0473
  const coordPattern = /(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/;
  const match = body.match(coordPattern);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    // Basic sanity check for valid lat/lng ranges
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng, source: body.slice(0, 60) };
    }
  }
  return null;
}

export default function PinTracker({ activeChat }: PinTrackerProps) {
  const [pins, setPins] = useState<LocationPin[]>([]);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // Scan existing messages for location data
  useEffect(() => {
    if (!activeChat) {
      setPins([]);
      return;
    }

    async function scanMessages() {
      const { data } = await supabase
        .from('messages')
        .select('body')
        .eq('chat_id', activeChat!.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!data) return;
      const found: LocationPin[] = [];
      for (const msg of data as Pick<Message, 'body'>[]) {
        const pin = extractLocation(msg.body);
        if (pin) found.push(pin);
      }
      setPins(found);
    }

    scanMessages();
  }, [activeChat]);

  function addManualPin() {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) return;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
    setPins((prev) => [{ lat, lng, source: 'Manual entry' }, ...prev]);
    setManualLat('');
    setManualLng('');
  }

  function mapsUrl(lat: number, lng: number) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-[#6c63ff]" />
        <h3 className="text-sm font-semibold text-[#e8e8f0]">PinTracker</h3>
      </div>

      {/* Auto-detected pins */}
      {activeChat && pins.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-[#9090a8] uppercase tracking-wider">
            Detected Locations
          </p>
          {pins.map((pin, i) => (
            <div
              key={i}
              className="bg-[#1a1a24] rounded-lg p-3 border border-[#2a2a3a] flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <Navigation size={12} className="text-[#6c63ff] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#e8e8f0] font-medium tabular-nums">
                    {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
                  </p>
                  <p className="text-[10px] text-[#4a4a5a] truncate max-w-[140px]">
                    {pin.source}
                  </p>
                </div>
              </div>
              <a
                href={mapsUrl(pin.lat, pin.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-[#6c63ff] hover:text-[#9c93ff] transition-colors flex-shrink-0 mt-0.5"
              >
                <ExternalLink size={11} />
                Maps
              </a>
            </div>
          ))}
        </div>
      )}

      {activeChat && pins.length === 0 && (
        <div className="bg-[#1a1a24] rounded-lg p-4 border border-dashed border-[#2a2a3a] text-center">
          <MapPin size={20} className="text-[#4a4a5a] mx-auto mb-2" />
          <p className="text-xs text-[#4a4a5a]">
            No location data detected in this conversation yet.
          </p>
          <p className="text-[10px] text-[#2a2a3a] mt-1">
            Coordinates in messages are auto-extracted.
          </p>
        </div>
      )}

      {/* Manual coordinate entry */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] text-[#9090a8] uppercase tracking-wider">Manual Entry</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Latitude"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            className="flex-1 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-2 py-1.5 text-xs text-[#e8e8f0] placeholder-[#4a4a5a] outline-none focus:border-[#6c63ff] transition-colors"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            className="flex-1 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg px-2 py-1.5 text-xs text-[#e8e8f0] placeholder-[#4a4a5a] outline-none focus:border-[#6c63ff] transition-colors"
          />
        </div>
        <button
          onClick={addManualPin}
          disabled={!manualLat || !manualLng}
          className="flex items-center justify-center gap-2 bg-[#1a1a24] hover:bg-[#22223a] border border-[#2a2a3a] disabled:opacity-40 disabled:cursor-not-allowed text-[#e8e8f0] text-xs font-medium py-2 rounded-lg transition-colors"
        >
          <MapPin size={12} className="text-[#6c63ff]" />
          Pin Location
        </button>
      </div>

      {!activeChat && (
        <p className="text-xs text-[#4a4a5a] text-center py-4">
          Select a chat to track locations
        </p>
      )}
    </div>
  );
}
