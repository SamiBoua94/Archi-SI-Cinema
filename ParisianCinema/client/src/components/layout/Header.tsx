import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { isAuthenticated, cinema, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent cursor-pointer">
              CinéParis
            </span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/films">
                  <span className={`${navigationMenuTriggerStyle()} cursor-pointer`}>
                    Films
                  </span>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Villes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <Link href="/films/ville/Paris">
                        <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">
                          <div className="text-sm font-medium leading-none">Paris</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Les films à l'affiche à Paris
                          </p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/films/ville/Lyon">
                        <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">
                          <div className="text-sm font-medium leading-none">Lyon</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Les films à l'affiche à Lyon
                          </p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/films/ville/Marseille">
                        <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">
                          <div className="text-sm font-medium leading-none">Marseille</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Les films à l'affiche à Marseille
                          </p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="text-sm mr-2">
                <span className="text-muted-foreground">Connecté en tant que </span>
                <span className="font-semibold">{cinema?.nom}</span>
              </div>

              <Link href="/cinema/dashboard">
                <Button variant="ghost" className="cursor-pointer">
                  Tableau de bord
                </Button>
              </Link>

              <Button variant="outline" onClick={() => logout()}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="default" className="cursor-pointer">
                Espace Cinéma
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}