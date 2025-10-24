using Domain.Entities;

namespace Domain.Interfaces;
public interface IAuthRepository
{
    Task<Users> Login(string username, string password);
    
}
