import { useState } from "react";

const PojectFerma = () => {
  const projects = [];
  for (let i = 0; i < 10; i++) {
    const isVerified = Math.random() > 0.5;
    const isBlocked = Math.random() > 0.5;
    projects.push({
      id: i,
      name: `Project ${i}`,
      isVerified: isVerified,
      createdAt: new Date().toISOString(),
      isBlocked: isBlocked,
    });
  }

  return projects;
};

export const useData = () => {

  const [ProjectsList, setProjectsList] = useState(PojectFerma());

  return {
    ProjectsList,
    setProjectsList,
  };
};
