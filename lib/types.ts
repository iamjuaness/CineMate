export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  name: string
  city: string
  address: string
  created_at: string
}

export interface Movie {
  id: string
  title: string
  description: string | null
  poster_url: string | null
  backdrop_url: string | null
  duration_minutes: number
  genre: string[]
  rating: number | null
  release_date: string
  director: string | null
  cast: string[] | null
  trailer_url: string | null
  in_theaters: boolean
  created_at: string
}

export interface Showtime {
  id: string
  movie_id: string
  location_id: string
  show_datetime: string
  available_seats: number
  total_seats: number
  price: number
  created_at: string
}

export interface Ticket {
  id: string
  user_id: string
  showtime_id: string
  seats_count: number
  total_amount: number
  purchase_date: string
  qr_code: string | null
  status: "active" | "used" | "cancelled"
  showtimes?: Showtime
}

export interface WatchedMovie {
  id: string
  user_id: string
  movie_id: string
  watched_date: string
  rating: number | null
  notes: string | null
  movies?: Movie
}

export interface WatchlistItem {
  id: string
  user_id: string
  movie_id: string
  added_date: string
  movies?: Movie
}

export interface UserPreferences {
  id: string
  user_id: string
  favorite_genres: string[]
  preferred_location_id: string | null
  updated_at: string
}
