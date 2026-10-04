export type Example = {
  id?: string;
  input?: string;
  output?: string;
  explanation?: string;
};

export type ProblemStatement = {
  paragraphs: string[];
  examples: Example[];
  constraints: string[];
  inputFormat?: string;
  outputFormat?: string;
};

export type Problem = {
  id: string;
  _id?: string;
  slug: string;
  title: string;
  difficulty: string;
  tags: string[];
  summary?: string;
  statement: ProblemStatement;
  allowedLanguages: string[];
  defaultLanguage: string;
  starterCode: Record<string, string>;
};

export type Submission = {
  submissionId: string;
  verdict: string;
  language: string;
  elapsedMs?: number | null;
  totalCount?: number;
  passedCount?: number;
  allPassed?: boolean;
  createdAt: string;
};

export type ExampleRunResult = {
  passed: boolean;
  stdout?: string;
  stderr?: string;
  timedOut?: boolean;
  exitCode?: number;
  expectedOutput?: string;
  input?: string;
};

export type ExecutionData = {
  status?: string;
  results?: ExampleRunResult[];
  passedCount?: number;
  totalCount?: number;
  stdout?: string;
  stderr?: string;
};

export type ExecutionState = {
  status: "idle" | "loading" | "success" | "error";
  data?: ExecutionData | null;
  error?: string | null;
};

export type ProblemSummary = {
  id?: string;
  _id?: string;
  slug?: string;
  title: string;
  difficulty?: string;
  tags?: string[];
  summary?: string;
  solved?: boolean;
};

export type Exercise = {
  _id: string;
  title: string;
  description?: string;
  problemCount: number;
  solvedCount: number;
};

export type ExerciseDetail = Exercise & { problems: ProblemSummary[] };
