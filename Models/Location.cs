namespace TequioDemoTrack.Models;
public class Location
{
    public int Id { get; set; }
    public string LocationValue { get; set; } = string.Empty;
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
