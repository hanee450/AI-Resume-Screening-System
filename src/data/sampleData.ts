import { JobDescription, CandidateResume } from '../types';

export const SAMPLE_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'jd-ds-01',
    title: 'Data Scientist',
    department: 'Data & Analytics',
    location: 'Bengaluru, India (Hybrid)',
    minYearsExperience: 3,
    educationLevel: 'B.Tech / M.Tech in CS, AI, or Quantitative discipline',
    requiredSkills: [
      'Python',
      'scikit-learn',
      'SQL',
      'pandas',
      'Machine Learning',
      'Predictive Modeling',
      'Streamlit',
      'Data Visualization'
    ],
    preferredSkills: [
      'A/B Testing',
      'Matplotlib',
      'Seaborn',
      'Deploying ML models',
      'Communication skills'
    ],
    responsibilities: [
      'Build machine learning models to solve complex business problems.',
      'Deploy internal interactive dashboards using Streamlit for stakeholders.',
      'Perform exploratory data analysis and communicate findings to non-technical leadership.'
    ],
    summaryText: 'Seeking a proactive Data Scientist with 3+ years of hands-on experience in building predictive ML models in Python, executing SQL data pipelines, and deploying interactive Streamlit analytics dashboards for business stakeholders.'
  },
  {
    id: 'jd-se-02',
    title: 'Senior Backend Engineer',
    department: 'Core Infrastructure',
    location: 'Pune, India (Remote)',
    minYearsExperience: 4,
    educationLevel: 'Bachelor degree in Engineering or IT',
    requiredSkills: [
      'Java',
      'Spring Boot',
      'REST APIs',
      'SQL',
      'Docker',
      'Microservices',
      'Git'
    ],
    preferredSkills: [
      'Kubernetes',
      'Jenkins',
      'Python',
      'AWS Certified Developer'
    ],
    responsibilities: [
      'Design, write, and maintain robust microservices using Java and Spring Boot.',
      'Optimize relational SQL database queries for high-throughput enterprise systems.',
      'Maintain automated deployment pipelines with Docker and Jenkins.'
    ],
    summaryText: 'Looking for a Senior Backend Software Engineer with 4+ years of expertise in Java, Spring Boot microservices, SQL performance tuning, and CI/CD pipeline automation.'
  },
  {
    id: 'jd-mkt-03',
    title: 'Marketing & Campaign Analyst',
    department: 'Growth Marketing',
    location: 'Mumbai, India',
    minYearsExperience: 2,
    educationLevel: 'Bachelor in Marketing, Business, or Communications',
    requiredSkills: [
      'Excel',
      'PowerPoint',
      'Google Analytics',
      'SQL',
      'Campaign Reporting',
      'Social Media Analytics'
    ],
    preferredSkills: [
      'HubSpot',
      'Market Research',
      'KPI tracking'
    ],
    responsibilities: [
      'Create executive campaign performance dashboards in Excel and PowerPoint.',
      'Query analytics databases using SQL to extract marketing metrics.',
      'Deliver monthly performance reviews to marketing directors.'
    ],
    summaryText: 'Hiring a Marketing Analyst to track campaign performance across digital media, run SQL queries for analytics, and build clear Excel/PowerPoint reports for leadership.'
  }
];

export const SAMPLE_CANDIDATES: CandidateResume[] = [
  {
    id: 'cand-01',
    name: 'ANITA SHARMA',
    email: 'anita.sharma@email.com',
    phone: '+91-98765-43210',
    location: 'Bengaluru, India',
    currentRole: 'Data Scientist',
    yearsExperience: 3,
    skills: [
      'Python',
      'pandas',
      'NumPy',
      'scikit-learn',
      'SQL',
      'Matplotlib',
      'Seaborn',
      'Streamlit',
      'Git',
      'Machine Learning',
      'Predictive Modeling',
      'Data Visualization',
      'A/B Testing'
    ],
    education: 'B.Tech in Computer Science, VIT Vellore (2017 - 2021)',
    certifications: [
      'IBM Data Science Professional Certificate',
      'Deep Learning Specialization (Coursera)'
    ],
    workHistory: [
      {
        title: 'Data Scientist',
        company: 'BrightMetrics Analytics',
        duration: '2023 - Present',
        highlights: [
          'Built machine learning models in Python using scikit-learn to predict customer churn, improving retention targeting by 22%.',
          'Used pandas and SQL to clean and analyze large transactional datasets.',
          'Deployed multiple internal dashboards using Streamlit for stakeholder self-service reporting.',
          'Presented model findings and business recommendations to senior leadership on a monthly basis.'
        ]
      },
      {
        title: 'Junior Data Analyst',
        company: 'RetailWorks Pvt Ltd',
        duration: '2021 - 2023',
        highlights: [
          'Built regression models to forecast monthly sales using Python and scikit-learn.',
          'Created data visualizations in Matplotlib/Seaborn to support quarterly business reviews.'
        ]
      }
    ],
    rawText: `ANITA SHARMA
Data Scientist
anita.sharma@email.com | +91-98765-43210 | Bengaluru, India

SUMMARY
Data Scientist with 3 years of experience building and deploying machine learning models in Python. Skilled in translating business problems into predictive models and communicating results clearly to non-technical stakeholders.

SKILLS
Python, pandas, NumPy, scikit-learn, SQL, Matplotlib, Seaborn, Streamlit, Git, Machine Learning, Predictive Modeling, Data Visualization, A/B Testing

EXPERIENCE
Data Scientist, BrightMetrics Analytics (2023 - Present)
- Built machine learning models in Python using scikit-learn to predict customer churn, improving retention campaign targeting by 22%.
- Used pandas and SQL to clean and analyze large transactional datasets.
- Deployed multiple internal dashboards using Streamlit for stakeholder self-service reporting.
- Presented model findings and business recommendations to senior leadership on a monthly basis.

Junior Data Analyst, RetailWorks Pvt Ltd (2021 - 2023)
- Built regression models to forecast monthly sales using Python and scikit-learn.
- Created data visualizations in Matplotlib/Seaborn to support quarterly business reviews.

EDUCATION
B.Tech in Computer Science, VIT Vellore (2017 - 2021)

CERTIFICATIONS
- IBM Data Science Professional Certificate
- Deep Learning Specialization (Coursera)`,
    status: 'Pending'
  },
  {
    id: 'cand-02',
    name: 'PRIYA IYER',
    email: 'priya.iyer@email.com',
    phone: '+91-99887-76655',
    location: 'Hyderabad, India',
    currentRole: 'Machine Learning Engineer',
    yearsExperience: 4,
    skills: [
      'Python',
      'TensorFlow',
      'scikit-learn',
      'Flask',
      'SQL',
      'pandas',
      'NumPy',
      'Docker',
      'Machine Learning',
      'Deep Learning',
      'Model Deployment'
    ],
    education: 'M.Tech in Artificial Intelligence, IIIT Hyderabad (2018 - 2020)',
    certifications: ['TensorFlow Developer Certificate'],
    workHistory: [
      {
        title: 'Machine Learning Engineer',
        company: 'NovaAI Labs',
        duration: '2022 - Present',
        highlights: [
          'Built and deployed predictive models using scikit-learn and TensorFlow, served via Flask APIs.',
          'Designed data pipelines in Python and SQL to feed model training workflows.',
          'Communicated model performance metrics and trade-offs to non-technical stakeholders regularly.'
        ]
      }
    ],
    rawText: `PRIYA IYER
Machine Learning Engineer
priya.iyer@email.com | +91-99887-76655 | Hyderabad, India

SUMMARY
Machine learning engineer with 4 years of experience building and deploying predictive models in Python. Strong background in scikit-learn, TensorFlow, and deploying models as production APIs using Flask.

SKILLS
Python, TensorFlow, scikit-learn, Flask, SQL, pandas, NumPy, Docker, Machine Learning, Deep Learning, Model Deployment, Data Pipelines

EXPERIENCE
Machine Learning Engineer, NovaAI Labs (2022 - Present)
- Built and deployed predictive models using scikit-learn and TensorFlow, served via Flask APIs.
- Designed data pipelines in Python and SQL to feed model training workflows.
- Communicated model performance metrics and trade-offs to non-technical stakeholders regularly.

EDUCATION
M.Tech in Artificial Intelligence, IIIT Hyderabad (2018 - 2020)
B.Tech in Computer Science, Anna University (2014 - 2018)

CERTIFICATIONS
- TensorFlow Developer Certificate`,
    status: 'Pending'
  },
  {
    id: 'cand-03',
    name: 'RAHUL VERMA',
    email: 'rahul.verma@email.com',
    phone: '+91-91234-56789',
    location: 'Pune, India',
    currentRole: 'Senior Software Engineer',
    yearsExperience: 5,
    skills: [
      'Java',
      'Spring Boot',
      'REST APIs',
      'SQL',
      'Docker',
      'Kubernetes',
      'Jenkins',
      'Git',
      'Microservices',
      'Python (scripting)'
    ],
    education: 'B.E. in Information Technology, PICT Pune (2015 - 2019)',
    certifications: ['AWS Certified Developer - Associate'],
    workHistory: [
      {
        title: 'Senior Software Engineer',
        company: 'CloudNine Technologies',
        duration: '2021 - Present',
        highlights: [
          'Designed and maintained backend microservices in Java and Spring Boot.',
          'Wrote Python scripts for internal automation and deployment tasks.',
          'Managed SQL databases supporting high-traffic production systems.'
        ]
      }
    ],
    rawText: `RAHUL VERMA
Software Engineer
rahul.verma@email.com | +91-91234-56789 | Pune, India

SUMMARY
Backend software engineer with 5 years of experience building scalable Java applications and REST APIs. Some exposure to Python for automation scripting. No formal experience with machine learning or data visualization tools.

SKILLS
Java, Spring Boot, REST APIs, SQL, Docker, Kubernetes, Jenkins, Git, Microservices, Python (scripting only)

EXPERIENCE
Senior Software Engineer, CloudNine Technologies (2021 - Present)
- Designed and maintained backend microservices in Java and Spring Boot.
- Wrote Python scripts for internal automation and deployment tasks.
- Managed SQL databases supporting high-traffic production systems.
- Set up CI/CD pipelines using Jenkins and Docker.

EDUCATION
B.E. in Information Technology, Pune Institute of Computer Technology (2015 - 2019)

CERTIFICATIONS
- AWS Certified Developer - Associate`,
    status: 'Pending'
  },
  {
    id: 'cand-04',
    name: 'SNEHA REDDY',
    email: 'sneha.reddy@email.com',
    phone: '+91-93456-12378',
    location: 'Chennai, India',
    currentRole: 'Data Analyst',
    yearsExperience: 2,
    skills: [
      'Python',
      'pandas',
      'scikit-learn (basic)',
      'SQL',
      'Matplotlib',
      'Excel',
      'Streamlit (learning)',
      'Data Cleaning',
      'Exploratory Data Analysis'
    ],
    education: 'B.Sc. in Statistics, Loyola College, Chennai (2019 - 2022)',
    certifications: ['Google Data Analytics Professional Certificate'],
    workHistory: [
      {
        title: 'Data Analyst',
        company: 'InsightWorks Consulting',
        duration: '2023 - Present',
        highlights: [
          'Built data visualization dashboards using Python, pandas, and Matplotlib.',
          'Developed basic regression models using scikit-learn for internal forecasting projects.',
          'Currently learning Streamlit to deploy small internal tools for the analytics team.'
        ]
      }
    ],
    rawText: `SNEHA REDDY
Data Analyst
sneha.reddy@email.com | +91-93456-12378 | Chennai, India

SUMMARY
Data analyst with 2 years of experience using Python and pandas for exploratory data analysis and reporting. Currently building skills in Streamlit for model deployment. Comfortable presenting findings to small teams.

SKILLS
Python, pandas, scikit-learn (basic), SQL, Matplotlib, Excel, Streamlit (learning), Data Cleaning, Exploratory Data Analysis

EXPERIENCE
Data Analyst, InsightWorks Consulting (2023 - Present)
- Built data visualization dashboards using Python, pandas, and Matplotlib.
- Developed basic regression models using scikit-learn for internal forecasting projects.
- Currently learning Streamlit to deploy small internal tools for the analytics team.

EDUCATION
B.Sc. in Statistics, Loyola College, Chennai (2019 - 2022)

CERTIFICATIONS
- Google Data Analytics Professional Certificate`,
    status: 'Pending'
  },
  {
    id: 'cand-05',
    name: 'KARAN MEHTA',
    email: 'karan.mehta@email.com',
    phone: '+91-90909-80808',
    location: 'Mumbai, India',
    currentRole: 'Marketing Analyst',
    yearsExperience: 3,
    skills: [
      'Excel',
      'PowerPoint',
      'Google Analytics',
      'basic SQL',
      'Campaign Reporting',
      'Social Media Analytics',
      'Market Research'
    ],
    education: 'BBA in Marketing, NMIMS Mumbai (2017 - 2020)',
    certifications: [
      'Google Analytics Certified',
      'HubSpot Content Marketing Certification'
    ],
    workHistory: [
      {
        title: 'Marketing Analyst',
        company: 'AdSphere Media',
        duration: '2022 - Present',
        highlights: [
          'Built weekly campaign performance dashboards using Excel and PowerPoint.',
          'Ran basic SQL queries to pull campaign data from marketing database.',
          'Analyzed social media engagement trends to inform content strategy.'
        ]
      }
    ],
    rawText: `KARAN MEHTA
Marketing Analyst
karan.mehta@email.com | +91-90909-80808 | Mumbai, India

SUMMARY
Marketing analyst with 3 years of experience tracking campaign performance and building reporting dashboards in Excel and PowerPoint. No experience with Python, machine learning, or predictive modeling.

SKILLS
Excel, PowerPoint, Google Analytics, basic SQL, Campaign Reporting, Social Media Analytics, Market Research

EXPERIENCE
Marketing Analyst, AdSphere Media (2022 - Present)
- Built weekly campaign performance dashboards using Excel and PowerPoint.
- Ran basic SQL queries to pull campaign data from marketing database.
- Analyzed social media engagement trends to inform content strategy.

EDUCATION
BBA in Marketing, Narsee Monjee Institute of Management Studies (2017 - 2020)

CERTIFICATIONS
- Google Analytics Certified
- HubSpot Content Marketing Certification`,
    status: 'Pending'
  }
];
