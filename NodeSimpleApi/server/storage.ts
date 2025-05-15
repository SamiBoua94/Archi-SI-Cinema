import { 
  Cinema, 
  InsertCinema, 
  Film, 
  InsertFilm, 
  Programmation, 
  InsertProgrammation,
  FilmWithProgrammations,
  ProgrammationWithDetails,
  CinemaWithoutPassword
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage methods
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  // Cinema methods
  getCinema(id: number): Promise<Cinema | undefined>;
  getCinemaByLogin(login: string): Promise<Cinema | undefined>;
  getAllCinemas(ville?: string): Promise<CinemaWithoutPassword[]>;
  createCinema(cinema: InsertCinema): Promise<Cinema>;
  updateCinema(id: number, cinema: Partial<InsertCinema>): Promise<Cinema>;
  deleteCinema(id: number): Promise<void>;
  
  // Film methods
  getFilm(id: number): Promise<Film | undefined>;
  getAllFilms(): Promise<Film[]>;
  getFilmsByCity(city: string, genre?: string): Promise<FilmWithProgrammations[]>;
  getFilmWithProgrammations(id: number): Promise<FilmWithProgrammations | undefined>;
  createFilm(film: InsertFilm): Promise<Film>;
  updateFilm(id: number, film: Partial<InsertFilm>): Promise<Film>;
  deleteFilm(id: number): Promise<void>;
  
  // Programmation methods
  getProgrammation(id: number): Promise<Programmation | undefined>;
  getProgrammationWithDetails(id: number): Promise<ProgrammationWithDetails | undefined>;
  getProgrammationsByCinema(cinemaId: number): Promise<Programmation[]>;
  getProgrammationsByFilm(filmId: number): Promise<Programmation[]>;
  createProgrammation(programmation: InsertProgrammation & { cinemaid: number }): Promise<Programmation>;
  updateProgrammation(id: number, programmation: Partial<InsertProgrammation & { cinemaid: number }>): Promise<Programmation>;
  deleteProgrammation(id: number): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private cinemas: Map<number, Cinema>;
  private films: Map<number, Film>;
  private programmations: Map<number, Programmation>;
  private cinemaIdCounter: number;
  private filmIdCounter: number;
  private programmationIdCounter: number;
  public sessionStore: session.Store;
  
  constructor() {
    this.cinemas = new Map();
    this.films = new Map();
    this.programmations = new Map();
    this.cinemaIdCounter = 1;
    this.filmIdCounter = 1;
    this.programmationIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // This is just for development purposes
    // In production, this would be loaded from a database

    // Create sample cinemas
    const cinema1: Cinema = {
      id: this.cinemaIdCounter++,
      nom: "Cinéma Gaumont Opéra",
      adresse: "2 Boulevard des Capucines",
      ville: "Paris",
      login: "gaumont",
      mot_de_passe: "$2b$10$7VVuTXBuQVB1wM3OdCqeW.UItYGYxByYgPBYM5IFgDRPQb3sLl0JO", // "password123"
      email: "contact@gaumont.fr",
      created_at: new Date()
    };

    const cinema2: Cinema = {
      id: this.cinemaIdCounter++,
      nom: "UGC Ciné Cité Les Halles",
      adresse: "7 Place de la Rotonde",
      ville: "Paris",
      login: "ugc",
      mot_de_passe: "$2b$10$7VVuTXBuQVB1wM3OdCqeW.UItYGYxByYgPBYM5IFgDRPQb3sLl0JO", // "password123"
      email: "contact@ugc.fr",
      created_at: new Date()
    };

    const cinema3: Cinema = {
      id: this.cinemaIdCounter++,
      nom: "MK2 Bibliothèque",
      adresse: "128-162 Avenue de France",
      ville: "Paris",
      login: "mk2",
      mot_de_passe: "$2b$10$7VVuTXBuQVB1wM3OdCqeW.UItYGYxByYgPBYM5IFgDRPQb3sLl0JO", // "password123"
      email: "contact@mk2.fr",
      created_at: new Date()
    };

    // Add cinemas to map
    this.cinemas.set(cinema1.id, cinema1);
    this.cinemas.set(cinema2.id, cinema2);
    this.cinemas.set(cinema3.id, cinema3);

    // Create sample films
    const film1: Film = {
      id: this.filmIdCounter++,
      titre: "Le Voyage de Chihiro",
      duree: 125,
      langue: "Japonais",
      sous_titres: true,
      realisateur: "Hayao Miyazaki",
      acteurs_principaux: "Rumi Hiiragi, Miyu Irino",
      synopsis: "Chihiro, une fillette de 10 ans, est en route vers sa nouvelle demeure en compagnie de ses parents. Au cours du voyage, la famille fait une halte dans un parc à thème qui leur paraît délabré. Lors de la visite, les parents s'arrêtent dans un des bâtiments pour déguster quelques mets très appétissants, malgré l'absence de vendeurs. Comme ils se régalent, ils ordonnent à Chihiro d'aller visiter les lieux. Prise de panique, Chihiro les rejoint et les trouve transformés en porcs. Elle rencontre alors l'énigmatique Haku, qui lui explique qu'il s'agit d'un monde où les humains ne sont pas les bienvenus.",
      age_minimum: "Tous publics",
      genres: "Animation, Aventure, Fantastique",
      poster: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
      created_at: new Date()
    };

    const film2: Film = {
      id: this.filmIdCounter++,
      titre: "Amélie",
      duree: 122,
      langue: "Français",
      sous_titres: false,
      realisateur: "Jean-Pierre Jeunet",
      acteurs_principaux: "Audrey Tautou, Mathieu Kassovitz",
      synopsis: "Amélie, une jeune serveuse dans un bar de Montmartre, passe son temps à observer les gens et à laisser son imagination divaguer. Elle s'est fixé un objectif : faire le bien de ceux qui l'entourent. Elle invente alors des stratagèmes pour intervenir incognito dans leur existence.",
      age_minimum: "Tous publics",
      genres: "Comédie, Romance",
      poster: "https://m.media-amazon.com/images/M/MV5BNDg4NjM1YjMtYmNhZC00MjM0LWFiZmYtNGY1YjA3MzZmODc5XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg",
      created_at: new Date()
    };

    const film3: Film = {
      id: this.filmIdCounter++,
      titre: "Le Fabuleux Destin d'Amélie Poulain",
      duree: 122,
      langue: "Français",
      sous_titres: false,
      realisateur: "Jean-Pierre Jeunet",
      acteurs_principaux: "Audrey Tautou, Mathieu Kassovitz",
      synopsis: "Amélie, une jeune serveuse dans un bar de Montmartre, passe son temps à observer les gens et à laisser son imagination divaguer. Elle s'est fixé un objectif : faire le bien de ceux qui l'entourent. Elle invente alors des stratagèmes pour intervenir incognito dans leur existence.",
      age_minimum: "Tous publics",
      genres: "Comédie, Romance",
      poster: "https://m.media-amazon.com/images/M/MV5BNDg4NjM1YjMtYmNhZC00MjM0LWFiZmYtNGY1YjA3MzZmODc5XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg",
      created_at: new Date()
    };

    const film4: Film = {
      id: this.filmIdCounter++,
      titre: "Inception",
      duree: 148,
      langue: "Anglais",
      sous_titres: true,
      realisateur: "Christopher Nolan",
      acteurs_principaux: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
      synopsis: "Dom Cobb est un voleur expérimenté, le meilleur dans l'art dangereux de l'extraction, voler les secrets les plus intimes enfouis au plus profond du subconscient durant une phase de rêve, lorsque l'esprit est le plus vulnérable. Les capacités de Cobb ont fait de lui une cible recherchée dans le monde troubles de l'espionnage industriel, mais au prix de tout ce qu'il a jamais aimé. Cobb se voit offrir une chance de rédemption lorsqu'on lui propose un dernier travail : accomplir l'inception, implanter une idée dans l'esprit d'une personne. S'ils réussissent, ce sera le crime parfait.",
      age_minimum: "12+",
      genres: "Action, Science-Fiction, Thriller",
      poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      created_at: new Date()
    };

    // Add films to map
    this.films.set(film1.id, film1);
    this.films.set(film2.id, film2);
    this.films.set(film3.id, film3);
    this.films.set(film4.id, film4);

    // Create sample programmations
    const programmation1: Programmation = {
      id: this.programmationIdCounter++,
      filmid: film1.id,
      cinemaid: cinema1.id,
      date_debut: "2025-05-01",
      date_fin: "2025-05-31",
      jour_1: "Monday",
      jour_2: "Wednesday",
      jour_3: "Friday",
      heure_debut: "19:30",
      created_at: new Date()
    };

    const programmation2: Programmation = {
      id: this.programmationIdCounter++,
      filmid: film2.id,
      cinemaid: cinema2.id,
      date_debut: "2025-05-01",
      date_fin: "2025-06-15",
      jour_1: "Tuesday",
      jour_2: "Thursday",
      jour_3: "Saturday",
      heure_debut: "20:00",
      created_at: new Date()
    };

    const programmation3: Programmation = {
      id: this.programmationIdCounter++,
      filmid: film3.id,
      cinemaid: cinema3.id,
      date_debut: "2025-05-15",
      date_fin: "2025-06-30",
      jour_1: "Wednesday",
      jour_2: "Friday",
      jour_3: "Sunday",
      heure_debut: "18:45",
      created_at: new Date()
    };

    const programmation4: Programmation = {
      id: this.programmationIdCounter++,
      filmid: film4.id,
      cinemaid: cinema1.id,
      date_debut: "2025-05-10",
      date_fin: "2025-06-10",
      jour_1: "Monday",
      jour_2: "Thursday",
      jour_3: "Saturday",
      heure_debut: "21:15",
      created_at: new Date()
    };

    // Add programmations to map
    this.programmations.set(programmation1.id, programmation1);
    this.programmations.set(programmation2.id, programmation2);
    this.programmations.set(programmation3.id, programmation3);
    this.programmations.set(programmation4.id, programmation4);
  }
  
  // Cinema methods
  async getCinema(id: number): Promise<Cinema | undefined> {
    return this.cinemas.get(id);
  }
  
  async getCinemaByLogin(login: string): Promise<Cinema | undefined> {
    return Array.from(this.cinemas.values()).find(cinema => cinema.login === login);
  }
  
  async getAllCinemas(ville?: string): Promise<CinemaWithoutPassword[]> {
    let cinemas = Array.from(this.cinemas.values());
    
    if (ville) {
      cinemas = cinemas.filter(cinema => cinema.ville.toLowerCase() === ville.toLowerCase());
    }
    
    return cinemas.map(({ mot_de_passe, ...rest }) => rest);
  }
  
  async createCinema(cinema: InsertCinema): Promise<Cinema> {
    const id = this.cinemaIdCounter++;
    const now = new Date();
    const newCinema: Cinema = {
      ...cinema,
      id,
      created_at: now
    };
    
    this.cinemas.set(id, newCinema);
    return newCinema;
  }
  
  async updateCinema(id: number, cinemaData: Partial<InsertCinema>): Promise<Cinema> {
    const existingCinema = this.cinemas.get(id);
    if (!existingCinema) {
      throw new Error(`Cinema with ID ${id} not found`);
    }
    
    const updatedCinema: Cinema = {
      ...existingCinema,
      ...cinemaData
    };
    
    this.cinemas.set(id, updatedCinema);
    return updatedCinema;
  }
  
  async deleteCinema(id: number): Promise<void> {
    this.cinemas.delete(id);
    
    // Delete associated programmations
    for (const [progId, prog] of this.programmations.entries()) {
      if (prog.cinemaid === id) {
        this.programmations.delete(progId);
      }
    }
  }
  
  // Film methods
  async getFilm(id: number): Promise<Film | undefined> {
    return this.films.get(id);
  }
  
  async getAllFilms(): Promise<Film[]> {
    return Array.from(this.films.values());
  }
  
  async getFilmsByCity(city: string, genre?: string): Promise<FilmWithProgrammations[]> {
    // Get all cinemas in the city
    const cinemas = await this.getAllCinemas(city);
    if (cinemas.length === 0) {
      return [];
    }
    
    const cinemaIds = cinemas.map(cinema => cinema.id);
    
    // Get all programmations for these cinemas
    const programmations = Array.from(this.programmations.values())
      .filter(prog => cinemaIds.includes(prog.cinemaid));
    
    if (programmations.length === 0) {
      return [];
    }
    
    // Get all films shown in these programmations
    const filmIds = [...new Set(programmations.map(prog => prog.filmid))];
    let films = filmIds.map(filmId => this.films.get(filmId))
      .filter((film): film is Film => film !== undefined);
    
    // Filter by genre if provided
    if (genre) {
      films = films.filter(film => 
        film.genres?.toLowerCase().includes(genre.toLowerCase())
      );
    }
    
    // Augment films with programmation info
    return films.map(film => {
      const filmProgrammations = programmations
        .filter(prog => prog.filmid === film.id)
        .map(prog => {
          const cinema = this.cinemas.get(prog.cinemaid);
          if (!cinema) return prog;
          
          const { mot_de_passe, ...cinemaWithoutPassword } = cinema;
          return {
            ...prog,
            cinema: cinemaWithoutPassword
          };
        });
      
      return {
        ...film,
        programmations: filmProgrammations
      };
    });
  }
  
  async getFilmWithProgrammations(id: number): Promise<FilmWithProgrammations | undefined> {
    const film = this.films.get(id);
    if (!film) {
      return undefined;
    }
    
    const programmations = Array.from(this.programmations.values())
      .filter(prog => prog.filmid === id)
      .map(prog => {
        const cinema = this.cinemas.get(prog.cinemaid);
        if (!cinema) return prog;
        
        const { mot_de_passe, ...cinemaWithoutPassword } = cinema;
        return {
          ...prog,
          cinema: cinemaWithoutPassword
        };
      });
    
    return {
      ...film,
      programmations
    };
  }
  
  async createFilm(film: InsertFilm): Promise<Film> {
    const id = this.filmIdCounter++;
    const now = new Date();
    const newFilm: Film = {
      ...film,
      id,
      created_at: now,
      poster: film.poster || '/images/default-poster.jpg'
    };
    
    this.films.set(id, newFilm);
    return newFilm;
  }
  
  async updateFilm(id: number, filmData: Partial<InsertFilm>): Promise<Film> {
    const existingFilm = this.films.get(id);
    if (!existingFilm) {
      throw new Error(`Film with ID ${id} not found`);
    }
    
    const updatedFilm: Film = {
      ...existingFilm,
      ...filmData
    };
    
    this.films.set(id, updatedFilm);
    return updatedFilm;
  }
  
  async deleteFilm(id: number): Promise<void> {
    this.films.delete(id);
    
    // Delete associated programmations
    for (const [progId, prog] of this.programmations.entries()) {
      if (prog.filmid === id) {
        this.programmations.delete(progId);
      }
    }
  }
  
  // Programmation methods
  async getProgrammation(id: number): Promise<Programmation | undefined> {
    return this.programmations.get(id);
  }
  
  async getProgrammationWithDetails(id: number): Promise<ProgrammationWithDetails | undefined> {
    const programmation = this.programmations.get(id);
    if (!programmation) {
      return undefined;
    }
    
    const film = this.films.get(programmation.filmid);
    const cinema = this.cinemas.get(programmation.cinemaid);
    
    let cinemaWithoutPassword: CinemaWithoutPassword | undefined;
    if (cinema) {
      const { mot_de_passe, ...rest } = cinema;
      cinemaWithoutPassword = rest;
    }
    
    return {
      ...programmation,
      film,
      cinema: cinemaWithoutPassword
    };
  }
  
  async getProgrammationsByCinema(cinemaId: number): Promise<Programmation[]> {
    return Array.from(this.programmations.values())
      .filter(prog => prog.cinemaid === cinemaId);
  }
  
  async getProgrammationsByFilm(filmId: number): Promise<Programmation[]> {
    return Array.from(this.programmations.values())
      .filter(prog => prog.filmid === filmId);
  }
  
  async createProgrammation(programmation: InsertProgrammation & { cinemaid: number }): Promise<Programmation> {
    const id = this.programmationIdCounter++;
    const now = new Date();
    const newProgrammation: Programmation = {
      ...programmation,
      id,
      created_at: now
    };
    
    this.programmations.set(id, newProgrammation);
    return newProgrammation;
  }
  
  async updateProgrammation(id: number, programmationData: Partial<InsertProgrammation & { cinemaid: number }>): Promise<Programmation> {
    const existingProgrammation = this.programmations.get(id);
    if (!existingProgrammation) {
      throw new Error(`Programming with ID ${id} not found`);
    }
    
    const updatedProgrammation: Programmation = {
      ...existingProgrammation,
      ...programmationData
    };
    
    this.programmations.set(id, updatedProgrammation);
    return updatedProgrammation;
  }
  
  async deleteProgrammation(id: number): Promise<void> {
    this.programmations.delete(id);
  }
}

// Export singleton instance
export const storage = new MemStorage();
