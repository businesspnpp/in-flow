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
        <MapPin size={16} className="text-amber-600" />
        <h3 className="text-sm font-bold text-zinc-900">PinTracker</h3>
      </div>

      {/* Auto-detected pins */}
      {activeChat && pins.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">
            Detected Locations
          </p>
          {pins.map((pin, i) => (
            <div
              key={i}
              className="bg-white border border-zinc-200 rounded-lg p-3 flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <Navigation size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-900 font-medium tabular-nums">
                    {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate max-w-[140px]">
                    {pin.source}
                  </p>
                </div>
              </div>
              <a
                href={mapsUrl(pin.lat, pin.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-amber-600 hover:text-amber-700 transition-colors flex-shrink-0 mt-0.5 font-medium"
              >
                <ExternalLink size={11} />
                Maps
              </a>
            </div>
          ))}
        </div>
      )}

      {activeChat && pins.length === 0 && (
        <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-lg p-5 text-center">
          <MapPin size={20} className="text-zinc-400 mx-auto mb-2" />
          <p className="text-xs text-zinc-600">
            No location data detected in this conversation yet.
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">
            Coordinates in messages are auto-extracted.
          </p>
        </div>
      )}

      {/* Manual coordinate entry */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-medium">Manual Entry</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Latitude"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 transition-colors"
          />
        </div>
        <button
          onClick={addManualPin}
          disabled={!manualLat || !manualLng}
          className="flex items-center justify-center gap-2 bg-white border border-zinc-300 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 text-xs font-semibold py-2.5 rounded-lg transition-colors"
        >
          <MapPin size={12} className="text-amber-600" />
          Pin Location
        </button>
      </div>

      {!activeChat && (
        <p className="text-xs text-zinc-500 text-center py-4">
          Select a chat to track locations
        </p>
      )}
    </div>
  );
}
