using MongoDB.Bson.Serialization.Attributes;

namespace Luxora.Api.Models;

public sealed class AdminUser
{
    [BsonId]
    public string Id { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "Admin";

    public int FailedLoginAttempts { get; set; }

    public DateTime? LockoutUntil { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public DateTime? LastFailedLoginAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
