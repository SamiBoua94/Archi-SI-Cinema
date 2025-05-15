import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, verifyToken, hashPassword } from "./auth";
import { 
  insertCinemaSchema, 
  insertFilmSchema, 
  insertProgrammationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // ====================== PUBLIC ENDPOINTS ======================
  
  // Get all cinemas (with optional city filter)
  app.get('/api/cinemas', async (req, res) => {
    try {
      const ville = req.query.ville as string | undefined;
      const cinemas = await storage.getAllCinemas(ville);
      
      res.status(200).json({
        success: true,
        data: {
          cinemas
        }
      });
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cinemas',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Get cinema by ID
  app.get('/api/cinemas/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cinema ID',
          error: 'INVALID_ID'
        });
      }
      
      const cinema = await storage.getCinema(id);
      if (!cinema) {
        return res.status(404).json({
          success: false,
          message: 'Cinema not found',
          error: 'NOT_FOUND'
        });
      }
      
      const { mot_de_passe, ...cinemaWithoutPassword } = cinema;
      
      res.status(200).json({
        success: true,
        data: {
          cinema: cinemaWithoutPassword
        }
      });
    } catch (error) {
      console.error('Error fetching cinema:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cinema',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Get all films (with optional filters)
  app.get('/api/films', async (req, res) => {
    try {
      const films = await storage.getAllFilms();
      
      res.status(200).json({
        success: true,
        data: {
          films
        }
      });
    } catch (error) {
      console.error('Error fetching films:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch films',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Get films by city
  app.get('/api/films/by-city/:city', async (req, res) => {
    try {
      const city = req.params.city;
      const genre = req.query.genre as string | undefined;
      
      const films = await storage.getFilmsByCity(city, genre);
      
      res.status(200).json({
        success: true,
        data: {
          city,
          films
        }
      });
    } catch (error) {
      console.error('Error fetching films by city:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch films by city',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Get film by ID
  app.get('/api/films/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid film ID',
          error: 'INVALID_ID'
        });
      }
      
      const film = await storage.getFilmWithProgrammations(id);
      if (!film) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
          error: 'NOT_FOUND'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          film
        }
      });
    } catch (error) {
      console.error('Error fetching film:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch film',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Get programming by ID
  app.get('/api/programmations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid programming ID',
          error: 'INVALID_ID'
        });
      }
      
      const programmation = await storage.getProgrammationWithDetails(id);
      if (!programmation) {
        return res.status(404).json({
          success: false,
          message: 'Programming not found',
          error: 'NOT_FOUND'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          programmation
        }
      });
    } catch (error) {
      console.error('Error fetching programming:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch programming',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // ====================== PROTECTED ENDPOINTS ======================
  
  // Create new cinema (admin only)
  app.post('/api/cinemas', async (req, res) => {
    try {
      // For creating new cinemas, we could add an admin check here
      // But for simplicity, we'll allow anyone to create a cinema in this implementation
      
      const validation = insertCinemaSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.error.errors
        });
      }
      
      // Check if login already exists
      const existingCinema = await storage.getCinemaByLogin(validation.data.login);
      if (existingCinema) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: [
            {
              field: 'login',
              message: 'Login already exists'
            }
          ]
        });
      }
      
      // Hash password before storing
      const hashedPassword = await hashPassword(validation.data.mot_de_passe);
      const cinemaData = {
        ...validation.data,
        mot_de_passe: hashedPassword
      };
      
      const newCinema = await storage.createCinema(cinemaData);
      const { mot_de_passe, ...cinemaWithoutPassword } = newCinema;
      
      res.status(201).json({
        success: true,
        message: 'Cinema created successfully',
        data: {
          cinema: cinemaWithoutPassword
        }
      });
    } catch (error) {
      console.error('Error creating cinema:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create cinema',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Create new film (protected)
  app.post('/api/films', verifyToken, async (req, res) => {
    try {
      const validation = insertFilmSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.error.errors
        });
      }
      
      const newFilm = await storage.createFilm(validation.data);
      
      res.status(201).json({
        success: true,
        message: 'Film created successfully',
        data: {
          film: newFilm
        }
      });
    } catch (error) {
      console.error('Error creating film:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create film',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Create new programming (protected)
  app.post('/api/programmations', verifyToken, async (req, res) => {
    try {
      const validation = insertProgrammationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.error.errors
        });
      }
      
      // Check if film exists
      const film = await storage.getFilm(validation.data.filmid);
      if (!film) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: [
            {
              field: 'filmid',
              message: 'Film not found'
            }
          ]
        });
      }
      
      // Add cinema ID from the authenticated user
      const programmationData = {
        ...validation.data,
        cinemaid: req.cinema!.id
      };
      
      const newProgrammation = await storage.createProgrammation(programmationData);
      
      res.status(201).json({
        success: true,
        message: 'Programming created successfully',
        data: {
          programmation: newProgrammation
        }
      });
    } catch (error) {
      console.error('Error creating programming:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create programming',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Update film (protected)
  app.put('/api/films/:id', verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid film ID',
          error: 'INVALID_ID'
        });
      }
      
      const validation = insertFilmSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.error.errors
        });
      }
      
      // Check if film exists
      const existingFilm = await storage.getFilm(id);
      if (!existingFilm) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
          error: 'NOT_FOUND'
        });
      }
      
      const updatedFilm = await storage.updateFilm(id, validation.data);
      
      res.status(200).json({
        success: true,
        message: 'Film updated successfully',
        data: {
          film: updatedFilm
        }
      });
    } catch (error) {
      console.error('Error updating film:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update film',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Update programming (protected)
  app.put('/api/programmations/:id', verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid programming ID',
          error: 'INVALID_ID'
        });
      }
      
      const validation = insertProgrammationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.error.errors
        });
      }
      
      // Check if programming exists and belongs to the authenticated cinema
      const existingProgrammation = await storage.getProgrammation(id);
      if (!existingProgrammation) {
        return res.status(404).json({
          success: false,
          message: 'Programming not found',
          error: 'NOT_FOUND'
        });
      }
      
      if (existingProgrammation.cinemaid !== req.cinema!.id) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this programming',
          error: 'FORBIDDEN'
        });
      }
      
      // Check if film exists
      const film = await storage.getFilm(validation.data.filmid);
      if (!film) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: [
            {
              field: 'filmid',
              message: 'Film not found'
            }
          ]
        });
      }
      
      const programmationData = {
        ...validation.data,
        cinemaid: req.cinema!.id
      };
      
      const updatedProgrammation = await storage.updateProgrammation(id, programmationData);
      
      res.status(200).json({
        success: true,
        message: 'Programming updated successfully',
        data: {
          programmation: updatedProgrammation
        }
      });
    } catch (error) {
      console.error('Error updating programming:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update programming',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Delete film (protected)
  app.delete('/api/films/:id', verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid film ID',
          error: 'INVALID_ID'
        });
      }
      
      // Check if film exists
      const existingFilm = await storage.getFilm(id);
      if (!existingFilm) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
          error: 'NOT_FOUND'
        });
      }
      
      await storage.deleteFilm(id);
      
      res.status(200).json({
        success: true,
        message: 'Film deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting film:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete film',
        error: 'SERVER_ERROR'
      });
    }
  });
  
  // Delete programming (protected)
  app.delete('/api/programmations/:id', verifyToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid programming ID',
          error: 'INVALID_ID'
        });
      }
      
      // Check if programming exists and belongs to the authenticated cinema
      const existingProgrammation = await storage.getProgrammation(id);
      if (!existingProgrammation) {
        return res.status(404).json({
          success: false,
          message: 'Programming not found',
          error: 'NOT_FOUND'
        });
      }
      
      if (existingProgrammation.cinemaid !== req.cinema!.id) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this programming',
          error: 'FORBIDDEN'
        });
      }
      
      await storage.deleteProgrammation(id);
      
      res.status(200).json({
        success: true,
        message: 'Programming deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting programming:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete programming',
        error: 'SERVER_ERROR'
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
