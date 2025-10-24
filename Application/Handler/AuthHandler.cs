using Domain.Entities;
using Domain.Interfaces;

namespace Application.Handler
{
    public class AuthHandler
    {
        private readonly IAuthRepository _authorization;
        public AuthHandler(IAuthRepository authorization)
        {
            this._authorization = authorization;
        }

        public async Task<Users> Login(string username, string password)
        {
            Users user = await _authorization.Login(username, password);
            return user;
        }
    }
}
