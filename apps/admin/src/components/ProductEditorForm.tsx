"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductEditorValues = {
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  featured: boolean;
  active: boolean;
};

type EditorErrors = Partial<Record<keyof ProductEditorValues, string>>;

const emptyValues: ProductEditorValues = {
  name: "",
  slug: "",
  category: "",
  description: "",
  imageUrl: "",
  price: 0,
  stock: 0,
  featured: false,
  active: true,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-");
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validate(values: ProductEditorValues): EditorErrors {
  const errors: EditorErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  }

  if (!values.slug.trim()) {
    errors.slug = "Slug is required";
  }

  if (!values.category.trim()) {
    errors.category = "Category is required";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required";
  }

  if (!values.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required";
  } else if (!isValidUrl(values.imageUrl.trim())) {
    errors.imageUrl = "This is not a valid URL";
  }

  if (!Number.isInteger(values.price) || values.price <= 0) {
    errors.price = "Price must be a positive whole number";
  }

  if (!Number.isInteger(values.stock) || values.stock < 0) {
    errors.stock = "Stock must be zero or more";
  }

  return errors;
}

export function ProductEditorForm({
  initialValues,
  productId,
}: {
  initialValues?: Partial<ProductEditorValues>;
  productId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductEditorValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<EditorErrors>({});
  const [showErrorUi, setShowErrorUi] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function updateValue<K extends keyof ProductEditorValues>(
    key: K,
    nextValue: ProductEditorValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: nextValue,
    }));
  }

  function handleNameChange(nextName: string) {
    setValues((current) => ({
      ...current,
      name: nextName,
      slug: current.slug ? current.slug : slugify(nextName),
    }));
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      ...values,
      name: values.name.trim(),
      slug: slugify(values.slug),
      category: values.category.trim(),
      description: values.description.trim(),
      imageUrl: values.imageUrl.trim(),
    };
    const nextErrors = validate(payload);

    setErrors(nextErrors);
    setShowErrorUi(Object.keys(nextErrors).length > 0);

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage("");
      return;
    }

    const requestUrl = productId ? `/api/products/${productId}` : "/api/products";
    const requestMethod = productId ? "PUT" : "POST";

    void (async () => {
      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setSuccessMessage("");
        setShowErrorUi(true);
        return;
      }

      setSuccessMessage(productId ? "Product updated successfully" : "Product created successfully");
      router.refresh();
    })();
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
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          value={values.name}
          onChange={(event) => handleNameChange(event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          value={values.slug}
          onChange={(event) => updateValue("slug", event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.slug ? <p className="mt-1 text-sm text-red-600">{errors.slug}</p> : null}
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
        {errors.category ? <p className="mt-1 text-sm text-red-600">{errors.category}</p> : null}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Price
          </label>
          <input
            id="price"
            type="number"
            min="1"
            step="1"
            value={values.price}
            onChange={(event) => updateValue("price", Number(event.target.value))}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.price ? <p className="mt-1 text-sm text-red-600">{errors.price}</p> : null}
        </div>

        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={(event) => updateValue("stock", Number(event.target.value))}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.stock ? <p className="mt-1 text-sm text-red-600">{errors.stock}</p> : null}
        </div>
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
          alt="Product preview"
          className="mt-2 h-28 w-full rounded border border-slate-200 object-cover"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(event) => updateValue("featured", event.target.checked)}
          />
          Featured
        </label>

        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={values.active}
            onChange={(event) => updateValue("active", event.target.checked)}
          />
          Active
        </label>
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
