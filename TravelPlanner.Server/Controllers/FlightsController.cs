using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.Server.Data;
using TravelPlanner.Server.DTO;

namespace TravelPlanner.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FlightsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetFlights([FromQuery] FlightQueryParameters queryParams)
        {
            // Base query
            var query = _context.Flights.AsQueryable();

            // Filtering using EF.Functions.Like
            if (!string.IsNullOrEmpty(queryParams.Airline))
                query = query.Where(f => EF.Functions.Like(f.Airline, $"%{queryParams.Airline}%"));

            if (!string.IsNullOrEmpty(queryParams.Origin))
                query = query.Where(f => EF.Functions.Like(f.Origin, $"%{queryParams.Origin}%"));

            if (!string.IsNullOrEmpty(queryParams.Destination))
                query = query.Where(f => EF.Functions.Like(f.Destination, $"%{queryParams.Destination}%"));

            if (queryParams.MaxPrice.HasValue)
                query = query.Where(f => f.Price <= queryParams.MaxPrice.Value);

            // Sorting
            query = queryParams.SortBy.ToLower() switch
            {
                "price" => queryParams.SortDirection.ToLower() == "asc" ? query.OrderBy(f => f.Price) : query.OrderByDescending(f => f.Price),
                "departuretime" => queryParams.SortDirection.ToLower() == "asc" ? query.OrderBy(f => f.DepartureTime) : query.OrderByDescending(f => f.DepartureTime),
                "arrivaltime" => queryParams.SortDirection.ToLower() == "asc" ? query.OrderBy(f => f.ArrivalTime) : query.OrderByDescending(f => f.ArrivalTime),
                _ => query
            };

            // Pagination
            var totalItems = query.Count();
            var flights = query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize).ToList();

            // Response
            var response = new
            {
                TotalItems = totalItems,
                Page = queryParams.Page,
                PageSize = queryParams.PageSize,
                Flights = flights
            };

            return Ok(response);
        }
    }

}