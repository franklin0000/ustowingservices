import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function AddressAutocomplete({ value, onChange, placeholder, onSelect }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  
  const MAPBOX_TOKEN = 'pk.eyJ1IjoidXN0b3dpbmciLCJhIjoiY21waGl5OWcwMGduaDJxcHhoYXI0djVzNyJ9.UbE-OghawPl0CCNYxpbriA';

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Prevent fetching if input is empty or matches the selected value
    if (!query.trim() || query === value) {
      setSuggestions([]);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        // Passing country=us,mx,ca limits results to the expected regions for Gruas (USA, Mexico, Canada)
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&country=us,mx,ca`);
        const data = await res.json();
        if (data.features) {
          setSuggestions(data.features);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [query, value]);

  const handleSelect = (feature) => {
    const address = feature.place_name;
    const lng = feature.center[0];
    const lat = feature.center[1];
    setQuery(address);
    setSuggestions([]);
    setShowDropdown(false);
    onSelect(address, lat, lng);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input 
          type="text"
          className="input-field pr-10"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Search className="w-5 h-5" />}
        </div>
      </div>
      
      <AnimatePresenceWrapper show={showDropdown && suggestions.length > 0}>
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li 
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition flex flex-col"
            >
              <span className="text-sm font-bold text-gray-900 truncate">{item.text}</span>
              <span className="text-xs text-gray-500 truncate mt-0.5">{item.place_name}</span>
            </li>
          ))}
        </ul>
      </AnimatePresenceWrapper>
    </div>
  );
}

// Helper to add a nice fade animation to the dropdown
import { motion, AnimatePresence } from 'framer-motion';
function AnimatePresenceWrapper({ show, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
