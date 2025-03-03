namespace TequioDemoTrack.Models.DTOs;
public class GenderDTO
{
    public int Id { get; set; }
    public string GenderValue { get; set; } = string.Empty;
    public ICollection<CustomerDTO> Customers { get; set; } = new List<CustomerDTO>();
}
