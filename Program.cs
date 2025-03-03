using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using TequioDemoTrack.Data;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//Configure AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.Name = "TequioDemoTrackLoginCookie";
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Cookie.HttpOnly = true; //The cookie cannot be accessed through JS (protects against XSS)
        options.Cookie.MaxAge = new TimeSpan(7, 0, 0, 0); // cookie expires in a week regardless of activity
        options.SlidingExpiration = true; // extend the cookie lifetime with activity up to 7 days.
        options.ExpireTimeSpan = new TimeSpan(24, 0, 0); // Cookie will expire in 24 hours without activity
        options.Events.OnRedirectToLogin = (context) =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = (context) =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });

builder.Services.AddIdentityCore<IdentityUser>(config =>
            {
                //for demonstration only - change these for other projects
                config.Password.RequireDigit = false;
                config.Password.RequiredLength = 8;
                config.Password.RequireLowercase = false;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequireUppercase = false;
                config.User.RequireUniqueEmail = true;
            })
    .AddRoles<IdentityRole>()  //add the role service.  
    .AddEntityFrameworkStores<TequioDemoTrackDbContext>();

// allows passing datetimes without time zone data 
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// allows our api endpoints to access the database through Entity Framework Core
builder.Services.AddNpgsql<TequioDemoTrackDbContext>(builder.Configuration["TequioDemoTrackDbConnectionString"]);


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TequioDemoTrackDbContext>();

    // Apply migrations
    dbContext.Database.Migrate();

    Console.WriteLine("Starting data seeding...");
    try
    {
        dbContext.SeedDynamicData();
        Console.WriteLine("Data seeding completed.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Data seeding failed: {ex.Message}");
    }
}



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// these two calls are required to add auth to the pipeline for a request
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
