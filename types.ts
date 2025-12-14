export interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  deathDate?: string; // Optional, if alive
  gender: 'male' | 'female';
  bio: string;
  occupation?: string;
  location?: string;
  children?: FamilyMember[];
  // New Lineage Fields
  fatherName?: string;
  motherName?: string;
  grandfatherName?: string;
}