﻿namespace TravelPlanner.Server.DTO
{
    public class ConfirmResetPasswordDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }

}