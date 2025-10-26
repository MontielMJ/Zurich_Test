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
        private readonly ILogger<AuthController> _logger;
        public AuthController(IJwtService jwtService, AuthHandler authHandler, ILogger<AuthController> logger)
        {
            _jwtService = jwtService;
            _authHandler = authHandler;
            _logger = logger;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            _logger.LogInformation("Intento de inicio de sesión para el usuario: {Username}", request.Username);
            Users user = await _authHandler.Login(request.Username, request.Password);

            if (user != null)
            {
                var token = _jwtService.GenerateToken(user.User, user.Role.Rol);
                _logger.LogInformation("Inicio de sesión exitoso para el usuario: {Username}", request.Username);
                return Ok(new { Token = token });
            }
            else
            {
                _logger.LogWarning("Fallo en el inicio de sesión para el usuario: {Username}", request.Username);
                return Unauthorized(new { Message = "Credenciales inválidas" });
            }
        }
    }
}
