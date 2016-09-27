using System;
using Microsoft.AspNetCore.Mvc;

namespace TestTs.Controllers
{
    public class ProjectController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
