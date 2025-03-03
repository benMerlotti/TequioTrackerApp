namespace TequioDemoTrack.Models.DTOs;

public class PurchaseDTO
{
    public int Id { get; set; }
    public DateTime PurchaseDate { get; set; }
    public int CustomerId { get; set; }
    public CustomerDTO Customer { get; set; } = null!;
    public int UserProfileId { get; set; }
    public UserProfileDTO UserProfile { get; set; }

    public ICollection<PurchaseProductDTO> PurchaseProducts { get; set; } = new List<PurchaseProductDTO>();

    public decimal TotalPrice => PurchaseProducts.Sum(pp => pp.Product.Price * pp.Quantity);
}

public class CreatePurchaseDTO
{
    public int CustomerId { get; set; }
    public int EmployeeId { get; set; }
    public int UserProfileId { get; set; }
    public ICollection<CreatePurchaseProductDTO> PurchaseProducts { get; set; } = new List<CreatePurchaseProductDTO>();
}


