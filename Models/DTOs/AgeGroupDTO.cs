namespace TequioDemoTrack.Models.DTOs;
public class AgeGroupDTO
{
    public int Id { get; set; }
    public string Group { get; set; } = string.Empty;
    public ICollection<CustomerDTO> Customers { get; set; } = new List<CustomerDTO>();
}
