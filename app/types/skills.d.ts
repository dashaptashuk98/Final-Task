import type { Nullable } from "./types";

export interface SkillMastery {
  name: string;
  categoryId?: Nullable<string>;
  mastery: Mastery;
}
export interface Mastery {
  Novice: "Novice";
  Advanced: "Advanced";
  Competent: "Competent";
  Proficient: "Proficient";
  Expert: "Expert";
}
