import { cvQuery } from "~/graphQL/cvs/cvs.query";
import { ExportPdf } from "~/graphQL/cvs/exportProfile.mutation";
import { getProjects, addProject, deleteProject } from "~/graphQL/cvs/project.query";
import { updateCvMutation, updateCvProject } from "~/graphQL/cvs/cvs.mutations";
import type {
  Cv,
  UpdateCvInput,
  UpdateCvResponse,
  Project,
  AddCvProjectInput,
  UpdateCvProjectInput,
} from "~/types/cvs";
import type { Nullable } from "~/types/types";

export const useCvs = () => {
  const { clients } = useApollo();
  const cv = useState<Nullable<Cv>>("cv", () => null);
  const projects = useState<Project[]>("projects", () => []);
  const fetchCv = async (cvId: string): Promise<Nullable<Cv>> => {
    const { data } = await useAsyncQuery<Nullable<Record<"cv", Cv>>>(cvQuery, { cvId });
    if (data.value) {
      cv.value = data.value.cv;
      return data.value.cv;
    }
    return null;
  };
  const fetchProject = async (): Promise<Project[]> => {
    const { data } = await useAsyncQuery<Nullable<Record<"projects", Project[]>>>(getProjects);
    if (data.value?.projects) {
      projects.value = data.value.projects;
      return data.value.projects;
    }
    return [];
  };

  const updateCv = async (cvInput: UpdateCvInput): Promise<Nullable<UpdateCvResponse>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: updateCvMutation,
        variables: { cv: cvInput },
      });
      if (data) {
        cv.value = data.cv;
        return data.cv;
      }
    }
    return null;
  };
  const exportPdf = async (html: string): Promise<string | null> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: ExportPdf,
        variables: { pdf: { html } },
      });
      if (data?.exportPdf) {
        return data.exportPdf;
      }
    }
    return null;
  };
  const addCvProject = async (projectInput: AddCvProjectInput): Promise<Nullable<Cv>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: addProject,
        variables: { project: projectInput },
      });
      if (data?.addCvProject) {
        cv.value = data.addCvProject;
        return data.addCvProject;
      }
    }
    return null;
  };

  const updateCvProjectData = async (projectInput: UpdateCvProjectInput): Promise<Nullable<Cv>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: updateCvProject,
        variables: { project: projectInput },
      });
      if (data?.updateCvProject) {
        cv.value = data.updateCvProject;
        return data.updateCvProject;
      }
    }
    return null;
  };

  const deleteCvProject = async (cvId: string, projectId: string): Promise<Nullable<Cv>> => {
    if (clients) {
      const { data } = await clients.default.mutate({
        mutation: deleteProject,
        variables: { cvId, projectId },
      });
      if (data?.removeCvProject) {
        cv.value = data.removeCvProject;
        return data.removeCvProject;
      }
    }
    return null;
  };

  return {
    cv,
    fetchCv,
    updateCv,
    exportPdf,
    fetchProject,
    projects,
    addCvProject,
    updateCvProjectData,
    deleteCvProject,
  };
};
