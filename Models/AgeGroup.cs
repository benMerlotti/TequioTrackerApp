namespace TequioDemoTrack.Models;
public class AgeGroup
{
    public int Id { get; set; }
    public string Group { get; set; } = string.Empty;
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
