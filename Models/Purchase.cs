using System.Text.Json.Serialization;

namespace TequioDemoTrack.Models;
public class Purchase
{
    public int Id { get; set; }
    public DateTime PurchaseDate { get; set; }
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }

    public ICollection<PurchaseProduct> PurchaseProducts { get; set; } = new List<PurchaseProduct>();

    public decimal TotalPrice => PurchaseProducts
    .Where(pp => pp != null && pp.Product != null) // Filter out null values
    .Sum(pp => pp.Product.Price * pp.Quantity);

}


