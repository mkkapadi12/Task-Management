import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { postSchema } from "@/schemas/post.schema";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/features/post/post.api";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { ICONS } from "@/lib/icons/icons";
const { LOADER2: Loader2, UPLOAD: Upload } = DASHBOARD_ICONS;
const { X } = ICONS;

const PostFormDrawer = ({ open, onOpenChange, editPost = null }) => {
  const isEdit = !!editPost;
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const isSubmitting = isCreating || isUpdating;

  const [preview, setPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "DRAFT",
      tags: "",
    },
  });

  const watchedStatus = watch("status");

  // Populate form when editing
  useEffect(() => {
    if (editPost && open) {
      setValue("title", editPost.title || "");
      setValue("content", editPost.content || "");
      setValue("status", editPost.status || "DRAFT");
      setValue(
        "tags",
        editPost.tags?.map((t) => t.name).join(", ") || ""
      );
      setPreview(editPost.coverImage || null);
      setCoverFile(null);
    }
  }, [editPost, open, setValue]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      reset();
      setPreview(null);
      setCoverFile(null);
    }
  }, [open, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setCoverFile(null);
    setPreview(null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("status", data.status);

      // Tags: split comma-separated → JSON array
      if (data.tags?.trim()) {
        const tagsArr = data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        tagsArr.forEach((tag) => formData.append("tags", tag));
      }

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      if (isEdit) {
        await updatePost({ id: editPost.id, formData }).unwrap();
        toast.success("Post updated successfully!");
      } else {
        await createPost(formData).unwrap();
        toast.success("Post created successfully!");
      }

      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Post" : "Create New Post"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update your post details below."
              : "Fill in the details to create a new post."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 px-4 pb-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              placeholder="Enter post title"
              aria-invalid={!!errors.title}
              className="h-10"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              placeholder="Write your post content…"
              rows={6}
              aria-invalid={!!errors.content}
              className="resize-none"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={watchedStatus}
              onValueChange={(val) => setValue("status", val)}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="post-tags">Tags</Label>
            <Input
              id="post-tags"
              placeholder="react, javascript, web dev"
              className="h-10"
              {...register("tags")}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            {preview ? (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={preview}
                  alt="Cover preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8 transition-colors hover:border-primary/50 hover:bg-primary/5">
                <Upload
                  size={24}
                  className="mb-2 text-muted-foreground"
                />
                <span className="text-sm text-muted-foreground">
                  Click to upload cover image
                </span>
                <span className="text-xs text-muted-foreground/60 mt-1">
                  PNG, JPG up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full h-11 rounded-lg mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating…" : "Creating…"}
              </>
            ) : isEdit ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default PostFormDrawer;
