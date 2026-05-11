import { baseApi } from "@/app/baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /posts?page&status&tag ──
    getAllPosts: builder.query({
      query: ({ page = 1, status, tag } = {}) => {
        const params = { page };
        if (status) params.status = status;
        if (tag) params.tag = tag;
        return { url: "/posts", method: "GET", params };
      },
      providesTags: (result) =>
        result?.posts
          ? [
              ...result.posts.map(({ id }) => ({ type: "Post", id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    // ── GET /posts/:id ──
    getPostById: builder.query({
      query: (id) => ({ url: `/posts/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // ── POST /posts (multipart/form-data) ──
    createPost: builder.mutation({
      query: (formData) => ({
        url: "/posts",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    // ── PUT /posts/:id (multipart/form-data) ──
    updatePost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
      ],
    }),

    // ── DELETE /posts/:id ──
    deletePost: builder.mutation({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApi;
