import { baseApi } from "@/app/baseApi";
import { setCredentials, setUser } from "./authSlice";
import { toast } from "sonner";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", data: body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch {
          console.log("Registration failed");
        }
      },
    }),

    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", data: body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch (error) {
          toast.error(error.error.message);
        }
      },
    }),

    getProfile: builder.query({
      query: (data) => ({
        url: "/users/profile",
        method: "GET",
        data,
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          toast.error(error.error.message);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetProfileQuery } =
  authApi;
