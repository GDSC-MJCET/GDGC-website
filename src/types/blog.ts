export type BlogComment = {
  _id: string;
  text: string;
  commentedBy?: { name?: string };
  level: number;
  replyTo: string | null;
  createdAt: string;
  showReplies?: boolean;
};

export type CommentNode = BlogComment & { replies: CommentNode[] };

export type BlogActivity = {
  total_upvotes?: number;
  total_comments?: number;
  total_reads?: number;
};

export type Blog = {
  _id: string;
  title: string;
  des?: string;
  banner?: string;
  author?: { name?: string };
  validated?: boolean;
  comments?: BlogComment[];
  activity?: BlogActivity;
};

export type BlogBlock = {
  type: string;
  data: { text: string; caption?: string; file: { url: string } };
};

export type BlogDetail = Blog & {
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isLiked?: boolean;
  content?: { blocks?: BlogBlock[] }[];
};
