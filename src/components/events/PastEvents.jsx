import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const eventsByYear = {
"2025-26": [
  {
    title: "TECH FACE-OFF",
    date: "12th & 13th",
    month: "February, 2026",
    desc: "Tech Face-Off: The Verdict, GDGC MJCET's flagship event, was a two-day inter-club debate that brought together top student chapters to engage in high-level discussions on real-world technology issues.",
    overview: "Conducted on 12th and 13th February 2026, Tech Face-Off brought together student chapters in a competitive debate format centered around contemporary tech themes. Spanning multiple rounds from prelims to the grand finale, participants engaged in research-backed arguments, rebuttals, and critical analysis under time constraints, emphasizing clarity of thought, depth of understanding, and disciplined expression.",
    neque: "Tech Face-Off was structured as a multi-stage debate progressing through a Round of 16, Quarterfinals, Semifinals, and a Grand Finale. Topics spanned AI ethics, system design, cybersecurity, and emerging tech, with teams delivering research-backed arguments and sharp rebuttals under time pressure. An independent fact-checking panel ensured credibility, while experienced judges evaluated logic, structure, and rebuttal quality throughout every round.",
    neque1: "The event drew 65 students from 13 clubs, making it one of the most collaborative inter-club engagements of the year. Consistent audience involvement extended discussions beyond competing teams to the entire room, fostering shared learning. Participants left with stronger analytical thinking, structured communication skills, and a sharper ability to engage critically with real-world technological challenges.",
    nequeimg: "poster.png",
    bg: "#4ade80"
  },
  {
    title: "CYBERSECURITY",
    date: "27th",
    month: "November, 2025",
    desc: "From Protection to Response — an industry-oriented cybersecurity session by IEEE CS and GDGC MJCET, focused on real-world threats and how modern defense systems respond to them.",
    overview: "Conducted on 27th November 2025, this session introduced students to the fundamentals of cybersecurity, moving beyond basic protection to understanding incident response and real-world attack scenarios. Led by industry expert Mr. Mahesh Nirati, the session combined conceptual clarity with practical insights into how security systems function today.",
    neque: "The session covered the CIA Triad, modern threats like malware, phishing, APTs, and zero-day attacks, along with real-world case studies highlighting social engineering tactics. Insights into next-gen firewalls and incident response frameworks were shared, giving students a realistic picture of how security professionals operate. The session also explored career paths and the skills needed to break into the cybersecurity domain.",
    neque1: "Around 50 students attended and remained actively engaged through real-world examples and interactive discussions that helped connect theory to practice. The Q&A segment allowed students to dig deeper into attack types, organizational defense strategies, and career opportunities in security. Attendees left with a clearer understanding of how cyberattacks work and why thinking critically about security is essential in today's landscape.",
    nequeimg: "poster.png",
    bg: "#60a5fa"
  },
  {
    title: "PIXELX",
    date: "22nd",
    month: "November, 2025",
    desc: "PixelX was a hands-on web development workshop by GDGC MJCET, designed to introduce students to the fundamentals of HTML, CSS, and JavaScript through practical, build-focused learning.",
    overview: "PixelX, conducted by GDGC MJCET on 22nd November 2025, was a beginner-friendly web development workshop covering HTML, CSS, and JavaScript. The session focused on learning by doing, taking participants from basic structure to building interactive web projects within a single day.",
    neque: "The workshop followed a step-by-step progression through HTML, CSS, and JavaScript, where participants built a portfolio webpage and a Rock-Paper-Scissors game from scratch. Modern concepts like Flexbox, Grid, and DOM manipulation were covered through live coding rather than passive theory. Every concept was immediately applied to a real project, making the learning tangible and rewarding from the very first hour.",
    neque1: "Around 30 students participated actively through live coding, real-time doubt solving, and peer discussions that kept the session collaborative throughout. The hands-on format meant participants could see the results of every change instantly and ask questions as they went. They walked away understanding how websites are built and, more importantly, with the confidence to open a blank file and start building on their own.",
    nequeimg: "poster.png",
    bg: "#fde047"
  },
  {
    title: "DYE 2025",
    date: "17th",
    month: "October, 2025",
    desc: "A multi-domain technical event introducing students to Web Development, AI/ML, Cloud and Cybersecurity, combining learning, interaction, and community engagement.",
    overview: "Doodle Your Engineering, organized by GDGC MJCET on 17th October 2025, was a technical exploratory event designed for first and second-year students. The session introduced participants to multiple technology domains, providing a broad understanding of career paths and industry trends through informative talks, interactive segments and real-world insights.",
    neque: "The event covered five domains — Web Development, UI/UX Design, AI/ML, Cloud Computing, and Cybersecurity — each presented with beginner-friendly explanations, real-world case studies, and practical learning paths. Emerging technologies like AI, Web3, and cloud ecosystems were woven into discussions to give students a forward-looking perspective on the industry. A fun segment called 'Tech Word or Trash Word' kept energy high before a community-focused close encouraging GDGC membership.",
    neque1: "DYE 2025 recorded an impressive 114 participants, driven by a strong pre-event marketing strategy combining digital outreach and on-campus engagement. Attendees remained actively involved throughout domain sessions and the interactive Q&A, with discussions staying lively from start to finish. The post-event montage reel reached 7K views, extending the event's impact well beyond the session itself and inspiring students to explore tech with clarity and confidence.",
    nequeimg: "poster.png",
    bg: "#f472b6"
  },
  {
    title: "CLOUD STUDY JAMS 2025",
    date: "3rd",
    month: "October, 2025",
    desc: "An introductory session on Google Cloud Study Jams, featuring cloud fundamentals, live demonstrations and hands-on guidance to begin your Google Cloud journey.",
    overview: "The Google Cloud Study Jams Info Session, conducted by GDGC MJCET on 3rd October 2025, introduced students to the Google Cloud Study Jams initiative and its learning ecosystem. The session focused on building a foundational understanding of cloud computing and guiding participants through accessing Google Cloud resources, completing hands-on labs and earning certifications.",
    neque: "The session introduced the Study Jams campaign structure — timeline, credits, certifications, and rewards — followed by clear explanations of cloud concepts like Virtual Machines, storage, and service models including IaaS, PaaS, and SaaS. A live demonstration walked students through redeeming credits and enrolling in the program, followed by a hands-on walkthrough of creating a Virtual Machine via both the Console UI and Cloud Shell CLI.",
    neque1: "The session engaged 85 participants who remained active throughout live demonstrations and a Q&A covering labs, credits, and common troubleshooting scenarios. The hands-on format effectively reduced the intimidation factor of entering a new technical domain, helping students see cloud computing as immediately accessible. Attendees left with a solid foundation in cloud concepts and the confidence to dive into hands-on labs and certification tracks right away.",
    nequeimg: "poster.png",
    bg: "#c084fc"
  },
  {
    title: "INFO SESSION 2025",
    date: "4th",
    month: "September, 2025",
    desc: "An orientation session introducing GDGC MJCET, its opportunities, and career-building insights to help freshers kickstart their journey.",
    overview: "The GDGC MJCET Fresher's Information Session 2025, conducted on 4th September 2025, served as an introductory and orientation session for incoming students. Organized virtually, the session aimed to familiarize first-year engineering students with GDGC's mission, structure and opportunities for technical and professional growth.",
    neque: "The session opened with an address by the Faculty Advisor on balancing academics with practical skills, followed by a detailed overview of GDGC's global presence, mission, and opportunities like the Solution Challenge and Google Summer of Code. Club structure, technical and non-technical domains, and the importance of open-source culture, GitHub collaboration, and portfolio development were all covered to help students understand how to make the most of their time in the community.",
    neque1: "A guest session by an Amazon SDE Intern brought real-world perspective on DSA, project building, hackathons, networking, and navigating internship applications. Over 60 students participated, with a highly engaged Q&A addressing AI's role in the industry, domain selection, and how to get started from scratch. Attendees left with clear direction, actionable career-building strategies, and genuine motivation to actively participate in GDGC and make the most of their engineering journey.",
    nequeimg: "poster.png",
    bg: "#fb923c"
  },
],
"2024-25": [
  {
    title: "EPISODE 3: BREAKTHROUGH",
    date: "5th – 20th",
    month: "May, 2025",
    desc: "A 15-day multi-domain learning program designed to help students explore, build, and grow through structured sessions, hands-on projects, and consistent practice.",
    overview: "Episode 3: Breakthrough was a 15-day online learning program conducted from May 5th to May 20th, organized by GDGC MJCET in collaboration with Horizon Research Group. The event was designed to provide a structured and consistent learning experience across multiple domains — spanning AI/ML, Web Development, App Development, Cloud, Cybersecurity, UI/UX, Game Development, Media, Marketing, and DSA.",
    neque: "The program followed a multi-domain structure where daily sessions balanced concept-building with hands-on implementation, covering both technical and non-technical fields for a well-rounded experience. Participants were exposed to real-world tools and technologies across domains such as AI, Cloud, and Development. Structured assignments were provided after each domain to reinforce learning through practical application, while collaborative sessions and continuous mentor guidance ensured consistent engagement and support throughout.",
    neque1: "The program saw over 250 registrations, with active participation from students across different colleges and domains. Consistent attendance, interactive sessions, and assignment submissions reflected strong engagement and commitment throughout the 15-day journey. Participants emerged with strong foundational understanding across multiple domains, hands-on experience through structured assignments, and increased confidence in exploring different fields — along with improved consistency and discipline in their approach to learning.",
    nequeimg: "poster.png",
    bg: "#a78bfa"
  },
  {
    title: "DEV ARENA",
    date: "23rd & 24th",
    month: "April, 2025",
    desc: "A two-day hands-on workshop where participants built an FPS game and integrated AI-powered features, gaining practical experience in game development, intelligent systems, and real-world project building.",
    overview: "Dev Arena was a two-day hands-on workshop organized by GDGC MJCET in collaboration with MJ Esports and Campus Hydra, conducted on April 23rd and 24th. The event brought together the worlds of game development and artificial intelligence, focusing on building something real rather than just learning concepts. Over the two days, students developed a First-Person Shooter (FPS) game while simultaneously exploring how AI can be integrated to make games more interactive and intelligent.",
    neque: "The event opened with a keynote by the COO of Live Studios on the gaming industry and AI's growing role within it, followed by interactive quizzes and an introduction to Hugging Face Transformers. Participants then moved into a live demonstration of speech-to-text and chatbot integration into Unity before diving into hands-on FPS game development — building core mechanics like player movement and shooting. They then developed an AI assistant named 'Ralfie', enabling voice-based interaction within the game environment, which was progressively enhanced through advanced AI integrations.",
    neque1: "Dev Arena witnessed participation from over 180 students, with strong engagement sustained across both days. The combination of hands-on activities, live demonstrations, and interactive segments — including quizzes, giveaways, and Q&A sessions — created an environment where students actively built, experimented, and asked thoughtful questions. By the end, participants had a working project combining game development and AI, boosting both their confidence and interest in exploring these domains further.",
    nequeimg: "poster.png",
    bg: "#f87171"
  },
  {
    title: "DESIGN AND DEV",
    date: "21st, 22nd & 23rd",
    month: "April, 2025",
    desc: "A three-day hands-on workshop where participants designed, developed, and deployed their own portfolio across web and mobile platforms, gaining practical experience in UI/UX, web development, and app development.",
    overview: "Design and Dev was a three-day hands-on workshop organized by GDGC MJCET, focused on bridging design and development into one complete learning experience. The workshop took participants from creating a design to turning it into a fully functional product — moving through UI/UX design, web development, and mobile app development as one connected flow rather than separate domains.",
    neque: "Day 1 focused on UI/UX design in Figma, covering layout structuring, color, typography, and spacing, culminating in a complete portfolio hero section with navigation and interactive elements. Day 2 transitioned into web development, converting Figma designs into functional websites using HTML and CSS, with hands-on exploration of responsive design, the box model, Flexbox, and live previews. Day 3 moved into Flutter, transforming the portfolio website into a cross-platform mobile application with UI components, Row/Column layouts, social media integration, and CV download functionality.",
    neque1: "The workshop saw active participation from students across different years, with strong engagement maintained throughout all three days. The structured yet interactive format, combined with continuous mentor support, ensured that students from varying experience levels could keep up and contribute. By the end, participants had a complete portfolio project spanning design, web, and mobile platforms — providing a strong foundation for hackathons, personal projects, and further exploration in both design and development.",
    nequeimg: "poster.png",
    bg: "#34d399"
  },
  {
    title: "DSA BOOTCAMP",
    date: "2nd January –",
    month: "March, 2025",
    desc: "The GDGC MJCET DSA Bootcamp was a 90-day intensive program designed to build strong foundations in Data Structures and Algorithms through structured curriculum, personalized learning paths, mentorship, and competitive engagement.",
    overview: "The DSA Bootcamp organized by GDGC MJCET was a comprehensive 90-day program launched on 2nd January, designed to strengthen participants' understanding of Data Structures and Algorithms. The program adopted an inclusive approach catering to learners across varying skill levels — from beginners to advanced coders — combining a structured curriculum, personalized learning paths, and continuous mentorship to create a dynamic and collaborative environment.",
    neque: "Participants were onboarded through a DSA League Qualifier Test and categorized into four leagues — Alpha, Beta, Gamma, and Omega — for personalized learning. The curriculum was based on Striver's A2Z DSA Course Sheet (455 problems), progressing through fundamentals in Month 1, intermediate topics in Month 2, and advanced concepts including trees, graphs, and dynamic programming in Month 3. League-wise leaderboards, monthly contests, and team-based challenges gamified the experience, while expert mentorship and curated resources from platforms like NeetCode, GeeksforGeeks, and HackerRank provided comprehensive support.",
    neque1: "The bootcamp witnessed enthusiastic participation from students across different academic levels, with consistent interaction through peer discussions, team coding challenges, real-time doubt clarification, and leaderboard tracking. Participants emerged with enhanced understanding of core data structures and algorithms, improved coding discipline, and increased confidence in tackling technical interviews and competitive programming. The program's structured roadmap, combined with mentorship and gamification, transformed learning into an engaging and result-oriented journey that built both technical proficiency and a strategic mindset.",
    nequeimg: "poster.png",
    bg: "#fbbf24"
  },
  {
    title: "SOLUTIONS CHALLENGE INFO SESSION",
    date: "15th",
    month: "January, 2025",
    desc: "The Solutions Challenge Information Session, led by Google Solution Challenge 2024 winner Ms. Sanika Chavan, equipped students with a comprehensive overview of the competition, from AI integration to SDG alignment and team strategy.",
    overview: "The Solutions Challenge Information Session was conducted on 15th January 2025 from 7:00 PM to 9:00 PM in an online format, led by Ms. Sanika Chavan — a distinguished winner of the Google Solution Challenge 2024. The session aimed to provide participants with a comprehensive understanding of the challenge, including its structure, evaluation criteria, and effective participation strategies, drawing from the speaker's firsthand experience.",
    neque: "The session presented a detailed overview of the Google Solution Challenge 2024, highlighting its focus in India and the requirement to address 31 predefined problem statements mapped to the UN SDGs. The six-month competition timeline — spanning registration, ideation, pitch deck submission, mentorship bootcamps, prototype development, and the final demonstration — was explained in full. Key emphasis was placed on integrating Google's Gemini models, forming diverse multidisciplinary teams, utilizing technologies like Flutter, Firebase, and Google Cloud, and building iteratively toward an MVP, illustrated through a case study of the winning project 'SpoonShare'.",
    neque1: "The session witnessed active participation from students across various institutions, with strong engagement particularly during the Q&A segment covering team formation, project execution, deployment, and evaluation. Participants left with a clear and structured roadmap for the Solutions Challenge, along with an understanding of user-centric design, practical implementation, and sustainable impact. The session reframed the challenge not merely as a competition but as a valuable platform for learning, innovation, and meaningful contribution to real-world problems through technology.",
    nequeimg: "poster.png",
    bg: "#38bdf8"
  },
  {
    title: "TECH FACE-OFF '24",
    date: "17th, 18th & 20th",
    month: "December, 2024",
    desc: "A three-day inter-club debate competition bringing together technical societies to discuss emerging tech topics, fostering critical thinking, collaboration and impactful dialogue.",
    overview: "Tech Face-Off: Clash of Clubs, organized by GDGC MJCET in collaboration with the Orators' Club, was a three-day inter-club debate competition held on 17th, 18th, and 20th December 2024. The event brought together students from various technical societies to engage in structured debates on contemporary technological and societal topics, designed to foster critical thinking, communication skills, and collaboration.",
    neque: "The competition followed a multi-stage knockout format — preliminary, quarter-final, semi-final, and grand finale rounds — with debate topics spanning AI, Web3, cybersecurity, remote work, cryptocurrencies, and digital privacy. A balanced evaluation panel comprising faculty members and student judges ensured a dynamic and inclusive atmosphere throughout. The highly competitive Grand Finale centered on encryption versus national security and privacy, with TSIG declared as winners and a Best Speaker award recognizing exceptional oratory.",
    neque1: "The event witnessed enthusiastic participation from multiple student clubs, with participants actively engaging across all rounds through strong collaboration and communication. The inter-club format encouraged networking and peer learning across technical and non-technical student communities, while the inclusion of both faculty and student judges added credibility and diversity to evaluations. Participants emerged with enhanced critical thinking, improved public speaking and argumentation skills, and broader exposure to diverse perspectives on emerging technological issues.",
    nequeimg: "poster.png",
    bg: "#fb923c"
  },
  {
    title: "CYBER STRIKERS LEAGUE",
    date: "19th",
    month: "December, 2024",
    desc: "A football-inspired tech event where gameplay met problem-solving, combining competition, strategy, and technical quizzes into one dynamic and engaging experience.",
    overview: "Cyber Strikers League was a unique and high-energy event conducted on December 19, 2024, at Ghulam Ahmed Hall by GDGC MJCET. The event creatively blended football-style gameplay with technical quizzes, offering participants an experience that combined strategy, teamwork, and technology in a format unlike anything conventional.",
    neque: "The event introduced a football-inspired gameplay format where quiz performance directly influenced match outcomes, creating a seamless blend of real-time technical knowledge and competitive gameplay. A custom-built game was developed using JavaScript, React, Node.js, Three.js, and Matter.js, deployed over a network-based setup that allowed participants to access and play via a shared IP environment. Throughout the matches, high energy, competitive spirit, humor, and active audience involvement kept the atmosphere lively and engaging from start to finish.",
    neque1: "The event witnessed strong participation from over 120 attendees, with participants, hosts, and the audience remaining actively involved throughout. The unique blend of gaming and learning significantly enhanced engagement while encouraging teamwork, strategic thinking, and quick decision-making. It provided a practical and engaging way to apply technical knowledge in a real-time setting, and strengthened community bonding through an experience that made learning feel genuinely fun and competitive.",
    nequeimg: "poster.png",
    bg: "#4ade80"
  },
  {
    title: "DYE '24",
    date: "13th",
    month: "November, 2024",
    desc: "An interactive career-guidance event offering tech roadmaps, practical skills, and expert insights to help students explore domains and build a strong foundation for their engineering journey.",
    overview: "Doodle Your Engineering, held on 13th November 2024 at the Seminar Hall (Block 4), was an engaging and informative session organized by GDG MJCET to help students explore diverse technology domains and make informed decisions about their engineering journey. Designed for both beginners and enthusiasts, the event provided clarity on career paths, skill-building, and personal development within the tech space.",
    neque: "The session delivered comprehensive roadmaps for major tech domains including Web Development, App Development, AI/ML, Cybersecurity, Networking, and Game Development, each led by GDG leads with real-world insights, tools, and resources. Sessions on Git and GitHub fundamentals, collaborative development practices, and building a strong professional presence through LinkedIn and GitHub were woven throughout. Live demonstrations including networking concepts and cybersecurity practices, interactive presentations, and project showcases kept the content practical and engaging.",
    neque1: "The event witnessed enthusiastic participation from a large number of students across different years and branches, who remained actively engaged through interactive demonstrations, discussions, and real-time learning. The diversity of sessions ensured involvement from students with varied interests, fostering a collaborative and inclusive learning environment. Participants left equipped with clear direction, structured roadmaps, and valuable resources to kickstart their journeys — empowered to take initiative, build meaningful projects, and strategically shape their careers in technology.",
    nequeimg: "poster.png",
    bg: "#f472b6"
  },
  {
    title: "INFO SESSION '24",
    date: "4th",
    month: "October, 2024",
    desc: "An engaging introductory session that unveiled GDG MJCET's vision, leadership, and upcoming initiatives, while inspiring students through expert guidance and the launch of the Gen AI Study Jams.",
    overview: "The GDG MJCET Info Session '24, held on 4th October 2024, was an introductory online event aimed at familiarizing students with the vision, mission, and upcoming initiatives of GDG MJCET. The session brought together students, faculty, and industry professionals to set the tone for a year focused on learning, innovation, and community building.",
    neque: "The session introduced GDG MJCET's vision, mission, and roadmap for 2024–2025, unveiled the new governing body and leadership team, and featured an insightful address by the faculty coordinator on balancing academics with skill development. An overview of key Google technologies — including AI, Cloud, Web, and App Development — was followed by the launch announcement of the Gen AI Study Jams campaign. The session also featured an expert talk by Abdul Malik, SDE at Amazon, on engineering growth, networking, and career development, rounded off by an interactive Q&A and distribution of curated learning resources.",
    neque1: "The event witnessed an enthusiastic turnout of around 160 participants, with approximately 80% active attendance. Students were highly engaged throughout, especially during the Q&A and the Gen AI Study Jams announcement, which generated strong excitement for hands-on learning in AI and Cloud. The session successfully fostered interaction between juniors, seniors, and industry professionals, strengthening the sense of community while inspiring students to actively participate in GDG MJCET's upcoming initiatives and pursue continuous learning.",
    nequeimg: "poster.png",
    bg: "#60a5fa"
  },
  {
    title: "PRODX",
    date: "6th",
    month: "July, 2024",
    desc: "ProdX was an interactive session on product management where students learned about industry practices, interview strategies, and real-world applications from experienced professionals.",
    overview: "ProdX was conducted by GDGC MJCET on 6th July 2024 at Seminar Hall, Block 4, with the aim of introducing product management as a career option and giving students a clear understanding of the field. The session covered industry insights, interview preparation, and the role of a product manager, featuring speakers Kondru Sharathchandra, Senior Product Manager at Google, and Purnachandra from Siemens.",
    neque: "Kondru Sharathchandra focused on interview preparation and product management fundamentals — sharing his career journey, emphasizing the importance of attitude, and explaining the product life cycle using real-world examples from companies like Zomato, Swiggy, CRED, and Foodpanda. Purnachandra then covered the technical aspects of product management, detailing the product life cycle and introducing tools for project management, data analysis, and prototyping, while stressing the importance of staying current with emerging technologies. Both speakers emphasized continuous learning, shared curated resources, and highlighted the value of networking.",
    neque1: "The event saw active participation from students, with the audience remaining engaged throughout and the Q&A session proving particularly interactive — allowing students to connect directly with speakers and clarify doubts. Overall, the event gave students clear insight into real industry scenarios, interview strategies, and the skills required in product management. The session also motivated many attendees to consider product management as a potential career path and take concrete steps toward skill development.",
    nequeimg: "poster.png",
    bg: "#34d399"
  },
],
"2023-24": [
  {
    title: "GDGC BUILD WEEK",
    date: "20th – 25th",
    month: "May, 2024",
    desc: "Build Week was a week-long hands-on program by GDSC MJCET where participants explored Web Development, App Development, and AI/ML, built real-world projects, and enhanced their technical and collaborative skills.",
    overview: "GDSC MJCET organized Build Week from 20th to 25th May 2024, offering members an immersive, hands-on learning experience across three domains — Web Development, App Development, and AI/ML. The event focused on enhancing technical knowledge, encouraging collaboration, and preparing students for industry-level challenges through real-world project building.",
    neque: "The Web Development track covered HTML, CSS, JavaScript, Node.js, and Tailwind CSS, with participants building a portfolio website, secret message app, and to-do list — all deployed via Netlify and GitHub. The App Development track progressed through Flutter and Dart from basics to advanced OOP and async programming, culminating in a fully functional BMI Calculator app. The AI/ML track introduced machine learning concepts, Python, regression, KNN, deep learning with YOLO, RAG, and generative AI, with participants building AI models and a custom chatbot. Every session across all tracks included practical coding, interactive discussions, quizzes, and live doubt-solving.",
    neque1: "The event witnessed high participation and engagement from GDSC members, with active involvement in hands-on sessions, collaborative learning, teamwork, and regular interaction through Q&A and quizzes. This created a dynamic and supportive learning environment where students built across domains simultaneously. Participants emerged with strong foundations in Web, App, and AI/ML development, practical experience through real-world projects, and clearer direction for future learning and career growth.",
    nequeimg: "poster.png",
    bg: "#f87171"
  },
  {
    title: "GEN AI STUDY JAMS",
    date: "6th & 8th",
    month: "May, 2024",
    desc: "The Gen AI Study Jam 2024 by GDSC MJCET was a month-long immersive learning program focused on Generative AI technologies, where participants gained practical AI skills, earned certifications, and strengthened their industry readiness.",
    overview: "The Gen AI Study Jam was a month-long technical event organized by GDSC MJCET in May 2024, focused on providing participants with hands-on experience in Generative AI technologies through Google's curated learning pathways. It included guided sessions, practical learning modules, and interactive activities designed to build strong foundational and applied knowledge in Gen AI.",
    neque: "Participants completed three major Google pathways — Prompt Design in Vertex AI, Developing Gen AI Apps with Gemini and Streamlit, and GenAI Arcade Games — supported by two interactive study jam sessions conducted on 6th and 8th May. Detailed walkthroughs of Google Cloud Platform, Vertex AI, Gemini API, and Postman were provided, covering key concepts such as prompt engineering, one-shot prompting, hallucinations, RESTful APIs, GraphQL APIs, and API calls. Interactive quizzes were conducted at the end of each session to reinforce learning, with participants motivated through skill badges, certificates, and swags upon completion.",
    neque1: "The event witnessed active participation from students throughout the month, with attendees highly engaged during sessions through questions, discussions, and quizzes. The interactive format encouraged collaboration, problem-solving, and peer learning, with positive feedback reflecting strong enthusiasm for Generative AI. Participants emerged equipped with practical knowledge of Vertex AI, Gemini, and Streamlit — gaining hands-on experience in prompt design, API usage, and AI-based application development that added tangible value to their professional profiles.",
    nequeimg: "poster.png",
    bg: "#34d399"
  },
  {
    title: "ANDROID UNPLUGGED",
    date: "6th",
    month: "January, 2024",
    desc: "Android Unplugged was an engaging session on Android development featuring hands-on Kotlin learning, UI design with Jetpack Compose, and interactive activities, encouraging participants to explore app development.",
    overview: "The Android Unplugged event, held on 6th January 2024 and organized by GDSC MJCET, introduced participants to Android application development. The session opened with Mohammed Zaka Kareem explaining the concept of Android Unplugging and highlighting the growing demand for Android and the importance of Kotlin as a modern programming language.",
    neque: "A hands-on Kotlin session conducted by Mubashir Ahmed covered the language basics — variables, functions, OOP concepts, and string handling — giving participants a solid programming foundation to build on. This was followed by an introduction to UI development using Jetpack Compose, covering its core advantages over XML and walking through fundamental UI components. An interactive quiz with prizes for top participants wrapped up the session, testing knowledge while keeping energy and engagement high.",
    neque1: "The event saw active participation from students, with strong involvement during the hands-on learning segments and the quiz session, and interactive discussions that made the atmosphere engaging and collaborative. Participants left with a foundational understanding of Kotlin, practical exposure to Jetpack Compose, and a meaningful boost in confidence and interest toward Android development — with many feeling equipped to begin building their own apps.",
    nequeimg: "poster.png",
    bg: "#a78bfa"
  },
  {
    title: "INFO SESSION – SOLUTION CHALLENGE",
    date: "9th",
    month: "December, 2023",
    desc: "An informative session on Solution Challenge 2024 where students learned about the competition, its timeline, and useful strategies to participate effectively.",
    overview: "The Info Session on Solution Challenge 2024 was conducted by GDGC MJCET on 9th December 2023 in virtual mode, with the purpose of giving students a clear understanding of the Solution Challenge — how to participate, the timeline, and how to plan effectively. The session was led by Abhinav Jain, a Global Top 100 finisher of Solution Challenge 2022, making the content practical and grounded in real experience.",
    neque: "The session covered the structure and significance of the Solution Challenge, explaining how it focuses on building solutions around the 17 UN Sustainable Development Goals and the benefits it offers — including mentorship, recognition, and prizes. The competition timeline was laid out clearly, from registrations in December through project submissions, selections, and the final Demo Day in June. Key participation strategies were discussed including team selection, problem scoping, clean code practices, and effective presentation, with the concept of regional bootcamps for selected teams also introduced.",
    neque1: "The session drew good participation from students who remained actively engaged throughout, with a lively Q&A segment that allowed students to clear doubts and dig into specifics despite the online format. The speaker's firsthand experience added relatability and credibility, with common mistakes and personal lessons making the guidance particularly actionable. Students left with a clear picture of the Solution Challenge process, practical strategies to get started, and strong motivation to participate and begin working on their ideas.",
    nequeimg: "poster.png",
    bg: "#fbbf24"
  },
  {
    title: "DYE '23",
    date: "18th",
    month: "November, 2023",
    desc: "A comprehensive introductory event by GDSC MJCET that guided students through various tech domains, productivity tools, and career pathways, empowering them to begin their engineering journey with clarity and confidence.",
    overview: "The Doodle Your Engineering event was conducted on 18th November 2023 at Seminar Hall, Block 4, as the first major event of GDSC MJCET for the academic year 2023–24. The session aimed to help students kickstart their technical journey by introducing them to various domains, tools, and opportunities within the Google Developer Student Club, providing structured guidance on learning technologies, academic growth, building an online presence, and improving productivity.",
    neque: "The session delivered detailed domain walkthroughs covering Web Development, Application Development, AI and ML, Cloud Computing, and Cybersecurity — each with roadmaps, real project demonstrations, and career guidance. A dedicated session on developer productivity tools covered IDEs, GitHub, extensions, and AI tools, while a focused segment on LinkedIn profile optimization guided students on building a professional presence. The event concluded with an interactive panel discussion featuring experienced seniors sharing insights on careers, startups, and academics.",
    neque1: "The event witnessed strong student participation as the first major event of the academic year, with active audience interaction during sessions and the panel discussion — students asking questions, clarifying doubts, and engaging through live demos and real-time discussions. Attendees left with actionable roadmaps for multiple tech domains, boosted confidence through peer learning and expert guidance, and a clearer understanding of how to build projects, improve productivity, and develop strong professional profiles to accelerate their engineering journey.",
    nequeimg: "poster.png",
    bg: "#38bdf8"
  },
  {
    title: "CLOUD STUDY JAMS",
    date: "September –",
    month: "October, 2023",
    desc: "Google Cloud Study Jams successfully introduced students to the fundamentals of Google Cloud through interactive sessions, hands-on labs, and competitive leaderboard tracking, marking a productive start to the cloud learning journey at MJCET.",
    overview: "The Google Cloud Study Jams was conducted by GDSC MJCET to introduce students to the fundamentals of Google Cloud technologies. The campaign aimed to provide foundational cloud knowledge and hands-on learning experience through the Google Skill Boost platform, with registrations open from 22nd to 28th September and the campaign officially beginning in October with an adjusted timeline to accommodate examinations.",
    neque: "The campaign covered Google Cloud Computing Fundamentals across four tracks — Cloud Fundamentals, Cloud Infrastructure, Networking and Security, and Data, ML and AI — delivered through two online interactive sessions in Week 1. Hands-on lab demonstrations were provided, with quizzes conducted at the end of each session to assess understanding. A real-time leaderboard system with Gold, Silver, and Bronze leagues gamified the experience and encouraged healthy competition, while participants earned badges and certificates upon completing modules.",
    neque1: "A total of 137 students registered out of 150 available slots, primarily from 2nd, 3rd, and 4th year, with the second session recording over 90 live participants. Students remained actively engaged through quizzes, lab activities, and leaderboard rankings, with progress consistently tracked via Google Sheets. The structured modules and competitive leaderboard system increased motivation and engagement, ultimately helping students develop practical cloud skills and move toward becoming industry-ready in cloud computing.",
    nequeimg: "poster.png",
    bg: "#4ade80"
  },
  {
    title: "AI GENESIS",
    date: "27th",
    month: "August, 2023",
    desc: "An insightful online session introducing GDSC MJCET, focusing on engineering excellence, skill development, and future opportunities, with strong student participation and engagement.",
    overview: "The GDSC MJCET Info Session and Engineering Excellence event was conducted on 27th August 2023 as an online session to introduce students to the Google Developer Student Club. The event aimed to provide insights into the club's mission, vision, and opportunities while guiding students on achieving excellence in engineering, featuring talks by Mr. Abdul Aleem, Dr. Maniza Hijab, and Miss Rida Malik Mubeen.",
    neque: "The session introduced GDSC MJCET's mission, vision, and core values — emphasizing innovation, collaboration, and continuous learning — followed by an overview of upcoming events, recruitment opportunities, and key Google technologies including Cloud, TensorFlow, Flutter, and Firebase. Discussions spanned major technical domains such as Web Development, App Development, Cybersecurity, AI, and Machine Learning, with expert guidance on skill development, project building, resume creation, exam preparation, and the importance of networking and building a professional presence on LinkedIn.",
    neque1: "The event recorded 133 total attendees with approximately 125 active participants, reflecting a strong 94% attendance rate and high enthusiasm throughout. Students showed keen interest in the recruitment drive and upcoming GDSC activities, engaging actively with the speakers and demonstrating genuine motivation to explore technical learning and community involvement. Attendees left with a clear awareness of diverse tech domains, actionable strategies for balancing academics with skill development, and strong encouragement to build meaningful projects and collaborate within the GDSC community.",
    nequeimg: "poster.png",
    bg: "#fb923c"
  },
],
};

const YEARS = ["2025-26", "2024-25", "2023-24"]

const EventCard = ({ event, onMoreInfo, scale = 1 }) => (
  <div
    className='group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 mx-auto'
    style={{
      backgroundColor: event.bg,
      maxWidth: `${Math.min(100, 100 + (scale - 0.85) * 50)}%`,
      minWidth: 'min(320px, 92vw)', width: '100%'
    }}
  >
    <div className='absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

    <div className='relative flex flex-col sm:flex-row gap-4 p-6 sm:p-8'>
      <div className='relative flex-shrink-0'>
        <div className='relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-300'>
          <img
            src="/poster.png"
            alt={event.title}
            className='w-screen h-32 sm:w-60 sm:h-60 object-cover transform group-hover:scale-105 transition-transform duration-500'
            
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        </div>
        <div className='absolute -top-1 -right-1 w-4 h-4 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
      </div>
      <div className='flex-1 flex flex-col justify-between min-h-[140px] sm:min-h-[120px]'>
        <div className='space-y-2'>
          <h2 className={`font-bold leading-tight text-black group-hover:text-black/90 transition-colors duration-300 text-2xl sm:text-3xl md:text-4xl`}>
            {event.title}
          </h2>
          <p className={`leading-relaxed line-clamp-3 group-hover:text-black/80 transition-colors duration-300 text-lg text-black/70`}>
            {event.desc}
          </p>
        </div>
        <div className='flex justify-between items-end mt-4'>
          <div className='text-black'>
            <div className={`font-bold leading-none mb-1 group-hover:scale-105 transition-transform duration-300 origin-left text-2xl`}>
              {event.date}
            </div>
            <div className={`font-medium uppercase tracking-wide text-sm text-black/70`}>
              {event.month}
            </div>
          </div>

          <button
            onClick={() => onMoreInfo(event)}
            className={`relative bg-black/90 hover:bg-black text-white border border-white/30 hover:border-white/50 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-black/25 transform hover:scale-105 active:scale-95 overflow-hidden group/button px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base`}
          >
            <span className='relative z-10 flex items-center gap-2'>
              More Info
              
            </span>
            <div className='absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300'></div>
          </button>
        </div>
      </div>
    </div>
    <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
  </div>
)

// Spring physics hook — gives that smooth, bubbly overshoot feel
const useSpring = (target, stiffness = 0.07, damping = 0.68) => {
  const value = useRef(target)
  const velocity = useRef(0)
  const raf = useRef(null)
  const [display, setDisplay] = useState(target)

  useEffect(() => {
    const animate = () => {
      const force = (target - value.current) * stiffness
      velocity.current = (velocity.current + force) * damping
      value.current += velocity.current

      if (Math.abs(velocity.current) > 0.0005 || Math.abs(target - value.current) > 0.0005) {
        setDisplay(value.current)
        raf.current = requestAnimationFrame(animate)
      } else {
        value.current = target
        setDisplay(target)
      }
    }

    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [target, stiffness, damping])

  return display
}

const ParallaxRow = ({ event, onMoreInfo, index, totalEvents }) => {
  const rowRef = useRef(null)
  const [targetParallax, setTargetParallax] = useState(0)
  const [targetScale, setTargetScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!rowRef.current || isMobile) return

      const rect = rowRef.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowH / 2
      const distanceFromCenter = elementCenter - viewportCenter

      const progress = (windowH - elementCenter) / windowH
      setTargetParallax(progress * 25)

      const maxDistance = windowH / 2
      const normalizedDistance = Math.abs(distanceFromCenter) / maxDistance
      setTargetScale(Math.max(0.85, 1 - normalizedDistance * 0.15))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Spring-interpolated values for buttery, bubbly motion
  const parallax = useSpring(targetParallax, 0.07, 0.68)
  const scale = useSpring(targetScale, 0.06, 0.70)

  return (
    <div ref={rowRef} className='my-6 sm:my-8 px-4 sm:px-6 md:px-8'>
      <div
        style={{
          transform: `translateY(${parallax}px) scale(${scale})`,
          willChange: 'transform',
          transformOrigin: 'center center',

        }}
      >
        <EventCard event={event} onMoreInfo={onMoreInfo} scale={scale} />
      </div>
    </div>
  )
}

export default function PastEvents() {
  const [selectedYear, setSelectedYear] = useState("2025-26")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const handleMoreInfo = (event) => {
    navigate('/event-details', { state: { event, year: selectedYear } })
    window.scrollTo(0, 0)
  }

  const events = eventsByYear[selectedYear]

  useEffect(() => {
    const fn = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div>
      <div className='flex justify-between px-4 mt-12 sm:px-6 md:px-8 py-6 sm:py-8 items-center'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-light'>Past Events</h2>

        <div ref={dropdownRef} className='relative'>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className='flex gap-2 px-4 sm:px-6 py-1.5 sm:py-2 border border-white rounded-full items-center justify-center cursor-pointer bg-transparent text-white hover:bg-white/10 transition-colors text-sm sm:text-base'
          >
            <p>{selectedYear}</p>
            <ChevronDown
              size={16}
              style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {dropdownOpen && (
            <div className='absolute right-0 mt-2 bg-[#0a0a1a] border border-white/20 rounded-xl overflow-hidden shadow-2xl z-50 min-w-full'>
              {YEARS.map(year => (
                <button
                  key={year}
                  onClick={() => { setSelectedYear(year); setDropdownOpen(false) }}
                  className='block w-full text-left px-5 py-3 text-sm cursor-pointer transition-colors'
                  style={{
                    background: year === selectedYear ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: year === selectedYear ? '#fff' : 'rgba(255,255,255,0.55)',
                    fontWeight: year === selectedYear ? 600 : 400,
                    border: 'none',
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='pb-6 sm:pb-8'>
        {events.map((event, i) => (
          <ParallaxRow
            key={`${selectedYear}-${i}`}
            event={event}
            onMoreInfo={handleMoreInfo}
            index={i}
            totalEvents={events.length}
          />
        ))}
      </div>
    </div>
  )
}


