import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "@/features/auth/auth.api";
import { logout } from "@/features/auth/auth.slice";
import { useAuth } from "@/hooks/useAuth";

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const { isLoading } = useGetProfileQuery();

  console.log(user);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-6 text-zinc-900">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            UserDashboard
          </h1>
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {user?.role || "User"}
          </span>
        </div>

        <div className="mb-8 space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Name
            </span>
            <span className="text-lg font-medium text-zinc-900">
              {user?.name || "N/A"}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Email Address
            </span>
            <span className="text-lg font-medium text-zinc-900">
              {user?.email || "N/A"}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              User ID
            </span>
            <span className="text-sm font-mono text-zinc-600">{user?.id}</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => dispatch(logout())}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
