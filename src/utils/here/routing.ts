export interface RouteResult {
  distance_km: number;
  duree_minutes: number;
}

export async function calculateRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  apiKey: string,
  departureDate?: string,
  departureTime?: string
): Promise<RouteResult | null> {
  if (!originLat || !originLng || !destLat || !destLng) {
    return null;
  }

  try {
    const url = new URL('https://router.hereapi.com/v8/routes');
    url.searchParams.set('transportMode', 'car');
    url.searchParams.set('origin', `${originLat},${originLng}`);
    url.searchParams.set('destination', `${destLat},${destLng}`);
    url.searchParams.set('return', 'summary');

    let departureDateTime: string;
    if (departureDate && departureTime) {
      departureDateTime = `${departureDate}T${departureTime}:00`;
    } else {
      departureDateTime = new Date().toISOString();
    }
    url.searchParams.set('departureTime', departureDateTime);
    url.searchParams.set('apiKey', apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('HERE Routing API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn('No routes found');
      return null;
    }

    const route = data.routes[0];
    const section = route.sections[0];
    const summary = section.summary;

    const distanceMeters = summary.length;
    const durationSeconds = summary.duration;

    const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));
    const durationMinutes = Math.round(durationSeconds / 60);

    return {
      distance_km: distanceKm,
      duree_minutes: durationMinutes,
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    return null;
  }
}
