import { Film, FilmWithProgrammations, Programmation, Cinema, CinemaProfile } from "./types";

// Données fictives basées sur notre MCD
const cinemas: Cinema[] = [
  {
    id: 1,
    nom: "Le Grand Rex",
    adresse: "1 Boulevard Poissonnière",
    ville: "Paris",
    login: "grandrex",
    motDePasse: "password123",
    email: "contact@legrandrex.com",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: 2,
    nom: "UGC Ciné Cité Les Halles",
    adresse: "7 Place de la Rotonde",
    ville: "Paris",
    login: "ugchalles",
    motDePasse: "password123",
    email: "contact@ugc.fr",
    createdAt: new Date("2023-01-20"),
  },
  {
    id: 3,
    nom: "Pathé Belleville",
    adresse: "77 Boulevard de Belleville",
    ville: "Paris",
    login: "pathebelleville",
    motDePasse: "password123",
    email: "belleville@pathe.com",
    createdAt: new Date("2023-02-05"),
  },
  {
    id: 4,
    nom: "MK2 Bibliothèque",
    adresse: "128-162 Avenue de France",
    ville: "Paris",
    login: "mk2bibliotheque",
    motDePasse: "password123",
    email: "bibliotheque@mk2.com",
    createdAt: new Date("2023-02-10"),
  }
];

const films: Film[] = [
  {
    id: 1,
    titre: "Les Amants de Paris",
    duree: 135,
    langue: "French",
    sousTitres: false,
    realisateur: "Jean-Pierre Clement",
    acteursPrincipaux: "Sophie Laurent, Michel Dubois, Clara Moreau",
    synopsis: "A touching story of two strangers who meet by chance in the streets of Paris.",
    ageMinimum: "12+",
    genres: "Drama, Romance",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
    createdAt: new Date("2023-03-10"),
  },
  {
    id: 2,
    titre: "Horizon 2050",
    duree: 150,
    langue: "English",
    sousTitres: true,
    realisateur: "Marie Fontaine",
    acteursPrincipaux: "John Smith, Emma Johnson, Pierre Dupont",
    synopsis: "A sci-fi thriller set in a future Paris where technology has transformed society.",
    ageMinimum: "16+",
    genres: "Sci-Fi, Thriller",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
    createdAt: new Date("2023-03-15"),
  },
  {
    id: 3,
    titre: "La Dernière Danse",
    duree: 120,
    langue: "French",
    sousTitres: false,
    realisateur: "Philippe Moreau",
    acteursPrincipaux: "Isabelle Dumont, Andre Martin, Julie Lefevre",
    synopsis: "An aging dance instructor finds new purpose when teaching a talented but troubled youth.",
    ageMinimum: "All",
    genres: "Drama",
    poster: "https://images.unsplash.com/photo-1545959570-a94c7d309061?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
    createdAt: new Date("2023-03-25"),
  },
  {
    id: 4,
    titre: "Le Secret des Catacombes",
    duree: 105,
    langue: "French",
    sousTitres: true,
    realisateur: "Alexandre Dubois",
    acteursPrincipaux: "Marc Lenoir, Caroline Petit, Thomas Girard",
    synopsis: "A historian discovers a mysterious artifact in the Paris catacombs, leading to a dangerous pursuit.",
    ageMinimum: "12+",
    genres: "Adventure, Mystery",
    poster: "https://images.unsplash.com/photo-1635606486435-7c8e839eb336?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
    createdAt: new Date("2023-04-05"),
  },
  {
    id: 5,
    titre: "Midnight in Montmartre",
    duree: 140,
    langue: "English",
    sousTitres: true,
    realisateur: "David Cohen",
    acteursPrincipaux: "Rachel Wilson, Michael Harris, Sophie Dubois",
    synopsis: "An American writer finds inspiration and romance during late night walks in Montmartre.",
    ageMinimum: "All",
    genres: "Romance, Comedy",
    poster: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=750",
    createdAt: new Date("2023-04-20"),
  }
];

const programmations: Programmation[] = [
  {
    id: 1,
    filmId: 1,
    cinemaId: 1,
    dateDebut: new Date("2023-05-15"),
    dateFin: new Date("2023-06-15"),
    jour1: "Lundi",
    jour2: "Mercredi",
    jour3: "Vendredi",
    heureDebut: "13:30:00",
    createdAt: new Date("2023-04-30"),
  },
  {
    id: 2,
    filmId: 1,
    cinemaId: 2,
    dateDebut: new Date("2023-05-20"),
    dateFin: new Date("2023-06-20"),
    jour1: "Mardi",
    jour2: "Jeudi",
    jour3: "Samedi",
    heureDebut: "14:00:00",
    createdAt: new Date("2023-05-05"),
  },
  {
    id: 3,
    filmId: 2,
    cinemaId: 1,
    dateDebut: new Date("2023-05-10"),
    dateFin: new Date("2023-06-10"),
    jour1: "Mardi",
    jour2: "Jeudi",
    jour3: "Samedi",
    heureDebut: "16:00:00",
    createdAt: new Date("2023-04-25"),
  },
  {
    id: 4,
    filmId: 3,
    cinemaId: 3,
    dateDebut: new Date("2023-05-05"),
    dateFin: new Date("2023-06-05"),
    jour1: "Lundi",
    jour2: "Mercredi",
    jour3: "Dimanche",
    heureDebut: "19:30:00",
    createdAt: new Date("2023-04-20"),
  },
  {
    id: 5,
    filmId: 4,
    cinemaId: 4,
    dateDebut: new Date("2023-05-25"),
    dateFin: new Date("2023-06-25"),
    jour1: "Mardi",
    jour2: "Vendredi",
    jour3: "Samedi",
    heureDebut: "20:45:00",
    createdAt: new Date("2023-05-10"),
  },
  {
    id: 6,
    filmId: 5,
    cinemaId: 2,
    dateDebut: new Date("2023-05-15"),
    dateFin: new Date("2023-06-15"),
    jour1: "Mercredi",
    jour2: "Vendredi",
    jour3: "Dimanche",
    heureDebut: "21:15:00",
    createdAt: new Date("2023-05-01"),
  },
  {
    id: 7,
    filmId: 5,
    cinemaId: 4,
    dateDebut: new Date("2023-05-20"),
    dateFin: new Date("2023-06-20"),
    jour1: "Lundi",
    jour2: "Jeudi",
    jour3: "Samedi",
    heureDebut: "18:30:00",
    createdAt: new Date("2023-05-05"),
  }
];

// Fonctions pour simuler des appels API

// Authentification
export const login = async (login: string, motDePasse: string): Promise<{ cinema: CinemaProfile, message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cinema = cinemas.find(c => c.login === login);
      
      if (!cinema || cinema.motDePasse !== motDePasse) {
        reject({ message: "Invalid login or password" });
        return;
      }
      
      const { motDePasse: _, ...cinemaProfile } = cinema;
      
      resolve({
        cinema: cinemaProfile,
        message: "Login successful"
      });
    }, 500);
  });
};

export const logout = async (): Promise<{ message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "Logged out successfully" });
    }, 300);
  });
};

export const getCinemaProfile = async (cinemaId: number): Promise<CinemaProfile> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cinema = cinemas.find(c => c.id === cinemaId);
      
      if (!cinema) {
        reject({ message: "Cinema not found" });
        return;
      }
      
      const { motDePasse, ...cinemaProfile } = cinema;
      
      resolve(cinemaProfile);
    }, 300);
  });
};

// Films
export const getAllFilms = async (): Promise<Film[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...films]);
    }, 400);
  });
};

export const getFilmsByVille = async (
  ville: string,
  langue?: string,
  ageMinimum?: string,
  sort?: "newest" | "alphabetical" | "rating" | "popular"
): Promise<FilmWithProgrammations[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Trouver les cinémas dans la ville donnée
      const cinemasInVille = cinemas.filter(c => c.ville.toLowerCase() === ville.toLowerCase());
      const cinemaIds = cinemasInVille.map(c => c.id);
      
      // 2. Trouver les programmations pour ces cinémas
      const progsInVille = programmations.filter(p => cinemaIds.includes(p.cinemaId));
      
      // 3. Obtenir les films uniques à partir de ces programmations
      const filmIdsMap = progsInVille.map(p => p.filmId).reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<number, boolean>);
      const filmIds = Object.keys(filmIdsMap).map(Number);
      const filmsInVille = films.filter(f => filmIds.includes(f.id));
      
      // 4. Ajouter les programmations à chaque film
      let filmsWithProgrammations = filmsInVille.map(film => {
        const filmProgs = progsInVille.filter(p => p.filmId === film.id);
        return {
          ...film,
          programmations: filmProgs
        };
      });
      
      // Appliquer les filtres
      if (langue) {
        filmsWithProgrammations = filmsWithProgrammations.filter(film => film.langue === langue);
      }
      
      if (ageMinimum) {
        filmsWithProgrammations = filmsWithProgrammations.filter(film => film.ageMinimum === ageMinimum);
      }
      
      // Appliquer le tri
      if (sort) {
        switch (sort) {
          case "newest":
            filmsWithProgrammations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            break;
          case "alphabetical":
            filmsWithProgrammations.sort((a, b) => a.titre.localeCompare(b.titre));
            break;
          case "rating":
          case "popular":
            // Pour simuler un tri par popularité ou note, nous utilisons un ordre aléatoire
            filmsWithProgrammations.sort(() => Math.random() - 0.5);
            break;
        }
      }
      
      resolve(filmsWithProgrammations);
    }, 600);
  });
};

export const getFilmById = async (id: number): Promise<FilmWithProgrammations | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const film = films.find(f => f.id === id);
      
      if (!film) {
        reject({ message: "Film not found" });
        return;
      }
      
      const filmProgrammations = programmations.filter(p => p.filmId === id);
      
      resolve({
        ...film,
        programmations: filmProgrammations
      });
    }, 300);
  });
};

export const getFilmsByCinemaId = async (cinemaId: number): Promise<Film[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trouver toutes les programmations pour ce cinema
      const cinemaProgs = programmations.filter(p => p.cinemaId === cinemaId);
      
      // Obtenir les IDs des films uniques
      const filmIdsMap = cinemaProgs.map(p => p.filmId).reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<number, boolean>);
      const filmIds = Object.keys(filmIdsMap).map(Number);
      
      // Récupérer les films complets
      const cinemaFilms = films.filter(f => filmIds.includes(f.id));
      
      resolve(cinemaFilms);
    }, 400);
  });
};

// Programmation
export const getProgrammationsByFilmId = async (filmId: number): Promise<Programmation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filmProgs = programmations.filter(p => p.filmId === filmId);
      resolve(filmProgs);
    }, 300);
  });
};

export const getProgrammationsByCinemaId = async (cinemaId: number): Promise<Programmation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cinemaProgs = programmations.filter(p => p.cinemaId === cinemaId);
      resolve(cinemaProgs);
    }, 300);
  });
};

// Création, mise à jour et suppression (pour le tableau de bord du cinéma)
export const createFilm = async (filmData: Omit<Film, "id" | "createdAt">): Promise<Film> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFilm: Film = {
        ...filmData,
        id: Math.max(...films.map(f => f.id)) + 1,
        createdAt: new Date()
      };
      
      films.push(newFilm);
      resolve(newFilm);
    }, 500);
  });
};

export const createProgrammation = async (programmationData: Omit<Programmation, "id" | "createdAt">): Promise<Programmation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProgrammation: Programmation = {
        ...programmationData,
        id: Math.max(...programmations.map(p => p.id)) + 1,
        createdAt: new Date()
      };
      
      programmations.push(newProgrammation);
      resolve(newProgrammation);
    }, 500);
  });
};

export const updateFilm = async (id: number, filmData: Partial<Film>): Promise<Film> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filmIndex = films.findIndex(f => f.id === id);
      
      if (filmIndex === -1) {
        reject({ message: "Film not found" });
        return;
      }
      
      const updatedFilm = {
        ...films[filmIndex],
        ...filmData
      };
      
      films[filmIndex] = updatedFilm;
      resolve(updatedFilm);
    }, 500);
  });
};

export const updateProgrammation = async (id: number, programmationData: Partial<Programmation>): Promise<Programmation> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const progIndex = programmations.findIndex(p => p.id === id);
      
      if (progIndex === -1) {
        reject({ message: "Programmation not found" });
        return;
      }
      
      const updatedProgrammation = {
        ...programmations[progIndex],
        ...programmationData
      };
      
      programmations[progIndex] = updatedProgrammation;
      resolve(updatedProgrammation);
    }, 500);
  });
};

export const deleteFilm = async (id: number): Promise<{ message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filmIndex = films.findIndex(f => f.id === id);
      
      if (filmIndex === -1) {
        reject({ message: "Film not found" });
        return;
      }
      
      // Supprimer le film
      films.splice(filmIndex, 1);
      
      // Supprimer les programmations associées
      const updatedProgrammations = programmations.filter(p => p.filmId !== id);
      programmations.length = 0;
      programmations.push(...updatedProgrammations);
      
      resolve({ message: "Film deleted successfully" });
    }, 500);
  });
};

export const deleteProgrammation = async (id: number): Promise<{ message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const progIndex = programmations.findIndex(p => p.id === id);
      
      if (progIndex === -1) {
        reject({ message: "Programmation not found" });
        return;
      }
      
      programmations.splice(progIndex, 1);
      resolve({ message: "Programmation deleted successfully" });
    }, 500);
  });
};