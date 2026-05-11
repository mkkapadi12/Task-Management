import { useState } from "react";
import { useGetAllPostsQuery } from "@/features/post/post.api";
import PostCard from "@/features/post/components/PostCard";
import PostFormDrawer from "@/features/post/components/PostFormDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
} from "lucide-react";

const PostsPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetAllPostsQuery({
    page,
    ...(status && { status }),
    ...(tag && { tag }),
  });

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  const handleTagSearch = (e) => {
    if (e.key === "Enter") {
      setPage(1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and browse all posts
          </p>
        </div>
        <Button
          onClick={() => setDrawerOpen(true)}
          className="rounded-lg shadow-md shadow-primary/20"
        >
          <Plus size={16} className="mr-1.5" />
          New Post
        </Button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status filter */}
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val === "ALL" ? "" : val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-9">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
          </SelectContent>
        </Select>

        {/* Tag search */}
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by tag…"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={handleTagSearch}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading posts…</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
            <Inbox size={28} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold mb-1">No posts found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
            {status || tag
              ? "Try adjusting your filters to find what you're looking for."
              : "Create your first post to get started!"}
          </p>
          {!status && !tag && (
            <Button
              onClick={() => setDrawerOpen(true)}
              size="sm"
              className="rounded-lg"
            >
              <Plus size={16} className="mr-1.5" />
              Create Post
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
            {isFetching && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-xs z-10 flex items-center justify-center rounded-xl">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            )}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* ── Create Drawer ── */}
      <PostFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
};

export default PostsPage;
