import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import { 
  insertCinemaSchema, 
  insertFilmSchema, 
  insertProgrammationSchema,
  loginSchema,
  searchByCitySchema,
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      secret: "cineparis-secret-key",
      saveUninitialized: false,
    })
  );

  // Authentication check middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.session && req.session.cinemaId) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Helper function to handle validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return { data: schema.parse(data), error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        return { 
          data: null, 
          error: error.errors.reduce((acc: Record<string, string>, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          }, {})
        };
      }
      return { data: null, error: { _errors: ["Validation failed"] } };
    }
  };

  // Auth Routes
  app.post("/api/auth/login", async (req, res) => {
    const { data, error } = validateRequest(loginSchema, req.body);
    
    if (error) {
      return res.status(400).json({ errors: error });
    }
    
    try {
      const cinema = await storage.getCinemaByLogin(data.login);
      
      if (!cinema || cinema.motDePasse !== data.motDePasse) {
        return res.status(401).json({ 
          message: "Invalid credentials",
          errors: { general: "Invalid login or password" } 
        });
      }
      
      // Set cinema session
      req.session.cinemaId = cinema.id;
      req.session.cinemaLogin = cinema.login;
      
      // Remove password from response
      const { motDePasse, ...cinemaWithoutPassword } = cinema;
      
      return res.status(200).json({ 
        message: "Login successful",
        cinema: cinemaWithoutPassword
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/cinema", isAuthenticated, async (req, res) => {
    try {
      const cinemaId = req.session.cinemaId as number;
      const cinemaProfile = await storage.getCinemaProfile(cinemaId);
      
      if (!cinemaProfile) {
        return res.status(404).json({ message: "Cinema not found" });
      }
      
      return res.status(200).json(cinemaProfile);
    } catch (error) {
      console.error("Get cinema error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Film Routes
  app.get("/api/films", async (req, res) => {
    try {
      const films = await storage.getFilms();
      return res.status(200).json(films);
    } catch (error) {
      console.error("Get films error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/films/ville/:ville", async (req, res) => {
    try {
      const { ville } = req.params;
      const { langue, ageMinimum, sort } = req.query;
      
      // Validate search parameters
      const { data, error } = validateRequest(searchByCitySchema, {
        ville,
        langue: langue as string,
        ageMinimum: ageMinimum as string,
        sort: sort as string,
      });
      
      if (error) {
        return res.status(400).json({ errors: error });
      }
      
      let films = await storage.getFilmsByVille(ville);
      
      // Apply filters if provided
      if (langue) {
        films = films.filter(film => film.langue === langue);
      }
      
      if (ageMinimum) {
        films = films.filter(film => film.ageMinimum === ageMinimum);
      }
      
      // Apply sorting
      if (sort) {
        switch (sort) {
          case "newest":
            films.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            break;
          case "alphabetical":
            films.sort((a, b) => a.titre.localeCompare(b.titre));
            break;
          case "rating":
            // In a real app, we would sort by rating
            // Here we'll just use random values
            films.sort(() => Math.random() - 0.5);
            break;
          case "popular":
          default:
            // In a real app, this would be based on views/ratings
            // For now, we're not doing any special sorting for "popular"
            break;
        }
      }
      
      return res.status(200).json(films);
    } catch (error) {
      console.error("Get films by ville error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/films/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const film = await storage.getFilmById(parseInt(id));
      
      if (!film) {
        return res.status(404).json({ message: "Film not found" });
      }
      
      return res.status(200).json(film);
    } catch (error) {
      console.error("Get film error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cinéma Dashboard Routes
  app.get("/api/cinema/films", isAuthenticated, async (req, res) => {
    try {
      const cinemaId = req.session.cinemaId as number;
      const films = await storage.getFilmsByCinemaId(cinemaId);
      return res.status(200).json(films);
    } catch (error) {
      console.error("Get cinema films error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/cinema/films", isAuthenticated, async (req, res) => {
    try {
      const cinemaId = req.session.cinemaId as number;
      
      // Validate film data
      const { data: validatedFilmData, error: filmError } = validateRequest(insertFilmSchema, req.body.film);
      
      if (filmError) {
        return res.status(400).json({ errors: { film: filmError } });
      }
      
      // Validate programmation data
      const programmationData = { ...req.body.programmation, cinemaId };
      const { data: validatedProgrammationData, error: programmationError } = validateRequest(
        insertProgrammationSchema, 
        programmationData
      );
      
      if (programmationError) {
        return res.status(400).json({ errors: { programmation: programmationError } });
      }
      
      // Create film
      const film = await storage.createFilm(validatedFilmData);
      
      // Create programmation with film ID
      const completeProgData = {
        ...validatedProgrammationData,
        filmId: film.id,
      };
      const programmation = await storage.createProgrammation(completeProgData);
      
      return res.status(201).json({
        film,
        programmation,
      });
    } catch (error) {
      console.error("Create film error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/cinema/films/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const cinemaId = req.session.cinemaId as number;
      
      // Check if film exists
      const existingFilm = await storage.getFilmById(parseInt(id));
      
      if (!existingFilm) {
        return res.status(404).json({ message: "Film not found" });
      }
      
      // Check if the cinema has a programmation for this film
      const programmations = await storage.getProgrammationsByFilmId(parseInt(id));
      const hasProgrammation = programmations.some(prog => prog.cinemaId === cinemaId);
      
      if (!hasProgrammation) {
        return res.status(403).json({ message: "Not authorized to update this film" });
      }
      
      // Validate and update film
      const { data: validatedFilmData, error: filmError } = validateRequest(
        insertFilmSchema.partial(), 
        req.body.film
      );
      
      if (filmError) {
        return res.status(400).json({ errors: { film: filmError } });
      }
      
      const updatedFilm = await storage.updateFilm(parseInt(id), validatedFilmData);
      
      // Update programmation if provided
      let updatedProgrammation;
      if (req.body.programmation) {
        // Find existing programmation for this cinema
        const existingProgrammation = programmations.find(prog => prog.cinemaId === cinemaId);
        
        if (existingProgrammation) {
          const { data: validatedProgrammationData, error: programmationError } = validateRequest(
            insertProgrammationSchema.partial(), 
            req.body.programmation
          );
          
          if (programmationError) {
            return res.status(400).json({ errors: { programmation: programmationError } });
          }
          
          updatedProgrammation = await storage.updateProgrammation(existingProgrammation.id, validatedProgrammationData);
        } else {
          // Create new programmation if none exists for this cinema
          const programmationData = {
            ...req.body.programmation,
            filmId: parseInt(id),
            cinemaId,
          };
          
          const { data: validatedProgrammationData, error: programmationError } = validateRequest(
            insertProgrammationSchema, 
            programmationData
          );
          
          if (programmationError) {
            return res.status(400).json({ errors: { programmation: programmationError } });
          }
          
          updatedProgrammation = await storage.createProgrammation(validatedProgrammationData);
        }
      }
      
      return res.status(200).json({
        film: updatedFilm,
        programmation: updatedProgrammation,
      });
    } catch (error) {
      console.error("Update film error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/cinema/films/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const cinemaId = req.session.cinemaId as number;
      
      // Check if film exists
      const existingFilm = await storage.getFilmById(parseInt(id));
      
      if (!existingFilm) {
        return res.status(404).json({ message: "Film not found" });
      }
      
      // Check if the cinema has a programmation for this film
      const programmations = await storage.getProgrammationsByFilmId(parseInt(id));
      const hasProgrammation = programmations.some(prog => prog.cinemaId === cinemaId);
      
      if (!hasProgrammation) {
        return res.status(403).json({ message: "Not authorized to delete this film" });
      }
      
      // Delete the film (this will cascade to programmations)
      await storage.deleteFilm(parseInt(id));
      
      return res.status(200).json({ message: "Film deleted successfully" });
    } catch (error) {
      console.error("Delete film error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
