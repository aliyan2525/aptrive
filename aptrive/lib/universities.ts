export type FormulaComponent = {
  key: string;
  label: string;
  weight: number; // fraction of aggregate, e.g. 0.10 for 10%
  maxMarks: number; // denominator to divide obtained marks by
  hint?: string;
};

export type University = {
  id: string;
  name: string;
  fullName: string;
  location: string;
  verified: boolean;
  formulaText: string;
  components: FormulaComponent[];
  sourceNote: string;
};

// Formulas compiled from each university's published/official admission
// merit criteria as of the 2026 admission cycle. Weightages and test
// denominators can change year to year — always confirm against the
// university's own admissions portal before relying on a result.
export const universities: University[] = [
  {
    id: "nust",
    name: "NUST",
    fullName: "National University of Sciences & Technology",
    location: "Islamabad (+ campuses)",
    verified: true,
    formulaText: "Matric 10% + FSc 15% + NET 75%",
    components: [
      { key: "matric", label: "Matric / SSC", weight: 0.10, maxMarks: 1100 },
      { key: "fsc", label: "FSc Part-I (Intermediate)", weight: 0.15, maxMarks: 1100 },
      { key: "test", label: "NET Score", weight: 0.75, maxMarks: 200 },
    ],
    sourceNote: "NUST undergraduate merit criteria (NET basis) — ugadmissions.nust.edu.pk",
  },
  {
    id: "fast",
    name: "FAST-NUCES",
    fullName: "National University of Computer & Emerging Sciences",
    location: "Islamabad, Lahore, Karachi, Peshawar",
    verified: true,
    formulaText: "Matric 10% + FSc 40% + Entry Test 50%",
    components: [
      { key: "matric", label: "Matric / SSC", weight: 0.10, maxMarks: 1100 },
      { key: "fsc", label: "FSc / HSSC", weight: 0.40, maxMarks: 1100 },
      { key: "test", label: "Entry Test (FAST / NTS NAT / SAT-equivalent %)", weight: 0.50, maxMarks: 100 },
    ],
    sourceNote: "FAST-NUCES undergraduate admission merit formula — nu.edu.pk",
  },
  {
    id: "comsats",
    name: "COMSATS",
    fullName: "COMSATS University Islamabad",
    location: "Islamabad (+ campuses)",
    verified: true,
    formulaText: "Matric 10% + FSc 40% + NTS/NAT 50%",
    components: [
      { key: "matric", label: "Matric / SSC", weight: 0.10, maxMarks: 1100 },
      { key: "fsc", label: "FSc / HSSC", weight: 0.40, maxMarks: 1100 },
      { key: "test", label: "NTS-NAT / Entry Test (%)", weight: 0.50, maxMarks: 100 },
    ],
    sourceNote: "COMSATS undergraduate merit policy — comsats.edu.pk",
  },
  {
    id: "uet-lahore",
    name: "UET Lahore",
    fullName: "University of Engineering & Technology, Lahore",
    location: "Lahore",
    verified: true,
    formulaText: "Matric 17% + FSc 50% + ECAT 33%",
    components: [
      { key: "matric", label: "Matric / SSC", weight: 0.17, maxMarks: 1100 },
      { key: "fsc", label: "FSc / HSSC", weight: 0.50, maxMarks: 1100 },
      { key: "test", label: "ECAT Score", weight: 0.33, maxMarks: 400 },
    ],
    sourceNote: "UET Lahore ECAT merit formula — uet.edu.pk",
  },
  {
    id: "giki",
    name: "GIKI",
    fullName: "Ghulam Ishaq Khan Institute of Engineering Sciences & Technology",
    location: "Topi, KPK",
    verified: false,
    formulaText: "Intermediate 15% + Entry Test 85% (reported — confirm before relying on it)",
    components: [
      { key: "fsc", label: "FSc / Intermediate", weight: 0.15, maxMarks: 1100 },
      { key: "test", label: "GIKI Entry Test", weight: 0.85, maxMarks: 200 },
    ],
    sourceNote: "Third-party prep sources disagree on whether the 15% component is Matric or Intermediate — verify at giki.edu.pk before trusting this result.",
  },
  {
    id: "pieas",
    name: "PIEAS",
    fullName: "Pakistan Institute of Engineering & Applied Sciences",
    location: "Nilore, Islamabad",
    verified: true,
    formulaText: "Matric 15% + FSc Part-I 25% + Entry Test 60%",
    components: [
      { key: "matric", label: "Matric / O-Level", weight: 0.15, maxMarks: 1100 },
      { key: "fsc", label: "FSc Part-I (out of 550)", weight: 0.25, maxMarks: 550 },
      { key: "test", label: "PIEAS Entry Test (%)", weight: 0.60, maxMarks: 100 },
    ],
    sourceNote: "PIEAS admission merit formula — admissions.pieas.edu.pk",
  },
  {
    id: "ned",
    name: "NED",
    fullName: "NED University of Engineering & Technology",
    location: "Karachi",
    verified: true,
    formulaText: "FSc 40% + Entry Test 60% (Matric not used)",
    components: [
      { key: "fsc", label: "FSc / HSC (Part-I)", weight: 0.40, maxMarks: 1100 },
      { key: "test", label: "NED Entry Test (%)", weight: 0.60, maxMarks: 100 },
    ],
    sourceNote: "NED revised merit weightage — neduet.edu.pk. Matric marks are not part of the formula.",
  },
  {
    id: "air",
    name: "Air University",
    fullName: "Air University",
    location: "Islamabad",
    verified: true,
    formulaText: "Matric 10% + FSc 40% + Entry Test 50%",
    components: [
      { key: "matric", label: "Matric / O-Level", weight: 0.10, maxMarks: 1100 },
      { key: "fsc", label: "FSc / A-Level", weight: 0.40, maxMarks: 1100 },
      { key: "test", label: "AIR Entry Test (%)", weight: 0.50, maxMarks: 100 },
    ],
    sourceNote: "Air University merit formula — au.edu.pk",
  },
  {
    id: "bahria",
    name: "Bahria University",
    fullName: "Bahria University",
    location: "Islamabad, Karachi, Lahore",
    verified: true,
    formulaText: "Intermediate 50% + Entry Test 50%",
    components: [
      { key: "fsc", label: "Intermediate / FSc", weight: 0.50, maxMarks: 1100 },
      { key: "test", label: "Bahria Entry Test (%)", weight: 0.50, maxMarks: 100 },
    ],
    sourceNote: "Bahria University undergraduate merit formula — bahria.edu.pk",
  },
  {
    id: "ist",
    name: "IST",
    fullName: "Institute of Space Technology",
    location: "Islamabad",
    verified: true,
    formulaText: "Matric 40% + Intermediate 60% (no entry test)",
    components: [
      { key: "matric", label: "Matric / SSC", weight: 0.40, maxMarks: 1100 },
      { key: "fsc", label: "Intermediate / FSc", weight: 0.60, maxMarks: 1100 },
    ],
    sourceNote: "IST merit formula — ist.edu.pk. No entry test component reported.",
  },
  {
    id: "umt",
    name: "UMT",
    fullName: "University of Management & Technology",
    location: "Lahore",
    verified: false,
    formulaText: "Formula pending confirmation",
    components: [],
    sourceNote: "Aptrive hasn't yet confirmed UMT's official merit formula. Check umt.edu.pk before relying on any third-party figure.",
  },
  {
    id: "ucp",
    name: "UCP",
    fullName: "University of Central Punjab",
    location: "Lahore",
    verified: false,
    formulaText: "Formula pending confirmation",
    components: [],
    sourceNote: "Aptrive hasn't yet confirmed UCP's official merit formula. Check ucp.edu.pk before relying on any third-party figure.",
  },
];
