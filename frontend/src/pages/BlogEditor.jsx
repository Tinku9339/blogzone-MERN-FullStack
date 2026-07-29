import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Sparkles, Save, ArrowLeft, Loader2 } from "lucide-react";
import {
  createBlog,
  updateBlog,
  fetchBlogById,
  generateDescription,
} from "../api/blogs.js";
import { getErrorMessage } from "../api/axios.js";
import { CATEGORIES } from "../utils/constants.js";
import ImageUploader from "../components/ImageUploader.jsx";
import Loader from "../components/Loader.jsx";
import RichTextEditor from "../components/RichTextEditor.jsx";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  image: "",
  isPublished: false,
};

export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    fetchBlogById(id)
      .then((res) => {
        if (cancelled) return;
        const blog = res.data.data;
        setForm({
          title: blog.title,
          category: blog.category,
          description: blog.description,
          image: blog.image,
          isPublished: blog.isPublished,
        });
      })
      .catch((err) => {
        toast.error(getErrorMessage(err, "Could not load this post."));
        navigate("/dashboard/blogs");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!form.title.trim()) {
      toast.error("Add a title first — the AI needs something to write about.");
      return;
    }
    setGenerating(true);
    try {
      const res = await generateDescription({
        title: form.title,
        category: form.category,
      });
      setForm((f) => ({ ...f, description: res.data.data.description }));
      toast.success("Description drafted — feel free to edit it.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not generate a description."));
    } finally {
      setGenerating(false);
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.category.trim()) return "Category is required.";
    const plainDescription = form.description
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
    if (!plainDescription) return "Description is required.";
    if (!form.image) return "Add a cover image.";
    return null;
  };

  const handleSubmit = async (e, publishOverride) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = {
      ...form,
      isPublished:
        publishOverride !== undefined ? publishOverride : form.isPublished,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateBlog(id, payload);
        toast.success(
          payload.isPublished ? "Post updated and published" : "Post updated",
        );
      } else {
        await createBlog(payload);
        toast.success(payload.isPublished ? "Post published" : "Draft saved");
      }
      navigate("/dashboard/blogs");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save this post."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Opening the draft" full />;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => navigate("/dashboard/blogs")}
        className="eyebrow mb-6 inline-flex items-center gap-1.5 hover:text-paper"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All posts
      </button>

      <p className="eyebrow mb-2">{isEdit ? "Editing" : "New post"}</p>
      <h1 className="font-display text-3xl font-semibold text-paper">
        {isEdit ? "Edit post" : "Write a new post"}
      </h1>

      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mt-8 flex flex-col gap-6"
      >
        <div>
          <label className="field-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="field-input font-display text-lg"
            value={form.title}
            onChange={handleChange}
            placeholder="A working title for the post"
            maxLength={200}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            list="category-options"
            className="field-input"
            value={form.category}
            onChange={handleChange}
            placeholder="Pick or type a category"
            required
          />
          <datalist id="category-options">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <ImageUploader
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0" htmlFor="description">
              Description
            </label>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-brass hover:underline disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {generating ? "Drafting…" : "Draft with AI"}
            </button>
          </div>

          <RichTextEditor
            className="field-input min-h-[260px] resize-y leading-relaxed"
            value={form.description}
            onChange={(description) =>
              setForm((currentForm) => ({
                ...currentForm,
                description,
              }))
            }
          />
        </div>

        <label className="flex items-center gap-3 rounded-sm border border-paper-line/15 bg-canvas-panel px-4 py-3.5">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm((f) => ({ ...f, isPublished: e.target.checked }))
            }
            className="h-4 w-4 accent-brass"
          />
          <span className="text-sm text-paper">
            Published — visible on the public site
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-paper-line/10 pt-6 sm:flex-row sm:justify-end">
          {!form.isPublished && (
            <button
              type="button"
              className="btn-outline"
              disabled={saving}
              onClick={(e) => handleSubmit(e, true)}
            >
              Save &amp; publish
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving
              ? "Saving…"
              : isEdit
                ? "Save changes"
                : form.isPublished
                  ? "Publish post"
                  : "Save draft"}
            <Save className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
