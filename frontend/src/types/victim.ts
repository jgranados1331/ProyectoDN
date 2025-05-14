export interface Victim {
  id: number;
  full_name: string;
  image_url: string;
  is_dead: boolean;
  death_time?: string;
  cause?: string;
  details?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface DeathDetails {
  cause: string;
  specifics?: string;
}