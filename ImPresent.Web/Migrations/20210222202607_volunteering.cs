using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace impresent.Migrations
{
    public partial class volunteering : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Volunteerings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: true),
                    PresenceDayId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Volunteerings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Volunteerings_PresenceDay_PresenceDayId",
                        column: x => x.PresenceDayId,
                        principalTable: "PresenceDay",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Volunteerings_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Volunteerings_PresenceDayId",
                table: "Volunteerings",
                column: "PresenceDayId");

            migrationBuilder.CreateIndex(
                name: "IX_Volunteerings_StudentId",
                table: "Volunteerings",
                column: "StudentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Volunteerings");
        }
    }
}
