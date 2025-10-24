import PetCard from "@/components/pet-card";
import { getPets } from "@/lib/data/pet";

export default async function PetsPage() {
  const pets = await getPets();

  return (
    <div className="container my-10">
      <div className="grid grid-cols-3 gap-4">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}
