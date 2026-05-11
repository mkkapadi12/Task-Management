import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetPostByIdQuery,
  useDeletePostMutation,
} from "@/features/post/post.api";
import PostFormDrawer from "@/features/post/components/PostFormDrawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  CalendarDays,
  User,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, error } = useGetPostByIdQuery(id);
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const post = data?.post;
  const isOwner = post && user && post.author?.id === user.id;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id).unwrap();
      toast.success("Post deleted successfully!");
      navigate("/posts");
    } catch (err) {
      toast.error(err?.message || "Failed to delete post");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Loading post…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mb-4">
          <AlertTriangle size={28} className="text-destructive" />
        </div>
        <h3 className="text-base font-semibold mb-1">Post not found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The post you're looking for doesn't exist or has been deleted.
        </p>
        <Button asChild variant="outline" size="sm" className="rounded-lg">
          <Link to="/posts">
            <ArrowLeft size={16} className="mr-1.5" />
            Back to Posts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Back link ── */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="rounded-lg -ml-2"
      >
        <Link to="/posts">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Posts
        </Link>
      </Button>

      {/* ── Cover Image ── */}
      {post.coverImage && (
        <div className="overflow-hidden rounded-xl border border-border/50">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>
      )}

      {/* ── Header ── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              post.status === "PUBLISHED"
                ? "bg-primary/15 text-primary"
                : "bg-warning/15 text-warning"
            )}
          >
            {post.status}
          </span>

          {post.tags?.length > 0 &&
            post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User size={15} />
            <span>{post.author?.name || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays size={15} />
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex items-center gap-2 pt-1">
            <Button
              onClick={() => setEditDrawerOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              <Pencil size={14} className="mr-1.5" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              className="rounded-lg"
            >
              {isDeleting ? (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              ) : (
                <Trash2 size={14} className="mr-1.5" />
              )}
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-8">
        <div className="prose prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* ── Edit Drawer ── */}
      {isOwner && (
        <PostFormDrawer
          open={editDrawerOpen}
          onOpenChange={setEditDrawerOpen}
          editPost={post}
        />
      )}
    </div>
  );
};

export default PostDetailPage;
