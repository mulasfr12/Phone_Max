using Luxora.Api.Models;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;

namespace Luxora.Api.Data;

public sealed class DatabaseSeeder
{
    private readonly MongoDbContext _context;
    private readonly IPasswordHasher<AdminUser> _passwordHasher;

    public DatabaseSeeder(
        MongoDbContext context,
        IPasswordHasher<AdminUser> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<SeedResult> SeedAsync(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var categoriesInserted = await SeedCategoriesAsync(now, cancellationToken);
        var productsInserted = await SeedProductsAsync(now, cancellationToken);
        var adminUsersInserted = await SeedDevelopmentAdminAsync(now, cancellationToken);

        return new SeedResult(
            categoriesInserted,
            productsInserted,
            adminUsersInserted);
    }

    private async Task<int> SeedDevelopmentAdminAsync(
        DateTime now,
        CancellationToken cancellationToken)
    {
        const string adminEmail = "admin@luxora.local";

        var adminExists = await _context.AdminUsers
            .Find(adminUser => adminUser.Email == adminEmail)
            .AnyAsync(cancellationToken);

        if (adminExists)
        {
            return 0;
        }

        var adminUser = new AdminUser
        {
            Id = "admin-luxora-local",
            FullName = "Luxora Admin",
            Email = adminEmail,
            Role = "Admin",
            CreatedAt = now
        };
        adminUser.PasswordHash = _passwordHasher.HashPassword(
            adminUser,
            "ChangeMe123!");

        await _context.AdminUsers.InsertOneAsync(
            adminUser,
            cancellationToken: cancellationToken);

        return 1;
    }

    private async Task<int> SeedCategoriesAsync(
        DateTime now,
        CancellationToken cancellationToken)
    {
        var categories = new List<Category>
        {
            new()
            {
                Id = "phones",
                Name = "Phones",
                Description = "Flagship devices, unlocked and ready.",
                SortOrder = 10,
                CreatedAt = now
            },
            new()
            {
                Id = "cases",
                Name = "Cases",
                Description = "Slim protection in refined finishes.",
                SortOrder = 20,
                CreatedAt = now
            },
            new()
            {
                Id = "charging",
                Name = "Charging",
                Description = "Fast power for desk, travel, and nightstand.",
                SortOrder = 30,
                CreatedAt = now
            },
            new()
            {
                Id = "audio",
                Name = "Audio",
                Description = "Wireless sound with a quieter profile.",
                SortOrder = 40,
                CreatedAt = now
            },
            new()
            {
                Id = "wearables",
                Name = "Wearables",
                Description = "Smart essentials for every day.",
                SortOrder = 50,
                CreatedAt = now
            },
            new()
            {
                Id = "accessories",
                Name = "Accessories",
                Description = "Cables, stands, lenses, and daily upgrades.",
                SortOrder = 60,
                CreatedAt = now
            }
        };

        return await InsertMissingAsync(
            _context.Categories,
            categories,
            category => category.Id,
            cancellationToken);
    }

    private async Task<int> SeedProductsAsync(
        DateTime now,
        CancellationToken cancellationToken)
    {
        var products = new List<Product>
        {
            new()
            {
                Id = "aura-x1",
                Name = "Aura X1 Pro",
                CategoryId = "phones",
                CategoryName = "Phones",
                Finish = "Graphite Titanium",
                Spec = "Titanium frame, 256GB, night lens system",
                ShortDescription = "A flagship phone tuned for low-light photography, daily speed, and a calmer premium feel.",
                Features =
                [
                    "6.7-inch adaptive OLED display",
                    "Night lens camera system",
                    "Titanium enclosure with ceramic shield",
                    "All-day battery with fast wireless charging"
                ],
                PriceCents = 119900,
                Currency = "USD",
                InStock = true,
                StockStatus = "in_stock",
                Visual = "phone",
                Tone = "from-zinc-950 via-zinc-800 to-slate-300",
                CreatedAt = now
            },
            new()
            {
                Id = "nova-fold",
                Name = "Nova Fold",
                CategoryId = "phones",
                CategoryName = "Phones",
                Finish = "Liquid Silver",
                Spec = "7.6-inch inner display, 512GB, hinge care",
                ShortDescription = "A refined foldable for multitasking, reading, and watching without carrying a tablet.",
                Features =
                [
                    "Expansive folding inner display",
                    "Polished hinge with care coverage",
                    "512GB storage for media and work",
                    "Dual-screen productivity modes"
                ],
                PriceCents = 164900,
                Currency = "USD",
                InStock = true,
                StockStatus = "low_stock",
                Visual = "fold",
                Tone = "from-neutral-950 via-slate-800 to-cyan-200",
                CreatedAt = now
            },
            new()
            {
                Id = "arc-buds",
                Name = "Arc Buds Studio",
                CategoryId = "audio",
                CategoryName = "Audio",
                Finish = "Soft Pearl",
                Spec = "Adaptive audio, low-latency mode, wireless case",
                ShortDescription = "Compact wireless audio with clean noise control and a soft-touch case.",
                Features =
                [
                    "Adaptive audio profile",
                    "Low-latency listening mode",
                    "Wireless charging case",
                    "Pressure-relief earbud design"
                ],
                PriceCents = 24900,
                Currency = "USD",
                InStock = true,
                StockStatus = "in_stock",
                Visual = "buds",
                Tone = "from-stone-900 via-zinc-700 to-stone-200",
                CreatedAt = now
            },
            new()
            {
                Id = "mag-dock",
                Name = "Mag Dock Duo",
                CategoryId = "charging",
                CategoryName = "Charging",
                Finish = "Midnight Steel",
                Spec = "15W phone charging, watch stand, woven cable",
                ShortDescription = "A compact desk and nightstand dock for phone, watch, and daily charging.",
                Features =
                [
                    "15W magnetic phone charging",
                    "Integrated watch stand",
                    "Weighted metal base",
                    "Braided USB-C cable included"
                ],
                PriceCents = 13900,
                Currency = "USD",
                InStock = true,
                StockStatus = "in_stock",
                Visual = "dock",
                Tone = "from-zinc-950 via-neutral-800 to-amber-200",
                CreatedAt = now
            },
            new()
            {
                Id = "veil-case",
                Name = "Veil Case",
                CategoryId = "cases",
                CategoryName = "Cases",
                Finish = "Smoked Quartz",
                Spec = "Slim shell, soft lining, camera lip",
                ShortDescription = "A restrained protective case with a satin exterior and precise camera coverage.",
                Features =
                [
                    "Slim impact-resistant shell",
                    "Microfiber interior lining",
                    "Raised camera and display edges",
                    "Magnetic accessory alignment"
                ],
                PriceCents = 6900,
                Currency = "USD",
                InStock = true,
                StockStatus = "in_stock",
                Visual = "case",
                Tone = "from-stone-950 via-zinc-800 to-zinc-300",
                CreatedAt = now
            },
            new()
            {
                Id = "loop-band",
                Name = "Loop Band",
                CategoryId = "wearables",
                CategoryName = "Wearables",
                Finish = "Platinum Weave",
                Spec = "Woven band, stainless clasp, all-day comfort",
                ShortDescription = "A refined wearable strap with a soft weave and polished clasp for daily wear.",
                Features =
                [
                    "Breathable woven textile",
                    "Stainless magnetic clasp",
                    "Low-profile daily fit",
                    "Compatible with modern smartwatches"
                ],
                PriceCents = 8900,
                Currency = "USD",
                InStock = false,
                StockStatus = "waitlist",
                Visual = "wearable",
                Tone = "from-neutral-950 via-stone-800 to-amber-200",
                CreatedAt = now
            },
            new()
            {
                Id = "lens-kit",
                Name = "Lux Lens Kit",
                CategoryId = "accessories",
                CategoryName = "Accessories",
                Finish = "Black Glass",
                Spec = "Macro and cinematic lens set, magnetic case",
                ShortDescription = "A compact mobile lens set for close detail, softer portraits, and travel video.",
                Features =
                [
                    "Magnetic macro lens",
                    "Cinematic diffusion lens",
                    "Slim carry case",
                    "Compatible with magnetic phone mounts"
                ],
                PriceCents = 12900,
                Currency = "USD",
                InStock = true,
                StockStatus = "in_stock",
                Visual = "accessory",
                Tone = "from-zinc-950 via-neutral-800 to-emerald-200",
                CreatedAt = now
            },
            new()
            {
                Id = "woven-cable",
                Name = "Woven USB-C Cable",
                CategoryId = "accessories",
                CategoryName = "Accessories",
                Finish = "Graphite Braid",
                Spec = "2m braided cable, 100W charging, aluminum ends",
                ShortDescription = "A durable daily cable with restrained detailing and fast charging support.",
                Features =
                [
                    "100W charging support",
                    "Two-meter braided jacket",
                    "Reinforced aluminum connectors",
                    "Travel tie included"
                ],
                PriceCents = 3900,
                Currency = "USD",
                InStock = true,
                StockStatus = "in_stock",
                Visual = "accessory",
                Tone = "from-zinc-950 via-neutral-800 to-emerald-200",
                CreatedAt = now
            }
        };

        return await InsertMissingAsync(
            _context.Products,
            products,
            product => product.Id,
            cancellationToken);
    }

    private static async Task<int> InsertMissingAsync<TDocument>(
        IMongoCollection<TDocument> collection,
        IReadOnlyCollection<TDocument> documents,
        Func<TDocument, string> getId,
        CancellationToken cancellationToken)
    {
        var ids = documents.Select(getId).ToList();
        var existingIds = await collection
            .Find(Builders<TDocument>.Filter.In("_id", ids))
            .Project(Builders<TDocument>.Projection.Include("_id"))
            .ToListAsync(cancellationToken);

        var existingIdSet = existingIds
            .Select(document => document["_id"].AsString)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var missingDocuments = documents
            .Where(document => !existingIdSet.Contains(getId(document)))
            .ToList();

        if (missingDocuments.Count == 0)
        {
            return 0;
        }

        await collection.InsertManyAsync(missingDocuments, cancellationToken: cancellationToken);
        return missingDocuments.Count;
    }
}
