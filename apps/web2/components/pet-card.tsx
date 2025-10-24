import { Pet } from "@/lib/types/pet";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import React from "react";

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{pet.name}</CardTitle>
        <CardDescription>{pet.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <span className="font-medium">HP:</span> {pet.hp}
        </div>
      </CardContent>
    </Card>
  );
}
