using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManager.Models;

public class ProjectTask
{
    public int Id { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    public DateTime? DueDate { get; set; }
    
    public bool CompletionStatus { get; set; } = false;
    
    public int EstimatedHours { get; set; } = 5;
    
    public string Dependencies { get; set; } = "[]"; // Store as JSON array of task titles
    
    // Foreign key
    public int ProjectId { get; set; }
    
    // Navigation property
    [ForeignKey("ProjectId")]
    public Project Project { get; set; } = null!;
}
