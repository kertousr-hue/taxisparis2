export interface HereAutocompleteSuggestion {
  id: string;
  title: string;
  address: {
    label: string;
    countryCode?: string;
    postalCode?: string;
    city?: string;
  };
  resultType: string;
}

const VALID_DEPARTMENTS = ['75', '77', '78', '91', '92', '93', '94', '95', '60', '28'];

export async function fetchHereAutocomplete(
  query: string,
  apiKey: string
): Promise<HereAutocompleteSuggestion[]> {
  if (!query || query.length < 3) {
    return [];
  }

  if (!apiKey || apiKey === 'votre_clé_here_api') {
    console.error('HERE Maps API key is missing or not configured. Please set VITE_HERE_API_KEY in .env file');
    return [];
  }

  try {
    const bbox = '0.8000,47.9000,4.2000,50.1000';
    const url = new URL('https://autosuggest.search.hereapi.com/v1/autosuggest');
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '5');
    url.searchParams.set('lang', 'fr');
    url.searchParams.append('in', 'countryCode:FRA');
    url.searchParams.append('in', `bbox:${bbox}`);
    url.searchParams.set('apiKey', apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HERE Autosuggest API error:', response.status, response.statusText, errorText);
      return [];
    }

    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }

    const suggestions: HereAutocompleteSuggestion[] = data.items
      .filter((item: any) => {
        if (!item.address) return false;

        const label = item.address.label || '';
        const postalCode = item.address.postalCode || '';
        const postalCodeMatch = label.match(/\b(\d{5})\b/);

        const foundPostalCode = postalCode || (postalCodeMatch ? postalCodeMatch[1] : '');

        if (!foundPostalCode) return true;

        const department = foundPostalCode.substring(0, 2);

        return VALID_DEPARTMENTS.includes(department);
      })
      .map((item: any) => {
        const label = item.address.label || '';
        const postalCodeMatch = label.match(/\b(\d{5})\b/);
        const postalCode = item.address.postalCode || (postalCodeMatch ? postalCodeMatch[1] : '');

        return {
          id: item.id,
          title: item.title,
          address: {
            label: item.address.label,
            countryCode: item.address.countryCode || 'FRA',
            postalCode: postalCode,
            city: item.address.city,
          },
          resultType: item.resultType,
        };
      });

    return suggestions;
  } catch (error) {
    console.error('Error fetching HERE autocomplete:', error);
    return [];
  }
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
