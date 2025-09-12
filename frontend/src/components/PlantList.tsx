import { useEffect, useState } from "react";
import { getPlants, Plant } from "../api/plantApi";

export default function PlantList() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    getPlants().then(setPlants).catch(console.error);
  }, []);

  return (
    <ul>
      {plants.map((p) => (
        <li key={p._id}>{p.name}</li>
      ))}
    </ul>
  );
}
