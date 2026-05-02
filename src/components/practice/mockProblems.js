export const MOCK_PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Map"],
    summary: "Return the indices of two numbers whose sum matches the target.",
    statement: {
      paragraphs: [
        "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.",
        "You may assume that each input has exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
      examples: [
        {
          input: "nums = [2,7,11,15]\ntarget = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] equals 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4]\ntarget = 6",
          output: "[1,2]",
          explanation: "The pair 2 and 4 adds up to 6.",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists.",
      ],
    },
    allowedLanguages: ["javascript", "python", "cpp", "java"],
    defaultLanguage: "javascript",
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  return []\n}`,
      python: `class Solution:\n    def twoSum(self, nums, target):\n        # Write your solution here\n        return []`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[] {};\n    }\n}`,
    },
  },
  "valid-anagram": {
    id: "valid-anagram",
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    tags: ["String", "Sorting", "Hash Map"],
    summary: "Check whether two strings contain the same characters in any order.",
    statement: {
      paragraphs: [
        "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
        "An anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.",
      ],
      examples: [
        {
          input: 's = "anagram"\nt = "nagaram"',
          output: "true",
          explanation: "Both strings contain the same characters with the same frequencies.",
        },
        {
          input: 's = "rat"\nt = "car"',
          output: "false",
          explanation: "The characters do not match, so the strings are not anagrams.",
        },
      ],
      constraints: [
        "1 <= s.length, t.length <= 5 * 10^4",
        "s and t consist of lowercase English letters.",
      ],
    },
    allowedLanguages: ["javascript", "python", "cpp", "java"],
    defaultLanguage: "javascript",
    starterCode: {
      javascript: `function isAnagram(s, t) {\n  // Write your solution here\n  return false\n}`,
      python: `class Solution:\n    def isAnagram(self, s, t):\n        # Write your solution here\n        return False`,
      cpp: `class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your solution here\n        return false;\n    }\n};`,
      java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your solution here\n        return false;\n    }\n}`,
    },
  },
  "longest-substring-without-repeating-characters": {
    id: "longest-substring-without-repeating-characters",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hash Map"],
    summary: "Find the maximum length of a substring that has no repeated characters.",
    statement: {
      paragraphs: [
        "Given a string `s`, find the length of the longest substring without duplicate characters.",
        "A substring is a contiguous sequence of characters within the string.",
      ],
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: 'The answer is "abc", with length 3.',
        },
        {
          input: 's = "bbbbb"',
          output: "1",
          explanation: 'The answer is "b", with length 1.',
        },
      ],
      constraints: [
        "0 <= s.length <= 5 * 10^4",
        "s consists of English letters, digits, symbols, and spaces.",
      ],
    },
    allowedLanguages: ["javascript", "python", "cpp", "java"],
    defaultLanguage: "javascript",
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Write your solution here\n  return 0\n}`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s):\n        # Write your solution here\n        return 0`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n        return 0;\n    }\n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}`,
    },
  },
}

export const getMockProblem = (problemId) => MOCK_PROBLEMS[problemId] || null

export function getMockProblemList() {
  return Object.values(MOCK_PROBLEMS).map((problem) => ({
    id: problem.id,
    slug: problem.slug,
    title: problem.title, 
    difficulty: problem.difficulty,
    tags: problem.tags || [],
    summary: problem.summary || problem.statement?.paragraphs?.[0] || "",
  }))
}
