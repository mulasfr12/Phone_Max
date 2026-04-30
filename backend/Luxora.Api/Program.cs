using Luxora.Api.Data;
using Luxora.Api.Helpers;
using Luxora.Api.Middleware;
using Luxora.Api.Repositories;
using Luxora.Api.Repositories.Interfaces;
using Luxora.Api.Services;
using Luxora.Api.Services.Interfaces;
using Luxora.Api.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

const string ViteCorsPolicy = "ViteCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection(MongoDbSettings.SectionName));
builder.Services.Configure<AuthSettings>(
    builder.Configuration.GetSection(AuthSettings.SectionName));
builder.Services.Configure<FrontendSettings>(
    builder.Configuration.GetSection(FrontendSettings.SectionName));
builder.Services.Configure<LuxoraCookieSettings>(
    builder.Configuration.GetSection(LuxoraCookieSettings.SectionName));

builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<DatabaseSeeder>();
builder.Services.AddScoped<MongoIndexInitializer>();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICheckoutRequestRepository, CheckoutRequestRepository>();
builder.Services.AddScoped<IAdminUserRepository, AdminUserRepository>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICheckoutRequestService, CheckoutRequestService>();
builder.Services.AddScoped<IAdminAuthService, AdminAuthService>();
builder.Services.AddScoped<IPasswordHasher<Luxora.Api.Models.AdminUser>, PasswordHasher<Luxora.Api.Models.AdminUser>>();

builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        var authSettings = builder.Configuration
            .GetSection(AuthSettings.SectionName)
            .Get<AuthSettings>() ?? new AuthSettings();
        var cookieSettings = builder.Configuration
            .GetSection(LuxoraCookieSettings.SectionName)
            .Get<LuxoraCookieSettings>() ?? new LuxoraCookieSettings();

        options.Cookie.Name = authSettings.AdminCookieName;
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = CookieSettingsHelper.ParseSameSite(
            cookieSettings.SameSite);
        options.Cookie.SecurePolicy = CookieSettingsHelper.ParseSecurePolicy(
            cookieSettings.SecurePolicy);
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy(ViteCorsPolicy, policy =>
    {
        var frontendSettings = builder.Configuration
            .GetSection(FrontendSettings.SectionName)
            .Get<FrontendSettings>() ?? new FrontendSettings();

        policy
            .WithOrigins(frontendSettings.AllowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
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
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<AdminCsrfMiddleware>();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var indexInitializer = scope.ServiceProvider
        .GetRequiredService<MongoIndexInitializer>();
    await indexInitializer.InitializeAsync(CancellationToken.None);
}

app.Run();
