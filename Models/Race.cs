namespace TequioDemoTrack.Models;
public class Race
{
    public int Id { get; set; }
    public string RaceValue { get; set; } = string.Empty;
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
