export interface Department {
  code: string;
  name: string;
  description: string;
  cities: string[];
}

export interface Airport {
  name: string;
  code: string;
  forfait: string;
}

export interface Station {
  name: string;
  address: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
}
