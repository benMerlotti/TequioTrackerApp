using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using TequioDemoTrack.Models;
using Microsoft.AspNetCore.Identity;
using Bogus;
using System.Collections.Generic;

namespace TequioDemoTrack.Data;




public class TequioDemoTrackDbContext : IdentityDbContext<IdentityUser>
{
    private readonly IConfiguration _configuration;
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Purchase> Purchases { get; set; }
    public DbSet<PurchaseProduct> PurchaseProducts { get; set; }
    public DbSet<AgeGroup> AgeGroups { get; set; }
    public DbSet<Gender> Genders { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Race> Races { get; set; }


    public TequioDemoTrackDbContext(DbContextOptions<TequioDemoTrackDbContext> context, IConfiguration config) : base(context)
    {
        _configuration = config;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Customer>()
     .Property(c => c.Id)
     .ValueGeneratedOnAdd(); // Enables auto-increment for the primary key

        // Repeat for other entities if needed
        modelBuilder.Entity<Purchase>()
            .Property(p => p.Id)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<PurchaseProduct>()
            .Property(pp => pp.Id)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
        {
            Id = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
            Name = "Admin",
            NormalizedName = "admin"
        });

        modelBuilder.Entity<IdentityUser>().HasData(
        new IdentityUser
        {
            Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            UserName = "Administrator",
            Email = "admina@strator.comx",
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, _configuration["AdminPassword"])
        },
        new IdentityUser
        {
            Id = "d7f5e876-91fe-4e0b-a2c9-e6a07500f50e",
            UserName = "SmithJordan",
            Email = "jordan@gmail.com",
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, _configuration["AdminPassword"])
        },
        new IdentityUser
        {
            Id = "f7b45b7d-3c74-4dfd-a8f9-20fe7b8cb062",
            UserName = "JohnsonTaylor",
            Email = "taylor@gmail.com",
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, _configuration["AdminPassword"])
        }

        );

        modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
        {
            RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
            UserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f"
        });
        modelBuilder.Entity<UserProfile>().HasData(
        new UserProfile
        {
            Id = 1,
            IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            FirstName = "Admina",
            LastName = "Strator",
            IsActive = true,
            Address = "101 Main Street",
        },
        new UserProfile
        {
            Id = 2,
            IdentityUserId = "d7f5e876-91fe-4e0b-a2c9-e6a07500f50e",
            FirstName = "Jordan",
            LastName = "Smith",
            Address = "202 Oak Avenue",
        },
        new UserProfile
        {
            Id = 3,
            IdentityUserId = "f7b45b7d-3c74-4dfd-a8f9-20fe7b8cb062",
            FirstName = "Taylor",
            LastName = "Johnson",
            Address = "303 Pine Street",
        }
    );


        modelBuilder.Entity<AgeGroup>().HasData(
        new AgeGroup { Id = 1, Group = "18-24" },
        new AgeGroup { Id = 2, Group = "25-34" },
        new AgeGroup { Id = 3, Group = "35-44" },
        new AgeGroup { Id = 4, Group = "45-54" },
        new AgeGroup { Id = 5, Group = "55-64" },
        new AgeGroup { Id = 6, Group = "65-74" }
    );

        // Seed data for Gender
        modelBuilder.Entity<Gender>().HasData(
            new Gender { Id = 1, GenderValue = "Male" },
            new Gender { Id = 2, GenderValue = "Female" },
            new Gender { Id = 3, GenderValue = "Non-binary" }
        );

        // Seed data for Race
        modelBuilder.Entity<Race>().HasData(
            new Race { Id = 1, RaceValue = "Asian" },
            new Race { Id = 2, RaceValue = "Black" },
            new Race { Id = 3, RaceValue = "White" },
            new Race { Id = 4, RaceValue = "Hispanic" }
        );

        // Seed data for Location
        modelBuilder.Entity<Location>().HasData(
     new Location { Id = 1, LocationValue = "Downtown LA" },
     new Location { Id = 2, LocationValue = "Hollywood" },
     new Location { Id = 3, LocationValue = "Beverly Hills" },
     new Location { Id = 4, LocationValue = "Santa Monica" },
     new Location { Id = 5, LocationValue = "Venice" },
     new Location { Id = 6, LocationValue = "Pasadena" },
     new Location { Id = 7, LocationValue = "Westwood" },
     new Location { Id = 8, LocationValue = "Silver Lake" },
     new Location { Id = 9, LocationValue = "Echo Park" },
     new Location { Id = 10, LocationValue = "Culver City" }
 );


        // Seed data for Product
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Sparkling Blanco", Pack = 8, Image = "/Blanco.png", Ingredients = "El Mexicano® Tequila Blanco (Certified Additive-Free, 100% De Agave), Sparkling Water, Natural Lime Flavor, Citric Acid", Price = 39.98m },
            new Product { Id = 2, Name = "Sparkling Blanco", Pack = 24, Image = "/Blanco.png", Ingredients = "El Mexicano® Tequila Blanco (Certified Additive-Free, 100% De Agave), Sparkling Water, Natural Lime Flavor, Citric Acid", Price = 119.94m },
            new Product { Id = 3, Name = "Sparkling Repasado", Pack = 8, Image = "/Repasado.png", Ingredients = "El Mexicano® Tequila Repasado (Certified Additive-Free, 100% De Agave), Sparkling Water, Natural Lime Flavor, Citric Acid", Price = 39.98m },
            new Product { Id = 4, Name = "Sparkling Repasado", Pack = 24, Image = "/Repasado.png", Ingredients = "El Mexicano® Tequila Repasado (Certified Additive-Free, 100% De Agave), Sparkling Water, Natural Lime Flavor, Citric Acid", Price = 119.94m }
  );
    }

    public void SeedDynamicData()
    {
        var dataGenerator = new DataGenerator();

        // Seed Customers
        if (!Customers.Any())
        {
            var fakeCustomers = dataGenerator.GenerateCustomers(1000);
            Customers.AddRange(fakeCustomers);
            SaveChanges(); // Ensure Customers are saved before proceeding
        }

        // Seed UserProfiles
        if (!UserProfiles.Any())
        {
            var userProfileFaker = new Faker<UserProfile>()
                .RuleFor(up => up.FirstName, f => f.Name.FirstName())
                .RuleFor(up => up.LastName, f => f.Name.LastName())
                .RuleFor(up => up.Address, f => f.Address.FullAddress());

            UserProfiles.AddRange(userProfileFaker.Generate(100));
            SaveChanges(); // Ensure UserProfiles are saved before proceeding
        }

        // Seed Purchases
        if (!Purchases.Any())
        {
            var existingCustomers = Customers.ToList();
            var existingUserProfiles = UserProfiles.ToList();

            if (!existingCustomers.Any() || !existingUserProfiles.Any())
            {
                Console.WriteLine("Error: Customers or UserProfiles list is empty.");
                return;
            }

            var fakePurchases = dataGenerator.GeneratePurchases(100, 5, existingCustomers, existingUserProfiles);
            Purchases.AddRange(fakePurchases);

            var fakePurchaseProducts = fakePurchases.SelectMany(p => p.PurchaseProducts).ToList();
            PurchaseProducts.AddRange(fakePurchaseProducts);
        }

        SaveChanges();
    }


}

public class DataGenerator
{
    public List<Customer> GenerateCustomers(int numberOfCustomers)
    {
        var faker = new Faker<Customer>()
        .RuleFor(c => c.Name, f => f.Name.FullName())
        .RuleFor(c => c.Email, f => f.Internet.Email())
        .RuleFor(c => c.Address, f => f.Address.FullAddress())
        .RuleFor(c => c.AgeGroupId, f => f.Random.Int(1, 6))
        .RuleFor(c => c.GenderId, f => f.Random.Int(1, 3)) // Consistent with others
        .RuleFor(c => c.RaceId, f => f.Random.Int(1, 4))
        .RuleFor(c => c.LocationId, f => f.Random.Int(1, 10));


        return faker.Generate(numberOfCustomers);
    }

    public List<Purchase> GeneratePurchases(int numberOfPurchases, int maxProductsPerPurchase, List<Customer> existingCustomers, List<UserProfile> existingUserProfiles)
    {

        // Generate fake Purchases
        var fakerPurchase = new Faker<Purchase>()
            .RuleFor(p => p.PurchaseDate, f => f.Date.Past(1)) // Purchase date within the past year
            .RuleFor(p => p.CustomerId, f => f.PickRandom(existingCustomers).Id) // Select CustomerId from existing customers
            .RuleFor(p => p.Customer, f => f.PickRandom(existingCustomers)) // Select Customer object
            .RuleFor(p => p.UserProfileId, f => f.PickRandom(existingUserProfiles).Id) // Select UserProfileId from existing profiles
            .RuleFor(p => p.UserProfile, f => f.PickRandom(existingUserProfiles)); // Select UserProfile object

        var purchases = fakerPurchase.Generate(numberOfPurchases);

        // Generate PurchaseProducts for each Purchase
        foreach (var purchase in purchases)
        {
            var fakerPurchaseProduct = new Faker<PurchaseProduct>()
                .RuleFor(pp => pp.PurchaseId, f => purchase.Id) // Link to Purchase
                .RuleFor(pp => pp.Purchase, f => purchase) // Set Purchase object
                .RuleFor(pp => pp.ProductId, f => f.Random.Int(1, 4)) // Random ProductId between 1 and 4
                .RuleFor(pp => pp.Quantity, f => f.Random.Int(1, 10)); // Random quantity

            purchase.PurchaseProducts = fakerPurchaseProduct.Generate(new Faker().Random.Int(1, maxProductsPerPurchase)).ToList();
        }

        return purchases;
    }

}