export interface SkillCategory {
  id: string;
  name: string;
  order: number;
  parent: SkillCategory | null;
  children: SkillCategory[];
}
