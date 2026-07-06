export interface ReservationData {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
}

export interface HairService {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: 'cut' | 'color' | 'style' | 'care';
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
}
