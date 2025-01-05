namespace TravelPlanner.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string ResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public string VerificationToken { get; set; }
        public DateTime? VerificationTokenExpires { get; set; }
    }

}
