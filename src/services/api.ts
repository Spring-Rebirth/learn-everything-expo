import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 统一在调用侧处理错误
    return Promise.reject(error);
  },
);

export type Post = {
  id: number;
  title: string;
  body: string;
};

export async function fetchPosts(limit = 12): Promise<Post[]> {
  const response = await api.get<Post[]>('/posts', {
    params: { _limit: limit },
  });
  return response.data;
}

