import { QueryClient, QueryFunction } from "@tanstack/react-query";
import * as mockApi from "./mockApi";

// Simuler un délai réseau
const simulateNetworkDelay = async (min = 200, max = 600) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
};

// Fonction auxiliaire pour extraire les arguments d'une URL
const parseQueryParams = (url: string) => {
  const [path, queryString] = url.split('?');
  const params = new URLSearchParams(queryString || '');
  const queryParams: Record<string, string> = {};
  
  params.forEach((value, key) => {
    queryParams[key] = value;
  });
  
  return { path, queryParams };
};

// Fonction pour simuler les appels API
export async function mockApiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<any> {
  console.log(`Mock API Request - ${method}: ${url}`, data);
  await simulateNetworkDelay();
  
  const { path, queryParams } = parseQueryParams(url);
  const pathParts = path.split('/').filter(p => p);
  
  try {
    // Routes pour les films
    if (pathParts.includes('films')) {
      // GET /api/films
      if (method === 'GET' && pathParts.length === 2) {
        return await mockApi.getAllFilms();
      }
      
      // GET /api/films/:id
      if (method === 'GET' && pathParts.length === 3 && !isNaN(Number(pathParts[2]))) {
        const filmId = Number(pathParts[2]);
        return await mockApi.getFilmById(filmId);
      }
      
      // GET /api/films/ville/:ville
      if (method === 'GET' && pathParts.includes('ville')) {
        const villeIndex = pathParts.indexOf('ville');
        if (villeIndex >= 0 && villeIndex + 1 < pathParts.length) {
          const ville = pathParts[villeIndex + 1];
          return await mockApi.getFilmsByVille(
            ville,
            queryParams.langue,
            queryParams.ageMinimum,
            queryParams.sort as any
          );
        }
      }
      
      // POST /api/films
      if (method === 'POST') {
        return await mockApi.createFilm(data as any);
      }
      
      // PUT /api/films/:id
      if (method === 'PUT' && pathParts.length === 3 && !isNaN(Number(pathParts[2]))) {
        const filmId = Number(pathParts[2]);
        return await mockApi.updateFilm(filmId, data as any);
      }
      
      // DELETE /api/films/:id
      if (method === 'DELETE' && pathParts.length === 3 && !isNaN(Number(pathParts[2]))) {
        const filmId = Number(pathParts[2]);
        return await mockApi.deleteFilm(filmId);
      }
    }
    
    // Routes pour les cinémas
    if (pathParts.includes('cinema')) {
      // Authentification
      if (pathParts.includes('auth')) {
        // GET /api/auth/cinema
        if (method === 'GET') {
          // Simulation d'un utilisateur connecté avec l'ID 1
          return await mockApi.getCinemaProfile(1);
        }
      }
      
      // GET /api/cinema/films
      if (method === 'GET' && pathParts.includes('films')) {
        // Simulation d'un utilisateur connecté avec l'ID 1
        return await mockApi.getFilmsByCinemaId(1);
      }
      
      // POST /api/cinema/films
      if (method === 'POST' && pathParts.includes('films')) {
        const newFilm = await mockApi.createFilm((data as any).film);
        if ((data as any).programmation) {
          await mockApi.createProgrammation({
            ...((data as any).programmation),
            filmId: newFilm.id,
            cinemaId: 1 // Utilisateur connecté simulé
          });
        }
        return newFilm;
      }
    }
    
    // Routes pour l'authentification
    if (pathParts.includes('auth')) {
      // POST /api/auth/login
      if (method === 'POST' && pathParts.includes('login')) {
        return await mockApi.login((data as any).login, (data as any).motDePasse);
      }
      
      // POST /api/auth/logout
      if (method === 'POST' && pathParts.includes('logout')) {
        return await mockApi.logout();
      }
    }
    
    // Routes pour les programmations
    if (pathParts.includes('programmations')) {
      // GET /api/programmations/film/:id
      if (method === 'GET' && pathParts.includes('film')) {
        const filmId = Number(pathParts[pathParts.length - 1]);
        return await mockApi.getProgrammationsByFilmId(filmId);
      }
      
      // GET /api/programmations/cinema/:id
      if (method === 'GET' && pathParts.includes('cinema')) {
        const cinemaId = Number(pathParts[pathParts.length - 1]);
        return await mockApi.getProgrammationsByCinemaId(cinemaId);
      }
      
      // POST /api/programmations
      if (method === 'POST') {
        return await mockApi.createProgrammation(data as any);
      }
      
      // PUT /api/programmations/:id
      if (method === 'PUT' && !isNaN(Number(pathParts[pathParts.length - 1]))) {
        const progId = Number(pathParts[pathParts.length - 1]);
        return await mockApi.updateProgrammation(progId, data as any);
      }
      
      // DELETE /api/programmations/:id
      if (method === 'DELETE' && !isNaN(Number(pathParts[pathParts.length - 1]))) {
        const progId = Number(pathParts[pathParts.length - 1]);
        return await mockApi.deleteProgrammation(progId);
      }
    }
    
    throw new Error(`API endpoint not mocked: ${method} ${url}`);
  } catch (error) {
    console.error(`Error in mock API request ${method} ${url}:`, error);
    throw error;
  }
}

// Adapter la fonction apiRequest pour utiliser notre mock
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const response = await mockApiRequest(method, url, data);
  return { json: () => response, text: () => JSON.stringify(response) };
}

// Fonction query pour react-query
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const response = await mockApiRequest('GET', queryKey[0] as string);
      return response;
    } catch (error: any) {
      if (error.status === 401 && unauthorizedBehavior === "returnNull") {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
