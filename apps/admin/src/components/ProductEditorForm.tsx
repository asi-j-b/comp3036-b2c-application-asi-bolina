"use client";

import { marked } from "marked";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type PostEditorValues = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  price: number;
  tags: string;
};

type EditorErrors = Partial<Record<keyof PostEditorValues, string>>;

const emptyValues: PostEditorValues = {
  title: "",
  category: "",
  description: "",
  content: "",
  imageUrl: "",
  price: 0,
  tags: "",
};

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validate(values: PostEditorValues): EditorErrors {
  const errors: EditorErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required";
  } else if (values.description.length > 200) {
    errors.description = "Description is too long. Maximum is 200 characters";
  }

  if (!values.content.trim()) {
    errors.content = "Content is required";
  }

  if (!values.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required";
  } else if (!isValidUrl(values.imageUrl.trim())) {
    errors.imageUrl = "This is not a valid URL";
  }

  if (!values.tags.trim()) {
    errors.tags = "At least one tag is required";
  }

  if (values.price <= 0) {
    errors.price = "Price must be a positive number";
  }

  return errors;
}

export function ProductEditorForm({
  initialValues,
  postId,
}: {
  initialValues?: Partial<PostEditorValues>;
  postId?: number;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PostEditorValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<EditorErrors>({});
  const [showErrorUi, setShowErrorUi] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  const previewHtml = useMemo(() => {
    return marked.parse(values.content) as string;
  }, [values.content]);

  useEffect(() => {
    if (!showPreview && selectionRef.current && contentRef.current) {
      const current = selectionRef.current;
      contentRef.current.focus();
      contentRef.current.setSelectionRange(current.start, current.end);
    }
  }, [showPreview]);

  function updateValue<K extends keyof PostEditorValues>(
    key: K,
    nextValue: PostEditorValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: nextValue,
    }));
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);

    setErrors(nextErrors);
    setShowErrorUi(Object.keys(nextErrors).length > 0);

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage("");
      return;
    }

    const requestUrl = postId ? `/api/posts/${postId}` : "/api/posts";
    const requestMethod = postId ? "PUT" : "POST";

    void (async () => {
      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setSuccessMessage("");
        return;
      }

      setSuccessMessage("Product updated successfully");
      router.refresh();
    })();
  }

  function togglePreview() {
    if (!showPreview && contentRef.current) {
      selectionRef.current = {
        start: contentRef.current.selectionStart,
        end: contentRef.current.selectionEnd,
      };
    }
    setShowPreview((current) => !current);
  }

  return (
    <form
      onSubmit={handleSave}
      className="w-full max-w-3xl space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      {showErrorUi ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Please fix the errors before saving
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title}</p> : null}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <input
          id="category"
          value={values.category}
          onChange={(event) => updateValue("category", event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(event) => updateValue("description", event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.description ? (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium">
          Content
        </label>
        <button
          type="button"
          onClick={togglePreview}
          className="mb-2 rounded border border-slate-300 px-3 py-1 text-sm"
        >
          {showPreview ? "Close Preview" : "Preview"}
        </button>
        {showPreview ? (
          <div
            data-test-id="content-preview"
            className="prose max-w-none rounded border border-slate-200 bg-slate-50 p-3 text-sm"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <textarea
            id="content"
            ref={contentRef}
            rows={8}
            value={values.content}
            onChange={(event) => updateValue("content", event.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        )}
        {errors.content ? <p className="mt-1 text-sm text-red-600">{errors.content}</p> : null}
      </div>

      <div>
        <label htmlFor="image-url" className="mb-1 block text-sm font-medium">
          Image URL
        </label>
        <input
          id="image-url"
          value={values.imageUrl}
          onChange={(event) => updateValue("imageUrl", event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.imageUrl ? (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
        ) : null}

        <img
          data-test-id="image-preview"
          src={values.imageUrl || "about:blank"}
          alt="Image Preview"
          className="mt-2 h-28 w-full rounded border border-slate-200 object-cover"
        />
      </div>

      <div>
        <label htmlFor="tags" className="mb-1 block text-sm font-medium">
          Tags
        </label>
        <input
          id="tags"
          value={values.tags}
          onChange={(event) => updateValue("tags", event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.tags ? <p className="mt-1 text-sm text-red-600">{errors.tags}</p> : null}
      </div>

      <button
        type="submit"
        className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Save
      </button>
    </form>
  );
}
