import type { Nullable } from "./types";

export interface Project {
  id: string;
  created_at: string;
  name: string;
  internal_name: string;
  domain: string;
  start_date: string;
  end_date?: Nullable<string>;
  description: string;
  environment: string[];
}
