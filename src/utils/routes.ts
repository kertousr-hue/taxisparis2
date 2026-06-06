export const routes = {
  home: '/',

  // Department routes
  paris: '/taxi-conventionne-paris-75/',
  essonne: '/taxi-conventionne-essonne-91/',
  hautsDeSeine: '/taxi-conventionne-hauts-de-seine-92/',
  seineSaintDenis: '/taxi-conventionne-seine-saint-denis-93/',
  valDeMarne: '/taxi-conventionne-val-de-marne-94/',

  // Service routes
  reservation: '/reservation-taxi-vsl/',
  airportTransfer: '/taxis-aeroports-parisiens/',
  stationTransfer: '/taxis-gares-parisiennes/',
  zones: '/zones-desservies/',
  about: '/qui-sommes-nous/',
  blog: '/blog/',
  faq: '/faq/',
  contact: '/contact/',

  // Dynamic city route
  city: (departmentSlug: string, citySlug: string) =>
    `/${departmentSlug}/${citySlug}/`,
};
