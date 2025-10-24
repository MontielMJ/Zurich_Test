using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ZurichDbContext _context;
        public AuthRepository(ZurichDbContext context)
        {
            this._context = context;            
        }
        public async Task<Users> Login(string username, string password)
        {   
           var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.User == username && u.Password == password);           
            return user;
        }
    }
}
