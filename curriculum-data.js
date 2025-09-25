// Detailed curriculum mapping (5-day blocks for each topic)
// Based on actual curriculum files from the AI Academy content generator
// Updated to include AI Awareness Days (Sept 8-9)

const curriculumMap = {
    // AI AWARENESS DAYS - All Grades (First Two Days of AI Academy)
    'ai_awareness': {
        '2.B': { // Sept 8 (Monday) - Day 2.B - FIRST DAY OF AI ACADEMY (School started Sept 3)
            code: 'AI_1.B',
            title: 'Welcome to Your AI-Powered Learning Journey',
            objectives: [
                'Welcome students to AI Academy @ Centner',
                'Introduction to AI-enhanced learning',
                'Establish AI ethics and digital citizenship',
                'Explore AI tools for each subject area',
                'Create classroom AI honor codes'
            ],
            materials: 'MacBooks, AI tool accounts (ChatGPT, Claude, Khan Academy/Khanmigo), digital citizenship agreements, mystery boxes',
            activities: [
                'Opening Circle: Share your name and one thing you hope AI can help you learn',
                'AI Timeline: Ancient Abacus (2700 BCE) to ChatGPT (2022)',
                'Interactive "AI or Human?" - Guess which writings are AI-generated',
                'Grade-specific breakout sessions',
                'Khan Academy & Khanmigo setup (7th Grade)',
                'Creating class AI Honor Code',
                'Digital Constitution development'
            ],
            assessment: 'Exit ticket on ethical AI use, Digital citizenship pledge, Khan Academy diagnostic, Math learning contracts',
            standards: 'Technology and Digital Literacy Standards, Florida B.E.S.T. Standards',
            details: {
                'Period 1 (8:18-9:48)': {
                    '9': 'World History: AI helps historians analyze ancient texts, digital archaeology, pattern recognition',
                    '11': 'American Literature: AI as writing partner (not replacement), understanding authorial voice vs AI'
                },
                'Period 2 (9:51-11:21)': {
                    '7': 'Pre-Algebra: Calculator Evolution activity, Khan Academy/Khanmigo setup, AI word problem translation, pattern recognition stations'
                },
                'Period 3 (12:12-1:42)': {
                    '7': 'Civics: Digital rights & responsibilities, privacy, misinformation, creating Digital Constitution',
                    '9': 'Algebra I: How AI uses algebra, creating equations AI can solve, finding patterns in data'
                }
            }
        },
        '3.A': { // Sept 9 (Tuesday) - Day 3.A - SECOND DAY OF AI ACADEMY
            code: 'AI_2.A',
            title: 'Mastering AI Tools for Academic Excellence',
            objectives: [
                'Master subject-specific AI tools',
                'Practice prompt engineering strategies',
                'Create AI-assisted projects',
                'Prepare for Parent Showcase (Thursday)'
            ],
            materials: 'Grammarly Premium, QuillBot, Hemingway Editor, Wolfram Alpha, Desmos, PhotoMath, Symbolab, iNaturalist, Google Lens',
            activities: [
                'AI Speed Analysis Challenge',
                'Subject-specific AI tool deep dives',
                'Cross-curricular "Mathematics of Literature" project',
                'Virtual microscope with AI identification',
                'AI Writing Workshop stations',
                'Collaborative story creation',
                'Parent showcase preparation'
            ],
            assessment: 'AI tool proficiency checks, Digital portfolio creation, Skills assessment exit tickets, Parent showcase sign-ups',
            standards: 'Technology and Digital Literacy Standards, Subject-specific Florida Standards',
            details: {
                'Period 1 (8:18-9:48)': {
                    '9': 'ELA: Grammarly Premium, QuillBot paraphrasing, Hemingway Editor, ChatGPT for symbolism analysis',
                    '11': 'Pre-Calculus: Wolfram Alpha derivatives, Desmos graphing trig functions, PhotoMath verification, Symbolab limits'
                },
                'Period 2 (9:51-11:21)': {
                    '7': 'Life Science Discovery Box: Virtual microscope AI, iNaturalist species ID, Google Lens biology, AI research assistant',
                    '11': 'US Government: AI in elections, deepfakes, fact-checking, AI legislation, constitutional questions about AI'
                },
                'Period 3 (12:12-1:42)': {
                    '7': 'ELA Writing Workshop: 4 stations - Brainstorming with AI, Grammar/Style, Creative writing, Research & citations'
                }
            }
        }
    },
    
    // 7th Grade Civics (B Days, Period 3) - Complete Curriculum
    // B days: 1.B, 2.B, 3.B, 4.B, 5.B, 6.B...
    '7th_civics': {
        '1.B': { // Sept 4 - Regular school day before AI Academy
            code: '7_civ_intro',
            title: 'Welcome to Civics Class',
            objectives: [
                'Introduction to classroom expectations',
                'Overview of civics curriculum',
                'Understanding why civics matters'
            ],
            materials: 'Syllabus, classroom rules, civics notebooks',
            activities: [
                'Classroom introductions',
                'Syllabus review',
                'What is civics? discussion',
                'Set up civics notebooks'
            ],
            assessment: 'Participation in discussions',
            standards: 'SS.7.CG.1.1'
        },
        '2.B': { // Sept 8 - AI Awareness Day - handled by ai_awareness section
            // AI Awareness content
        },
        '3.B': { // Sept 10 - First regular civics lesson after AI Academy starts
            code: '7_civ_1.1.1',
            title: 'Foundations of American Democracy',
            objectives: [
                'Identify key Enlightenment thinkers and their influence on American government',
                'Explain the Declaration of Independence\'s principles',
                'Analyze the relationship between natural rights and government',
                'Compare different forms of government'
            ],
            materials: 'Showrunner Episode 1.1.1, AI discussion prompts, founding documents, interactive timeline',
            activities: [
                'AI-guided Socratic dialogue on natural rights',
                'Declaration of Independence analysis with NotebookLM',
                'Government systems comparison chart',
                'Enlightenment thinkers speed dating simulation'
            ],
            assessment: 'AI-evaluated quiz (80% mastery required), Document analysis rubric, Socratic dialogue participation',
            standards: 'SS.7.C.1.1, SS.7.C.1.2, SS.7.C.1.4, SS.7.CG.1.5'
        },
        '8.B-12.B': { // Days 8.B through 12.B
            code: '7_civ_1.1.2',
            title: 'Articles of Confederation to Constitution',
            objectives: [
                'Analyze weaknesses of the Articles of Confederation',
                'Understand compromises made at Constitutional Convention',
                'Explain the structure of the Constitution',
                'Evaluate the ratification debate between Federalists and Anti-Federalists'
            ],
            materials: 'Showrunner Episode 1.1.2, Constitutional Convention simulation, compromise cards, ratification debate materials',
            activities: [
                'Articles of Confederation failure simulation',
                'Great Compromise negotiation role-play',
                'Constitution scavenger hunt with AI assistance',
                'Federalist vs Anti-Federalist debate'
            ],
            assessment: 'Constitutional knowledge test, Compromise negotiation evaluation, Debate performance rubric',
            standards: 'SS.7.C.1.5, SS.7.C.1.6, SS.7.C.1.7, SS.7.C.1.8'
        },
        '13.B-17.B': { // Days 13.B, 15.B, 17.B (3 B days)
            code: '7_civ_1.1.3',
            title: 'Bill of Rights and Civil Liberties',
            objectives: [
                'Identify and explain each amendment in the Bill of Rights',
                'Apply Bill of Rights to modern scenarios',
                'Analyze Supreme Court cases involving civil liberties',
                'Evaluate the balance between individual rights and public safety'
            ],
            materials: 'Showrunner Episode 1.1.3, Bill of Rights scenarios, Supreme Court case summaries, rights ranking activity',
            activities: [
                'Bill of Rights matching game with real-world scenarios',
                'Mock trial on First Amendment case',
                'Rights ranking pyramid discussion',
                'Create your own amendment proposal'
            ],
            assessment: 'Bill of Rights application test, Case analysis essay, Amendment proposal presentation',
            standards: 'SS.7.C.2.4, SS.7.C.2.5, SS.7.C.3.6, SS.7.C.3.12'
        },
        '19.B-23.B': { // Days 19.B, 21.B, 23.B (3 B days)
            code: '7_civ_1.2.1',
            title: 'Constitutional Principles',
            objectives: [
                'Define and explain separation of powers',
                'Understand checks and balances system',
                'Analyze federalism and division of powers',
                'Evaluate how these principles work in practice'
            ],
            materials: 'Showrunner Episode 1.2.1, Powers sorting cards, checks and balances flowchart, federalism scenarios',
            activities: [
                'Powers and responsibilities sorting activity',
                'Checks and balances simulation game',
                'Federal vs state powers debate',
                'Current events analysis through constitutional lens'
            ],
            assessment: 'Principles identification quiz, System diagram creation, Current events analysis',
            standards: 'SS.7.C.1.7, SS.7.C.3.3, SS.7.C.3.4, SS.7.C.3.14'
        },
        '25.B-29.B': { // Days 25.B, 27.B, 29.B (3 B days)
            code: '7_civ_1.2.2',
            title: 'Citizenship and Civic Participation',
            objectives: [
                'Define citizenship and paths to citizenship',
                'Identify rights, responsibilities, and obligations of citizens',
                'Analyze forms of civic participation',
                'Develop personal civic action plans'
            ],
            materials: 'Showrunner Episode 1.2.2, Citizenship test prep, civic participation menu, action plan templates',
            activities: [
                'Citizenship test challenge with AI coach',
                'Rights and responsibilities balance beam',
                'Civic participation fair simulation',
                'Design a community service project'
            ],
            assessment: 'Citizenship knowledge test, Participation portfolio, Action plan presentation',
            standards: 'SS.7.C.2.1, SS.7.C.2.2, SS.7.C.2.3, SS.7.C.2.14'
        },
        '31.B-35.B': { // Days 31.B, 33.B, 35.B (3 B days before winter break)
            code: '7_civ_1.3.1',
            title: 'The Legislative Branch',
            objectives: [
                'Understand the structure of Congress',
                'Analyze the lawmaking process',
                'Evaluate representation and constituencies',
                'Apply knowledge to current legislation'
            ],
            materials: 'Showrunner Episode 1.3.1, bill tracking sheets, committee cards, legislative simulation',
            activities: [
                'How a Bill Becomes a Law simulation',
                'Committee hearing role-play',
                'Mock Congress session',
                'Current legislation tracking'
            ],
            assessment: 'Legislative process test, Bill tracking project, Congress simulation evaluation',
            standards: 'SS.7.C.3.8, SS.7.C.3.9, SS.7.C.3.10, SS.7.C.3.11'
        }
    },

    // 7th Grade ELA (A Days, Period 3) - Complete Curriculum
    // A days: 1.A, 2.A, 3.A, 4.A, 5.A...
    '7th_ela': {
        '1.A': { // Sept 3 - First day of school
            code: '7_ela_intro',
            title: 'Welcome to 7th Grade ELA',
            objectives: [
                'Introduction to classroom expectations',
                'Overview of ELA curriculum',
                'Establish reading and writing goals'
            ],
            materials: 'Syllabus, reading journals, name tags',
            activities: [
                'Classroom introductions',
                'Syllabus review',
                'Reading interest survey',
                'Set up reading journals'
            ],
            assessment: 'Participation and goal setting',
            standards: 'LAFS.7.SL.1.1'
        },
        '2.A': { // Sept 5 - Regular school day before AI Academy
            code: '7_ela_foundations',
            title: 'Building Our Reading Community',
            objectives: [
                'Establish classroom reading routines',
                'Introduction to independent reading',
                'Create classroom library system'
            ],
            materials: 'Classroom library books, reading logs',
            activities: [
                'Book speed dating activity',
                'Create reading goals',
                'Library organization',
                'Silent reading time'
            ],
            assessment: 'Reading goal sheets',
            standards: 'LAFS.7.RL.1.10'
        },
        '3.A': { // Sept 9 - AI Awareness Day - handled by ai_awareness section
            // AI Awareness content
        },
        '4.A': { // Sept 11 - First regular ELA lesson after AI Academy starts
            code: '7_ela_1.1.1',
            title: 'Introduction to 7th Grade ELA',
            objectives: [
                'Establish classroom community and learning expectations',
                'Assess students\' current reading and writing abilities',
                'Introduce key literary concepts for the year',
                'Build foundational vocabulary knowledge'
            ],
            materials: 'Interactive notebooks, diagnostic assessments, literary terms handouts, vocabulary journals',
            activities: [
                'Learning style assessment and goal setting',
                'Diagnostic reading and writing evaluations',
                'Literary terms scavenger hunt',
                'Vocabulary pre-assessment'
            ],
            assessment: 'Diagnostic reading assessment, Writing sample, Vocabulary pre-test, Learning goals reflection',
            standards: 'ELA.7.R.1.1, ELA.7.C.1.1, ELA.7.V.1.1'
        },
        '8.A-12.A': { // Days 8.A, 10.A, 12.A (3 A days)
            code: '7_ela_1.2.1',
            title: 'Narrative Elements and Structure',
            objectives: [
                'Identify and analyze basic story elements',
                'Understand different narrative structures',
                'Recognize how authors use structure for meaning',
                'Apply knowledge to reading comprehension'
            ],
            materials: 'Short story collections, plot diagrams, story mapping tools, narrative texts',
            activities: [
                'Story element identification exercises',
                'Plot diagram creation and analysis',
                'Narrative structure comparison',
                'Interactive story mapping'
            ],
            assessment: 'Story elements quiz, Plot diagram accuracy, Reading comprehension checks, Structure analysis',
            standards: 'ELA.7.R.1.2, ELA.7.R.1.3, ELA.7.R.3.1'
        },
        '14.A-18.A': { // Days 14.A, 16.A, 18.A (3 A days)
            code: '7_ela_1.3.1',
            title: 'Character Development and Analysis',
            objectives: [
                'Analyze direct and indirect characterization',
                'Examine character motivations and conflicts',
                'Understand character-plot relationships',
                'Compare characters across texts'
            ],
            materials: 'Character analysis worksheets, literary excerpts, tracking sheets, comparison charts',
            activities: [
                'Characterization sorting activities',
                'Character motivation analysis',
                'Character arc tracking',
                'Character comparison discussions'
            ],
            assessment: 'Character analysis essays, Development timelines, Characterization quiz, Discussion evaluation',
            standards: 'ELA.7.R.1.3, ELA.7.R.3.1, ELA.7.C.2.1'
        },
        '20.A-24.A': { // Days 20.A, 22.A, 24.A (3 A days)
            code: '7_ela_1.4.1',
            title: 'Theme and Central Idea',
            objectives: [
                'Distinguish between theme and central idea',
                'Identify universal themes across cultures',
                'Support theme analysis with evidence',
                'Connect themes to personal experiences'
            ],
            materials: 'Theme worksheets, universal themes chart, evidence sheets, cross-cultural texts',
            activities: [
                'Theme vs topic differentiation',
                'Universal themes exploration',
                'Textual evidence gathering',
                'Cross-text theme comparison'
            ],
            assessment: 'Theme analysis essays, Evidence-based presentations, Theme identification test, Connection projects',
            standards: 'ELA.7.R.1.2, ELA.7.R.2.1, ELA.7.R.3.2'
        },
        '26.A-30.A': { // Days 26.A, 28.A, 30.A (3 A days)
            code: '7_ela_2.1.1',
            title: 'Informational Text Structures',
            objectives: [
                'Identify different informational text structures',
                'Understand how structure affects comprehension',
                'Analyze author organization for purpose',
                'Apply structure knowledge to writing'
            ],
            materials: 'Informational texts, structure guides, graphic organizers, non-fiction articles',
            activities: [
                'Text structure identification practice',
                'Graphic organizer creation',
                'Structure effectiveness analysis',
                'Comprehension strategy development'
            ],
            assessment: 'Structure identification quiz, Graphic organizer accuracy, Comprehension assessments, Analysis essays',
            standards: 'ELA.7.R.2.1, ELA.7.R.2.2, ELA.7.C.1.4'
        },
        '32.A-35.A': { // Days 32.A, 34.A, 35.A (last days before winter break)
            code: '7_ela_2.2.1',
            title: 'Author\'s Purpose and Perspective',
            objectives: [
                'Identify author\'s purpose in various texts',
                'Analyze author\'s perspective and bias',
                'Evaluate how purpose affects writing style',
                'Apply understanding to own writing'
            ],
            materials: 'Purpose cards, perspective texts, bias detection worksheets, writing samples',
            activities: [
                'Purpose identification stations',
                'Perspective analysis debates',
                'Bias detection practice',
                'Purpose-driven writing workshop'
            ],
            assessment: 'Author\'s purpose quiz, Perspective analysis essay, Writing portfolio review',
            standards: 'ELA.7.R.2.3, ELA.7.R.2.4, ELA.7.C.1.3'
        }
    },

    // 7th Grade Pre-Algebra (B Days - odd numbers, Period 2) - Complete Curriculum
    '7th_math': {
        '3.B-7.B': { // After AI awareness on 2.B, regular curriculum starts
            code: '7_math_1.1.1',
            title: 'Number Systems and Operations',
            objectives: [
                'Master operations with integers and rational numbers',
                'Apply order of operations consistently',
                'Convert between fractions, decimals, and percents',
                'Solve real-world problems with rational numbers'
            ],
            materials: 'Khan Academy modules, number line manipulatives, fraction bars, decimal squares, calculators',
            activities: [
                'Integer operations war card game',
                'Fraction-decimal-percent conversion relay',
                'Order of operations escape room',
                'Real-world problem solving stations'
            ],
            assessment: 'Operations quiz, Conversion test, Problem-solving portfolio, Khan Academy progress',
            standards: 'MA.7.NSO.1.1, MA.7.NSO.1.2, MA.7.NSO.2.1, MA.7.NSO.2.2'
        },
        '7.B-11.B': { // Days 7.B, 9.B, 11.B (3 B days)
            code: '7_math_1.2.1',
            title: 'Algebraic Expressions and Equations',
            objectives: [
                'Translate verbal phrases into algebraic expressions',
                'Simplify algebraic expressions using properties',
                'Solve one and two-step equations',
                'Apply equations to real-world situations'
            ],
            materials: 'Algebra tiles, equation balance scales, Khan Academy Algebra Basics, expression cards',
            activities: [
                'Expression translation challenge',
                'Algebra tile simplification',
                'Equation solving race',
                'Real-world equation modeling'
            ],
            assessment: 'Expression translation test, Equation solving quiz, Application problems, Performance tasks',
            standards: 'MA.7.AR.1.1, MA.7.AR.1.2, MA.7.AR.2.1, MA.7.AR.2.2'
        },
        '13.B-17.B': { // Days 13.B, 15.B, 17.B (3 B days)
            code: '7_math_1.3.1',
            title: 'Proportional Relationships',
            objectives: [
                'Identify and represent proportional relationships',
                'Calculate unit rates and constant of proportionality',
                'Solve proportion problems using multiple methods',
                'Apply proportions to scale drawings and similar figures'
            ],
            materials: 'Ratio tables, proportion wheels, scale models, graphing tools, Khan Academy Ratios',
            activities: [
                'Unit rate shopping comparison',
                'Scale model building project',
                'Proportion puzzle solving',
                'Similar figures investigation'
            ],
            assessment: 'Proportions test, Scale drawing project, Unit rate problems, Real-world applications',
            standards: 'MA.7.AR.3.1, MA.7.AR.3.2, MA.7.AR.4.1, MA.7.AR.4.2'
        },
        '19.B-23.B': { // Days 19.B, 21.B, 23.B (3 B days)
            code: '7_math_2.1.1',
            title: 'Linear Equations and Graphing',
            objectives: [
                'Graph linear equations on coordinate plane',
                'Find slope and y-intercept from equations and graphs',
                'Write equations in slope-intercept form',
                'Interpret graphs in real-world contexts'
            ],
            materials: 'Graphing calculators, coordinate planes, Desmos activities, linear equation cards',
            activities: [
                'Human graphing activity',
                'Slope investigation lab',
                'Equation-graph matching game',
                'Real-world linear modeling'
            ],
            assessment: 'Graphing test, Equation writing quiz, Interpretation problems, Desmos activities',
            standards: 'MA.7.AR.2.2, MA.7.AR.3.3, MA.7.DP.1.1, MA.7.DP.1.2'
        },
        '25.B-29.B': { // Days 25.B, 27.B, 29.B (3 B days)
            code: '7_math_2.2.1',
            title: 'Geometry Foundations',
            objectives: [
                'Calculate area and perimeter of complex figures',
                'Find surface area and volume of 3D shapes',
                'Apply angle relationships and properties',
                'Solve geometric problems in real contexts'
            ],
            materials: 'Geometric solids, protractors, area models, 3D printing software, Khan Academy Geometry',
            activities: [
                'Area and perimeter scavenger hunt',
                'Surface area packaging project',
                'Angle relationships investigation',
                '3D shape construction challenge'
            ],
            assessment: 'Geometry test, Construction project, Problem-solving portfolio, Practical applications',
            standards: 'MA.7.GR.1.1, MA.7.GR.1.2, MA.7.GR.1.3, MA.7.GR.2.1'
        },
        '31.B-35.B': { // Days 31.B, 33.B, 35.B (3 B days before winter break)
            code: '7_math_2.3.1',
            title: 'Data Analysis and Statistics',
            objectives: [
                'Calculate measures of central tendency',
                'Create and interpret data displays',
                'Understand probability concepts',
                'Apply statistics to real-world data'
            ],
            materials: 'Data sets, graphing tools, probability materials, Khan Academy Statistics',
            activities: [
                'Mean, median, mode investigations',
                'Data display creation project',
                'Probability experiments',
                'Real-world data analysis'
            ],
            assessment: 'Statistics test, Data project, Probability problems, Khan progress check',
            standards: 'MA.7.DP.1.1, MA.7.DP.1.2, MA.7.DP.1.3, MA.7.DP.2.1'
        }
    },

    // 7th Grade Science (A Days, Period 2) - Complete Curriculum
    '7th_science': {
        '2.A-6.A': { // Days 2.A, 4.A, 6.A (3 A days)
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
        '8.A-12.A': { // Days 8.A, 10.A, 12.A (3 A days)
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
        '14.A-18.A': { // Days 14.A, 16.A, 18.A (3 A days)
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
        '20.A-24.A': { // Days 20.A, 22.A, 24.A (3 A days)
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
        '26.A-30.A': { // Days 26.A, 28.A, 30.A (3 A days)
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
        '32.A-36.A': { // Days 32.A, 34.A, 36.A (3 A days)
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
        },
        '23-27': {
            code: '7_sci_1.2.2',
            title: 'Cell Organelles and Functions',
            objectives: [
                'Identify major cell organelles and their functions',
                'Explain how organelles work together as a system',
                'Compare plant and animal cell structures',
                'Model cell processes and interactions'
            ],
            materials: 'Discovery Box 1.2.2: Cell organelle models, interactive charts, plant/animal cell slides, modeling clay',
            activities: [
                'Organelle Function Stations',
                'Cell City Analogy Project',
                'Plant vs Animal Cell Investigation',
                'Cell Process Simulation'
            ],
            assessment: 'Organelle functions quiz, Cell comparison lab report, Model presentation',
            standards: 'SC.7.L.16.1, SC.7.L.16.2, SC.7.L.17.2'
        },
        '28-32': {
            code: '7_sci_1.3.1',
            title: 'DNA and Heredity',
            objectives: [
                'Describe the structure and function of DNA',
                'Explain how traits are inherited from parents',
                'Use Punnett squares to predict genetic outcomes',
                'Analyze patterns of inheritance'
            ],
            materials: 'Discovery Box 1.3.1: DNA models, heredity cards, Punnett square templates, trait inventory sheets',
            activities: [
                'DNA Model Building Lab',
                'Trait Inventory Investigation',
                'Punnett Square Practice',
                'Genetic Probability Games'
            ],
            assessment: 'DNA structure quiz, Punnett square problems, Heredity project',
            standards: 'SC.7.L.16.1, SC.7.L.16.2, SC.7.L.16.3'
        },
        '33-37': {
            code: '7_sci_1.3.2',
            title: 'Evolution and Natural Selection',
            objectives: [
                'Explain the theory of evolution by natural selection',
                'Analyze evidence for evolution',
                'Understand adaptation and survival of the fittest',
                'Explore speciation and biodiversity'
            ],
            materials: 'Discovery Box 1.3.2: Fossil replicas, adaptation cards, natural selection simulation, evolution timeline',
            activities: [
                'Fossil Evidence Investigation',
                'Natural Selection Simulation',
                'Adaptation Station Rotation',
                'Evolution Timeline Creation'
            ],
            assessment: 'Evolution evidence analysis, Natural selection test, Adaptation project',
            standards: 'SC.7.L.15.1, SC.7.L.15.2, SC.7.L.15.3'
        },
        '38-42': {
            code: '7_sci_2.1.1',
            title: 'Ecosystems and Energy Flow',
            objectives: [
                'Trace energy flow through ecosystems',
                'Analyze food chains and food webs',
                'Understand trophic levels and energy pyramids',
                'Evaluate human impact on ecosystems'
            ],
            materials: 'Discovery Box 2.1.1: Ecosystem cards, energy flow models, food web materials, ecological pyramids',
            activities: [
                'Food Web Construction',
                'Energy Pyramid Building',
                'Ecosystem Role Play',
                'Human Impact Investigation'
            ],
            assessment: 'Food web analysis, Energy flow diagram, Ecosystem project, Impact assessment',
            standards: 'SC.7.L.17.1, SC.7.L.17.2, SC.7.L.17.3'
        },
        '43-47': {
            code: '7_sci_2.1.2',
            title: 'Human Body Systems',
            objectives: [
                'Identify major body systems and their functions',
                'Explain how body systems work together',
                'Analyze the effects of diseases on body systems',
                'Investigate homeostasis and feedback loops'
            ],
            materials: 'Discovery Box 2.1.2: Body system models, organ cards, health scenarios, homeostasis simulations',
            activities: [
                'Body Systems Jigsaw',
                'Disease Detective Activity',
                'Homeostasis Lab',
                'Systems Integration Project'
            ],
            assessment: 'Body systems test, Disease case study, Homeostasis lab report',
            standards: 'SC.7.L.14.1, SC.7.L.14.2, SC.7.L.14.3'
        }
    },

    // 7th Grade ELA (A Days, Period 3) - SHIFTED BY 2 DAYS
    // DUPLICATE SECTION - COMMENTED OUT (content already in first 7th_ela section above)
    /*'7th_ela': {
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
    },*/

    // 9th Grade ELA (A Days, Period 1) - Complete Curriculum
    '9th_ela': {
        '2.A-6.A': { // Days 2.A, 4.A, 6.A (3 A days)
            code: '9_ela_1.1.1',
            title: 'The Power of Words - Rhetoric Through MLK',
            objectives: [
                'Define rhetoric and identify ethos, pathos, logos',
                'Analyze rhetorical appeals in MLK\'s "I Have a Dream" speech',
                'Evaluate how rhetorical choices enhance effectiveness',
                'Connect rhetoric to progress and its costs'
            ],
            materials: 'MLK speech video/text, rhetorical analysis organizers, Showrunner animation, NotebookLM resources',
            activities: [
                'Showrunner animation with Professor Rhetoric',
                'ChatGPT guided rhetorical appeal identification',
                'NotebookLM deep dive into March on Washington',
                'Gemini AI writing workshop for analysis essay'
            ],
            assessment: 'Quick check quiz, Simulation activity, Socratic dialogue prep, Synthesis ticket',
            standards: 'ELA.9.R.2.1, ELA.9.R.2.3, ELA.9.R.3.1, ELA.9.C.1.3'
        },
        '8.A-12.A': { // Days 8.A, 10.A, 12.A (3 A days)
            code: '9_ela_1.2.1',
            title: 'Dark Communication - "Cask of Amontillado"',
            objectives: [
                'Define unreliable narration and identify bias',
                'Analyze dramatic irony for tension and character',
                'Evaluate manipulative rhetoric in the story',
                'Connect to modern toxic communication'
            ],
            materials: 'Poe text, unreliable narration guides, character analysis organizers, modern parallels sheets',
            activities: [
                'Showrunner animation analyzing unreliable narration',
                'ChatGPT exercises on narrator bias',
                'NotebookLM Gothic narrator comparisons',
                'Digital age manipulation parallels'
            ],
            assessment: 'Unreliable narration quiz, Character analysis activity, Modern parallels discussion, Analysis essay',
            standards: 'ELA.9.R.1.1, ELA.9.R.1.3, ELA.9.R.3.3, ELA.9.R.3.4'
        },
        '14.A-18.A': { // Days 14.A, 16.A, 18.A (3 A days)
            code: '9_ela_2.1.1',
            title: 'Tradition vs. Progress - "The Lottery"',
            objectives: [
                'Analyze symbolism critiquing blind tradition',
                'Examine mob mentality in harmful practices',
                'Evaluate costs of maintaining social order',
                'Connect themes to contemporary harmful traditions'
            ],
            materials: 'Jackson text, post-WWII context, reader response materials, symbolism guides',
            activities: [
                'Showrunner episode on symbolism and social commentary',
                'Mob psychology simulation activity',
                'Contemporary parallels research',
                'Socratic dialogue on tradition vs progress'
            ],
            assessment: 'Symbolism quiz, Group dynamics simulation, Modern parallels analysis, Theme essay',
            standards: 'ELA.9.R.1.1, ELA.9.R.3.1, ELA.9.R.3.4'
        },
        '18-22': {
            code: '9_ela_2.2.1',
            title: 'Equality\'s Price - "Harrison Bergeron"',
            objectives: [
                'Analyze satirical critique of enforced equality',
                'Examine individual excellence vs societal stability',
                'Evaluate approaches to social justice',
                'Connect dystopian themes to equality debates'
            ],
            materials: 'Vonnegut text, satire analysis tools, dystopian archetype frameworks, equality debate resources',
            activities: [
                'Philosophical debate simulation',
                'Character archetype analysis',
                'Gamified dystopian theme exploration',
                'AI-assisted equality vs equity research'
            ],
            assessment: 'Philosophical debate performance, Character analysis, Contemporary research project, Satirical analysis',
            standards: 'ELA.9.R.1.2, ELA.9.R.1.3, ELA.9.C.1.3'
        },
        '23-62': {
            code: '9_ela_3_novel',
            title: 'Ender\'s Game Novel Study (8 weeks)',
            objectives: [
                'Analyze complex character development throughout novel',
                'Evaluate ethics of child soldiers and military training',
                'Examine isolation, manipulation, and moral responsibility',
                'Connect to contemporary military and technology ethics'
            ],
            materials: 'Complete Ender\'s Game novel, character tracking charts, ethical frameworks, portfolio materials',
            activities: [
                'Weekly character development tracking',
                'Thematic integration across novel',
                'Contemporary connection research',
                'Philosophical debate simulations',
                'Portfolio development with growth documentation'
            ],
            assessment: 'Character analysis essay (Week 2), Leadership paper (Week 4), Thematic essay (Week 6), Final portfolio (Week 8)',
            standards: 'ELA.9.R.1.1, ELA.9.R.1.2, ELA.9.R.1.3, ELA.9.C.1.3, ELA.9.C.2.1'
        },
        '63-92': {
            code: '9_ela_4_poetry',
            title: 'Poetry Unit - Voice and Social Change (6 weeks)',
            objectives: [
                'Analyze diverse poetic forms from traditional to spoken word',
                'Master advanced poetry analysis techniques',
                'Create original poetry demonstrating craft understanding',
                'Connect poetic themes to social change and progress'
            ],
            materials: 'Poetry anthology (150+ poems), audio/video performances, creation tools',
            activities: [
                'Modern voices analysis (Gorman, Kaur)',
                'Classic American poetry exploration',
                'Social change poetry workshops',
                'Original poetry creation and performance'
            ],
            assessment: 'Comparative analysis essay, Social commentary analysis, Original poetry anthology with performance',
            standards: 'ELA.9.R.1.2, ELA.9.R.1.4, ELA.9.R.3.1, ELA.9.C.1.5'
        },
        '20.A-24.A': { // Days 20.A, 22.A, 24.A
            code: '9_ela_2.3.1',
            title: 'Technology\'s Impact - "The Veldt"',
            objectives: [
                'Analyze technology\'s role in family dynamics',
                'Examine psychological horror elements',
                'Evaluate Bradbury\'s warnings about technology',
                'Connect to modern digital dependency'
            ],
            materials: 'Bradbury text, technology impact surveys, digital wellness resources',
            activities: [
                'Technology dependency self-assessment',
                'Psychological elements analysis',
                'Modern parallels discussion',
                'Digital wellness action plan'
            ],
            assessment: 'Technology impact essay, Literary analysis, Modern application project',
            standards: 'ELA.9.R.1.1, ELA.9.R.1.2, ELA.9.R.3.1'
        },
        '26.A-30.A': { // Days 26.A, 28.A, 30.A
            code: '9_ela_2.4.1',
            title: 'Identity and Conformity - "The Scarlet Ibis"',
            objectives: [
                'Analyze symbolism and foreshadowing',
                'Examine pride as character motivation',
                'Evaluate sibling dynamics and expectations',
                'Connect to societal pressure themes'
            ],
            materials: 'Hurst text, symbolism guides, character motivation maps',
            activities: [
                'Symbol tracking throughout story',
                'Pride consequences debate',
                'Character motivation analysis',
                'Personal connection writing'
            ],
            assessment: 'Symbolism identification quiz, Character analysis essay, Theme presentation',
            standards: 'ELA.9.R.1.2, ELA.9.R.1.3, ELA.9.R.3.1'
        },
        '32.A-35.A': { // Days 32.A, 34.A, 35.A
            code: '9_ela_review',
            title: 'Semester Review and Portfolio',
            objectives: [
                'Synthesize semester themes',
                'Demonstrate growth in analysis skills',
                'Create comprehensive portfolio',
                'Prepare for semester assessment'
            ],
            materials: 'All semester texts, portfolio rubrics, review materials',
            activities: [
                'Theme synthesis discussions',
                'Portfolio organization workshop',
                'Peer review sessions',
                'Semester reflection writing'
            ],
            assessment: 'Portfolio presentation, Comprehensive theme essay, Semester exam',
            standards: 'ELA.9.R.1.1-ELA.9.C.2.1'
        }
    },

    // 9th Grade Geometry (B Days, Period 2) - Complete Curriculum  
    '9th_geometry': {
        '1.B-5.B': { // Days 1.B, 3.B, 5.B (3 B days)
            code: '9_geom_1.1.1',
            title: 'Points, Lines, and Planes',
            objectives: [
                'Define and identify undefined terms: point, line, plane',
                'Use proper geometric notation',
                'Identify collinear and coplanar points',
                'Apply postulates about points, lines, and planes'
            ],
            materials: 'GeoGebra 3D, digital manipulatives, compass/straightedge, coordinate plane software',
            activities: [
                'Architect\'s Foundation in GeoGebra 3D',
                'GPS coordinate system exploration',
                'Virtual manipulation of postulates',
                'Real-world spatial relationships'
            ],
            assessment: 'Interactive Quizizz, Construction evaluation, Exit ticket on undefined terms',
            standards: 'MA.912.GR.1.1'
        },
        '7.B-11.B': { // Days 7.B, 9.B, 11.B (3 B days)
            code: '9_geom_1.1.2',
            title: 'Segments, Rays, and Angles',
            objectives: [
                'Distinguish segments, rays, and lines',
                'Measure and calculate segment lengths',
                'Apply segment and angle addition postulates',
                'Identify angle relationships'
            ],
            materials: 'Digital rulers and protractors, angle measurement apps, GeoGebra angle tools',
            activities: [
                'Segment construction challenges',
                'Midpoint exploration with coordinates',
                'Angle relationship discovery lab',
                'Real-world measurement projects'
            ],
            assessment: 'Construction portfolio, Measurement accuracy, Angle classification quiz',
            standards: 'MA.912.GR.1.1'
        },
        '13.B-17.B': { // Days 13.B, 15.B, 17.B (3 B days)
            code: '9_geom_2.1.1',
            title: 'Reasoning and Proof',
            objectives: [
                'Distinguish inductive and deductive reasoning',
                'Make conjectures based on patterns',
                'Write conditional statements and converses',
                'Construct two-column proofs'
            ],
            materials: 'Logic reasoning software, proof templates, interactive proof builders, truth tables',
            activities: [
                'Pattern Investigation Lab',
                'Conditional statement workshop',
                'Two-column proof builder',
                'Logic puzzle challenges'
            ],
            assessment: 'Logic puzzle performance, Proof construction rubric, Truth table accuracy',
            standards: 'MA.912.LT.4.3, MA.912.LT.4.10, MTR.3.1'
        },
        '16-20': {
            code: '9_geom_3.1.1',
            title: 'Parallel and Perpendicular Lines',
            objectives: [
                'Identify parallel, perpendicular, and skew lines',
                'Recognize angle relationships with transversals',
                'Calculate slope and write line equations',
                'Apply parallel line theorems'
            ],
            materials: 'GeoGebra parallel line explorer, Desmos graphing, slope calculators, coordinate geometry tools',
            activities: [
                'Parallel Line Angle Explorer',
                'Interactive angle discovery lab',
                'Slope family creation',
                'Real-world parallel applications'
            ],
            assessment: 'Angle relationship quiz, Slope calculations, Line equation writing, Problem-solving rubric',
            standards: 'MA.912.GR.1.1, MA.912.GR.3.3, MA.912.AR.2.3'
        },
        '21-25': {
            code: '9_geom_4.1.1',
            title: 'Congruent Triangles',
            objectives: [
                'Define and identify congruent triangles',
                'Apply SSS, SAS, ASA, AAS congruence postulates',
                'Use CPCTC in formal proofs',
                'Solve problems with overlapping triangles'
            ],
            materials: 'Triangle congruence explorers, digital compass/straightedge, proof construction software',
            activities: [
                'Triangle Classification Explorer',
                'SSS/SAS construction challenges',
                'CPCTC Proof Builder Workshop',
                'Engineering congruence applications'
            ],
            assessment: 'Congruence proof evaluations, Construction accuracy, CPCTC applications, Complex problems',
            standards: 'MA.912.GR.1.2, MA.912.GR.1.3, MA.912.GR.1.6'
        },
        '26-30': {
            code: '9_geom_5.1.1',
            title: 'Triangle Relationships',
            objectives: [
                'Locate triangle centers (circumcenter, incenter, centroid, orthocenter)',
                'Apply perpendicular and angle bisector theorems',
                'Use triangle inequality theorem',
                'Solve optimization problems with triangle centers'
            ],
            materials: 'GeoGebra triangle centers, construction tools, optimization software',
            activities: [
                'Dynamic Triangle Centers Explorer',
                'Center location investigations',
                'Inscribed/circumscribed circle construction',
                'Real-world optimization applications'
            ],
            assessment: 'Construction accuracy, Center location tests, Optimization solutions, Theorem applications',
            standards: 'MA.912.GR.5.2, MA.912.GR.5.3'
        },
        '31-87': {
            code: '9_geom_units_6-11',
            title: 'Quadrilaterals through Transformations',
            objectives: [
                'Master properties of special quadrilaterals',
                'Apply similarity concepts and theorems',
                'Use right triangle trigonometry',
                'Master circle theorems and equations',
                'Calculate areas, surface areas, and volumes',
                'Apply transformations and symmetry'
            ],
            materials: 'GeoGebra suite, 3D modeling software, scientific calculators, construction tools',
            activities: [
                'Quadrilateral hierarchy investigations',
                'Similarity and indirect measurement projects',
                'Trigonometry real-world applications',
                'Circle construction and proof challenges',
                'Volume optimization problems',
                'Transformation art projects'
            ],
            assessment: 'Unit tests, Construction portfolios, Real-world projects, Proof evaluations',
            standards: 'MA.912.GR.1.4-MA.912.GR.7.3, MA.912.T.1.1-MA.912.T.1.2'
        },
        '19.B-23.B': { // Days 19.B, 21.B, 23.B
            code: '9_geom_4.2.1',
            title: 'Properties of Triangles',
            objectives: [
                'Apply triangle sum theorem',
                'Use exterior angle theorem',
                'Classify triangles by sides and angles',
                'Solve complex triangle problems'
            ],
            materials: 'Triangle manipulatives, angle tools, GeoGebra triangles',
            activities: [
                'Triangle sum investigations',
                'Exterior angle explorations',
                'Triangle classification sort',
                'Real-world triangle applications'
            ],
            assessment: 'Triangle properties test, Problem-solving evaluation, Construction accuracy',
            standards: 'MA.912.GR.1.1, MA.912.GR.1.2'
        },
        '25.B-29.B': { // Days 25.B, 27.B, 29.B
            code: '9_geom_5.1.1',
            title: 'Quadrilaterals and Their Properties',
            objectives: [
                'Identify properties of special quadrilaterals',
                'Prove quadrilateral relationships',
                'Apply properties to solve problems',
                'Construct quadrilaterals with given properties'
            ],
            materials: 'Quadrilateral kits, property cards, construction tools',
            activities: [
                'Quadrilateral hierarchy mapping',
                'Property investigation stations',
                'Proof practice workshop',
                'Construction challenges'
            ],
            assessment: 'Quadrilateral test, Proof evaluation, Construction portfolio',
            standards: 'MA.912.GR.3.1, MA.912.GR.3.2, MA.912.GR.3.4'
        },
        '31.B-35.B': { // Days 31.B, 33.B, 35.B
            code: '9_geom_review',
            title: 'Semester Review and Assessment Prep',
            objectives: [
                'Review all geometric concepts',
                'Strengthen proof writing skills',
                'Apply geometry to complex problems',
                'Prepare for semester exam'
            ],
            materials: 'Review packets, practice tests, construction tools',
            activities: [
                'Concept review stations',
                'Proof writing workshop',
                'Practice exam sessions',
                'Peer tutoring groups'
            ],
            assessment: 'Practice exams, Proof portfolio, Semester project, Final exam',
            standards: 'MA.912.GR.1.1-MA.912.GR.5.3'
        }
    },

    // 9th Grade World History (B Days, Period 1) - Complete Curriculum
    '9th_worldhistory': {
        '1-5': {
            code: '9_wh_1.1.1',
            title: 'Introduction to Historical Analysis',
            objectives: [
                'Distinguish primary and secondary sources with 90% accuracy',
                'Identify bias and perspective in historical sources',
                'Apply historical thinking to modern information evaluation',
                'Create connections between past and present'
            ],
            materials: 'Showrunner animated content, NotebookLM guides, Boston Massacre sources, digital timeline tools',
            activities: [
                'Historical Detective Simulation',
                'Bias Busters Debate',
                'Truth or Trash game',
                'HistoryTok timeline creation'
            ],
            assessment: 'Quick Check Quiz (AI-graded), Moon Landing DBQ, Fact-Check the Feed task, EOC practice',
            standards: 'SS.912.W.1.1, SS.912.W.1.3, SS.912.W.1.5, SS.912.W.1.6'
        },
        '6-10': {
            code: '9_wh_1.2.1',
            title: 'Establishing Historical Causation',
            objectives: [
                'Distinguish immediate and long-term causes',
                'Identify unintended consequences in history',
                'Analyze chain reactions in historical events',
                'Apply cause-effect analysis to modern events'
            ],
            materials: 'Russian Revolution sources, causation organizers, modern cause-effect examples',
            activities: [
                'Butterfly Effect Timeline creation',
                'Causation Detective simulation',
                'Modern Chain Reaction analysis',
                'Russian Revolution DBQ'
            ],
            assessment: 'Causation analysis quiz, Russian Revolution DBQ, Chain reaction project, EOC practice',
            standards: 'SS.912.W.1.1, SS.912.W.1.4'
        },
        '11-15': {
            code: '9_wh_2.1.1',
            title: 'Constantinople and Byzantine Empire',
            objectives: [
                'Analyze Constantinople\'s strategic importance',
                'Evaluate Justinian\'s legal and military achievements',
                'Compare Byzantine with Western European civilizations',
                'Connect Byzantine law to modern government'
            ],
            materials: 'Showrunner episode, Procopius sources, interactive maps, Hagia Sophia virtual tour',
            activities: [
                'TikTok city location simulation',
                'Justinian power couple analysis',
                'Virtual Hagia Sophia tour',
                'Byzantine vs modern law comparison'
            ],
            assessment: 'Geographic advantages quiz, Justinian\'s Code DBQ, Empire capital design task',
            standards: 'SS.912.W.2.1, SS.912.W.2.2, SS.912.W.2.3'
        },
        '16-87': {
            code: '9_wh_units_2-8',
            title: 'Medieval through Contemporary World',
            objectives: [
                'Trace development from medieval to modern era',
                'Analyze global interconnections and exchanges',
                'Evaluate impact of revolutions and world wars',
                'Connect historical patterns to contemporary issues'
            ],
            materials: 'Unit-specific Showrunner episodes, primary sources, interactive simulations, NotebookLM discussions',
            activities: [
                'Medieval civilization comparisons',
                'Renaissance art analysis simulations',
                'Exploration and colonization mapping',
                'Enlightenment philosophy debates',
                'Industrial Revolution cause-effect chains',
                'World War simulations and peace negotiations',
                'Cold War decision-making scenarios'
            ],
            assessment: 'Unit DBQs, Performance tasks, Creative projects, EOC preparation assessments',
            standards: 'SS.912.W.2.1-SS.912.W.8.4'
        },
        '19.B-23.B': { // Days 19.B, 21.B, 23.B
            code: '9_wh_2.2.1',
            title: 'Islamic Empires and Culture',
            objectives: [
                'Analyze rise of Islamic civilization',
                'Evaluate cultural and scientific contributions',
                'Compare with contemporary civilizations',
                'Assess lasting global impact'
            ],
            materials: 'Islamic empire maps, scientific achievement cards, cultural artifacts',
            activities: [
                'Empire expansion mapping',
                'Golden Age achievements gallery',
                'Cross-cultural comparisons',
                'Legacy tracking project'
            ],
            assessment: 'Empire analysis quiz, Achievements presentation, Comparison essay',
            standards: 'SS.912.W.3.1, SS.912.W.3.2, SS.912.W.3.3'
        },
        '25.B-29.B': { // Days 25.B, 27.B, 29.B
            code: '9_wh_3.1.1',
            title: 'Medieval Europe and Feudalism',
            objectives: [
                'Understand feudal system structure',
                'Analyze role of Catholic Church',
                'Evaluate knighthood and chivalry',
                'Connect to modern social structures'
            ],
            materials: 'Feudal pyramid models, manor diagrams, knight code documents',
            activities: [
                'Feudal hierarchy simulation',
                'Manor life investigation',
                'Knighthood ceremony recreation',
                'Modern parallels discussion'
            ],
            assessment: 'Feudalism test, Manor project, Social structure analysis',
            standards: 'SS.912.W.2.9, SS.912.W.2.10, SS.912.W.2.11'
        },
        '31.B-35.B': { // Days 31.B, 33.B, 35.B
            code: '9_wh_review',
            title: 'Semester Review: Ancient to Medieval',
            objectives: [
                'Synthesize major historical themes',
                'Analyze continuity and change',
                'Prepare comprehensive timeline',
                'Ready for semester assessment'
            ],
            materials: 'Review guides, timeline materials, practice DBQs',
            activities: [
                'Civilization comparison charts',
                'Timeline creation project',
                'DBQ practice sessions',
                'Review game tournaments'
            ],
            assessment: 'Comprehensive timeline, Thematic essay, Practice EOC, Semester exam',
            standards: 'SS.912.W.1.1-SS.912.W.3.3'
        }
    },

    // 11th Grade Pre-Calculus (A Days, Period 1)
    '11th_precalc': {
        '2.A-6.A': { // Days 2.A, 4.A, 6.A (3 A days) 
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
        '8.A-12.A': { // Days 8.A, 10.A, 12.A (3 A days)
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
        },
        '14.A-18.A': { // Days 14.A, 16.A, 18.A
            code: '11_pc_2.1.1',
            title: 'Exponential and Logarithmic Functions',
            objectives: [
                'Graph exponential and logarithmic functions',
                'Solve exponential and logarithmic equations',
                'Apply to compound interest and growth models',
                'Use properties of logarithms'
            ],
            materials: 'Graphing calculators, exponential models, logarithm tables',
            activities: [
                'Exponential growth investigations',
                'Logarithm property explorations',
                'Compound interest calculations',
                'Population growth modeling'
            ],
            assessment: 'Exponential/log test, Growth model project, Application problems',
            standards: 'MAFS.912.F-IF.3.7, MAFS.912.F-LE.1.4, MAFS.912.F-BF.2.5'
        },
        '20.A-24.A': { // Days 20.A, 22.A, 24.A
            code: '11_pc_3.1.1',
            title: 'Trigonometric Functions',
            objectives: [
                'Define and graph trig functions',
                'Use unit circle for exact values',
                'Apply trig to real-world problems',
                'Understand periodic behavior'
            ],
            materials: 'Unit circles, trig graphing tools, periodic models',
            activities: [
                'Unit circle mastery activities',
                'Trig graph transformations',
                'Periodic phenomenon modeling',
                'Real-world trig applications'
            ],
            assessment: 'Trig functions test, Unit circle quiz, Application project',
            standards: 'MAFS.912.F-TF.1.1, MAFS.912.F-TF.1.2, MAFS.912.F-TF.2.5'
        },
        '26.A-30.A': { // Days 26.A, 28.A, 30.A
            code: '11_pc_3.2.1',
            title: 'Trigonometric Identities and Equations',
            objectives: [
                'Prove fundamental trig identities',
                'Solve trig equations',
                'Apply double and half-angle formulas',
                'Use sum and difference formulas'
            ],
            materials: 'Identity cards, equation solving guides, formula sheets',
            activities: [
                'Identity proof practice',
                'Equation solving workshop',
                'Formula derivation exercises',
                'Application problem sets'
            ],
            assessment: 'Identity proofs test, Equation solving quiz, Formula applications',
            standards: 'MAFS.912.F-TF.3.8, MAFS.912.F-TF.3.9'
        },
        '32.A-35.A': { // Days 32.A, 34.A, 35.A
            code: '11_pc_review',
            title: 'Semester Review and CLEP Prep',
            objectives: [
                'Review all precalculus concepts',
                'Prepare for CLEP exam',
                'Strengthen problem-solving skills',
                'Ready for calculus'
            ],
            materials: 'CLEP prep materials, practice exams, review packets',
            activities: [
                'Concept review stations',
                'CLEP practice tests',
                'Problem-solving marathon',
                'Peer tutoring sessions'
            ],
            assessment: 'Practice CLEP exam, Comprehensive review test, Portfolio',
            standards: 'All MAFS.912 standards covered'
        }
    },

    // 11th Grade US Government (A Days, Period 2)
    '11th_gov': {
        '2.A-6.A': { // Days 2.A, 4.A, 6.A (3 A days) 
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
        },
        '14.A-18.A': { // Days 14.A, 16.A, 18.A (3 A days)
            code: '11_gov_1.2.1',
            title: 'Federalism and State Powers',
            objectives: [
                'Analyze federal vs state powers',
                'Understand concurrent powers',
                'Evaluate federalism in practice'
            ],
            materials: 'Power distribution charts, state constitutions, case studies, current conflicts',
            activities: [
                'Federal vs State Powers Sorting',
                'Tenth Amendment Analysis',
                'State Rights Debate',
                'Contemporary Federalism Issues'
            ],
            assessment: 'Federalism test, Powers diagram, Case analysis essay',
            standards: 'SS.912.CG.2.1, SS.912.CG.2.2, SS.912.CG.2.3'
        },
        '20.A-24.A': { // Days 20.A, 22.A, 24.A (3 A days)
            code: '11_gov_1.2.2',
            title: 'Civil Rights and Civil Liberties',
            objectives: [
                'Distinguish rights from liberties',
                'Analyze Bill of Rights applications',
                'Evaluate contemporary rights issues'
            ],
            materials: 'Bill of Rights copies, court cases, rights scenarios, current events',
            activities: [
                'Rights vs Liberties Comparison',
                'Bill of Rights Case Studies',
                'Mock Supreme Court',
                'Rights in the News Analysis'
            ],
            assessment: 'Rights quiz, Case brief writing, Liberty application essay',
            standards: 'SS.912.CG.2.4, SS.912.CG.2.5, SS.912.CG.2.6'
        },
        '26.A-30.A': { // Days 26.A, 28.A, 30.A (3 A days)
            code: '11_gov_1.3.1',
            title: 'Political Parties and Elections',
            objectives: [
                'Analyze party system development',
                'Understand electoral processes',
                'Evaluate campaign finance issues'
            ],
            materials: 'Party platforms, election maps, campaign materials, voting systems',
            activities: [
                'Party Platform Analysis',
                'Election Simulation',
                'Campaign Strategy Workshop',
                'Voting Systems Comparison'
            ],
            assessment: 'Party systems test, Election analysis, Campaign project',
            standards: 'SS.912.CG.3.6, SS.912.CG.3.7, SS.912.CG.3.8'
        },
        '32.A-35.A': { // Days 32.A, 34.A, 35.A (last days before winter break)
            code: '11_gov_1.3.2',
            title: 'Media and Public Policy',
            objectives: [
                'Analyze media influence on politics',
                'Evaluate policy-making process',
                'Assess public opinion role'
            ],
            materials: 'News sources, policy examples, polling data, media analysis tools',
            activities: [
                'Media Bias Detection',
                'Policy Development Simulation',
                'Public Opinion Analysis',
                'News Literacy Workshop'
            ],
            assessment: 'Media analysis paper, Policy proposal, Opinion poll project',
            standards: 'SS.912.CG.3.9, SS.912.CG.3.10, SS.912.CG.3.11'
        }
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
        '1.B-5.B': { // Days 1.B, 3.B, 5.B (3 B days) 
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
        '7.B-11.B': { // Days 7.B, 9.B, 11.B (3 B days)
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
        },
        '13.B-17.B': { // Days 13.B, 15.B, 17.B (3 B days)
            code: '11_ela_1.2.1',
            title: 'American Renaissance and Realism',
            objectives: [
                'Analyze American Renaissance writers',
                'Understand shift to realism',
                'Evaluate literary movements impact'
            ],
            materials: 'Renaissance texts, realist literature, movement comparisons, author studies',
            activities: [
                'Hawthorne and Melville Analysis',
                'Realism vs Romanticism Debate',
                'Literary Movement Timeline',
                'Mark Twain Regional Study'
            ],
            assessment: 'Movement comparison essay, Literary analysis paper, Author study project',
            standards: 'LAFS.1112.RL.1.3, LAFS.1112.RL.2.5, LAFS.1112.RI.1.2'
        },
        '19.B-23.B': { // Days 19.B, 21.B, 23.B (3 B days)
            code: '11_ela_1.2.2',
            title: 'Modernism and the Lost Generation',
            objectives: [
                'Analyze modernist techniques',
                'Understand post-WWI literature',
                'Evaluate experimental forms'
            ],
            materials: 'Modernist texts, Lost Generation works, jazz age materials, experimental poetry',
            activities: [
                'Fitzgerald and Hemingway Study',
                'Modernist Poetry Workshop',
                'Jazz Age Cultural Context',
                'Stream of Consciousness Writing'
            ],
            assessment: 'Modernism analysis, Lost Generation essay, Creative writing piece',
            standards: 'LAFS.1112.RL.2.4, LAFS.1112.RL.2.6, LAFS.1112.RI.2.5'
        },
        '25.B-29.B': { // Days 25.B, 27.B, 29.B (3 B days)
            code: '11_ela_1.3.1',
            title: 'Harlem Renaissance and Social Justice',
            objectives: [
                'Analyze Harlem Renaissance literature',
                'Understand civil rights themes',
                'Evaluate literature as social commentary'
            ],
            materials: 'Harlem Renaissance texts, civil rights literature, music connections, art prints',
            activities: [
                'Langston Hughes Poetry Study',
                'Jazz and Literature Connections',
                'Social Justice Theme Analysis',
                'Cultural Expression Workshop'
            ],
            assessment: 'Poetry analysis, Social justice essay, Renaissance presentation',
            standards: 'LAFS.1112.RL.1.1, LAFS.1112.RI.2.6, LAFS.1112.RI.3.8'
        },
        '31.B-35.B': { // Days 31.B, 33.B, 35.B (last B days before winter break)
            code: '11_ela_1.3.2',
            title: 'Contemporary American Voices',
            objectives: [
                'Analyze contemporary literature',
                'Understand diverse perspectives',
                'Evaluate current literary trends'
            ],
            materials: 'Contemporary texts, diverse author anthology, multimedia resources, current reviews',
            activities: [
                'Contemporary Author Study',
                'Diverse Voices Discussion',
                'Modern Theme Analysis',
                'Book Club Simulation'
            ],
            assessment: 'Contemporary analysis paper, Author comparison, Reading response journal',
            standards: 'LAFS.1112.RL.1.3, LAFS.1112.RI.1.3, LAFS.1112.W.1.1'
        }
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
        },
        '13.B-17.B': { // Days 13.B, 15.B, 17.B (3 B days)  
            code: '11_econ_1.2.1',
            title: 'Market Structures',
            objectives: [
                'Compare perfect competition vs monopoly',
                'Analyze oligopoly and monopolistic competition',
                'Evaluate market efficiency'
            ],
            materials: 'Market structure cards, competition scenarios, efficiency graphs, case studies',
            activities: [
                'Market Structure Simulation',
                'Competition Analysis Lab',
                'Monopoly Power Investigation',
                'Efficiency Comparison Project'
            ],
            assessment: 'Market structures test, Competition analysis, Efficiency evaluation',
            standards: 'SS.912.E.1.7, SS.912.E.1.8, SS.912.E.1.9'
        },
        '19.B-23.B': { // Days 19.B, 21.B, 23.B (3 B days)
            code: '11_econ_1.2.2',
            title: 'Money and Banking',
            objectives: [
                'Understand functions of money',
                'Analyze banking system structure',
                'Evaluate monetary policy tools'
            ],
            materials: 'Currency examples, banking simulations, Fed materials, interest rate models',
            activities: [
                'Money Evolution Timeline',
                'Banking System Simulation',
                'Federal Reserve Game',
                'Interest Rate Workshop'
            ],
            assessment: 'Banking test, Monetary policy analysis, Fed simulation results',
            standards: 'SS.912.E.2.1, SS.912.E.2.2, SS.912.E.2.3'
        },
        '25.B-29.B': { // Days 25.B, 27.B, 29.B (3 B days)
            code: '11_econ_1.3.1',
            title: 'GDP and Economic Indicators',
            objectives: [
                'Calculate GDP components',
                'Analyze economic indicators',
                'Evaluate business cycles'
            ],
            materials: 'GDP calculators, indicator charts, cycle graphs, real data sets',
            activities: [
                'GDP Calculation Workshop',
                'Economic Indicators Analysis',
                'Business Cycle Mapping',
                'Recession/Expansion Study'
            ],
            assessment: 'GDP calculation test, Indicator analysis, Cycle prediction project',
            standards: 'SS.912.E.2.4, SS.912.E.2.5, SS.912.E.2.6'
        },
        '31.B-35.B': { // Days 31.B, 33.B, 35.B (last B days before winter break)
            code: '11_econ_1.3.2',
            title: 'International Trade and Finance',
            objectives: [
                'Analyze comparative advantage',
                'Understand exchange rates',
                'Evaluate trade policies'
            ],
            materials: 'Trade simulation materials, exchange rate charts, tariff scenarios, global maps',
            activities: [
                'Comparative Advantage Game',
                'Exchange Rate Trading',
                'Trade Policy Debate',
                'Global Economy Simulation'
            ],
            assessment: 'Trade analysis paper, Exchange rate test, Policy evaluation essay',
            standards: 'SS.912.E.3.1, SS.912.E.3.2, SS.912.E.3.3'
        }
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