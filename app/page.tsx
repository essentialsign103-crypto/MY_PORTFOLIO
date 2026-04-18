"use client";

import dynamic from "next/dynamic";

const HomeContent = dynamic(
  () => import("./components/HomeContent").then((mod) => mod.HomeContent),
  { ssr: false }
);

interface Project {
  id: string;
  title: string;
  category: string;
  note: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
}

interface PortfolioData {
  heroTitle: string;
  heroDescription: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  projects: Project[];
}

const defaultData: PortfolioData = {
  heroTitle: "Cinematic Video Editing That Makes Brands Feel Premium",
  heroDescription: "I help creators, brands, and businesses turn raw footage into polished visual stories with clean pacing, strong emotion, and a premium final look.",
  aboutText: "I'm Hamza Teha, a video editor building work that feels cinematic, focused, and valuable. My approach combines creative instinct with strong technical execution so every cut, transition, and pacing choice supports the message.",
  contactEmail: "hamzatehafeko8@gmail.com",
  contactPhone: "+251 965614501",
  projects: [
    {
      id: "1",
      title: "Brand Story Edit",
      category: "Commercial / Identity",
      note: "Placeholder for result, reach, or audience impact.",
      type: "image",
      src: "/images/project-01.png",
      alt: "Project placeholder one",
    },
    {
      id: "2",
      title: "Social Campaign Cut",
      category: "Short-Form / Social Media",
      note: "Space reserved for future metrics and campaign details.",
      type: "video",
      src: "/videos/project-02-placeholder.mp4",
      poster: "/images/project-02.png",
    },
    {
      id: "3",
      title: "YouTube Growth Edit",
      category: "Long-Form / Creator Content",
      note: "Ready for thumbnail, case outcome, and testimonial pairing later.",
      type: "image",
      src: "/images/project-03.png",
      alt: "Project placeholder three",
    },
  ],
};

const serviceOptions = [
  "Web Development",
  "Video Editing",
  "Thumbnail Design",
  "Online Passport",
  "banner design",
  "Tech Related",
];

export default function Home() {
  return <HomeContent serviceOptions={serviceOptions} defaultData={defaultData} />;
}
