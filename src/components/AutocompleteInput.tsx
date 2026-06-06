import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import { fetchHereAutocomplete, geocodeAddress, debounce, type HereAutocompleteSuggestion } from '../utils/here';

interface AutocompleteInputProps {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  apiKey: string;
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  onInputChange: (value: string) => void;
  isValidated: boolean;
  hasError?: boolean;
}

export default function AutocompleteInput({
  label,
  value,
  placeholder,
  required = false,
  apiKey,
  onAddressSelect,
  onInputChange,
  isValidated,
  hasError = false,
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<HereAutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await fetchHereAutocomplete(query, apiKey);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  useEffect(() => {
    if (value.length >= 3) {
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  }, [value, debouncedFetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onInputChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = async (suggestion: HereAutocompleteSuggestion) => {
    setIsGeocoding(true);
    setShowSuggestions(false);

    try {
      const geocodeResult = await geocodeAddress(suggestion.address.label, apiKey);

      if (geocodeResult) {
        onAddressSelect(
          geocodeResult.address,
          geocodeResult.coordinates.lat,
          geocodeResult.coordinates.lng
        );
        setSuggestions([]);
      } else {
        console.error('Failed to geocode address');
        onInputChange(suggestion.address.label);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      onInputChange(suggestion.address.label);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const inputId = `autocomplete-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={inputId} className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
        <MapPin size={12} aria-hidden="true" className="text-gray-400" />
        {label} {required && '*'}
      </label>
      <input
        ref={inputRef}
        type="text"
        id={inputId}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        required={required}
        aria-required={required ? 'true' : 'false'}
        aria-autocomplete="list"
        aria-controls={`${inputId}-suggestions`}
        aria-expanded={showSuggestions && suggestions.length > 0}
        placeholder={placeholder}
        disabled={isGeocoding}
        className={`w-full px-4 py-3 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          isValidated
            ? 'border-green-400 bg-green-50 text-gray-800'
            : hasError
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 bg-gray-50 focus:bg-white'
        } ${isGeocoding ? 'opacity-60 cursor-wait' : ''}`}
      />
      {isValidated && (
        <div role="status" aria-live="polite" className="mt-1.5 text-xs text-green-600 flex items-center gap-1 font-medium">
          <CheckCircle size={12} aria-hidden="true" /> Adresse valide
        </div>
      )}
      {isGeocoding && (
        <div role="status" aria-live="polite" className="mt-1.5 text-xs text-blue-600 flex items-center gap-1.5">
          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Vérification en cours…
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && !isGeocoding && (
        <ul
          id={`${inputId}-suggestions`}
          role="listbox"
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-1.5 max-h-56 overflow-y-auto"
          style={{ top: '100%' }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              role="option"
              aria-selected={false}
              tabIndex={0}
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSuggestionClick(suggestion);
                }
              }}
              className="flex items-start gap-2.5 px-4 py-3 hover:bg-blue-50 active:bg-blue-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors focus:bg-blue-50 focus:outline-none"
            >
              <MapPin size={13} className="text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <div className="font-semibold text-gray-900 text-sm leading-tight">{suggestion.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">{suggestion.address.label}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && isLoading && value.length >= 3 && (
        <div role="status" aria-live="polite" className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-1.5 p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Recherche en cours…
        </div>
      )}
      {showSuggestions && !isLoading && suggestions.length === 0 && value.length >= 3 && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-1.5 p-4 text-center text-sm text-gray-500">
          Aucune suggestion — saisir l'adresse complète manuellement
        </div>
      )}
    </div>
  );
}
