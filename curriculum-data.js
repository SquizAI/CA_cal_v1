// Detailed curriculum mapping (5-day blocks for each topic)
// Based on actual curriculum files from the AI Academy content generator
// Updated to include AI Awareness Days (Sept 8-9)

const curriculumMap = {
    // AI AWARENESS DAYS - All Grades
    'ai_awareness': {
        '1': { // Sept 8 - Day 1.B
            code: 'AI_1.B',
            title: 'AI Awareness Day 1 - Welcome to the Future of Learning',
            objectives: [
                'Introduction to AI-driven learning',
                'Establish AI ethics and digital citizenship',
                'Explore AI tools for each subject area',
                'Create classroom AI honor codes'
            ],
            materials: 'Chromebooks, AI tool accounts (ChatGPT, Claude, Khan Academy), digital citizenship agreements',
            activities: [
                'Period 1: AI Timeline & Ethics Discussion (9th WH, 11th AmLit)',
                'Period 2: Khan Academy Setup & AI Tutors (7th Pre-Algebra)',
                'Period 3: Digital Constitution Creation (7th Civics, 9th Algebra I)',
                'After School: AI Exploration Lab (Optional)'
            ],
            assessment: 'Digital citizenship pledge signed, Khan Academy setup complete, AI ethics agreement created, reflection essay',
            standards: 'Technology and Digital Literacy Standards, Florida B.E.S.T. Standards',
            details: {
                'Period 1 (8:18-9:48)': {
                    '9th World History': 'AI Through the Ages - Historical development of AI, ethical guidelines',
                    '11th American Literature': 'AI as Writing Partner - Prompt engineering, citation practices'
                },
                'Period 2 (9:51-11:21)': {
                    '7th Pre-Algebra': 'Math with AI Assistants - Khan Academy/Khanmigo, problem-solving with AI'
                },
                'Period 3 (12:12-1:42)': {
                    '7th Civics': 'Digital Citizenship - Rights and responsibilities in AI age',
                    '9th Algebra I': 'AI Pattern Recognition - Machine learning basics, mathematical patterns'
                }
            }
        },
        '2': { // Sept 9 - Day 2.A
            code: 'AI_2.A',
            title: 'AI Awareness Day 2 - Mastering AI Tools for Academic Excellence',
            objectives: [
                'Master subject-specific AI tools',
                'Practice prompt engineering strategies',
                'Create AI-assisted projects',
                'Prepare for Parent Showcase'
            ],
            materials: 'AI platforms (Grammarly, Wolfram Alpha, Desmos, iNaturalist), project materials, presentation tools',
            activities: [
                'Period 1: Subject AI Tools Deep Dive (9th ELA, 11th Pre-Calc)',
                'Period 2: Discovery Box AI Integration (7th Science), Democracy & AI (11th Gov)',
                'Period 3: AI Writing Workshop (7th ELA)',
                'After School: Showcase Preparation Workshop'
            ],
            assessment: 'AI tool proficiency demonstration, collaborative project completion, showcase presentation ready',
            standards: 'Technology and Digital Literacy Standards, Subject-specific Florida Standards',
            details: {
                'Period 1 (8:18-9:48)': {
                    '9th ELA': 'Grammarly, QuillBot, Hemingway Editor, ChatGPT for literary analysis',
                    '11th Pre-Calculus': 'Wolfram Alpha, Desmos, PhotoMath, Symbolab for advanced math'
                },
                'Period 2 (9:51-11:21)': {
                    '7th Life Science': 'Virtual microscope, iNaturalist, Google Lens for biology',
                    '11th US Government': 'AI in elections, legislation, constitutional questions'
                },
                'Period 3 (12:12-1:42)': {
                    '7th ELA': 'AI Writing Workshop - Brainstorming, grammar, creative writing, research with AI'
                }
            }
        }
    },
    
    // 7th Grade Science (A Days, Period 2) - SHIFTED BY 2 DAYS
    '7th_science': {
        '3-7': { // Was 1-5, now shifted
            code: '7_sci_1.1.1', 
            title: 'Introduction to Scientific Thinking',
            objectives: [
                'Define science and distinguish it from other ways of knowing',
                'Identify characteristics of scientific knowledge',
                'Explore careers in life science research'
            ],
            materials: 'Discovery Box 1.1.1: Mystery boxes, observation tools, science sorting cards, career exploration materials',
            activities: [
                'Mystery Box Investigation Lab',
                'Science vs Non-Science Sorting Activity',
                'Fields of Science Career Exploration',
                'Scientific Method Introduction'
            ],
            assessment: 'Exit ticket on scientific thinking, Mystery box lab report, Vocabulary quiz',
            standards: 'SC.7.N.1.1, SC.7.N.1.5, SC.7.N.1.3, SC.7.N.2.1'
        },
        '8-12': { // Was 6-10
            code: '7_sci_1.1.2', 
            title: 'Scientific Investigation Design',
            objectives: [
                'Differentiate between observations and inferences',
                'Design controlled experiments with proper variables',
                'Understand replication vs. repetition'
            ],
            materials: 'Discovery Box 1.1.2: Mystery powder kit, data sheets, measurement tools, variable cards',
            activities: [
                'Cookie Crime Mystery Investigation',
                'Mystery Powder Analysis Lab',
                'Variables and Controls Practice',
                'Hypothesis Writing Workshop'
            ],
            assessment: 'Experimental design project, Lab report with data analysis',
            standards: 'SC.7.N.1.1, SC.7.N.1.2, SC.7.N.1.4, SC.7.N.1.6'
        },
        '13-17': { // Was 11-15
            code: '7_sci_1.1.3', 
            title: 'Data Collection and Analysis',
            objectives: [
                'Collect quantitative and qualitative data',
                'Create appropriate data tables and graphs',
                'Identify patterns and trends in data'
            ],
            materials: 'Discovery Box 1.1.3: Data collection tools, graphing materials, digital sensors',
            activities: [
                'Plant Growth Investigation',
                'Data Graphing Workshop',
                'Statistical Analysis Practice',
                'Digital Data Collection Lab'
            ],
            assessment: 'Data analysis project, Graph interpretation quiz',
            standards: 'SC.7.N.1.1, SC.7.N.1.5, SC.7.N.3.2'
        },
        '18-22': { // Was 16-20
            code: '7_sci_1.2.1', 
            title: 'Cell Theory and Microscopy',
            objectives: [
                'State and explain the three parts of cell theory',
                'Use microscopes to observe various cell types',
                'Compare prokaryotic and eukaryotic cells'
            ],
            materials: 'Discovery Box 1.2.1: Microscopes, prepared slides, cell models, microscopy tools',
            activities: [
                'Microscopy Mastery Lab',
                'Cell Type Comparison Investigation',
                'Build-a-Cell 3D Model Project',
                'Virtual Cell Tour'
            ],
            assessment: 'Cell theory quiz, Microscopy practical exam, Cell model project',
            standards: 'SC.7.L.12.1, SC.7.L.12.2, SC.7.L.12.3'
        },
        '23-27': { // Was 21-25
            code: '7_sci_1.2.2', 
            title: 'Cell Structure and Organelles',
            objectives: [
                'Identify and describe functions of cell organelles',
                'Compare plant and animal cell structures',
                'Analyze how structure relates to function'
            ],
            materials: 'Discovery Box 1.2.2: 3D organelle models, microscope slides, comparison charts',
            activities: [
                'Organelle Function Station Rotation',
                'Plant vs Animal Cell Lab',
                'Cell City Analogy Project',
                'Microscope Observation of Real Cells'
            ],
            assessment: 'Organelle function quiz, Cell diagram labeling, Comparative essay',
            standards: 'SC.7.L.12.2, SC.7.L.12.3, SC.7.L.12.4'
        },
        '28-32': { // Was 26-30
            code: '7_sci_1.2.3', 
            title: 'Cell Membrane and Transport',
            objectives: [
                'Explain the structure and function of cell membranes',
                'Investigate passive and active transport processes',
                'Conduct diffusion and osmosis experiments'
            ],
            materials: 'Discovery Box 1.2.3: Osmosis/diffusion materials, membrane models, lab supplies',
            activities: [
                'Egg Osmosis Lab',
                'Diffusion Investigation with Food Coloring',
                'Cell Transport Simulation',
                'Membrane Model Building'
            ],
            assessment: 'Transport mechanisms quiz, Lab report, Concept map',
            standards: 'SC.7.L.12.4, SC.7.P.11.2'
        }
        // Continue with more units through the year...
    },

    // 7th Grade ELA (A Days, Period 3) - SHIFTED BY 2 DAYS
    '7th_ela': {
        '3-7': { // Was 1-5 
            code: '7_ela_1.1.1', 
            title: 'Narrative Elements',
            objectives: [
                'Identify key elements of narrative structure',
                'Analyze plot development and story arc',
                'Recognize narrative techniques and devices'
            ],
            materials: 'Short story anthology, graphic organizers, narrative element cards, digital texts',
            activities: [
                'Story Mapping Exercise',
                'Plot Diagram Creation',
                'Narrative Technique Hunt',
                'Creative Writing: Opening Hooks'
            ],
            assessment: 'Story element identification quiz, Narrative analysis paragraph',
            standards: 'LAFS.7.RL.1.1, LAFS.7.RL.1.3, LAFS.7.RL.2.5'
        },
        '8-12': { // Was 6-10
            code: '7_ela_1.1.2', 
            title: 'Character Development',
            objectives: [
                'Analyze character traits and motivations',
                'Track character changes throughout a text',
                'Understand character relationships and conflicts'
            ],
            materials: 'Novel excerpts, character journals, trait analysis sheets, role-play materials',
            activities: [
                'Character Trait Web Creation',
                'Character Diary Entry Writing',
                'Hot Seat Character Interviews',
                'Character Evolution Timeline'
            ],
            assessment: 'Character analysis essay, Trait identification quiz, Character project',
            standards: 'LAFS.7.RL.1.3, LAFS.7.RL.2.6, LAFS.7.RL.3.9'
        },
        '13-17': { // Was 11-15
            code: '7_ela_1.1.3', 
            title: 'Theme and Central Ideas',
            objectives: [
                'Identify themes in literary texts',
                'Analyze how themes develop',
                'Connect themes to real-world contexts'
            ],
            materials: 'Theme-based text sets, analysis guides, theme tracking sheets',
            activities: [
                'Theme Discovery Stations',
                'Theme Development Tracking',
                'Real-World Theme Connections',
                'Thematic Essay Writing'
            ],
            assessment: 'Theme analysis essay, Theme identification assessment',
            standards: 'LAFS.7.RL.1.2, LAFS.7.RL.2.4, LAFS.7.RL.3.9'
        }
        // Continue with more units...
    },

    // 9th Grade ELA (A Days, Period 1) - SHIFTED BY 2 DAYS
    '9th_ela': {
        '3-7': { // Was 1-5 
            code: '9_ela_1.1.1', 
            title: 'Literary Analysis Foundations',
            objectives: [
                'Master essential literary terminology',
                'Analyze complex text structures',
                'Develop critical reading strategies'
            ],
            materials: 'Literature anthology, analysis guides, annotation tools, rhetorical devices handbook',
            activities: [
                'Close Reading Workshop',
                'Literary Terms Application',
                'Text Annotation Practice',
                'Socratic Seminar Preparation'
            ],
            assessment: 'Literary analysis essay, Terms and devices quiz, Annotation portfolio',
            standards: 'LAFS.9-10.RL.1.1, LAFS.9-10.RL.2.4, LAFS.9-10.RL.2.5'
        },
        '8-12': { // Was 6-10
            code: '9_ela_1.1.2', 
            title: 'Theme and Symbolism',
            objectives: [
                'Identify and analyze complex themes',
                'Interpret symbols and their significance',
                'Connect themes to universal human experiences'
            ],
            materials: 'Symbolic literature selections, theme journals, visual symbol cards',
            activities: [
                'Symbol Hunting Exercise',
                'Theme Development Analysis',
                'Comparative Theme Study',
                'Symbolic Art Creation'
            ],
            assessment: 'Theme and symbol essay, Interpretive analysis, Creative project',
            standards: 'LAFS.9-10.RL.1.2, LAFS.9-10.RL.2.4, LAFS.9-10.RL.3.9'
        }
        // Continue with more units...
    },

    // 11th Grade Pre-Calculus (A Days, Period 1) - SHIFTED BY 2 DAYS
    '11th_precalc': {
        '3-7': { // Was 1-5 
            code: '11_pc_1.1.1', 
            title: 'Functions Review and Analysis',
            objectives: [
                'Review all function types and properties',
                'Analyze function transformations',
                'Apply functions to real-world modeling'
            ],
            materials: 'Graphing calculators, function cards, transformation manipulatives, modeling software',
            activities: [
                'Function Family Review',
                'Transformation Investigation',
                'Real-World Function Modeling',
                'Graphing Calculator Workshop'
            ],
            assessment: 'Functions test, Graphing project, Application problems',
            standards: 'MAFS.912.F-IF.2.4, MAFS.912.F-BF.2.3, MAFS.912.F-IF.3.7'
        },
        '8-12': { // Was 6-10
            code: '11_pc_1.1.2', 
            title: 'Polynomial and Rational Functions',
            objectives: [
                'Factor complex polynomials',
                'Find zeros and analyze end behavior',
                'Graph polynomial and rational functions'
            ],
            materials: 'Algebra tiles, graphing software, polynomial cards, asymptote tools',
            activities: [
                'Polynomial Factoring Practice',
                'Zero Finding Investigation',
                'Rational Function Graphing',
                'End Behavior Analysis'
            ],
            assessment: 'Polynomial quiz, Rational functions test, Graphing assessment',
            standards: 'MAFS.912.A-APR.2.3, MAFS.912.A-APR.3.4, MAFS.912.F-IF.3.7'
        }
        // Continue with more units...
    },

    // 11th Grade US Government (A Days, Period 2) - SHIFTED BY 2 DAYS
    '11th_gov': {
        '3-7': { // Was 1-5 
            code: '11_gov_1.1.1', 
            title: 'Constitutional Foundations',
            objectives: [
                'Analyze the structure of the Constitution',
                'Understand founding principles and philosophy',
                'Evaluate the amendment process'
            ],
            materials: 'Constitution copies, founding documents, amendment cards, primary sources',
            activities: [
                'Constitutional Convention Simulation',
                'Document Analysis Workshop',
                'Amendment Debate',
                'Federalist Papers Study'
            ],
            assessment: 'Constitution test, Document-based question essay, Amendment project',
            standards: 'SS.912.CG.1.1, SS.912.CG.1.2, SS.912.CG.1.3'
        },
        '8-12': { // Was 6-10
            code: '11_gov_1.1.2', 
            title: 'Three Branches of Government',
            objectives: [
                'Compare powers of each branch',
                'Analyze checks and balances system',
                'Evaluate contemporary branch conflicts'
            ],
            materials: 'Branch diagrams, power cards, case studies, current events articles',
            activities: [
                'Branch Power Mapping',
                'Checks and Balances Simulation',
                'Supreme Court Case Analysis',
                'Congressional Debate'
            ],
            assessment: 'Branches quiz, Balance of power essay, Case study analysis',
            standards: 'SS.912.CG.3.1, SS.912.CG.3.2, SS.912.CG.3.3'
        }
        // Continue with more units...
    },

    // B Day Subjects
    // 7th Grade Pre-Algebra (B Days, Period 2) - SHIFTED BY 2 DAYS
    '7th_math': {
        '3-7': { // Was 1-5 
            code: '7_math_1.1.1', 
            title: 'Number Systems and Integers',
            objectives: [
                'Work with positive and negative integers',
                'Apply integer operations',
                'Solve real-world problems with integers'
            ],
            materials: 'Number lines, integer chips, temperature cards, elevation maps',
            activities: [
                'Integer Operations Game',
                'Number Line Exploration',
                'Temperature Change Problems',
                'Integer War Card Game'
            ],
            assessment: 'Integer operations quiz, Problem-solving assessment',
            standards: 'MAFS.7.NS.1.1, MAFS.7.NS.1.2, MAFS.7.NS.1.3'
        },
        '8-12': { // Was 6-10
            code: '7_math_1.1.2', 
            title: 'Rational Numbers',
            objectives: [
                'Convert between fractions and decimals',
                'Operate with rational numbers',
                'Compare and order rational numbers'
            ],
            materials: 'Fraction bars, decimal squares, conversion charts, calculator',
            activities: [
                'Fraction-Decimal Conversion Practice',
                'Rational Number Operations',
                'Number Comparison Challenge',
                'Real-World Applications'
            ],
            assessment: 'Rational numbers test, Conversion quiz, Application problems',
            standards: 'MAFS.7.NS.1.2, MAFS.7.NS.1.3, MAFS.7.NS.2.2'
        }
        // Continue with more units...
    },

    // 7th Grade Civics (B Days, Period 3) - SHIFTED BY 2 DAYS
    '7th_civics': {
        '3-7': { // Was 1-5 
            code: '7_civ_1.1.1', 
            title: 'John Locke & Natural Rights',
            objectives: [
                'Understand natural rights philosophy',
                'Connect Locke\'s ideas to American founding',
                'Apply natural rights to modern situations'
            ],
            materials: 'Primary source excerpts, rights cards, scenario cards, timeline materials',
            activities: [
                'Natural Rights Sorting Activity',
                'Locke Philosophy Stations',
                'Rights Violation Scenarios',
                'Modern Application Debate'
            ],
            assessment: 'Natural rights quiz, Document analysis, Application essay',
            standards: 'SS.7.CG.1.1, SS.7.CG.1.2, SS.7.CG.1.4'
        },
        '8-12': { // Was 6-10
            code: '7_civ_1.1.2', 
            title: 'Montesquieu & Separation of Powers',
            objectives: [
                'Understand separation of powers concept',
                'Analyze the three branches system',
                'Evaluate checks and balances'
            ],
            materials: 'Branch diagrams, power cards, balance scales, government scenarios',
            activities: [
                'Power Distribution Activity',
                'Three Branches Simulation',
                'Checks and Balances Game',
                'Branch Conflict Resolution'
            ],
            assessment: 'Separation quiz, Branch functions test, System analysis',
            standards: 'SS.7.CG.1.1, SS.7.CG.3.1, SS.7.CG.3.3'
        }
        // Continue with more units...
    },

    // 9th Grade World History (B Days, Period 1) - SHIFTED BY 2 DAYS
    '9th_history': {
        '3-7': { // Was 1-5 
            code: '9_wh_1.1.1', 
            title: 'Ancient Civilizations Overview',
            objectives: [
                'Compare major ancient civilizations',
                'Analyze factors in civilization development',
                'Evaluate lasting contributions'
            ],
            materials: 'Civilization cards, maps, timeline materials, artifact replicas',
            activities: [
                'Civilization Comparison Chart',
                'Map Analysis Activity',
                'Timeline Construction',
                'Artifact Investigation'
            ],
            assessment: 'Civilization test, Comparison essay, Timeline project',
            standards: 'SS.912.W.1.1, SS.912.W.1.3, SS.912.W.2.1'
        },
        '8-12': { // Was 6-10
            code: '9_wh_1.1.2', 
            title: 'Greece and Rome',
            objectives: [
                'Analyze Greek democracy development',
                'Evaluate Roman republic structure',
                'Trace influences on modern government'
            ],
            materials: 'Government charts, primary sources, influence maps, debate materials',
            activities: [
                'Athenian Democracy Simulation',
                'Roman Senate Debate',
                'Government Comparison',
                'Legacy Tracking Project'
            ],
            assessment: 'Government systems quiz, Influence essay, Simulation participation',
            standards: 'SS.912.W.2.1, SS.912.W.2.2, SS.912.W.2.3'
        }
        // Continue with more units...
    },

    // 9th Grade Algebra I (B Days, Period 3) - SHIFTED BY 2 DAYS
    '9th_algebra': {
        '3-7': { // Was 1-5 
            code: '9_alg_1.1.1', 
            title: 'Linear Equations and Inequalities',
            objectives: [
                'Solve multi-step linear equations',
                'Graph linear equations and inequalities',
                'Apply to real-world problems'
            ],
            materials: 'Equation cards, graphing tools, coordinate planes, problem sets',
            activities: [
                'Equation Solving Stations',
                'Graphing Practice',
                'Word Problem Workshop',
                'Linear Equation Bingo'
            ],
            assessment: 'Linear equations test, Graphing quiz, Application problems',
            standards: 'MAFS.912.A-REI.2.3, MAFS.912.A-REI.4.10, MAFS.912.A-CED.1.2'
        },
        '8-12': { // Was 6-10
            code: '9_alg_1.1.2', 
            title: 'Systems of Linear Equations',
            objectives: [
                'Solve systems using multiple methods',
                'Graph system solutions',
                'Apply systems to real situations'
            ],
            materials: 'System cards, graphing calculators, scenario problems, manipulatives',
            activities: [
                'Systems Solution Methods',
                'Graphical Solutions Lab',
                'Real-World Systems',
                'System Challenge Problems'
            ],
            assessment: 'Systems test, Methods comparison, Application project',
            standards: 'MAFS.912.A-REI.3.5, MAFS.912.A-REI.3.6, MAFS.912.A-CED.1.3'
        }
        // Continue with more units...
    },

    // 11th Grade American Literature (B Days, Period 1) - SHIFTED BY 2 DAYS
    '11th_ela': {
        '3-7': { // Was 1-5 
            code: '11_ela_1.1.1', 
            title: 'Colonial and Revolutionary Literature',
            objectives: [
                'Analyze colonial American texts',
                'Understand historical and cultural context',
                'Evaluate persuasive techniques'
            ],
            materials: 'Colonial texts, historical documents, context cards, primary sources',
            activities: [
                'Puritan Literature Analysis',
                'Revolutionary Pamphlet Study',
                'Historical Context Research',
                'Persuasive Writing Workshop'
            ],
            assessment: 'Colonial literature essay, Document analysis, Context quiz',
            standards: 'LAFS.1112.RL.1.1, LAFS.1112.RI.3.9, LAFS.1112.RI.2.6'
        },
        '8-12': { // Was 6-10
            code: '11_ela_1.1.2', 
            title: 'Transcendentalism and Romanticism',
            objectives: [
                'Analyze transcendentalist philosophy',
                'Evaluate romantic literary elements',
                'Connect to American identity formation'
            ],
            materials: 'Transcendentalist texts, nature writings, philosophy cards, art connections',
            activities: [
                'Emerson and Thoreau Study',
                'Nature Writing Workshop',
                'Romantic Elements Hunt',
                'Philosophy Debate'
            ],
            assessment: 'Transcendentalism essay, Literary analysis, Philosophy reflection',
            standards: 'LAFS.1112.RL.1.2, LAFS.1112.RL.2.4, LAFS.1112.RI.1.1'
        }
        // Continue with more units...
    },

    // 11th Grade Economics (B Days, alternating with Gov) - SHIFTED BY 2 DAYS
    '11th_econ': {
        '3-7': { // Was 1-5 
            code: '11_econ_1.1.1', 
            title: 'Economic Fundamentals',
            objectives: [
                'Understand scarcity and choice',
                'Analyze opportunity cost',
                'Evaluate economic systems'
            ],
            materials: 'Economic models, choice scenarios, system comparison charts, trade-off cards',
            activities: [
                'Scarcity Simulation',
                'Opportunity Cost Analysis',
                'Economic Systems Comparison',
                'Resource Allocation Game'
            ],
            assessment: 'Fundamentals test, Choice analysis essay, Systems comparison',
            standards: 'SS.912.E.1.1, SS.912.E.1.2, SS.912.E.1.3'
        },
        '8-12': { // Was 6-10
            code: '11_econ_1.1.2', 
            title: 'Supply and Demand',
            objectives: [
                'Graph supply and demand curves',
                'Find market equilibrium',
                'Analyze factors causing shifts'
            ],
            materials: 'Market graphs, price cards, equilibrium tools, shift scenarios',
            activities: [
                'Supply and Demand Graphing',
                'Market Equilibrium Lab',
                'Price Discovery Simulation',
                'Shift Factor Analysis'
            ],
            assessment: 'Supply/demand test, Graphing assessment, Market analysis',
            standards: 'SS.912.E.1.3, SS.912.E.1.4, SS.912.E.1.6'
        }
        // Continue with more units...
    }
};

// Function to get lesson details for a specific day
function getLesson(dayType, dayNumber, subject) {
    const ranges = Object.keys(curriculumMap[subject] || {});
    for (const range of ranges) {
        const [start, end] = range.split('-').map(Number);
        if (dayNumber >= start && dayNumber <= end) {
            return curriculumMap[subject][range];
        }
    }
    return null;
}