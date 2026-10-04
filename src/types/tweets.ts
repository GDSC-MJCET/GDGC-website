export type Tweet = {
  _id: string;
  text: string;
  media?: { url: string }[];
  authorName?: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  isLiked?: boolean;
  isReposted?: boolean;
};
