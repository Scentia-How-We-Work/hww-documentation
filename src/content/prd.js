// Add dark mode

const prd = {
  pageTitle: "[Project Title] PRD v.1",

  overview: {
    title: "[Project Name]",
    team: "Product Tech and AI",
    contributors: [
      {
        name: "Name 1",
        role: "Role",
        email: "email@email.com.au",
      },
      {
        name: "Name 2",
        role: "Role",
        email: "email@email.com.au",
      },
    ],
    stakeholders: [
      {
        name: "Name 1",
        role: "Role",
        email: "email@email.com.au",
      },
      {
        name: "Name 2",
        role: "Role",
        email: "email@email.com.au",
      },
    ],
    primaryContact: {
      name: "Erin Smith",
      role: "BA",
      email: "esmith@scentia.com.au",
    },
    targetDelivery: "Q4 end - 31.12.26",
  },

  problem: {
    currentState:
      "[2-3 sentences defining the problem we are trying to solve and the narrative behind it - what the process looks like for users now.]",
    strategicAlignment:
      "[2-3 sentences on why this is relevant to the wider company strategy.]",
    businessCase: {
      baseline: [
        {
          metric: "End to end process duration",
          currentState: "[X hours/days]",
        },
        {
          metric: "Total employee time required",
          currentState: "[X hours]",
        },
        {
          metric: "Number of handoffs",
          currentState: "[X]",
        },
        {
          metric: "SLA performance",
          currentState: "[X%]",
        },
      ],
      expectedImprovement: [
        {
          metric: "End to end process duration",
          currentState: "[X hours/days]",
          target: "[X hours/days]",
          improvement: "[X%]",
        },
        {
          metric: "Total employee time required",
          currentState: "[X hours]",
          target: "[X hours]",
          improvement: "[X%]",
        },
        {
          metric: "Number of handoffs",
          currentState: "[X]",
          target: "[X]",
          improvement: "[X%]",
        },
        {
          metric: "SLA performance",
          currentState: "[X%]",
          target: "[X%]",
          improvement: "[X%]",
        },
      ],
      commercialBenefit: {
        title: "Commercial Benefit",
        timeSaving: "Estimated annual time saving: [X hours]",
        costBenefit: "Estimated annual capacity / cost benefit: [$X]",
      },
    },
  },

  solution: {
    futureState:
      "[Briefly describe the future state process, proposed solution, MVP to be delivered.]",
    workflows: [
      {
        image: "https://placebear.com/1920/1080",
        alt: "Placeholder Image",
      },
    ],
    keyFeatures: [
      "[List of features that form the MVP solution in priority order.]",
      "",
      "",
    ],
    wireframes: [
      {
        image: "https://placebear.com/1920/1080",
        alt: "Placeholder Image",
      },
    ],
  },

  scope: {
    goals: [
      "[List of primary goals in priority order, including measurable metrics.]",
      "",
      "",
    ],
    nonGoals: ["[List of areas out of scope and why.]", "", ""],
  },

  milestones: [
    {
      target: "",
      milestone: "",
      description: "",
    },
  ],

  risks: [
    {
      risk: "",
      impact: "[Low / Medium / High]",
      likelihood: "[Low / Medium / High]",
      mitigation: "",
    },
  ],

  dependencies: [],

  assumptions: ["", "", ""],
};

export default prd;
