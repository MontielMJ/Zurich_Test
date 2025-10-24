using Application.Handler;
using Domain.Entities;
using Domain.Entities.Dtos;
using Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Zurich_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtService _jwtService;
        private readonly AuthHandler _authHandler;
        public AuthController(IJwtService jwtService, AuthHandler authHandler)
        {
            _jwtService = jwtService;
            _authHandler = authHandler;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            Users user = await _authHandler.Login(request.Username, request.Password);

            if (user != null)
            {
                var token = _jwtService.GenerateToken(user.User, user.Role.Rol);
                return Ok(new { Token = token });
            }

            return Unauthorized(new { Message = "Credenciales inválidas" });
        }
    }
}
