<script setup lang="ts">
  import { useCvs } from "~/composables/useCvs";
  import { useUsers } from "~/composables/useUsers";
  import type { CvSkill, SkillsTableRow } from "~/types/skills";
  import type { SkillCategory } from "~/types/skillCategory";

  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const route = useRoute();
  const cvId = route.params.cvId as string;
  const { cv, fetchCv, exportPdf } = useCvs();
  const { skillCategories, fetchSkillCategories } = useUsers();

  const cvPreviewRef = ref<HTMLElement | null>(null);
  const exportError = ref<string | null>(null);

  const handleExportPdf = async () => {
    if (!cvPreviewRef.value) return;

    try {
      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch {
            return "";
          }
        })
        .join("\n");

      const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page { size: A4; margin: 20mm; }
            body { margin: 0; padding: 0; font-family: Roboto, sans-serif; }
            ${styles}
            .export-btn { display: none !important; }
          </style>
        </head>
        <body>
          ${cvPreviewRef.value.innerHTML}
        </body>
      </html>
    `;

      const pdfUrl = await exportPdf(html);
      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      }
    } catch {
      exportError.value = "Sorry, something went wrong with PDF export. Please try again later.";
    }
  };

  const skillsByCategory = computed((): Record<string, CvSkill[]> => {
    const skills = cv.value?.skills || ([] as CvSkill[]);

    if (!skills.length) return {} as Record<string, CvSkill[]>;

    return skills.reduce(
      (acc, skill) => {
        const category = (skillCategories.value as SkillCategory[])?.find(
          (cat) => String(cat.id) === String(skill.categoryId),
        );

        const categoryName = category?.name || "Other";
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(skill);
        return acc;
      },
      {} as Record<string, CvSkill[]>,
    );
  });

  const skillsTableData = computed((): SkillsTableRow[] => {
    const data: SkillsTableRow[] = [];
    Object.entries(skillsByCategory.value).forEach(
      ([categoryName, skills]: [string, CvSkill[]]) => {
        const skillNames = skills.map((s: CvSkill) => s.name).join(", ");
        const createdAt = new Date(skills[0]?.created_at || new Date());
        const now = new Date();
        const years = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365),
        );
        const lastUsedYear = !isNaN(createdAt.getTime())
          ? createdAt.getFullYear()
          : new Date().getFullYear();

        data.push({
          category: categoryName,
          skill: skillNames,
          experience: years > 0 ? years : 1,
          lastUsed: lastUsedYear,
        });
      },
    );

    return data;
  });

  await Promise.all([fetchCv(cvId), fetchSkillCategories()]);
</script>

<template>
  <div v-if="cv" ref="cvPreviewRef" class="cv-preview">
    <div class="cv-header">
      <div class="cv-header-content">
        <h1 class="cv-name">{{ cv.user?.profile.full_name }}</h1>
        <h2 class="cv-titleNAme">{{ cv.user?.position_name }}</h2>
      </div>
      <button class="export-btn" @click="handleExportPdf">EXPORT PDF</button>
    </div>

    <div v-if="exportError" class="export-error">
      {{ exportError }}
    </div>

    <div class="cv-body">
      <div class="cv-sidebar">
        <div class="cv-section">
          <h3 class="education__title">Education</h3>
          <p>{{ cv.education }}</p>
        </div>

        <div class="cv-section">
          <h3 class="education__title">Language proficiency</h3>
          <div v-for="lang in cv.languages" :key="lang.name" class="language-item">
            {{ lang.name }} - {{ lang.proficiency }}
          </div>
        </div>

        <div class="cv-section">
          <h3 class="education__title">Domains</h3>
          <div v-for="project in cv.projects" :key="project.id" class="language-item">
            {{ project.project.domain }}
          </div>
        </div>
      </div>

      <div class="cv-main">
        <div class="cv-section">
          <h3>{{ cv.name }}</h3>
          <p>{{ cv.description }}</p>
          <div
            v-for="(skills, categoryName) in skillsByCategory"
            :key="categoryName"
            class="skill-category">
            <h4 class="category-title">{{ categoryName }}</h4>
            <div class="tags">
              <span v-for="skill in skills" :key="skill.name" class="tag">
                {{ skill.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h3 v-if="cv.projects && cv.projects.length" class="cv-title">Projects</h3>
    <div v-if="cv.projects && cv.projects.length" class="cv-begin">
      <div class="cv-sidebar">
        <div v-for="project in cv.projects" :key="project.id" class="project-item">
          <h4>{{ project.project.name }}</h4>
          <p>{{ project.project.description }}</p>
        </div>
      </div>
      <div class="cv-main">
        <div class="cv-section">
          <h3 class="project__title">Project roles</h3>
          <div v-for="project in cv.projects" :key="project.id" class="project-role">
            <div class="role-header">
              <h4>{{ project.project.internal_name }}</h4>
            </div>
            <div class="period">
              <h3 class="project__title">Period</h3>
              <p>
                {{ project.project.start_date }} –
                {{ project.project.end_date || "Till now" }}
              </p>
            </div>
            <div class="responsibilities">
              <h3 class="project__title">Responsibilities:</h3>
              <ul>
                <li v-for="responsibility in project.responsibilities" :key="responsibility">
                  {{ responsibility }}
                </li>
              </ul>
            </div>
            <div class="environment">
              <h3 class="project__title">Environment:</h3>
              <div class="tech-tags">
                <span v-for="tech in project.project.environment" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cv-end">
      <h3 class="cv-title">Professional skills</h3>
      <DataTable :value="skillsTableData">
        <Column field="category" header="SKILLS" style="width: 25%">
          <template #body="slotProps">
            <span class="category-name">{{ slotProps.data.category }}</span>
          </template>
        </Column>
        <Column field="skill" style="width: 35%" />
        <Column field="experience" header="EXPERIENCE IN YEARS" style="width: 20%">
          <template #body="slotProps">
            {{ slotProps.data.experience }}
          </template>
        </Column>
        <Column field="lastUsed" header="LAST USED" style="width: 20%">
          <template #body="slotProps">
            {{ slotProps.data.lastUsed || "-" }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
  .cv-preview {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .cv-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    padding-bottom: 20px;
  }

  .cv-name {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 34px;
    margin: 0;
    line-height: 42px;
    letter-spacing: 0.25px;
    color: #353535;
  }

  .cv-titleNAme {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    text-transform: uppercase;
    color: #353535;
  }

  .export-btn {
    background: transparent;
    font-family: Roboto;
    font-weight: 500;
    color: #c63031;
    font-size: 14px;
    line-height: 24.5px;
    letter-spacing: 0.4px;
    text-align: center;
    border-radius: 40px;
    border: 1px solid #c63031;
    text-transform: uppercase;
    padding: 10px 36px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .export-btn:hover {
    background: #c63031;
    color: white;
  }

  .cv-body,
  .cv-begin {
    display: grid;
    grid-template-columns: 260px 1fr;
  }

  .education__title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #353535;
    margin: 0;
  }

  .cv-main {
    padding: 0 20px;
    border-left: 1px solid #c63031;
  }

  .cv-section {
    margin-bottom: 16px;
  }

  .cv-section p {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #353535;
    margin: 0 0 18px;
  }

  .cv-section h3 {
    margin: 0 0 10px;
  }

  .language-item {
    margin-bottom: 5px;
    color: #555;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #353535;
  }

  @media (max-width: 768px) {
    .cv-body {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .cv-header {
      flex-direction: column;
      gap: 15px;
    }
  }

  .project-item {
    margin-bottom: 10px;
    padding: 0 20px 0 0;
  }

  .project-item h4 {
    margin: 0 0 10px 0;
    color: #c63031;
  }

  .project__title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #353535;
  }

  .cv-title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 34px;
    line-height: 42px;
    letter-spacing: 0.25px;
    margin: 0 0 34px;
    color: #353535;
  }

  .project-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
    font-size: 0.9rem;
    color: #666;
  }

  .skill-category {
    margin-bottom: 20px;
  }

  .category-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0 0 10px 0;
    color: #333;
  }
  .project-role {
    margin-bottom: 30px;
  }

  .role-header {
    margin: 0 0 15px;
  }

  .role-header h4 {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    letter-spacing: 0.15px;

    color: #353535;
  }

  .delete-icon {
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
  }

  .period,
  .responsibilities,
  .environment {
    margin-bottom: 15px;
  }

  .responsibilities ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  .responsibilities li {
    margin-bottom: 5px;
    line-height: 1.5;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .tech-tag {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;

    color: #353535;
  }

  .cv-end {
    margin-top: 30px;
  }

  .category-name {
    color: #c63031;
    font-weight: bold;
  }

  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    min-height: 54px;
    height: auto;
    padding: 16px 12px;
    vertical-align: top;
  }

  .export-error {
    background-color: #ffebee;
    color: #c62828;
    margin-bottom: 20px;
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    line-height: 1.4;
  }
</style>
