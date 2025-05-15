import { Link } from "wouter";

type Theater = {
  id: number;
  name: string;
  address: string;
  image: string;
};

// Sample data for featured theaters
const featuredTheaters: Theater[] = [
  {
    id: 1,
    name: "Le Grand Rex",
    address: "1 Boulevard Poissonnière, 75002 Paris",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  },
  {
    id: 2,
    name: "UGC Ciné Cité Les Halles",
    address: "7 Place de la Rotonde, 75001 Paris",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  },
  {
    id: 3,
    name: "Cinéma Le Champo",
    address: "51 Rue des Écoles, 75005 Paris",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  },
];

export default function FeaturedTheaters() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold font-['Montserrat'] text-[#333333] mb-6">
        Cinémas à l'affiche à Paris
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTheaters.map((theater) => (
          <div
            key={theater.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url('${theater.image}')` }}
              aria-label={`${theater.name} exterior`}
            ></div>
            <div className="p-4">
              <h3 className="font-['Montserrat'] font-semibold text-lg mb-2">
                {theater.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{theater.address}</p>
              <Link href={`/films/ville/Paris`}>
                <span className="text-[#E50914] hover:text-[#E50914]/80 text-sm font-semibold cursor-pointer">
                  Voir les séances
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
