
using Microsoft.AspNetCore.Mvc;
using WatchlistWeb.Dto;
using WatchlistWeb.Interfaces;
using WatchlistWeb.Models;
using WatchlistWeb.Helper;

namespace WatchlistWeb.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UserControler : Controller
    {
        private readonly IUserRepository _userRepository;

        public UserControler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public ActionResult GetUser(string name) 
        {
            var user =_userRepository.GetUserByName(name);
            if (user == null)
            {
                BadRequest(ModelState);
            }
            return Ok(user);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult AddUser([FromBody] UserRegisterDto userRegisterDto)
        {
            if (userRegisterDto == null)
            {
                return BadRequest(ModelState);
            }

            if (_userRepository.GetUsers().FirstOrDefault(u => u.Name.ToLower() == userRegisterDto.Name.ToLower()) != null)
            {
                ModelState.AddModelError("message", "Username already taken!");
                return BadRequest(ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User user = new User
            {
                Id = userRegisterDto.Id,
                Name = userRegisterDto.Name,
                Password = HashClass.GetHash(userRegisterDto.Password),
                ApiKey = 0,
                LoggedIn = false
            };
            if (!_userRepository.AddUser(user))
            {
                ModelState.AddModelError("message", "Something went wrong while saving a user!");
                return BadRequest(ModelState);
            }
            return Ok();
        }
        [HttpPut("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Login([FromBody] UserLoginDto userLogin)
        {
            if(userLogin.Name == null || userLogin.Password == null)
            {
                return BadRequest(ModelState);
            }

            var user = _userRepository.CheckLogin(userLogin.Name, HashClass.GetHash(userLogin.Password));

            if(user == null)
            {
                ModelState.AddModelError("message", "Wrong username or password!");
                return BadRequest(ModelState);
            }
            if(user.LoggedIn)
            {
                ModelState.AddModelError("message", "Allready logged in!");
                return BadRequest(ModelState);
            }
            user.ApiKey = user.Name.GetHashCode();
            user.LoggedIn = true;

            if (!_userRepository.Login(user))
            {
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(user.ApiKey);
        }
        [HttpDelete]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteUser([FromQuery] int id)
        {
            if (!_userRepository.UserExists(id))
            {
                return NotFound();
            }

            var userToDelete = _userRepository.GetUser(id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!_userRepository.DeleteUser(userToDelete))
            {
                ModelState.AddModelError("message", "Something went wrong!");
                return BadRequest(ModelState);
            }

            return NoContent();
        }

        [HttpPut("logout")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult LogOut([FromQuery] string name, [FromQuery] int apiKey)
        {

            var user = _userRepository.GetUserByApiKey(name,apiKey);

            if(user == null)
            {
                return BadRequest(ModelState);
            }
            user.LoggedIn = false;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!_userRepository.LogOut(user))
            {
                ModelState.AddModelError("message", "Something went wrong!");
                return BadRequest(ModelState);
            }

            return NoContent();

        }
    }
}
