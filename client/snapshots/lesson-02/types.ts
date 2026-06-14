export type StringMap = {
  [key: string]: string;
};

export type Recipe = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  content: string;
  likes: string[];
};

export type CurrentUser = {
  userId: string;
  name: string;
  email: string;
  likes: string[];
};
