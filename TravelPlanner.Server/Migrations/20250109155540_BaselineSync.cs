﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class BaselineSync : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           // migrationBuilder.AddColumn<bool>(
           //     name: "IsEmailVerified",
           //     table: "Users",
           //     type: "bit",
           //     nullable: false,
           //     defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
           // migrationBuilder.DropColumn(
           //     name: "IsEmailVerified",
           //     table: "Users");
        }
    }
}