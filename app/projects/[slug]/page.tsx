import { initialSharvanBaseData } from "@/lib/sharvan-base-data";
import { ProjectDetailView } from "@/components/sections/project-detail-view";

export function generateStaticParams() {
  return initialSharvanBaseData.projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <ProjectDetailView slug={resolvedParams.slug} />;
}
