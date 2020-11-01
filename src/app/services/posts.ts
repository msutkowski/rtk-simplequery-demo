import { createApi } from "rtk_simple-query";

export interface Post {
  id: number;
  name: string;
}

type PostsResponse = Post[];

interface QueryArg {
  queryString: string;
  method?: string;
  body?: string;
  headers?: any;
}

export const postApi = createApi({
  reducerPath: "postsApi",
  baseQuery({
    queryString = "",
    method = "GET",
    body,
    headers = {
      "Content-Type": "application/json",
    },
  }: QueryArg) {
    return fetch(`/${queryString}`, { method, body, headers }).then((res) =>
      res.json()
    );
  },
  entityTypes: ["Posts"], // used for invalidation
  endpoints: (build) => ({
    getPosts: build.query<PostsResponse, void>({
      query() {
        return {
          queryString: `posts`,
        };
      },
      provides: [{ type: "Posts" }], // this provides entities of the type X - if you use a mutation that impacts this entity it will refetch
    }),
    getPost: build.query<Post, number>({
      query(id) {
        return {
          queryString: `posts/${id}`,
        };
      },
      provides: [(result) => ({ type: "Posts", id: result.id })], // this provides entities of the type X - if you use a mutation that impacts this entity it will refetch
    }),
    updatePost: build.mutation<Post, Partial<Post>>({
      query(data) {
        const { id, ...post } = data;
        return {
          queryString: `posts/${id}`,
          method: "PUT",
          body: JSON.stringify(post),
        };
      },
      invalidates: [(result) => ({ type: "Posts", id: result.id })],
    }),
    deletePost: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          queryString: `posts/${id}`,
          method: "DELETE",
        };
      },
      invalidates: [(result) => ({ type: "Posts" })], // will cause a refetch of `getPosts`
    }),
  }),
});
