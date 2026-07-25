// Program-level NUST admission merit reference data, transcribed from a
// merit-list graphic circulated by a test-prep page (Physikomatics /
// Mathsflix / "Physics by Bilal Zia"), not fetched directly from NUST's
// own admissions portal. The cycle year is not printed on the source
// graphic. Treat these as the most recent reference figures available,
// not a guarantee — always confirm against ugadmissions.nust.edu.pk
// before relying on them for a real decision.
//
// "topMerit" = the highest-ranked (lowest merit number) admitted
// candidate's figures; "lastMerit" = the lowest-ranked admitted
// candidate's figures, i.e. the effective closing cutoff for the
// program that cycle.

export type MeritPoint = {
  merit: number; // merit list rank/number
  netMarks: number; // net test marks
  cummAggregate: number; // cumulative aggregate %
};

export type NustProgram = {
  code: string; // programme code, e.g. "CEME-W604"
  name: string; // display name
  school: string; // school/college code, e.g. "CEME", "SEECS"
  category: string; // grouping used on the source sheet
  topMerit: MeritPoint;
  lastMerit: MeritPoint;
};

export const NUST_MERIT_SOURCE_NOTE =
  "Transcribed from a merit-list summary circulated by a test-prep page, not fetched directly from NUST's admissions portal. Cycle year not stated on the source — confirm against ugadmissions.nust.edu.pk before relying on it.";

export const nustPrograms: NustProgram[] = [
  // --- Engineering Program ---
  { code: "CAE-Z606", name: "Bachelor of Aerospace Engineering", school: "CAE", category: "Engineering Program", topMerit: { merit: 175, netMarks: 154, cummAggregate: 81.09091 }, lastMerit: { merit: 2470, netMarks: 129, cummAggregate: 68.46591 } },
  { code: "CAE-Z607", name: "Bachelor of Avionics Engineering", school: "CAE", category: "Engineering Program", topMerit: { merit: 206, netMarks: 152, cummAggregate: 80.719 }, lastMerit: { merit: 2922, netMarks: 122, cummAggregate: 67.20455 } },
  { code: "CEME-W603", name: "Bachelor of Electrical Engineering", school: "CEME", category: "Engineering Program", topMerit: { merit: 1768, netMarks: 129, cummAggregate: 70.82045 }, lastMerit: { merit: 5179, netMarks: 107, cummAggregate: 62.07954 } },
  { code: "CEME-W604", name: "Bachelor of Mechanical Engineering", school: "CEME", category: "Engineering Program", topMerit: { merit: 405, netMarks: 151, cummAggregate: 78.49773 }, lastMerit: { merit: 5422, netMarks: 105, cummAggregate: 61.59773 } },
  { code: "CEME-W608", name: "Bachelor of Computer Engineering", school: "CEME", category: "Engineering Program", topMerit: { merit: 358, netMarks: 149, cummAggregate: 79.075 }, lastMerit: { merit: 3260, netMarks: 119, cummAggregate: 66.33296 } },
  { code: "CEME-W615", name: "Bachelor of Mechatronics Engineering", school: "CEME", category: "Engineering Program", topMerit: { merit: 55, netMarks: 163, cummAggregate: 83.84318 }, lastMerit: { merit: 4144, netMarks: 114, cummAggregate: 64.28637 } },
  { code: "IESE-E609", name: "Bachelor of Environmental Engineering", school: "IESE", category: "Engineering Program", topMerit: { merit: 956, netMarks: 138, cummAggregate: 74.55 }, lastMerit: { merit: 6915, netMarks: 98, cummAggregate: 59.01364 } },
  { code: "IGIS-G636", name: "Bachelor of Geoinformatics Engineering", school: "IGIS", category: "Engineering Program", topMerit: { merit: 2384, netMarks: 123, cummAggregate: 68.69546 }, lastMerit: { merit: 6699, netMarks: 103, cummAggregate: 59.36364 } },
  { code: "MCE-X601", name: "Bachelor of Civil Engineering", school: "MCE", category: "Engineering Program", topMerit: { merit: 3346, netMarks: 115, cummAggregate: 66.09198 }, lastMerit: { merit: 9604, netMarks: 91, cummAggregate: 54.79247 } },
  { code: "MCS-Y603", name: "Bachelor of Electrical Engineering", school: "MCS", category: "Engineering Program", topMerit: { merit: 1762, netMarks: 128, cummAggregate: 70.82727 }, lastMerit: { merit: 7488, netMarks: 106, cummAggregate: 58.04091 } },
  { code: "MCS-Y605", name: "Bachelor of Software Engineering", school: "MCS", category: "Engineering Program", topMerit: { merit: 90, netMarks: 157, cummAggregate: 82.79318 }, lastMerit: { merit: 3409, netMarks: 119, cummAggregate: 65.96137 } },
  { code: "MCS-Y614", name: "Bachelor of Engineering in Information Security", school: "MCS", category: "Engineering Program", topMerit: { merit: 451, netMarks: 144, cummAggregate: 78.04091 }, lastMerit: { merit: 3979, netMarks: 113, cummAggregate: 64.60227 } },
  { code: "NBC-Q601", name: "Bachelor of Civil Engineering", school: "NBC", category: "Engineering Program", topMerit: { merit: 4241, netMarks: 112, cummAggregate: 64.1 }, lastMerit: { merit: 15826, netMarks: 65, cummAggregate: 45.175 } },
  { code: "NICE-I601", name: "Bachelor of Civil Engineering", school: "NICE", category: "Engineering Program", topMerit: { merit: 84, netMarks: 159, cummAggregate: 82.96041 }, lastMerit: { merit: 5407, netMarks: 111, cummAggregate: 61.625 } },
  { code: "PNEC-P603", name: "Bachelor of Electrical Engineering", school: "PNEC", category: "Engineering Program", topMerit: { merit: 704, netMarks: 144, cummAggregate: 76.15909 }, lastMerit: { merit: 8008, netMarks: 97, cummAggregate: 57.19318 } },
  { code: "PNEC-P604", name: "Bachelor of Mechanical Engineering", school: "PNEC", category: "Engineering Program", topMerit: { merit: 176, netMarks: 157, cummAggregate: 81.05682 }, lastMerit: { merit: 6888, netMarks: 102, cummAggregate: 59.05455 } },
  { code: "PNEC-P669", name: "Bachelor of Engineering in Naval Architecture", school: "PNEC", category: "Engineering Program", topMerit: { merit: 1685, netMarks: 129, cummAggregate: 71.09375 }, lastMerit: { merit: 14420, netMarks: 73, cummAggregate: 47.70227 } },
  { code: "SCME-C625", name: "Bachelor of Chemical Engineering", school: "SCME", category: "Engineering Program", topMerit: { merit: 339, netMarks: 149, cummAggregate: 79.28409 }, lastMerit: { merit: 5377, netMarks: 108, cummAggregate: 61.68637 } },
  { code: "SCME-C626", name: "Bachelor of Metallurgy and Materials Engineering", school: "SCME", category: "Engineering Program", topMerit: { merit: 2149, netMarks: 123, cummAggregate: 69.46591 }, lastMerit: { merit: 7501, netMarks: 98, cummAggregate: 58.02273 } },
  { code: "SEECS-S603", name: "Bachelor of Electrical Engineering", school: "SEECS", category: "Engineering Program", topMerit: { merit: 17, netMarks: 165, cummAggregate: 85.74773 }, lastMerit: { merit: 1821, netMarks: 131, cummAggregate: 70.625 } },
  { code: "SEECS-S605", name: "Bachelor of Software Engineering", school: "SEECS", category: "Engineering Program", topMerit: { merit: 6, netMarks: 170, cummAggregate: 86.77922 }, lastMerit: { merit: 846, netMarks: 140, cummAggregate: 75.17727 } },
  { code: "SEECS-S608", name: "Bachelor of Computer Engineering", school: "SEECS", category: "Engineering Program", topMerit: { merit: 9, netMarks: 171, cummAggregate: 86.525 }, lastMerit: { merit: 1226, netMarks: 132, cummAggregate: 73.08312 } },
  { code: "SMME-M604", name: "Bachelor of Mechanical Engineering", school: "SMME", category: "Engineering Program", topMerit: { merit: 20, netMarks: 166, cummAggregate: 85.42273 }, lastMerit: { merit: 2355, netMarks: 127, cummAggregate: 68.79773 } },
  { code: "SMME-M606", name: "Bachelor of Aerospace Engineering", school: "SMME", category: "Engineering Program", topMerit: { merit: 93, netMarks: 159, cummAggregate: 82.74653 }, lastMerit: { merit: 2526, netMarks: 124, cummAggregate: 68.31818 } },
  { code: "NBC-Q601-BAL", name: "Bachelor of Civil Engineering (Balochistan Domicile)", school: "NBC", category: "Engineering Program", topMerit: { merit: 9927, netMarks: 87, cummAggregate: 54.32465 }, lastMerit: { merit: 18326, netMarks: 53, cummAggregate: 37.03864 } },

  // --- Computing Programmes ---
  { code: "NBC-Q642", name: "Bachelor of Science in Computer Science", school: "NBC", category: "Computing Programmes", topMerit: { merit: 4154, netMarks: 113, cummAggregate: 64.42955 }, lastMerit: { merit: 14263, netMarks: 75, cummAggregate: 50.44952 } },
  { code: "NBC-Q680", name: "Bachelor of Science in Artificial Intelligence", school: "NBC", category: "Computing Programmes", topMerit: { merit: 3864, netMarks: 117, cummAggregate: 64.97955 }, lastMerit: { merit: 14410, netMarks: 74, cummAggregate: 50.29546 } },
  { code: "PNEC-P642", name: "Bachelor of Science in Computer Science", school: "PNEC", category: "Computing Programmes", topMerit: { merit: 233, netMarks: 153, cummAggregate: 80.44318 }, lastMerit: { merit: 4419, netMarks: 113, cummAggregate: 63.875 } },
  { code: "SEECS-S642", name: "Bachelor of Science in Computer Science", school: "SEECS", category: "Computing Programmes", topMerit: { merit: 1, netMarks: 179, cummAggregate: 90.65227 }, lastMerit: { merit: 853, netMarks: 141, cummAggregate: 75.02955 } },
  { code: "SEECS-S673", name: "Bachelor of Science in Data Science", school: "SEECS", category: "Computing Programmes", topMerit: { merit: 87, netMarks: 159, cummAggregate: 82.97285 }, lastMerit: { merit: 909, netMarks: 143, cummAggregate: 74.70455 } },
  { code: "SEECS-S680", name: "Bachelor of Science in Artificial Intelligence", school: "SEECS", category: "Computing Programmes", topMerit: { merit: 41, netMarks: 162, cummAggregate: 84.45095 }, lastMerit: { merit: 642, netMarks: 143, cummAggregate: 76.57955 } },
  { code: "NBC-Q642-BAL", name: "Bachelor of Science in Computer Science (Balochistan Domicile)", school: "NBC", category: "Computing Programmes", topMerit: { merit: 2827, netMarks: 122, cummAggregate: 67.43181 }, lastMerit: { merit: 21287, netMarks: 58, cummAggregate: 40.26765 } },
  { code: "NBC-Q680-BAL", name: "Bachelor of Science in Artificial Intelligence (Balochistan Domicile)", school: "NBC", category: "Computing Programmes", topMerit: { merit: 6784, netMarks: 102, cummAggregate: 59.74546 }, lastMerit: { merit: 21398, netMarks: 57, cummAggregate: 39.94493 } },

  // --- Business Studies & Social Sciences ---
  { code: "NBS-B616", name: "Bachelor of Business Administration", school: "NBS", category: "Business Studies & Social Sciences", topMerit: { merit: 7, netMarks: 161, cummAggregate: 83.94318 }, lastMerit: { merit: 773, netMarks: 135, cummAggregate: 69.65227 } },
  { code: "NBS-B654", name: "Bachelor of Science in Accounting and Finance", school: "NBS", category: "Business Studies & Social Sciences", topMerit: { merit: 1, netMarks: 172, cummAggregate: 87.22386 }, lastMerit: { merit: 759, netMarks: 133, cummAggregate: 69.73864 } },
  { code: "NBS-B684", name: "Bachelor of Science in Tourism and Hospitality Management", school: "NBS", category: "Business Studies & Social Sciences", topMerit: { merit: 815, netMarks: 132, cummAggregate: 69.38182 }, lastMerit: { merit: 2809, netMarks: 100, cummAggregate: 59.39091 } },
  { code: "S3H-H6002", name: "Bachelor of Science in Liberal Arts and Humanities", school: "S3H", category: "Business Studies & Social Sciences", topMerit: { merit: 624, netMarks: 137, cummAggregate: 70.67045 }, lastMerit: { merit: 3348, netMarks: 101, cummAggregate: 56.94318 } },
  { code: "S3H-H632", name: "Bachelor of Science in Economics", school: "S3H", category: "Business Studies & Social Sciences", topMerit: { merit: 11, netMarks: 161, cummAggregate: 83.46591 }, lastMerit: { merit: 1248, netMarks: 123, cummAggregate: 66.625 } },
  { code: "S3H-H638", name: "Bachelor of Science in Mass Communication", school: "S3H", category: "Business Studies & Social Sciences", topMerit: { merit: 268, netMarks: 139, cummAggregate: 74.60227 }, lastMerit: { merit: 2692, netMarks: 98, cummAggregate: 59.87272 } },
  { code: "S3H-H640", name: "Bachelor of Public Administration", school: "S3H", category: "Business Studies & Social Sciences", topMerit: { merit: 249, netMarks: 140, cummAggregate: 74.87727 }, lastMerit: { merit: 2531, netMarks: 109, cummAggregate: 60.62955 } },
  { code: "S3H-H662", name: "Bachelor of Science in Psychology", school: "S3H", category: "Business Studies & Social Sciences", topMerit: { merit: 8, netMarks: 164, cummAggregate: 83.88182 }, lastMerit: { merit: 2267, netMarks: 114, cummAggregate: 61.81818 } },

  // --- LLB ---
  { code: "S3H-H676", name: "Bachelor of Laws", school: "S3H", category: "LLB", topMerit: { merit: 2, netMarks: 158, cummAggregate: 82.55568 }, lastMerit: { merit: 264, netMarks: 112, cummAggregate: 65.06591 } },

  // --- Architecture & Industrial Design ---
  { code: "SADA-D637", name: "Bachelor of Architecture", school: "SADA", category: "Architecture & Industrial Design", topMerit: { merit: 5, netMarks: 154, cummAggregate: 79.48637 }, lastMerit: { merit: 126, netMarks: 130, cummAggregate: 70.28125 } },
  { code: "SADA-D653", name: "Bachelor of Industrial Design", school: "SADA", category: "Architecture & Industrial Design", topMerit: { merit: 7, netMarks: 149, cummAggregate: 79.30162 }, lastMerit: { merit: 231, netMarks: 121, cummAggregate: 66.21875 } },

  // --- Applied Sciences ---
  { code: "ASAB-A677", name: "Bachelor of Science in Biotechnology", school: "ASAB", category: "Applied Sciences", topMerit: { merit: 4, netMarks: 165, cummAggregate: 84.21136 }, lastMerit: { merit: 253, netMarks: 139, cummAggregate: 73.39583 } },
  { code: "ASAB-A695", name: "Bachelor of Science in Agriculture", school: "ASAB", category: "Applied Sciences", topMerit: { merit: 317, netMarks: 131, cummAggregate: 72.23409 }, lastMerit: { merit: 1646, netMarks: 99, cummAggregate: 56.27611 } },
  { code: "IESE-E634", name: "Bachelor of Science in Environmental Science", school: "IESE", category: "Applied Sciences", topMerit: { merit: 103, netMarks: 142, cummAggregate: 76.92273 }, lastMerit: { merit: 789, netMarks: 115, cummAggregate: 65.90682 } },

  // --- Natural Sciences ---
  { code: "SNS-N619", name: "Bachelor of Science in Mathematics", school: "SNS", category: "Natural Sciences", topMerit: { merit: 24, netMarks: 158, cummAggregate: 81.40455 }, lastMerit: { merit: 2294, netMarks: 75, cummAggregate: 45.33409 } },
  { code: "SNS-N630", name: "Bachelor of Science in Physics", school: "SNS", category: "Natural Sciences", topMerit: { merit: 3, netMarks: 167, cummAggregate: 86.26136 }, lastMerit: { merit: 1987, netMarks: 80, cummAggregate: 49.06818 } },
  { code: "SNS-N659", name: "Bachelor of Science in Chemistry", school: "SNS", category: "Natural Sciences", topMerit: { merit: 104, netMarks: 140, cummAggregate: 76.47273 }, lastMerit: { merit: 2098, netMarks: 37, cummAggregate: 31.73864 } },

  // --- Food Science & Technology ---
  { code: "ASAB-A687", name: "Bachelor of Science in Food Science and Technology", school: "ASAB", category: "Food Science & Technology", topMerit: { merit: 11, netMarks: 158, cummAggregate: 83.10454 }, lastMerit: { merit: 866, netMarks: 105, cummAggregate: 62.96591 } },

  // --- Bioinformatics ---
  { code: "SINES-R665", name: "Bachelor of Science in Bioinformatics", school: "SINES", category: "Bioinformatics", topMerit: { merit: 15, netMarks: 157, cummAggregate: 82.43636 }, lastMerit: { merit: 383, netMarks: 132, cummAggregate: 72.11591 } },
];

/** nustPrograms grouped by their `category`, in first-seen order — the
 * shape the program <select>'s <optgroup> list wants. Computed once at
 * module load so every consumer (calculator, merit estimator) shares
 * the same grouping instead of re-deriving it. */
export const groupedNustPrograms: { category: string; programs: NustProgram[] }[] = (() => {
  const groups: { category: string; programs: NustProgram[] }[] = [];
  for (const program of nustPrograms) {
    let group = groups.find((g) => g.category === program.category);
    if (!group) {
      group = { category: program.category, programs: [] };
      groups.push(group);
    }
    group.programs.push(program);
  }
  return groups;
})();
