// Types basés sur le MCD proposé

export interface Cinema {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  login: string;
  motDePasse: string;
  email: string;
  createdAt: Date;
}

export type CinemaProfile = Omit<Cinema, 'motDePasse'>;

export interface Film {
  id: number;
  titre: string;
  duree: number;
  langue: string;
  sousTitres: boolean;
  realisateur: string;
  acteursPrincipaux: string;
  synopsis: string;
  ageMinimum: string;
  genres: string;
  poster: string;
  createdAt: Date;
}

export interface Programmation {
  id: number;
  filmId: number;
  cinemaId: number;
  dateDebut: Date;
  dateFin: Date;
  jour1: string;
  jour2: string;
  jour3: string;
  heureDebut: string;
  createdAt: Date;
}

export interface FilmWithProgrammations extends Film {
  programmations: Programmation[];
}

// Types pour les réponses des API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

// Types pour les formulaires
export interface LoginFormData {
  login: string;
  motDePasse: string;
  rememberMe?: boolean;
}

export interface FilmFormData {
  titre: string;
  duree: number;
  langue: string;
  sousTitres: boolean;
  realisateur: string;
  acteursPrincipaux: string;
  synopsis: string;
  ageMinimum: string;
  genres: string;
  poster: string;
}

export interface ProgrammationFormData {
  dateDebut: Date;
  dateFin: Date;
  jour1: string;
  jour2: string;
  jour3: string;
  heureDebut: string;
}

// Types pour les filtres
export interface FilmFilterOptions {
  ville: string;
  langue?: string;
  ageMinimum?: string;
  sort?: 'newest' | 'alphabetical' | 'rating' | 'popular';
}