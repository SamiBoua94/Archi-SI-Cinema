import { pgTable, text, serial, integer, boolean, date, time, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Cinema table schema
export const cinemas = pgTable("cinemas", {
  id: serial("id").primaryKey(),
  nom: text("nom").notNull(),
  adresse: text("adresse").notNull(),
  ville: text("ville").notNull(),
  login: text("login").notNull().unique(),
  mot_de_passe: text("mot_de_passe").notNull(),
  email: text("email").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow()
});

// Film table schema
export const films = pgTable("films", {
  id: serial("id").primaryKey(),
  titre: text("titre").notNull(),
  duree: integer("duree").notNull(),
  langue: text("langue").notNull(),
  sous_titres: boolean("sous_titres").default(false),
  realisateur: text("realisateur").notNull(),
  acteurs_principaux: text("acteurs_principaux").notNull(),
  synopsis: text("synopsis"),
  age_minimum: text("age_minimum").notNull(),
  genres: text("genres"),
  poster: text("poster").notNull().default('/images/default-poster.jpg'),
  created_at: timestamp("created_at").notNull().defaultNow()
});

// Programming table schema
export const programmations = pgTable("programmations", {
  id: serial("id").primaryKey(),
  filmid: integer("filmid").notNull().references(() => films.id),
  cinemaid: integer("cinemaid").notNull().references(() => cinemas.id),
  date_debut: date("date_debut").notNull(),
  date_fin: date("date_fin").notNull(),
  jour_1: text("jour_1").notNull(),
  jour_2: text("jour_2").notNull(),
  jour_3: text("jour_3").notNull(),
  heure_debut: text("heure_debut").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow()
});

// Create insert schemas
export const insertCinemaSchema = createInsertSchema(cinemas).omit({ 
  id: true, 
  created_at: true 
});

export const insertFilmSchema = createInsertSchema(films).omit({ 
  id: true, 
  created_at: true,
  poster: true
});

export const insertProgrammationSchema = createInsertSchema(programmations).omit({ 
  id: true, 
  created_at: true,
  cinemaid: true 
});

// Login schema
export const loginSchema = z.object({
  login: z.string().min(1, "Login is required"),
  mot_de_passe: z.string().min(1, "Password is required")
});

// Export types
export type Cinema = typeof cinemas.$inferSelect;
export type InsertCinema = z.infer<typeof insertCinemaSchema>;
export type LoginCinema = z.infer<typeof loginSchema>;

export type Film = typeof films.$inferSelect;
export type InsertFilm = z.infer<typeof insertFilmSchema>;

export type Programmation = typeof programmations.$inferSelect;
export type InsertProgrammation = z.infer<typeof insertProgrammationSchema>;

// Extended types for responses
export type FilmWithProgrammations = Film & {
  programmations?: (Programmation & { cinema?: Cinema })[];
};

export type ProgrammationWithDetails = Programmation & {
  film?: Film;
  cinema?: Cinema;
};

export type CinemaWithoutPassword = Omit<Cinema, 'mot_de_passe'>;
