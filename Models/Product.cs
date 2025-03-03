using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TequioDemoTrack.Models;
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Image { get; set; }
    public string Ingredients { get; set; }
    public int Pack { get; set; }
    [JsonIgnore]
    public ICollection<PurchaseProduct> PurchaseProducts { get; set; } = new List<PurchaseProduct>();
}


