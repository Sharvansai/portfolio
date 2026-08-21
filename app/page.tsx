"use client";
import React from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectsGallery } from "@/components/sections/projects-gallery";
import { SkillsMatrix } from "@/components/sections/skills-matrix";
import { ExperimentsLab } from "@/components/sections/experiments-lab";
import { TimelineSection } from "@/components/sections/timeline-section";
import { ResumeSection } from "@/components/sections/resume-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <HeroSection />
      <AboutSection />
      <ProjectsGallery />
      <SkillsMatrix />
      <TimelineSection />
      <ResumeSection />
      <ContactSection />
    </div>
  );
}
