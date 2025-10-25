using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManager.Models;

public class Project
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    
    // Foreign key
    public int UserId { get; set; }
    
    // Navigation properties
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
