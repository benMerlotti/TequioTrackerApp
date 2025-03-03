namespace TequioDemoTrack.Models;
public class Gender
{
    public int Id { get; set; }
    public string GenderValue { get; set; } = string.Empty;
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
