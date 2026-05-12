import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetAllPostsQuery } from "@/features/post/post.api";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { Button } from "@/components/ui/button";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { cn, DateFormate } from "@/lib/utils";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useGetAllPostsQuery({ page: 1 });

  const posts = data?.posts || [];

  const stats = useMemo(() => {
    const published = posts.filter((p) => p.status === "PUBLISHED").length;
    const drafts = posts.filter((p) => p.status === "DRAFT").length;
    const memberSince = user?.createdAt
      ? DateFormate(user.createdAt, "long", "en-US")
      : "—";

    return { total: posts.length, published, drafts, memberSince };
  }, [posts, user]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Welcome ── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your posts today.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: DASHBOARD_ICONS.FILETEXT,
            label: "Total Posts",
            value: stats.total,
          },
          {
            icon: DASHBOARD_ICONS.CHECKCIRCLE,
            label: "Published",
            value: stats.published,
          },
          {
            icon: DASHBOARD_ICONS.FILEPEN,
            label: "Drafts",
            value: stats.drafts,
          },
          {
            icon: DASHBOARD_ICONS.CALENDARDAYS,
            label: "Member Since",
            value: stats.memberSince,
          },
        ].map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      {/* ── Recent Posts ── */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <h3 className="text-base font-semibold">Recent Posts</h3>
          <Button asChild size="sm" className="rounded-lg">
            <Link to="/posts">View All</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-sm">Loading posts…</p>
          </div>
        ) : posts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <DASHBOARD_ICONS.INBOX
                size={28}
                className="text-muted-foreground"
              />
            </div>
            <h4 className="text-base font-semibold mb-1">No posts yet</h4>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
              Create your first post to get started. Share your thoughts with
              the world!
            </p>
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/posts">
                <DASHBOARD_ICONS.PLUS size={16} className="mr-1.5" />
                Create Post
              </Link>
            </Button>
          </div>
        ) : (
          /* Posts table */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left font-medium px-5 py-3">Title</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                  <th className="text-left font-medium px-5 py-3 hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-right font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.slice(0, 5).map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-border/30 last:border-b-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/posts/${post.id}`}
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          post.status === "PUBLISHED"
                            ? "bg-primary/15 text-primary"
                            : "bg-warning/15 text-warning",
                        )}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">
                      {DateFormate(post.createdAt, "short", "en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg"
                        >
                          <Link to={`/posts/${post.id}`}>
                            <DASHBOARD_ICONS.EYE size={15} />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
