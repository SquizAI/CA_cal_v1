// 7th Grade Civics Curriculum Data for School Calendar Integration
// Based on lessons_structured folder content
// Florida Standards Aligned - B-Day Schedule (3 days per week)

const seventhGradeCivicsCurriculum = {
  courseInfo: {
    title: "7th Grade Civics",
    totalWeeks: 26,
    standardsCovered: 31,
    totalLessons: 75,
    assessmentMethod: "AI-driven with 80% mastery requirement",
    format: "AI-First Autonomous Learning with Showrunner episodes"
  },

  // UNIT 1: FOUNDATIONS OF AMERICAN GOVERNMENT (Weeks 1-8)
  unit1: {
    title: "Foundations of American Government",
    duration: "8 weeks (24 B-days)",
    
    week1: {
      title: "Enlightenment Philosophers",
      lessons: [
        {
          code: "7_civ_1.1.1",
          title: "John Locke & Natural Rights",
          objectives: [
            "Define John Locke's three natural rights (life, liberty, property)",
            "Explain the concept of state of nature vs. organized government",
            "Describe social contract theory and its purpose",
            "Connect Locke's ideas to the Declaration of Independence",
            "Apply natural rights concepts to modern scenarios"
          ],
          materials: [
            "Showrunner episode (25-30 min)",
            "Digital assessment platform",
            "Island government simulation materials",
            "Character profile: John Locke"
          ],
          keyActivities: [
            "AI-guided episode viewing with Dr. Civics and John Locke",
            "Socratic dialogue with NotebookLM on natural rights",
            "Design Your Island Government simulation",
            "Modern applications discussion"
          ],
          assessmentMethods: [
            "Quick check quiz (10 questions)",
            "Socratic dialogue participation",
            "Social contract creation simulation",
            "Mastery assessment (80% required)"
          ],
          floridaStandards: ["SS.7.C.1.1", "SS.7.C.1.2"],
          duration: "45-60 minutes",
          status: "COMPLETE"
        },
        {
          code: "7_civ_1.1.2",
          title: "Montesquieu & Separation of Powers",
          objectives: [
            "Identify the three branches of government theory",
            "Explain checks and balances system",
            "Analyze Montesquieu's influence on American government",
            "Compare absolute monarchy to constitutional government",
            "Apply separation of powers to modern government situations"
          ],
          materials: [
            "Showrunner episode featuring Montesquieu",
            "Interactive branch-sorting activity",
            "Checks and balances demonstration materials"
          ],
          keyActivities: [
            "Meet Montesquieu time-travel segment",
            "Three branches explanation with visual aids",
            "Modern applications in current government",
            "Constitutional convention connection"
          ],
          assessmentMethods: [
            "Quick check quiz on three branches",
            "Simulation activity on government design",
            "Socratic dialogue on power distribution"
          ],
          floridaStandards: ["SS.7.C.1.1", "SS.7.C.1.8"],
          status: "COMPLETE"
        },
        {
          code: "7_civ_1.1.3",
          title: "Rousseau & Social Contract",
          objectives: [
            "Define Rousseau's version of social contract",
            "Compare Rousseau's ideas to Locke's theories",
            "Understand the general will concept",
            "Analyze how social contract applies to democracy",
            "Evaluate modern examples of social contracts"
          ],
          materials: [
            "Showrunner episode with Rousseau character",
            "Social contract comparison charts",
            "Modern democracy examples"
          ],
          keyActivities: [
            "Rousseau introduction and core concepts",
            "Social contract theory deep dive",
            "Historical application to American founding",
            "Modern democratic applications"
          ],
          assessmentMethods: [
            "Comparative analysis of philosophers",
            "Social contract design activity",
            "Discussion on general will vs. individual rights"
          ],
          floridaStandards: ["SS.7.C.1.1"],
          status: "COMPLETE"
        }
      ]
    },

    week2: {
      title: "From Ideas to Revolution",
      lessons: [
        {
          code: "7_civ_1.2.1",
          title: "Franklin: Enlightenment to Revolution",
          objectives: [
            "Understand how Enlightenment ideas spread to colonial America",
            "Analyze Benjamin Franklin's role as philosopher and revolutionary",
            "Connect Franklin's scientific method to political philosophy",
            "Identify how natural rights influenced revolutionary thinking",
            "Apply understanding of idea transmission to modern social media"
          ],
          materials: [
            "Showrunner episode featuring Benjamin Franklin",
            "Scientific experiment demonstrations",
            "Colonial resistance timeline materials"
          ],
          keyActivities: [
            "Meet Benjamin Franklin as self-made philosopher",
            "Franklin's scientific revolution demonstration",
            "Science to politics connection activity",
            "Revolutionary awakening scenario"
          ],
          assessmentMethods: [
            "Science-to-politics connection quiz",
            "Revolutionary ideas spreading simulation",
            "Modern parallel identification activity"
          ],
          floridaStandards: ["SS.7.C.1.2"],
          status: "COMPLETE"
        },
        {
          code: "7_civ_1.2.2",
          title: "Colonial Grievances & Rights",
          objectives: [
            "Identify specific colonial grievances against Britain",
            "Connect grievances to natural rights violations",
            "Analyze the escalation from protest to revolution",
            "Evaluate when resistance becomes justified",
            "Apply grievance analysis to modern situations"
          ],
          materials: [
            "Colonial grievances primary source excerpts",
            "Timeline of escalating conflicts",
            "Rights violation analysis worksheets"
          ],
          keyActivities: [
            "Grievances categorization activity",
            "Rights violation identification",
            "Escalation timeline creation",
            "Modern parallels discussion"
          ],
          assessmentMethods: [
            "Grievances analysis quiz",
            "Justification for resistance essay",
            "Timeline creation and explanation"
          ],
          floridaStandards: ["SS.7.C.1.2", "SS.7.C.1.3"],
          status: "COMPLETE"
        }
      ]
    },

    week3: {
      title: "Declaration of Independence",
      lessons: [
        {
          code: "7_civ_1.3.1",
          title: "Analyzing the Declaration",
          objectives: [
            "Identify key sections of the Declaration",
            "Analyze philosophical influences in the text",
            "Connect Declaration language to Enlightenment ideas",
            "Evaluate the document's revolutionary nature",
            "Apply Declaration principles to modern issues"
          ],
          materials: [
            "Declaration text analysis tools",
            "Philosophical influence mapping charts",
            "Character profile: Thomas Jefferson"
          ],
          keyActivities: [
            "Meet Thomas Jefferson segment",
            "Declaration core concepts breakdown",
            "Historical application analysis",
            "Modern applications discussion"
          ],
          assessmentMethods: [
            "Text analysis quiz",
            "Philosophical influence identification",
            "Modern application scenarios"
          ],
          floridaStandards: ["SS.7.C.1.3"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.3.2",
          title: "Natural Rights in Action",
          objectives: [
            "Connect Declaration to Locke's natural rights",
            "Analyze colonial rights under threat",
            "Understand the progression from ideas to action",
            "Evaluate revolutionary justification",
            "Apply rights-based reasoning to current events"
          ],
          materials: [
            "Natural rights violation case studies",
            "Action escalation timeline",
            "Modern rights scenarios"
          ],
          keyActivities: [
            "Rights in danger analysis",
            "Ideas to action progression study",
            "Escalation justification debate",
            "Modern applications workshop"
          ],
          assessmentMethods: [
            "Rights analysis assessment",
            "Justification argument evaluation",
            "Modern scenario application"
          ],
          floridaStandards: ["SS.7.C.1.3"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.3.3",
          title: "Grievances Against King George",
          objectives: [
            "Identify specific grievances in the Declaration",
            "Categorize violations by type of right",
            "Analyze the legal vs. moral arguments",
            "Evaluate effectiveness of written protest",
            "Compare to modern protest methods"
          ],
          materials: [
            "Grievances text analysis",
            "Legal vs. moral argument charts",
            "Modern protest comparison materials"
          ],
          keyActivities: [
            "Grievances categorization",
            "Legal argument analysis",
            "Protest effectiveness evaluation",
            "Modern comparison activity"
          ],
          assessmentMethods: [
            "Grievances identification quiz",
            "Argument type analysis",
            "Protest methods comparison"
          ],
          floridaStandards: ["SS.7.C.1.3"],
          status: "IN_DEVELOPMENT"
        }
      ]
    },

    week4: {
      title: "Articles of Confederation",
      lessons: [
        {
          code: "7_civ_1.4.1",
          title: "Structure & Weaknesses",
          objectives: [
            "Identify the structure of the Articles government",
            "Analyze weaknesses in the confederation system",
            "Understand why the Articles failed",
            "Compare Articles to modern federal system",
            "Evaluate lessons learned from first government attempt"
          ],
          materials: [
            "Articles structure diagrams",
            "Weakness identification worksheets",
            "Comparison charts with Constitution"
          ],
          keyActivities: [
            "Meet Madison discussing Articles problems",
            "Government structure analysis",
            "Weakness identification activity",
            "Modern federation comparison"
          ],
          assessmentMethods: [
            "Structure identification quiz",
            "Weakness analysis essay",
            "Government comparison activity"
          ],
          floridaStandards: ["SS.7.C.1.4"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.4.2",
          title: "Shays' Rebellion & Crisis",
          objectives: [
            "Understand the causes of Shays' Rebellion",
            "Analyze how the rebellion exposed Articles' weaknesses",
            "Evaluate the government's response to crisis",
            "Connect rebellion to Constitutional Convention",
            "Apply crisis response analysis to modern situations"
          ],
          materials: [
            "Shays' Rebellion timeline",
            "Crisis response analysis tools",
            "Character profile: Daniel Shays"
          ],
          keyActivities: [
            "Meet Hamilton explaining the crisis",
            "Rebellion causes and effects analysis",
            "Government response evaluation",
            "Constitutional Convention connection"
          ],
          assessmentMethods: [
            "Cause and effect analysis",
            "Crisis response evaluation",
            "Convention necessity argument"
          ],
          floridaStandards: ["SS.7.C.1.4"],
          status: "IN_DEVELOPMENT"
        }
      ]
    },

    week5: {
      title: "Constitutional Convention",
      lessons: [
        {
          code: "7_civ_1.5.1",
          title: "Virginia vs New Jersey Plans",
          objectives: [
            "Compare the Virginia and New Jersey Plans",
            "Analyze large state vs. small state interests",
            "Understand representation debates",
            "Evaluate compromise necessity",
            "Apply representation principles to modern issues"
          ],
          materials: [
            "Plan comparison charts",
            "State interest analysis worksheets",
            "Representation calculation tools"
          ],
          keyActivities: [
            "Madison presenting Virginia Plan",
            "New Jersey counterattack scenario",
            "Great divide analysis",
            "Modern representation applications"
          ],
          assessmentMethods: [
            "Plan comparison quiz",
            "Interest analysis activity",
            "Compromise evaluation essay"
          ],
          floridaStandards: ["SS.7.C.1.5"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.5.2",
          title: "Great Compromise",
          objectives: [
            "Understand the Great Compromise solution",
            "Analyze bicameral legislature benefits",
            "Evaluate compromise as governance tool",
            "Connect to modern congressional structure",
            "Apply compromise principles to current issues"
          ],
          materials: [
            "Compromise explanation materials",
            "Bicameral structure diagrams",
            "Modern Congress comparison charts"
          ],
          keyActivities: [
            "Franklin's dinner party scenario",
            "Meet Roger Sherman explaining compromise",
            "Bicameral presentation activity",
            "Modern Congress connections"
          ],
          assessmentMethods: [
            "Compromise explanation quiz",
            "Bicameral system analysis",
            "Modern application scenarios"
          ],
          floridaStandards: ["SS.7.C.1.5"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.5.3",
          title: "Three-Fifths Compromise",
          objectives: [
            "Understand the Three-Fifths Compromise context",
            "Analyze moral vs. practical considerations",
            "Evaluate compromise's historical impact",
            "Connect to later constitutional amendments",
            "Apply ethical reasoning to difficult decisions"
          ],
          materials: [
            "Historical context materials",
            "Ethical analysis frameworks",
            "Amendment connection resources"
          ],
          keyActivities: [
            "Historical context presentation",
            "Moral dilemma analysis",
            "Impact evaluation discussion",
            "Constitutional amendment connections"
          ],
          assessmentMethods: [
            "Context understanding quiz",
            "Ethical analysis essay",
            "Historical impact evaluation"
          ],
          floridaStandards: ["SS.7.C.1.5"],
          status: "IN_DEVELOPMENT"
        }
      ]
    },

    week6: {
      title: "Constitution's Preamble",
      lessons: [
        {
          code: "7_civ_1.6.1",
          title: "Understanding 'We the People'",
          objectives: [
            "Analyze the significance of 'We the People'",
            "Understand popular sovereignty concept",
            "Compare to Articles of Confederation opening",
            "Evaluate democratic foundation principles",
            "Apply popular sovereignty to modern democracy"
          ],
          materials: [
            "Preamble analysis tools",
            "Popular sovereignty explanation materials",
            "Democratic principles worksheets"
          ],
          keyActivities: [
            "Madison explaining revolutionary phrase",
            "Popular sovereignty demonstration",
            "Democratic foundation analysis",
            "Modern applications discussion"
          ],
          assessmentMethods: [
            "Preamble analysis quiz",
            "Popular sovereignty explanation",
            "Modern democracy connection activity"
          ],
          floridaStandards: ["SS.7.C.1.6"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.6.2",
          title: "Six Goals of Government",
          objectives: [
            "Identify the six purposes in the Preamble",
            "Analyze how each goal addresses Articles' failures",
            "Evaluate goal achievement in modern America",
            "Connect goals to government functions",
            "Apply goal analysis to policy evaluation"
          ],
          materials: [
            "Six goals analysis charts",
            "Modern achievement evaluation tools",
            "Policy connection worksheets"
          ],
          keyActivities: [
            "Hamilton explaining the six goals",
            "Perfect union and justice analysis",
            "Tranquility and defense discussion",
            "Welfare and liberty balance"
          ],
          assessmentMethods: [
            "Goals identification quiz",
            "Modern achievement evaluation",
            "Policy analysis activity"
          ],
          floridaStandards: ["SS.7.C.1.6"],
          status: "IN_DEVELOPMENT"
        }
      ]
    },

    week7: {
      title: "Federalism & Separation of Powers",
      lessons: [
        {
          code: "7_civ_1.7.1",
          title: "Division of Powers",
          objectives: [
            "Identify federal, state, and concurrent powers",
            "Understand federalism as power-sharing system",
            "Analyze advantages of federal structure",
            "Compare to unitary and confederate systems",
            "Apply federalism analysis to current issues"
          ],
          materials: [
            "Powers division charts",
            "Federalism comparison diagrams",
            "Current issues analysis tools"
          ],
          keyActivities: [
            "Madison explaining power division",
            "Enumerated powers identification",
            "Reserved powers analysis",
            "Concurrent powers examples"
          ],
          assessmentMethods: [
            "Powers categorization quiz",
            "Federalism advantages essay",
            "Current issues analysis"
          ],
          floridaStandards: ["SS.7.C.1.7", "SS.7.C.3.9"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.8.1",
          title: "Three Branches Overview",
          objectives: [
            "Identify the three branches and their functions",
            "Understand separation of powers principle",
            "Analyze why power separation prevents tyranny",
            "Connect to Montesquieu's influence",
            "Evaluate modern branch relationships"
          ],
          materials: [
            "Three branches organization charts",
            "Separation principles explanation",
            "Modern examples analysis"
          ],
          keyActivities: [
            "Montesquieu and Madison discussion",
            "Branch functions demonstration",
            "Power separation benefits",
            "Modern applications"
          ],
          assessmentMethods: [
            "Branch functions quiz",
            "Separation benefits analysis",
            "Modern examples evaluation"
          ],
          floridaStandards: ["SS.7.C.1.8", "SS.7.C.3.8"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.8.2",
          title: "Checks and Balances",
          objectives: [
            "Identify specific checks each branch has",
            "Understand how checks prevent abuse of power",
            "Analyze real examples of checks in action",
            "Evaluate system effectiveness",
            "Apply checks and balances to new scenarios"
          ],
          materials: [
            "Checks and balances charts",
            "Real examples case studies",
            "System effectiveness analysis tools"
          ],
          keyActivities: [
            "Interactive checks demonstration",
            "Real-world examples analysis",
            "System effectiveness evaluation",
            "New scenario applications"
          ],
          assessmentMethods: [
            "Checks identification quiz",
            "Real examples analysis",
            "System evaluation essay"
          ],
          floridaStandards: ["SS.7.C.1.8"],
          status: "IN_DEVELOPMENT"
        }
      ]
    },

    week8: {
      title: "Bill of Rights Origins",
      lessons: [
        {
          code: "7_civ_1.9.1",
          title: "Federalist vs Anti-Federalist",
          objectives: [
            "Compare Federalist and Anti-Federalist positions",
            "Understand arguments for and against Bill of Rights",
            "Analyze the ratification debate",
            "Evaluate compromise necessity",
            "Apply debate analysis to modern constitutional issues"
          ],
          materials: [
            "Federalist/Anti-Federalist comparison charts",
            "Primary source excerpts",
            "Debate analysis worksheets"
          ],
          keyActivities: [
            "Madison vs. George Mason debate",
            "Position comparison analysis",
            "Ratification struggle recreation",
            "Modern constitutional debates"
          ],
          assessmentMethods: [
            "Position comparison quiz",
            "Debate analysis essay",
            "Modern application scenarios"
          ],
          floridaStandards: ["SS.7.C.1.9"],
          status: "IN_DEVELOPMENT"
        },
        {
          code: "7_civ_1.10.1",
          title: "First Amendment Freedoms",
          objectives: [
            "Identify the five First Amendment freedoms",
            "Understand the importance of each freedom",
            "Analyze historical challenges to these rights",
            "Evaluate modern applications and limits",
            "Apply First Amendment analysis to current issues"
          ],
          materials: [
            "First Amendment breakdown charts",
            "Historical challenges case studies",
            "Modern applications worksheets"
          ],
          keyActivities: [
            "Madison explaining the five pillars",
            "Historical challenges analysis",
            "Digital age applications",
            "Rights vs. responsibilities balance"
          ],
          assessmentMethods: [
            "Five freedoms identification quiz",
            "Historical challenges analysis",
            "Modern applications evaluation"
          ],
          floridaStandards: ["SS.7.C.1.10"],
          status: "IN_DEVELOPMENT"
        }
      ]
    }
  },

  // UNIT 2: THREE BRANCHES OF GOVERNMENT (Weeks 9-16)
  unit2: {
    title: "Three Branches of Government",
    duration: "8 weeks (24 B-days)",
    status: "FRAMEWORK_CREATED"
  },

  // UNIT 3: CITIZENSHIP & POLITICAL SYSTEM (Weeks 17-24)  
  unit3: {
    title: "Citizenship & Political System",
    duration: "8 weeks (24 B-days)",
    status: "FRAMEWORK_CREATED"
  },

  // UNIT 4: INTERNATIONAL RELATIONS (Weeks 25-26)
  unit4: {
    title: "International Relations",
    duration: "2 weeks (6 B-days)",
    status: "FRAMEWORK_CREATED"
  },

  // Assessment and Implementation Details
  assessmentFramework: {
    masteryRequirement: "80% or higher to advance",
    remediation: "Available for scores below 80%",
    enrichment: "Provided for 95%+ scores",
    aiTools: ["ChatGPT-4", "Gemini", "NotebookLM", "Showrunner"],
    duration: "45-60 minutes per lesson",
    format: "AI-First Autonomous Learning"
  },

  implementationNotes: {
    schedule: "B-days only (3 times per week)",
    autonomousLearning: "Zero teacher involvement required",
    characterConsistency: "Dr. Civics guides all episodes",
    technicalRequirements: [
      "Device with internet access",
      "AI platform access",
      "Progress tracking system",
      "Assessment security"
    ],
    successMetrics: [
      "85%+ mastery achievement rate",
      "40-45 minute average engagement",
      "90%+ positive AI interactions",
      "<5% technical issues"
    ]
  },

  completionStatus: {
    fullyComplete: ["7_civ_1.1.1", "7_civ_1.1.2", "7_civ_1.1.3", "7_civ_1.2.1", "7_civ_1.2.2"],
    inDevelopment: ["7_civ_1.3.1", "7_civ_1.3.2", "7_civ_1.3.3", "7_civ_1.4.1", "7_civ_1.4.2"],
    frameworkOnly: "Remaining 36 lessons have generation prompts and structure"
  }
};

// Export for calendar integration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = seventhGradeCivicsCurriculum;
}