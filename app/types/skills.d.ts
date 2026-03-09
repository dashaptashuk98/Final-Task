export type Mastery = "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert";

export const MASTERY_LEVELS: Mastery[] = [
  "Novice",
  "Advanced",
  "Competent",
  "Proficient",
  "Expert",
];

export const MASTERY_OPTIONS = MASTERY_LEVELS.map((level) => ({
  name: level,
  value: level,
}));

export interface Skill {
  id: string;
  created_at: string;
  name: string;
  mastery?: Mastery;
  category: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    } | null;
  } | null;
  category_name: string | null;
  category_parent_name: string | null;
}

export interface UserSkill {
  id: string;
  name: string;
  mastery: Mastery;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    parent?: {
      id: string;
      name: string;
    } | null;
  } | null;
  created_at?: string;
}

export type SkillFormKey = "skill" | "mastery";
