import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ApiError } from '../../api/apiClient.js';
import {
  deleteProductImage,
  setPrimaryProductImage,
  uploadProductImage,
} from '../../api/adminProductImagesApi.js';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from '../../api/adminProductsApi.js';
import {
  normalizeProductImage,
  normalizeProducts,
} from '../../api/productMappers.js';
import AdminShell from '../../components/admin/AdminShell.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { products as localProducts } from '../../data/products.js';
import {
  adminSecurityTokenNotReadyMessage,
  getAdminMutationErrorMessage,
} from '../../utils/adminSecurity.js';
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

const emptyImageForm = {
  file: null,
  altText: '',
  setPrimary: false,
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
    key: 'createdAt',
    label: 'Created',
    render: (product) => formatDate(product.createdAt, 'Not recorded'),
  },
  {
    key: 'updatedAt',
    label: 'Updated',
    render: (product) => formatDate(product.updatedAt, 'Never updated'),
  },
];

function formatAdminLabel(value) {
  return String(value || '').replaceAll('_', ' ');
}

function formatDate(value, fallbackLabel) {
  return value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : fallbackLabel;
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
  const { csrfToken } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({
    isLoading: true,
    isPreview: false,
    error: null,
    actionMessage: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProductForm);
  const [activeImageProductId, setActiveImageProductId] = useState(null);
  const [imageForm, setImageForm] = useState(emptyImageForm);
  const [imageStatus, setImageStatus] = useState({
    isLoading: false,
    message: null,
  });

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
          isPreview: true,
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
  const isSecurityTokenReady = Boolean(csrfToken);
  const areMutationsDisabled = status.isPreview || !isSecurityTokenReady;

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

  function replaceProductImages(productId, images) {
    const normalizedImages = images.map(normalizeProductImage);
    const primaryImage =
      normalizedImages.find((image) => image.isPrimary) ||
      normalizedImages[0] ||
      null;
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              images: normalizedImages,
              primaryImage,
              primaryImageUrl: primaryImage?.url || null,
            }
          : product,
      ),
    );
  }

  function startEdit(product) {
    setEditingProduct(product);
    setFormData(productToForm(product));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!csrfToken) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: adminSecurityTokenNotReadyMessage,
      }));
      return;
    }

    const payload = formToPayload(formData);

    setStatus((currentStatus) => ({
      ...currentStatus,
      actionMessage: editingProduct ? 'Updating product...' : 'Creating product...',
    }));

    try {
      const savedProduct = editingProduct
        ? await updateAdminProduct(editingProduct.id, payload, csrfToken)
        : await createAdminProduct(payload, csrfToken);
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
        actionMessage: getAdminMutationErrorMessage(
          error,
          'Product action failed.',
        ),
      }));
    }
  }

  async function handleDelete(product) {
    if (!csrfToken) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: adminSecurityTokenNotReadyMessage,
      }));
      return;
    }

    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    setStatus((currentStatus) => ({
      ...currentStatus,
      actionMessage: `Deleting ${product.name}...`,
    }));

    try {
      await deleteAdminProduct(product.id, csrfToken);
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
        actionMessage: getAdminMutationErrorMessage(
          error,
          `Could not delete ${product.name}.`,
        ),
      }));
    }
  }

  function toggleImagePanel(productId) {
    setActiveImageProductId((currentProductId) =>
      currentProductId === productId ? null : productId,
    );
    setImageForm(emptyImageForm);
    setImageStatus({ isLoading: false, message: null });
  }

  function handleImageFormChange(event) {
    const { checked, files, name, type, value } = event.target;
    setImageForm((currentForm) => ({
      ...currentForm,
      [name]:
        type === 'file'
          ? files?.[0] || null
          : type === 'checkbox'
            ? checked
            : value,
    }));
    setImageStatus({ isLoading: false, message: null });
  }

  async function handleImageUpload(product) {
    if (!csrfToken) {
      setImageStatus({
        isLoading: false,
        message: adminSecurityTokenNotReadyMessage,
      });
      return;
    }

    if (!imageForm.file) {
      setImageStatus({
        isLoading: false,
        message: 'Choose an image file before uploading.',
      });
      return;
    }

    setImageStatus({ isLoading: true, message: 'Uploading image...' });

    try {
      const uploadedImage = await uploadProductImage(
        product.id,
        imageForm,
        csrfToken,
      );
      const productImages = product.images || [];
      const nextImages = imageForm.setPrimary || productImages.length === 0
        ? [
            ...productImages.map((image) => ({ ...image, isPrimary: false })),
            uploadedImage,
          ]
        : [...productImages, uploadedImage];

      replaceProductImages(product.id, nextImages);
      setImageForm(emptyImageForm);
      setImageStatus({ isLoading: false, message: 'Image uploaded.' });
    } catch (error) {
      setImageStatus({
        isLoading: false,
        message: getAdminMutationErrorMessage(error, 'Image upload failed.'),
      });
    }
  }

  async function handleSetPrimaryImage(product, imageId) {
    if (!csrfToken) {
      setImageStatus({
        isLoading: false,
        message: adminSecurityTokenNotReadyMessage,
      });
      return;
    }

    setImageStatus({ isLoading: true, message: 'Updating primary image...' });

    try {
      const images = await setPrimaryProductImage(product.id, imageId, csrfToken);
      replaceProductImages(product.id, images);
      setImageStatus({ isLoading: false, message: 'Primary image updated.' });
    } catch (error) {
      setImageStatus({
        isLoading: false,
        message: getAdminMutationErrorMessage(
          error,
          'Could not update primary image.',
        ),
      });
    }
  }

  async function handleDeleteImage(product, imageId) {
    if (!csrfToken) {
      setImageStatus({
        isLoading: false,
        message: adminSecurityTokenNotReadyMessage,
      });
      return;
    }

    if (!window.confirm('Delete this image?')) {
      return;
    }

    setImageStatus({ isLoading: true, message: 'Deleting image...' });

    try {
      await deleteProductImage(product.id, imageId, csrfToken);
      const remainingImages = (product.images || []).filter(
        (image) => image.id !== imageId,
      );
      if (
        remainingImages.length > 0 &&
        !remainingImages.some((image) => image.isPrimary)
      ) {
        remainingImages[0] = { ...remainingImages[0], isPrimary: true };
      }
      replaceProductImages(product.id, remainingImages);
      setImageStatus({ isLoading: false, message: 'Image deleted.' });
    } catch (error) {
      setImageStatus({
        isLoading: false,
        message: getAdminMutationErrorMessage(error, 'Could not delete image.'),
      });
    }
  }

  return (
    <AdminShell
      eyebrow="Catalog"
      title="Product management."
      description="Manage backend catalog products when the API is running, with local preview data as a development fallback."
    >
      <AdminNotice
        isSecurityTokenReady={isSecurityTokenReady}
        status={status}
      />

      <ProductForm
        disabled={areMutationsDisabled}
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
                disabled={areMutationsDisabled}
                onClick={() => startEdit(product)}
                aria-label={`Edit ${product.name}`}
                className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={areMutationsDisabled}
                onClick={() => toggleImagePanel(product.id)}
                aria-label={`Manage images for ${product.name}`}
                className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Images
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
                disabled={areMutationsDisabled}
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

      {activeImageProductId && (
        <ProductImageManager
          disabled={areMutationsDisabled}
          imageForm={imageForm}
          imageStatus={imageStatus}
          onChange={handleImageFormChange}
          onDeleteImage={handleDeleteImage}
          onSetPrimaryImage={handleSetPrimaryImage}
          onUpload={handleImageUpload}
          product={products.find((product) => product.id === activeImageProductId)}
        />
      )}

      {!status.isLoading && sortedProducts.length === 0 && (
        <EmptyState label="No products found." />
      )}
    </AdminShell>
  );
}

function AdminNotice({ isSecurityTokenReady, status }) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 shadow-sm shadow-zinc-950/5">
        Admin catalog endpoints are protected by admin auth and CSRF. Mutations
        stay disabled until the current security token is ready.
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
      {!status.isLoading && !status.isPreview && !isSecurityTokenReady && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          <p className="font-semibold">Admin security token is not ready.</p>
          <p className="mt-1">{adminSecurityTokenNotReadyMessage}</p>
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

function ProductImageManager({
  disabled,
  imageForm,
  imageStatus,
  onChange,
  onDeleteImage,
  onSetPrimaryImage,
  onUpload,
  product,
}) {
  if (!product) {
    return null;
  }

  const images = product.images || [];

  return (
    <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Images for {product.name}
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Upload local development images, set one primary image, or remove
            images from the catalog.
          </p>
        </div>
        <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
          {images.length} images
        </span>
      </div>

      {disabled && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          Image management requires backend API mode and a ready admin security
          token.
        </div>
      )}

      {imageStatus.message && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          {imageStatus.message}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((image) => (
          <article
            key={image.id}
            className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
          >
            <div className="aspect-[4/3] bg-zinc-200">
              <img
                src={image.url}
                alt={image.altText || `${product.name} product image`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                {image.isPrimary && (
                  <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">
                    Primary
                  </span>
                )}
                <span className="text-xs font-semibold text-zinc-500">
                  {Math.round((image.sizeBytes || 0) / 1024)} KB
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {image.altText || 'No alt text provided.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={disabled || image.isPrimary || imageStatus.isLoading}
                  onClick={() => onSetPrimaryImage(product, image.id)}
                  className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Set primary
                </button>
                <button
                  type="button"
                  disabled={disabled || imageStatus.isLoading}
                  onClick={() => onDeleteImage(product, image.id)}
                  className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-500 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {images.length === 0 && (
        <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
          No uploaded images yet. Storefront cards will keep using the CSS
          product visual fallback.
        </div>
      )}

      <div className="mt-5 grid gap-4 border-t border-zinc-100 pt-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="text-sm font-semibold text-zinc-800">
          Image file
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled || imageStatus.isLoading}
            onChange={onChange}
            className="mt-2 block w-full text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>
        <TextField
          label="Alt text"
          name="altText"
          value={imageForm.altText}
          onChange={onChange}
          disabled={disabled || imageStatus.isLoading}
        />
        <label className="flex items-center gap-3 text-sm font-semibold text-zinc-800">
          <input
            name="setPrimary"
            type="checkbox"
            checked={imageForm.setPrimary}
            onChange={onChange}
            disabled={disabled || imageStatus.isLoading}
            className="h-4 w-4 rounded border-zinc-300"
          />
          Set primary
        </label>
      </div>
      <button
        type="button"
        disabled={disabled || imageStatus.isLoading || !imageForm.file}
        onClick={() => onUpload(product)}
        className="mt-5 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
      >
        {imageStatus.isLoading ? 'Working...' : 'Upload image'}
      </button>
    </section>
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
