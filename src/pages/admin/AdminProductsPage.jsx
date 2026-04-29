import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ApiError } from '../../api/apiClient.js';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from '../../api/adminProductsApi.js';
import { normalizeProducts } from '../../api/productMappers.js';
import AdminShell from '../../components/admin/AdminShell.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { products as localProducts } from '../../data/products.js';
import { formatPrice } from '../../utils/money.js';

const emptyProductForm = {
  name: '',
  categoryId: '',
  categoryName: '',
  finish: '',
  spec: '',
  shortDescription: '',
  featuresText: '',
  priceCents: '',
  currency: 'USD',
  inStock: true,
  stockStatus: 'in_stock',
  visual: 'phone',
  tone: 'from-zinc-950 via-zinc-800 to-slate-300',
};

const inputClassName =
  'mt-2 min-h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-500 focus:bg-white';

const productColumns = [
  {
    key: 'name',
    label: 'Product',
    render: (product) => (
      <div>
        <p className="font-semibold text-zinc-950">{product.name}</p>
        <p className="mt-1 text-xs text-zinc-500">{product.finish}</p>
      </div>
    ),
  },
  { key: 'category', label: 'Category' },
  {
    key: 'priceCents',
    label: 'Price',
    render: (product) => formatPrice(product.priceCents, product.currency),
  },
  {
    key: 'stockStatus',
    label: 'Stock status',
    render: (product) => formatAdminLabel(product.stockStatus || 'in_stock'),
  },
  {
    key: 'inStock',
    label: 'Available',
    render: (product) => (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          product.inStock
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-amber-50 text-amber-700'
        }`}
      >
        {product.inStock ? 'In stock' : 'Unavailable'}
      </span>
    ),
  },
  {
    key: 'updatedAt',
    label: 'Updated',
    render: (product) => formatDate(product.updatedAt),
  },
];

function formatAdminLabel(value) {
  return String(value || '').replaceAll('_', ' ');
}

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : 'Not updated';
}

function productToForm(product) {
  return {
    name: product.name,
    categoryId: product.categoryId || product.category?.toLowerCase() || '',
    categoryName: product.categoryName || product.category || '',
    finish: product.finish || '',
    spec: product.spec || '',
    shortDescription: product.shortDescription || '',
    featuresText: (product.features || []).join('\n'),
    priceCents: String(product.priceCents || ''),
    currency: product.currency || 'USD',
    inStock: Boolean(product.inStock),
    stockStatus: product.stockStatus || 'in_stock',
    visual: product.visual || 'phone',
    tone: product.tone || emptyProductForm.tone,
  };
}

function formToPayload(formData) {
  return {
    name: formData.name.trim(),
    categoryId: formData.categoryId.trim(),
    categoryName: formData.categoryName.trim(),
    finish: formData.finish.trim(),
    spec: formData.spec.trim(),
    shortDescription: formData.shortDescription.trim(),
    features: formData.featuresText
      .split(/\n|,/)
      .map((feature) => feature.trim())
      .filter(Boolean),
    priceCents: Number(formData.priceCents),
    currency: formData.currency.trim().toUpperCase(),
    inStock: formData.inStock,
    stockStatus: formData.stockStatus,
    visual: formData.visual.trim(),
    tone: formData.tone.trim(),
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({
    isLoading: true,
    isPreview: false,
    error: null,
    actionMessage: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProductForm);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      setStatus({
        isLoading: true,
        isPreview: false,
        error: null,
        actionMessage: null,
      });

      try {
        const apiProducts = await getAdminProducts();

        if (!isActive) {
          return;
        }

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

        setProducts(localProducts);
        setStatus({
          isLoading: false,
          isPreview: !(error instanceof ApiError),
          error:
            error.message ||
            'The backend catalog is unavailable, so local preview data is shown.',
          actionMessage: null,
        });
      }
    }

    loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

  function handleChange(event) {
    const { checked, name, type, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function resetForm() {
    setEditingProduct(null);
    setFormData(emptyProductForm);
  }

  function startEdit(product) {
    setEditingProduct(product);
    setFormData(productToForm(product));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = formToPayload(formData);

    setStatus((currentStatus) => ({
      ...currentStatus,
      actionMessage: editingProduct ? 'Updating product...' : 'Creating product...',
    }));

    try {
      const savedProduct = editingProduct
        ? await updateAdminProduct(editingProduct.id, payload)
        : await createAdminProduct(payload);
      const normalizedProduct = normalizeProducts([savedProduct])[0];

      setProducts((currentProducts) => {
        if (editingProduct) {
          return currentProducts.map((product) =>
            product.id === normalizedProduct.id ? normalizedProduct : product,
          );
        }

        return [...currentProducts, normalizedProduct];
      });
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: editingProduct
          ? 'Product updated.'
          : 'Product created.',
      }));
      resetForm();
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: error.message || 'Product action failed.',
      }));
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    setStatus((currentStatus) => ({
      ...currentStatus,
      actionMessage: `Deleting ${product.name}...`,
    }));

    try {
      await deleteAdminProduct(product.id);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id),
      );
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: `${product.name} deleted.`,
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: error.message || `Could not delete ${product.name}.`,
      }));
    }
  }

  return (
    <AdminShell
      eyebrow="Catalog"
      title="Product management."
      description="Manage backend catalog products when the API is running, with local preview data as a development fallback."
    >
      <AdminNotice status={status} />

      <ProductForm
        disabled={status.isPreview}
        editingProduct={editingProduct}
        formData={formData}
        onCancel={resetForm}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <div className="mt-6">
        <AdminTable
          label="Admin product catalog"
          columns={productColumns}
          rows={sortedProducts}
          renderActions={(product) => (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={status.isPreview}
                onClick={() => startEdit(product)}
                aria-label={`Edit ${product.name}`}
                className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Edit
              </button>
              <Link
                to={`/products/${product.id}`}
                aria-label={`Preview ${product.name}`}
                className="rounded-full bg-zinc-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
              >
                Preview
              </Link>
              <button
                type="button"
                disabled={status.isPreview}
                onClick={() => handleDelete(product)}
                aria-label={`Delete ${product.name}`}
                className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Delete
              </button>
            </div>
          )}
        />
      </div>

      {!status.isLoading && sortedProducts.length === 0 && (
        <EmptyState label="No products found." />
      )}
    </AdminShell>
  );
}

function AdminNotice({ status }) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 shadow-sm shadow-zinc-950/5">
        Admin catalog endpoints are connected for local development, but they
        are still unprotected and not production-ready until auth is added.
      </div>
      {status.isLoading && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-600 shadow-sm shadow-zinc-950/5">
          Loading products...
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
          <p className="font-semibold">Could not load backend products.</p>
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

function ProductForm({
  disabled,
  editingProduct,
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
            {editingProduct ? 'Edit product' : 'Create product'}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Feature text can be separated by commas or new lines.
          </p>
        </div>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="w-fit rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TextField label="Name" name="name" value={formData.name} onChange={onChange} disabled={disabled} required />
        <TextField label="Category ID" name="categoryId" value={formData.categoryId} onChange={onChange} disabled={disabled} required />
        <TextField label="Category name" name="categoryName" value={formData.categoryName} onChange={onChange} disabled={disabled} required />
        <TextField label="Finish" name="finish" value={formData.finish} onChange={onChange} disabled={disabled} />
        <TextField label="Spec" name="spec" value={formData.spec} onChange={onChange} disabled={disabled} />
        <TextField label="Price cents" name="priceCents" type="number" value={formData.priceCents} onChange={onChange} disabled={disabled} required />
        <TextField label="Currency" name="currency" value={formData.currency} onChange={onChange} disabled={disabled} required />
        <TextField label="Visual" name="visual" value={formData.visual} onChange={onChange} disabled={disabled} />
        <TextField label="Tone" name="tone" value={formData.tone} onChange={onChange} disabled={disabled} />
        <label className="text-sm font-semibold text-zinc-800">
          Stock status
          <select
            name="stockStatus"
            value={formData.stockStatus}
            onChange={onChange}
            disabled={disabled}
            className={inputClassName}
          >
            <option value="in_stock">in stock</option>
            <option value="low_stock">low stock</option>
            <option value="waitlist">waitlist</option>
            <option value="out_of_stock">out of stock</option>
          </select>
        </label>
        <label className="flex items-center gap-3 pt-8 text-sm font-semibold text-zinc-800">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={onChange}
            disabled={disabled}
            className="h-4 w-4 rounded border-zinc-300"
          />
          In stock
        </label>
      </div>

      <label className="mt-4 block text-sm font-semibold text-zinc-800">
        Short description
        <textarea
          name="shortDescription"
          rows="3"
          value={formData.shortDescription}
          onChange={onChange}
          disabled={disabled}
          className={`${inputClassName} resize-none py-3`}
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-zinc-800">
        Features
        <textarea
          name="featuresText"
          rows="4"
          value={formData.featuresText}
          onChange={onChange}
          disabled={disabled}
          className={`${inputClassName} resize-none py-3`}
        />
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="mt-5 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
      >
        {editingProduct ? 'Update product' : 'Create product'}
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

function EmptyState({ label }) {
  return (
    <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600 shadow-sm shadow-zinc-950/5">
      {label}
    </div>
  );
}
