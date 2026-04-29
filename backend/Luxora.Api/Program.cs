using Luxora.Api.Data;
using Luxora.Api.Repositories;
using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Settings;

const string ViteCorsPolicy = "ViteCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection(MongoDbSettings.SectionName));

builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<DatabaseSeeder>();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICheckoutRequestRepository, CheckoutRequestRepository>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICheckoutRequestService, CheckoutRequestService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(ViteCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(ViteCorsPolicy);
app.MapControllers();

app.Run();
