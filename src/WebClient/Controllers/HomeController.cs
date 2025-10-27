using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebClient.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    [Authorize]
    public IActionResult Secure()
    {
        return View();
    }

    public IActionResult Logout()
    {
        return SignOut("Cookies", "OpenIdConnect");
    }

    public IActionResult Error()
    {
        return View();
    }
}
