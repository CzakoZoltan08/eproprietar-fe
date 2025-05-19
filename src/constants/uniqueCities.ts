import { cities } from "./citiesRomania";

export const uniqueCities: string[] = Array.from(
  new Set(cities.map((city) => city.nume))
).sort(); // optional: sort alphabetically