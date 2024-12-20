namespace TravelPlanner.Server.DTO
{
    using System.ComponentModel.DataAnnotations;

    public class FlightQueryParameters
    {
        [MaxLength(50)]
        public string? Airline { get; set; }

        [MaxLength(50)]
        public string? Origin { get; set; }

        [MaxLength(50)]
        public string? Destination { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Max price must be a positive number.")]
        public decimal? MaxPrice { get; set; }

        [Required]
        [RegularExpression("^(departureTime|arrivalTime|price)$", ErrorMessage = "Invalid sort field.")]
        public string SortBy { get; set; } = "departureTime";

        [Required]
        [RegularExpression("^(asc|desc)$", ErrorMessage = "Sort direction must be 'asc' or 'desc'.")]
        public string SortDirection { get; set; } = "asc";

        [Range(1, int.MaxValue, ErrorMessage = "Page number must be at least 1.")]
        public int Page { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100.")]
        public int PageSize { get; set; } = 5;
    }

}
