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
        public AuthController(IJwtService jwtService)
        {
            _jwtService = jwtService;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request.Username == "cmontiel" && request.Password == "123456")
            {
                var token = _jwtService.GenerateToken(request.Username, "Client");
                return Ok(new { Token = token });
            }

            return Unauthorized(new { Message = "Credenciales inválidas" });
        }
    }
}
