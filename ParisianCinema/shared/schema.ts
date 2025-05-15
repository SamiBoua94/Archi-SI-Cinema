import { pgTable, text, serial, integer, boolean, timestamp, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Cinéma schema (anciennement 'users')
export const cinemas = pgTable("cinemas", {
  id: serial("id").primaryKey(),
  nom: text("nom").notNull(),
  adresse: text("adresse").notNull(),
  ville: text("ville").notNull(),
  login: text("login").notNull().unique(),
  motDePasse: text("mot_de_passe").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCinemaSchema = createInsertSchema(cinemas).omit({
  id: true,
  createdAt: true,
});

// Film schema
export const films = pgTable("films", {
  id: serial("id").primaryKey(),
  titre: text("titre").notNull(),
  duree: integer("duree").notNull(), // in minutes
  langue: text("langue").notNull(),
  sousTitres: boolean("sous_titres").default(false),
  realisateur: text("realisateur").notNull(),
  acteursPrincipaux: text("acteurs_principaux").notNull(),
  synopsis: text("synopsis"),
  ageMinimum: text("age_minimum").notNull(),
  genres: text("genres"),
  poster: text("poster").notNull().default("/images/default-poster.jpg"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFilmSchema = createInsertSchema(films).omit({
  id: true, 
  createdAt: true,
});

// Programmation schema (fusion des anciens 'schedules' et 'showtimes')
export const programmations = pgTable("programmations", {
  id: serial("id").primaryKey(),
  filmId: integer("film_id").notNull().references(() => films.id),
  cinemaId: integer("cinema_id").notNull().references(() => cinemas.id),
  dateDebut: date("date_debut").notNull(),
  dateFin: date("date_fin").notNull(),
  jour1: text("jour_1").notNull(),
  jour2: text("jour_2").notNull(),
  jour3: text("jour_3").notNull(),
  heureDebut: time("heure_debut").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProgrammationSchema = createInsertSchema(programmations).omit({
  id: true,
  createdAt: true,
});

// Login schema for validation
export const loginSchema = z.object({
  login: z.string().min(1, "Login is required"),
  motDePasse: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

// Search movies by city schema
export const searchByCitySchema = z.object({
  ville: z.string().min(1, "City is required"),
  langue: z.string().optional(),
  ageMinimum: z.string().optional(),
  sort: z.enum(["popular", "newest", "alphabetical", "rating"]).optional(),
});

// Export types
export type Cinema = typeof cinemas.$inferSelect;
export type InsertCinema = z.infer<typeof insertCinemaSchema>;
export type Film = typeof films.$inferSelect;
export type InsertFilm = z.infer<typeof insertFilmSchema>;
export type Programmation = typeof programmations.$inferSelect;
export type InsertProgrammation = z.infer<typeof insertProgrammationSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SearchByCity = z.infer<typeof searchByCitySchema>;

// For the frontend, combine film with its programmations
export type FilmWithProgrammations = Film & {
  programmations: Programmation[]
};

// Cinéma profile that includes data except password
export type CinemaProfile = Omit<Cinema, 'motDePasse'>;
