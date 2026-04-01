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
    neque: "The flagship GDGC event saw participation from 65 students across 13 clubs, making it one of the most collaborative inter-club engagements on campus. The multi-stage format progressed from Round of 16 through Quarterfinals, Semifinals, and a Grand Finale, with debate topics spanning AI ethics, system design, cybersecurity, and emerging tech. An independent fact-checking panel ensured accuracy and credibility of arguments, while experienced judges evaluated logic, structure, and rebuttal quality. The event strengthened analytical thinking and structured communication among participants and fostered a culture of informed debate within the campus tech community.",
    nequeimg: "poster.png",
    bg: "#4ade80"
  },
  {
    title: "CYBERSECURITY",
    date: "27th",
    month: "November, 2025",
    desc: "From Protection to Response — an industry-oriented cybersecurity session by IEEE CS and GDGC MJCET, focused on real-world threats and how modern defense systems respond to them.",
    overview: "Conducted on 27th November 2025, this session introduced students to the fundamentals of cybersecurity, moving beyond basic protection to understanding incident response and real-world attack scenarios. Led by industry expert Mr. Mahesh Nirati, the session combined conceptual clarity with practical insights into how security systems function today.",
    neque: "The session covered the CIA Triad, modern threats including malware, phishing, APTs and zero-day attacks, and real-world case studies highlighting social engineering tactics. Insights into security tools like next-gen firewalls were shared alongside a discussion on career paths and skills required in the cybersecurity domain. Around 50 students, primarily from 1st and 2nd year, participated actively through real-world examples and interactive discussions. Attendees gained a clearer understanding of how cyberattacks work, how organizations respond to them, and the importance of thinking critically about security in the modern landscape.",
    nequeimg: "poster.png",
    bg: "#60a5fa"
  },
  {
    title: "PIXELX",
    date: "22nd",
    month: "November, 2025",
    desc: "PixelX was a hands-on web development workshop by GDGC MJCET, designed to introduce students to the fundamentals of HTML, CSS, and JavaScript through practical, build-focused learning.",
    overview: "PixelX, conducted by GDGC MJCET on 22nd November 2025, was a beginner-friendly web development workshop covering HTML, CSS, and JavaScript. The session focused on learning by doing, taking participants from basic structure to building interactive web projects within a single day.",
    neque: "The workshop followed a step-by-step progression from HTML to CSS to JavaScript, where participants built a portfolio webpage and a Rock-Paper-Scissors game from scratch. Modern concepts like Flexbox, Grid, and DOM manipulation were covered through hands-on coding rather than passive theory. Around 30 students, primarily from 1st and 2nd year, participated actively through live coding, real-time doubt solving, and peer discussions. Participants walked away with a clear understanding of how websites are built and the confidence to start building and exploring web development on their own.",
    nequeimg: "poster.png",
    bg: "#fde047"
  },
  {
    title: "DYE 2025",
    date: "17th",
    month: "October, 2025",
    desc: "A multi-domain technical event introducing students to Web Development, AI/ML, Cloud and Cybersecurity, combining learning, interaction, and community engagement.",
    overview: "Doodle Your Engineering, organized by GDGC MJCET on 17th October 2025, was a technical exploratory event designed for first and second-year students. The session introduced participants to multiple technology domains, providing a broad understanding of career paths and industry trends through informative talks, interactive segments and real-world insights.",
    neque: "The event featured multi-domain exploration covering Web Development, UI/UX Design, AI/ML, Cloud Computing and Cybersecurity, with beginner-friendly explanations of core concepts, tools and industry applications. An interactive fun segment 'Tech Word or Trash Word' boosted engagement, while a community-focused concluding session encouraged GDGC membership. The event recorded an impressive 114 participants with strong engagement throughout, and post-event impact extended beyond the session with the event montage reel reaching 7K views. Attendees gained clear exposure to multiple technology domains, foundational understanding of career paths, and increased interest in joining GDGC and participating in future initiatives.",
    nequeimg: "poster.png",
    bg: "#f472b6"
  },
  {
    title: "CLOUD STUDY JAMS 2025",
    date: "3rd",
    month: "October, 2025",
    desc: "An introductory session on Google Cloud Study Jams, featuring cloud fundamentals, live demonstrations and hands-on guidance to begin your Google Cloud journey.",
    overview: "The Google Cloud Study Jams Info Session, conducted by GDGC MJCET on 3rd October 2025, introduced students to the Google Cloud Study Jams initiative and its learning ecosystem. The session focused on building a foundational understanding of cloud computing and guiding participants through accessing Google Cloud resources, completing hands-on labs and earning certifications.",
    neque: "The session included an introduction to the Google Cloud Study Jams campaign covering timeline, credits, certifications and rewards, along with simplified explanations of cloud computing concepts such as Virtual Machines, storage and service models (IaaS, PaaS, SaaS). A live demonstration guided students through redeeming credits and enrolling into the program, followed by a hands-on walkthrough of creating a Virtual Machine using both Console (UI) and Cloud Shell (CLI). The session engaged 85 participants and successfully set the stage for active participation in the Study Jams campaign, with attendees gaining a strong foundation in core cloud concepts and increased readiness for hands-on labs and certification tracks.",
    nequeimg: "poster.png",
    bg: "#c084fc"
  },
  {
    title: "INFO SESSION 2025",
    date: "4th",
    month: "September, 2025",
    desc: "An orientation session introducing GDGC MJCET, its opportunities, and career-building insights to help freshers kickstart their journey.",
    overview: "The GDGC MJCET Fresher's Information Session 2025, conducted on 4th September 2025, served as an introductory and orientation session for incoming students. Organized virtually, the session aimed to familiarize first-year engineering students with GDGC's mission, structure and opportunities for technical and professional growth.",
    neque: "The session featured an opening address by the Faculty Advisor emphasizing the importance of balancing academics with practical skills, followed by an introduction to GDGC's global presence, mission and opportunities including Solution Challenge and Google Summer of Code. A guest session by an Amazon SDE Intern covered DSA, project building, hackathons and career pathways. The session saw participation from 60+ students, with an interactive Q&A segment addressing AI's role, domain selection, and getting started in tech. Attendees gained clarity on GDGC's role as a platform for skill development, awareness of career-building strategies, and motivation to actively participate in GDGC initiatives.",
    nequeimg: "poster.png",
    bg: "#fb923c"
  },
],
  "2024-25": [
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#60a5fa" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fde047" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#4ade80" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#f472b6" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#c084fc" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb923c" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#2dd4bf" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb7185" },
  ],
  "2023-24": [
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fde047" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#60a5fa" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#4ade80" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#f472b6" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#c084fc" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb923c" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#2dd4bf" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb7185" },
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


