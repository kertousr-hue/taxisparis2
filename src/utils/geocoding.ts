const EXTENDED_REGION_BBOX = '0.8000,47.9000,4.2000,50.1000';
const PARIS_CENTER = '48.8566,2.3522';
const VALID_DEPARTMENTS = ['75', '77', '78', '91', '92', '93', '94', '95', '60', '28'];

export interface AddressSuggestion {
  title: string;
  label: string;
  position: {
    lat: number;
    lng: number;
  };
  address: {
    label: string;
    countryCode: string;
    postalCode?: string;
  };
}

export async function fetchAddressSuggestions(
  query: string,
  apiKey: string
): Promise<AddressSuggestion[]> {
  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(
        query
      )}&in=countryCode:FRA&in=bbox:${EXTENDED_REGION_BBOX}&lang=fr&limit=5&apiKey=${apiKey}`
    );
    const data = await response.json();

    const addresses = data.items.filter((item: any) => {
      if (!item.position || !item.address) return false;

      const countryCode = item.address.countryCode;
      if (countryCode !== 'FRA') return false;

      const postalCode = item.address.postalCode;
      if (!postalCode) return false;

      const department = postalCode.substring(0, 2);
      return VALID_DEPARTMENTS.includes(department);
    });

    return addresses;
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    return [];
  }
}

export interface GeocodeResult {
  position: {
    lat: number;
    lng: number;
  };
  address: {
    label: string;
    countryCode: string;
    postalCode?: string;
  };
}

export async function geocodeAddress(
  address: string,
  apiKey: string
): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        address
      )}&in=countryCode:FRA&in=bbox:${EXTENDED_REGION_BBOX}&lang=fr&apiKey=${apiKey}`
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();

    if (!data.items?.length) {
      return null;
    }

    const result = data.items[0];
    const addressData = result.address;

    if (addressData.countryCode !== 'FRA') {
      throw new Error('L\'adresse doit être en France');
    }

    const postalCode = addressData.postalCode;
    if (postalCode && !VALID_DEPARTMENTS.includes(postalCode.substring(0, 2))) {
      throw new Error('L\'adresse doit être dans la zone autorisée (IDF, Oise, Eure-et-Loir)');
    }

    return result;
  } catch (err) {
    console.error('Error geocoding address:', err);
    throw err;
  }
}

export function validateFrenchAddress(address: {
  countryCode: string;
  postalCode?: string;
}): void {
  if (address.countryCode !== 'FRA') {
    throw new Error('L\'adresse doit être en France');
  }

  if (address.postalCode && !VALID_DEPARTMENTS.includes(address.postalCode.substring(0, 2))) {
    throw new Error('L\'adresse doit être dans la zone autorisée (IDF, Oise, Eure-et-Loir)');
  }
}
