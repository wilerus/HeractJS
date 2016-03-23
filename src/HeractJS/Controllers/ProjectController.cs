using System;
using Microsoft.AspNet.Mvc;

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
