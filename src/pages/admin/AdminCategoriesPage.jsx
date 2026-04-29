import { useEffect, useMemo, useState } from 'react';

import { ApiError } from '../../api/apiClient.js';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../api/adminCategoriesApi.js';
import { getAdminProducts } from '../../api/adminProductsApi.js';
import { normalizeCategories, normalizeProducts } from '../../api/productMappers.js';
import AdminShell from '../../components/admin/AdminShell.jsx';
import { categories as localCategories } from '../../data/homeData.js';
import { products as localProducts } from '../../data/products.js';

const emptyCategoryForm = {
  name: '',
  description: '',
  sortOrder: '0',
};

const toneByCategory = {
  phones: 'from-zinc-950 via-zinc-800 to-stone-500',
  cases: 'from-stone-900 via-neutral-700 to-zinc-300',
  charging: 'from-neutral-950 via-slate-800 to-cyan-300',
  audio: 'from-zinc-950 via-indigo-950 to-zinc-400',
  wearables: 'from-neutral-950 via-stone-800 to-amber-200',
  accessories: 'from-zinc-950 via-neutral-800 to-emerald-200',
};

const inputClassName =
  'mt-2 min-h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-500 focus:bg-white';

function categoryToForm(category) {
  return {
    name: category.name,
    description: category.description || '',
    sortOrder: String(category.sortOrder ?? 0),
  };
}

function formToPayload(formData) {
  return {
    name: formData.name.trim(),
    description: formData.description.trim(),
    sortOrder: Number(formData.sortOrder),
  };
}

function getCategoryTone(category) {
  return category.tone || toneByCategory[category.id] || toneByCategory.accessories;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({
    isLoading: true,
    isPreview: false,
    error: null,
    actionMessage: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(emptyCategoryForm);

  useEffect(() => {
    let isActive = true;

    async function loadCategories() {
      setStatus({
        isLoading: true,
        isPreview: false,
        error: null,
        actionMessage: null,
      });

      try {
        const [apiCategories, apiProducts] = await Promise.all([
          getAdminCategories(),
          getAdminProducts(),
        ]);

        if (!isActive) {
          return;
        }

        setCategories(normalizeCategories(apiCategories));
        setProducts(normalizeProducts(apiProducts));
        setStatus({
          isLoading: false,
          isPreview: false,
          error: null,
          actionMessage: null,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setCategories(localCategories);
        setProducts(localProducts);
        setStatus({
          isLoading: false,
          isPreview: !(error instanceof ApiError),
          error:
            error.message ||
            'The backend categories endpoint is unavailable, so local preview data is shown.',
          actionMessage: null,
        });
      }
    }

    loadCategories();

    return () => {
      isActive = false;
    };
  }, []);

  const sortedCategories = useMemo(
    () =>
      [...categories].sort(
        (firstCategory, secondCategory) =>
          (firstCategory.sortOrder ?? 0) - (secondCategory.sortOrder ?? 0) ||
          firstCategory.name.localeCompare(secondCategory.name),
      ),
    [categories],
  );

  function getProductCount(category) {
    return products.filter((product) => {
      return (
        product.categoryId === category.id ||
        product.category?.toLowerCase() === category.name.toLowerCase() ||
        product.categoryName?.toLowerCase() === category.name.toLowerCase()
      );
    }).length;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function resetForm() {
    setEditingCategory(null);
    setFormData(emptyCategoryForm);
  }

  function startEdit(category) {
    setEditingCategory(category);
    setFormData(categoryToForm(category));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = formToPayload(formData);

    setStatus((currentStatus) => ({
      ...currentStatus,
      actionMessage: editingCategory
        ? 'Updating category...'
        : 'Creating category...',
    }));

    try {
      const savedCategory = editingCategory
        ? await updateAdminCategory(editingCategory.id, payload)
        : await createAdminCategory(payload);
      const normalizedCategory = normalizeCategories([savedCategory])[0];

      setCategories((currentCategories) => {
        if (editingCategory) {
          return currentCategories.map((category) =>
            category.id === normalizedCategory.id ? normalizedCategory : category,
          );
        }

        return [...currentCategories, normalizedCategory];
      });
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: editingCategory
          ? 'Category updated.'
          : 'Category created.',
      }));
      resetForm();
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: error.message || 'Category action failed.',
      }));
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Delete ${category.name}?`)) {
      return;
    }

    setStatus((currentStatus) => ({
      ...currentStatus,
      actionMessage: `Deleting ${category.name}...`,
    }));

    try {
      await deleteAdminCategory(category.id);
      setCategories((currentCategories) =>
        currentCategories.filter((item) => item.id !== category.id),
      );
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: `${category.name} deleted.`,
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: error.message || `Could not delete ${category.name}.`,
      }));
    }
  }

  return (
    <AdminShell
      eyebrow="Merchandising"
      title="Category structure."
      description="Manage backend category groups when the API is running, with local preview data as a development fallback."
    >
      <AdminNotice status={status} />

      <CategoryForm
        disabled={status.isPreview}
        editingCategory={editingCategory}
        formData={formData}
        onCancel={resetForm}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sortedCategories.map((category) => (
          <article
            key={category.id}
            className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm shadow-zinc-950/5"
          >
            <div className={`h-20 bg-gradient-to-br ${getCategoryTone(category)}`} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-950">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Sort {category.sortOrder ?? 0}
                  </p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                  {getProductCount(category)} products
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {category.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={status.isPreview}
                  onClick={() => startEdit(category)}
                  className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={status.isPreview}
                  onClick={() => handleDelete(category)}
                  className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-500 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!status.isLoading && sortedCategories.length === 0 && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600 shadow-sm shadow-zinc-950/5">
          No categories found.
        </div>
      )}
    </AdminShell>
  );
}

function AdminNotice({ status }) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 shadow-sm shadow-zinc-950/5">
        Admin category endpoints are connected for local development, but they
        are still unprotected and not production-ready until auth is added.
      </div>
      {status.isLoading && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-600 shadow-sm shadow-zinc-950/5">
          Loading categories...
        </div>
      )}
      {!status.isLoading && status.isPreview && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          <p className="font-semibold">Using local preview data.</p>
          <p className="mt-1">{status.error}</p>
          <p className="mt-1">Create, edit, and delete actions are disabled.</p>
        </div>
      )}
      {!status.isLoading && status.error && !status.isPreview && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800">
          <p className="font-semibold">Could not load backend categories.</p>
          <p className="mt-1">{status.error}</p>
        </div>
      )}
      {status.actionMessage && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          {status.actionMessage}
        </div>
      )}
    </>
  );
}

function CategoryForm({
  disabled,
  editingCategory,
  formData,
  onCancel,
  onChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 sm:p-5"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            {editingCategory ? 'Edit category' : 'Create category'}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            IDs are generated by the backend from the category name.
          </p>
        </div>
        {editingCategory && (
          <button
            type="button"
            onClick={onCancel}
            className="w-fit rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1fr_10rem]">
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          disabled={disabled}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={onChange}
          disabled={disabled}
          required
        />
        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          min="0"
          value={formData.sortOrder}
          onChange={onChange}
          disabled={disabled}
          required
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="mt-5 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
      >
        {editingCategory ? 'Update category' : 'Create category'}
      </button>
    </form>
  );
}

function TextField({ label, ...props }) {
  return (
    <label className="text-sm font-semibold text-zinc-800">
      {label}
      <input className={inputClassName} {...props} />
    </label>
  );
}
