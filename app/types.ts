export interface Experience {
  id: number;
  title: string;
  description?: string;
  price?: number;
  location: string;
  schedule?: ExperienceSchedule;
  images?: ExperienceImage[];
  reviews?: Review[];
  tags?: Tag[];
  average_rating: number | null
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  admin: boolean;
  created_at?: string;
  last_login?: string;
}

export interface PaymentMethod {
  id: number;
  card_number: string;
  billing_zip: string;
  exp_month: number;
  exp_year: number;
  user_id: number;
}

export interface Referral {
  id: number;
  passcode: string;
  user_id: number;
}

export interface ExperienceImage {
  id: number;
  image_url: string;
}

export interface ExperienceSchedule {
  id: number;
  start_date?: string;
  end_date?: string;
  recurring_pattern?: string;
  days_of_week?: string;
  start_time?: string;
  end_time?: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
}

export interface Review {
  id: number;
  user_name: string;
  experience_id: number;
  rating: number;
  comment?: string;
  timestamp: string;
}

export interface Bundle {
  id: number;
  name: string;
  description?: string;
  total_price?: number;
  experiences?: Experience[];
}

export interface Booking {
  id: number;
  user_id: number;
  experience?: Experience;
  number_of_guests: number;
  confirmation_code: string;
  bundle_id?: number;
  status?: string;
  created_at?: string;
  reservations: Reservation[];
}

export interface Payment {
  id: number;
  booking_id: number;
  user_id: number;
  amount: number;
  payment_method_id: number;
  status: string;
}

export interface Reservation {
  id: number;
  booking_id: number;
  date: string;
  timeslot?: string;
  status?: string;
  created_at?: string;
  start_time?: string;
  end_time?: string;
}
