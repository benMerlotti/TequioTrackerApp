namespace TequioDemoTrack.Models;
public class PurchaseProduct
{
    public int Id { get; set; }
    public int PurchaseId { get; set; }
    public Purchase Purchase { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }
}
