namespace ProjectManager.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool CompletionStatus { get; set; }
    public int ProjectId { get; set; }
    public int EstimatedHours { get; set; } = 5;
    public string Dependencies { get; set; } = "[]";
}

public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public int EstimatedHours { get; set; } = 5;
    public string Dependencies { get; set; } = "[]";
}

public class UpdateTaskDto
{
    public string? Title { get; set; }
    public DateTime? DueDate { get; set; }
    public bool? CompletionStatus { get; set; }
    public int? EstimatedHours { get; set; }
    public string? Dependencies { get; set; }
}
