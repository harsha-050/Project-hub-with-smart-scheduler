namespace ProjectManager.DTOs;

public class ProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreationDate { get; set; }
    public int TaskCount { get; set; }
}

public class ProjectDetailsDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreationDate { get; set; }
    public List<TaskDto> Tasks { get; set; } = new();
}

public class CreateProjectDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateProjectDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}
