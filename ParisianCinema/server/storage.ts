import {
  cinemas, type Cinema, type InsertCinema,
  films, type Film, type InsertFilm,
  programmations, type Programmation, type InsertProgrammation,
  type FilmWithProgrammations, type CinemaProfile
} from "@shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // Cinema operations
  getCinema(id: number): Promise<Cinema | undefined>;
  getCinemaByLogin(login: string): Promise<Cinema | undefined>;
  createCinema(cinema: InsertCinema): Promise<Cinema>;
  getCinemaProfile(id: number): Promise<CinemaProfile | undefined>;
  
  // Film operations
  getFilms(): Promise<Film[]>;
  getFilmsByVille(ville: string): Promise<FilmWithProgrammations[]>;
  getFilmById(id: number): Promise<FilmWithProgrammations | undefined>;
  getFilmsByCinemaId(cinemaId: number): Promise<Film[]>;
  createFilm(film: InsertFilm): Promise<Film>;
  updateFilm(id: number, film: Partial<Film>): Promise<Film | undefined>;
  deleteFilm(id: number): Promise<boolean>;

  // Programmation operations
  createProgrammation(programmation: InsertProgrammation): Promise<Programmation>;
  getProgrammationsByFilmId(filmId: number): Promise<Programmation[]>;
  getProgrammationsByCinemaId(cinemaId: number): Promise<Programmation[]>;
  updateProgrammation(id: number, programmation: Partial<Programmation>): Promise<Programmation | undefined>;
  deleteProgrammation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private cinemas: Map<number, Cinema>;
  private films: Map<number, Film>;
  private programmations: Map<number, Programmation>;
  private cinemaId: number;
  private filmId: number;
  private programmationId: number;

  constructor() {
    this.cinemas = new Map();
    this.films = new Map();
    this.programmations = new Map();
    this.cinemaId = 1;
    this.filmId = 1;
    this.programmationId = 1;

    // Create sample cinemas
    this.createCinema({
      nom: "Le Grand Rex",
      adresse: "1 Boulevard Poissonnière",
      ville: "Paris",
      login: "grandrex",
      motDePasse: "password123", // In a real app, this would be hashed
      email: "contact@legrandrex.com",
    });

    this.createCinema({
      nom: "UGC Ciné Cité Les Halles",
      adresse: "7 Place de la Rotonde",
      ville: "Paris",
      login: "ugchalles",
      motDePasse: "password123", // In a real app, this would be hashed
      email: "contact@ugc.fr",
    });

    // Create sample films
    const film1 = this.createFilm({
      titre: "Les Amants de Paris",
      duree: 135, // 2h 15m
      langue: "French",
      sousTitres: false,
      realisateur: "Jean-Pierre Clement",
      acteursPrincipaux: "Sophie Laurent, Michel Dubois, Clara Moreau",
      synopsis: "A touching story of two strangers who meet by chance in the streets of Paris.",
      ageMinimum: "12+",
      genres: "Drama, Romance",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
    });

    const film2 = this.createFilm({
      titre: "Horizon 2050",
      duree: 150, // 2h 30m
      langue: "English",
      sousTitres: true,
      realisateur: "Marie Fontaine",
      acteursPrincipaux: "John Smith, Emma Johnson, Pierre Dupont",
      synopsis: "A sci-fi thriller set in a future Paris where technology has transformed society.",
      ageMinimum: "16+",
      genres: "Sci-Fi, Thriller",
      poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
    });

    // Create programmations for the films
    this.createProgrammation({
      filmId: film1.id,
      cinemaId: 1,
      dateDebut: new Date("2023-05-15"),
      dateFin: new Date("2023-06-15"),
      jour1: "Lundi",
      jour2: "Mercredi",
      jour3: "Vendredi",
      heureDebut: new Date("2000-01-01T13:30:00").toTimeString().split(' ')[0],
    });

    this.createProgrammation({
      filmId: film1.id,
      cinemaId: 2,
      dateDebut: new Date("2023-05-20"),
      dateFin: new Date("2023-06-20"),
      jour1: "Mardi",
      jour2: "Jeudi",
      jour3: "Samedi",
      heureDebut: new Date("2000-01-01T14:00:00").toTimeString().split(' ')[0],
    });

    this.createProgrammation({
      filmId: film2.id,
      cinemaId: 1,
      dateDebut: new Date("2023-05-10"),
      dateFin: new Date("2023-06-10"),
      jour1: "Mardi",
      jour2: "Jeudi",
      jour3: "Samedi",
      heureDebut: new Date("2000-01-01T16:00:00").toTimeString().split(' ')[0],
    });
  }

  // Cinema methods
  async getCinema(id: number): Promise<Cinema | undefined> {
    return this.cinemas.get(id);
  }

  async getCinemaByLogin(login: string): Promise<Cinema | undefined> {
    return Array.from(this.cinemas.values()).find(cinema => cinema.login === login);
  }

  async createCinema(cinemaData: InsertCinema): Promise<Cinema> {
    const id = this.cinemaId++;
    const cinema: Cinema = { ...cinemaData, id, createdAt: new Date() };
    this.cinemas.set(id, cinema);
    return cinema;
  }

  async getCinemaProfile(id: number): Promise<CinemaProfile | undefined> {
    const cinema = await this.getCinema(id);
    if (!cinema) return undefined;
    
    // Omit password from cinema object
    const { motDePasse, ...cinemaProfile } = cinema;
    return cinemaProfile;
  }

  // Film methods
  async getFilms(): Promise<Film[]> {
    return Array.from(this.films.values());
  }

  async getFilmsByVille(ville: string): Promise<FilmWithProgrammations[]> {
    const cinemasInVille = Array.from(this.cinemas.values()).filter(
      cinema => cinema.ville.toLowerCase() === ville.toLowerCase()
    );
    
    const cinemaIds = cinemasInVille.map(cinema => cinema.id);
    
    const programmationsInVille = Array.from(this.programmations.values()).filter(
      prog => cinemaIds.includes(prog.cinemaId)
    );
    
    const filmIds = [...new Set(programmationsInVille.map(prog => prog.filmId))];
    
    const films = filmIds.map(filmId => this.films.get(filmId)).filter(Boolean) as Film[];
    
    return Promise.all(
      films.map(async film => {
        const filmProgrammations = await this.getProgrammationsByFilmId(film.id);
        return {
          ...film,
          programmations: filmProgrammations || [],
        };
      })
    );
  }

  async getFilmById(id: number): Promise<FilmWithProgrammations | undefined> {
    const film = this.films.get(id);
    if (!film) return undefined;

    const programmations = await this.getProgrammationsByFilmId(id);
    
    return {
      ...film,
      programmations: programmations || [],
    };
  }

  async getFilmsByCinemaId(cinemaId: number): Promise<Film[]> {
    const programmations = Array.from(this.programmations.values()).filter(
      prog => prog.cinemaId === cinemaId
    );
    
    const filmIds = [...new Set(programmations.map(prog => prog.filmId))];
    
    return filmIds.map(filmId => this.films.get(filmId)).filter(Boolean) as Film[];
  }

  async createFilm(filmData: InsertFilm): Promise<Film> {
    const id = this.filmId++;
    const film: Film = { ...filmData, id, createdAt: new Date() };
    this.films.set(id, film);
    return film;
  }

  async updateFilm(id: number, filmData: Partial<Film>): Promise<Film | undefined> {
    const film = this.films.get(id);
    if (!film) return undefined;

    const updatedFilm = { ...film, ...filmData };
    this.films.set(id, updatedFilm);
    return updatedFilm;
  }

  async deleteFilm(id: number): Promise<boolean> {
    // Delete associated programmations first
    const programmationsToDelete = Array.from(this.programmations.values())
      .filter(prog => prog.filmId === id);
    
    for (const prog of programmationsToDelete) {
      await this.deleteProgrammation(prog.id);
    }
    
    return this.films.delete(id);
  }

  // Programmation methods
  async createProgrammation(programmationData: InsertProgrammation): Promise<Programmation> {
    const id = this.programmationId++;
    const programmation: Programmation = { ...programmationData, id, createdAt: new Date() };
    this.programmations.set(id, programmation);
    return programmation;
  }

  async getProgrammationsByFilmId(filmId: number): Promise<Programmation[]> {
    return Array.from(this.programmations.values()).filter(
      prog => prog.filmId === filmId
    );
  }

  async getProgrammationsByCinemaId(cinemaId: number): Promise<Programmation[]> {
    return Array.from(this.programmations.values()).filter(
      prog => prog.cinemaId === cinemaId
    );
  }

  async updateProgrammation(id: number, programmationData: Partial<Programmation>): Promise<Programmation | undefined> {
    const programmation = this.programmations.get(id);
    if (!programmation) return undefined;

    const updatedProgrammation = { ...programmation, ...programmationData };
    this.programmations.set(id, updatedProgrammation);
    return updatedProgrammation;
  }

  async deleteProgrammation(id: number): Promise<boolean> {
    return this.programmations.delete(id);
  }
}

export const storage = new MemStorage();
