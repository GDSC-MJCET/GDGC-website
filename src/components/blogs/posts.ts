// Our posts on Medium (https://medium.com/@gdscmjcet), newest first. Add new ones at the top.
export const MEDIUM_URL = "https://medium.com/@gdscmjcet";

export type Post = {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  url: string;
  image: string;
  tags: string[];
};

// Medium's CDN serves any width; ask for one big enough to stay crisp
const img = (id: string) => `https://cdn-images-1.medium.com/max/1400/${id}`;

export const POSTS: Post[] = [
  {
    title: "We Said the Same Sentence in Four Languages and Got Billed Very Differently",
    subtitle: "A story about tokenizers, Telugu, and why “a token is about four characters” only works if you write English.",
    author: "Moid Abdul",
    date: "3 Nov 2026",
    url: "https://medium.com/@gdscmjcet/we-said-the-same-sentence-in-four-languages-and-got-billed-very-differently-ff18c7bce717",
    image: img("1*AMAkNectQxc2h4OOzJJnYQ.png"),
    tags: ["Research", "AI"],
  },
  {
    title: "We Deleted All the Vowels to Save Money and Broke Every LLM Tool We Own",
    subtitle: "A story about gzip, tokenizers, and why “it works on our bytes” is not a defense.",
    author: "Moid Abdul",
    date: "26 Oct 2026",
    url: "https://medium.com/@gdscmjcet/we-deleted-all-the-vowels-to-save-money-and-broke-every-llm-tool-we-own-d75b4fe38de7",
    image: img("1*YU7GzXYIJ66sM7oHJWEuVg.png"),
    tags: ["Embeddings", "Tokenizers"],
  },
  {
    title: "Am I Testing My Code or Is My Code Testing Me",
    subtitle: "How many people you know have said “I wanted to learn to code” and then never did?",
    author: "Misbah Hussain",
    date: "21 Sep 2026",
    url: "https://medium.com/@gdscmjcet/am-i-testing-my-code-or-is-my-code-testing-me-f6dbe65bae5d",
    image: img("1*dRNV-AI6obV9Vq3ZHQ3U1A.png"),
    tags: ["Coding", "Freshers"],
  },
  {
    title: "Neuromorphic Computing — Where Neurons and Computers Shake Hands",
    subtitle: "Have you ever wondered why the human brain can learn new things so quickly, while computers take much more time and power?",
    author: "Syeda Fariba Razvi & Hadiya Mariyam",
    date: "14 Sep 2026",
    url: "https://medium.com/@gdscmjcet/neuromorphic-computing-where-neurons-and-computers-shake-hands-2b509bcf7165",
    image: img("1*CmvW1_Q4IZohMNTA7hbB0w.png"),
    tags: ["Neuroscience", "Hardware"],
  },
];
