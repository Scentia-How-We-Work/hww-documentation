// The shape of a PRD file in src/content/projects (see template.json).

export type Person = { name: string; role: string; email: string };

export type Image = { image: string; alt: string };

export type Prd = {
  pageTitle: string;
  overview: {
    title: string;
    team: string;
    contributors: Person[];
    stakeholders: Person[];
    primaryContact: Person;
    targetDelivery: string;
  };
  problem: {
    headline: string;
    currentState: string;
    strategicAlignment: string;
    businessCase: {
      baseline: { metric: string; currentState: string }[];
      expectedImprovement: {
        metric: string;
        currentState: string;
        target: string;
        improvement: string;
      }[];
      commercialBenefit: { title: string; timeSaving: string; costBenefit: string };
    };
  };
  solution: {
    futureState: string;
    workflows: Image[];
    keyFeatures: string[];
    wireframes: Image[];
  };
  scope: { goals: string[]; nonGoals: string[] };
  milestones: { target: string; milestone: string; description: string }[];
  risks: { risk: string; impact: string; likelihood: string; mitigation: string }[];
  dependencies: { dependency: string; requirement: string; owner: string; status: string }[];
  assumptions: string[];
};

export type Project = { id: string; prd: Prd };

export type Level = "low" | "medium" | "high";
