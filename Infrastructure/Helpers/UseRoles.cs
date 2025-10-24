namespace Infrastructure.Helpers;

public class UserRoles
{
    public const string Admin = "Admin";
    public const string Client = "Client";

    public const string PolicyClientOrAdmin = "Client,Admin";
    public const string PolicyOnlyAdmin = "Admin";
}
