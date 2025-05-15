// Ce fichier remplace l'API réelle par notre mock API
import * as mockApi from './mockApi';

// Adaptation des noms d'API pour correspondre aux futures API réelles
export const fetchData = async <T>(url: string): Promise<T> => {
  console.log(`fetchData: ${url}`);
  
  // Adapter le chemin d'API pour notre mock
  const pathParts = url.split('/').filter(p => p);
  
  try {
    if (url.includes('/films')) {
      if (url.includes('/ville/')) {
        const ville = url.split('/ville/')[1].split('?')[0];
        const queryString = url.split('?')[1] || '';
        const params = new URLSearchParams(queryString);
        
        return await mockApi.getFilmsByVille(
          ville,
          params.get('langue') || undefined,
          params.get('ageMinimum') || undefined,
          params.get('sort') as any || undefined
        ) as T;
      } else if (/\/films\/\d+$/.test(url)) {
        const filmId = Number(url.split('/').pop());
        return await mockApi.getFilmById(filmId) as T;
      } else {
        return await mockApi.getAllFilms() as T;
      }
    } else if (url.includes('/cinema/films')) {
      // Simuler l'utilisateur connecté avec ID 1
      return await mockApi.getFilmsByCinemaId(1) as T;
    } else if (url.includes('/auth/cinema')) {
      // Simuler l'utilisateur connecté avec ID 1
      return await mockApi.getCinemaProfile(1) as T;
    } else if (url.includes('/programmations/film/')) {
      const filmId = Number(url.split('/').pop());
      return await mockApi.getProgrammationsByFilmId(filmId) as T;
    } else if (url.includes('/programmations/cinema/')) {
      const cinemaId = Number(url.split('/').pop());
      return await mockApi.getProgrammationsByCinemaId(cinemaId) as T;
    }
    
    throw new Error(`Endpoint non simulé: ${url}`);
  } catch (error) {
    console.error(`Erreur dans fetchData pour ${url}:`, error);
    throw error;
  }
};

export const postData = async <T, R>(url: string, data: T): Promise<R> => {
  console.log(`postData: ${url}`, data);
  
  try {
    if (url.includes('/auth/login')) {
      const { login, motDePasse } = data as any;
      return await mockApi.login(login, motDePasse) as R;
    } else if (url.includes('/auth/logout')) {
      return await mockApi.logout() as R;
    } else if (url.includes('/films')) {
      return await mockApi.createFilm(data as any) as R;
    } else if (url.includes('/cinema/films')) {
      const newFilm = await mockApi.createFilm((data as any).film);
      if ((data as any).programmation) {
        await mockApi.createProgrammation({
          ...((data as any).programmation),
          filmId: newFilm.id,
          cinemaId: 1 // ID simulé de l'utilisateur connecté
        });
      }
      return newFilm as R;
    } else if (url.includes('/programmations')) {
      return await mockApi.createProgrammation(data as any) as R;
    }
    
    throw new Error(`Endpoint POST non simulé: ${url}`);
  } catch (error) {
    console.error(`Erreur dans postData pour ${url}:`, error);
    throw error;
  }
};

export const updateData = async <T, R>(url: string, data: T): Promise<R> => {
  console.log(`updateData: ${url}`, data);
  
  try {
    if (url.includes('/films/')) {
      const filmId = Number(url.split('/').pop());
      return await mockApi.updateFilm(filmId, data as any) as R;
    } else if (url.includes('/programmations/')) {
      const progId = Number(url.split('/').pop());
      return await mockApi.updateProgrammation(progId, data as any) as R;
    }
    
    throw new Error(`Endpoint PUT non simulé: ${url}`);
  } catch (error) {
    console.error(`Erreur dans updateData pour ${url}:`, error);
    throw error;
  }
};

export const deleteData = async (url: string): Promise<void> => {
  console.log(`deleteData: ${url}`);
  
  try {
    if (url.includes('/films/')) {
      const filmId = Number(url.split('/').pop());
      await mockApi.deleteFilm(filmId);
    } else if (url.includes('/programmations/')) {
      const progId = Number(url.split('/').pop());
      await mockApi.deleteProgrammation(progId);
    } else {
      throw new Error(`Endpoint DELETE non simulé: ${url}`);
    }
  } catch (error) {
    console.error(`Erreur dans deleteData pour ${url}:`, error);
    throw error;
  }
};

// Fonction utilitaire pour gérer les erreurs d'API de manière cohérente
export const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    console.error("API Error:", error.message);
    throw error;
  }
  console.error("Unknown API Error:", error);
  throw new Error("Une erreur inconnue s'est produite");
};