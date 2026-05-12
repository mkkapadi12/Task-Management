import { Link } from "react-router-dom";
import { cn, DateFormate } from "@/lib/utils";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";

const PostCard = ({ post }) => {
  const excerpt =
    post.content?.length > 100
      ? post.content.slice(0, 100) + "…"
      : post.content;

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Cover image */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-accent/10">
            <span className="text-3xl font-bold text-primary/30">
              {post.title?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>
        )}

        {/* Status badge overlay */}
        <span
          className={cn(
            "absolute top-3 right-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm",
            post.status === "PUBLISHED"
              ? "bg-primary/80 text-primary-foreground"
              : "bg-warning/80 text-warning-foreground",
          )}
        >
          {post.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer — author + date */}
        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <DASHBOARD_ICONS.USER size={13} />
            <span className="truncate max-w-[100px]">
              {post.author?.name || "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <DASHBOARD_ICONS.CALENDARDAYS size={13} />
            <span>{DateFormate(post.createdAt, "long")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
