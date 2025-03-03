namespace TequioDemoTrack.Models.DTOs;
public class PurchaseProductDTO
{
    public int Id { get; set; }
    public int PurchaseId { get; set; }
    public PurchaseDTO Purchase { get; set; } = null!;
    public int ProductId { get; set; }
    public ProductDTO Product { get; set; } = null!;
    public int Quantity { get; set; }
}

public class CreatePurchaseProductDTO
{
    public int Id { get; set; }
    public int PurchaseId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class UpdatePurchaseProductDTO
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}