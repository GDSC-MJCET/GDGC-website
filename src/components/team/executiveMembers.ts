// The Executive Committee for 2026-27, grouped by portfolio, in the order of the team sheet.
// Names and portfolios only (the sheet's phone numbers, roll numbers and birthdays are not for the site).
// To change the list, edit it here; the page shows whatever is in it.

export type Portfolio = { name: string; members: string[] };

export const PORTFOLIOS: Portfolio[] = [
  {
    name: "Marketing",
    members: [
      "Mohammed Junaid Khan",
      "Zaina Fatima",
      "Fatima Unnisa",
      "Mohd Taher Khan",
      "Mohd Jalal Uddin",
      "Zoha Ahmed",
      "Ali Abbas Veerji",
    ],
  },
  {
    name: "Events & PR",
    members: [
      "Mohammed Abdul Basith",
      "Safwan Nisar Ahmed",
      "Haseeb Salafi",
      "Sufyaan M. Zubair",
      "Faraaz Masood",
      "Mohammed Abdul Sami",
    ],
  },
  {
    name: "Operations",
    members: [
      "Mohammed Farhan Khan",
      "Faizan Ahmed Khan",
      "Mir Abbas Ali Razvi",
      "Mohammed Oubaid",
    ],
  },
  {
    name: "UI/UX & Design",
    members: [
      "Qudsia Zainab Shirazi",
      "Xenia Fatima",
      "Mirhan",
      "Zehra Fatima",
      "Muzzammil Siddiqi",
    ],
  },
  {
    name: "HR",
    members: [
      "Talha Rehan",
      "Salma Fatima",
      "Safa",
      "Amena Fatima Sana",
      "Zoya Irfan Hussain",
      "Hafsa Tahreem",
    ],
  },
  {
    name: "Media",
    members: [
      "Safiya Vikar Khan",
      "Maira Banu",
      "Farzeen",
      "Arisa",
      "Abdul Rahman P",
      "Mohammed Aayan Qureshi",
      "Afina Ikram",
      "Hajara Fatima",
    ],
  },
  {
    name: "Documentation",
    members: [
      "Mohammed Meraj Uddin",
      "Saad Riyaz Mohammed",
      "Sobia Mehrosh",
      "Syed Anas Yaseen",
      "Mohammed Osman Mohiuddin",
      "Afroze Shaik",
      "Asna Abdul Baseer",
    ],
  },
  {
    name: "AIML",
    members: [
      "Soha Alam Khan",
      "Aisha Erum",
      "Huda Khan",
      "Mohammed Waleed",
      "Syed Ali Shanawaz",
      "Naumaan Ahmed Mohammed",
      "Saleha Abdul Baseer",
      "Numa Alfiya",
    ],
  },
  {
    name: "Web Dev",
    members: [
      "Ayub Baig",
      "Syed Ayesha",
      "Syed Mohammed Ali",
      "Amar Bin Abdullah Bawazeer",
      "Shaik Adnan Hyder",
      "Syed Anas Ali",
    ],
  },
  {
    name: "Cloud & Cybersec",
    members: [
      "Rayyan Afroz Ahmed",
      "Mohammed Owais Ibraheem",
      "Mohammed Samiuddin",
      "Mohammed Aamir",
      "Abdul Wasey",
    ],
  },
  {
    name: "DSA",
    members: [
      "Mohammed Abdul Raqeeb",
      "Syed Musaddiq Ahmed",
      "Mohammed Abdul Muqeet",
      "Abdul Ahad",
      "Tabrez Khan",
      "Muhammed Jibran Fahad",
    ],
  },
  {
    name: "IoT & Hardware",
    members: [
      "Shaik Ayan Hyder",
      "Hamza Mohammed Jeelani",
      "Mirza Zohair Ali Baig",
      "Mohammed Nazeer Ahmed",
      "Omer Ahmed Khan",
      "Syeda Fayeqa Nabeel",
    ],
  },
];

export const EXEC_COUNT = PORTFOLIOS.reduce((n, p) => n + p.members.length, 0);
