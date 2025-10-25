using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManager.Data;
using ProjectManager.DTOs;
using ProjectManager.Models;
using System.Security.Claims;

namespace ProjectManager.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    [HttpPost("projects/{projectId}/tasks")]
    public async Task<ActionResult<TaskDto>> CreateTask(int projectId, CreateTaskDto dto)
    {
        var userId = GetUserId();
        
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

        if (project == null)
        {
            return NotFound(new { error = "Project not found" });
        }

        var task = new ProjectTask
        {
            Title = dto.Title,
            DueDate = dto.DueDate,
            EstimatedHours = dto.EstimatedHours,
            Dependencies = dto.Dependencies,
            ProjectId = projectId
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { taskId = task.Id }, new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            DueDate = task.DueDate,
            CompletionStatus = task.CompletionStatus,
            ProjectId = task.ProjectId,
            EstimatedHours = task.EstimatedHours,
            Dependencies = task.Dependencies
        });
    }

    [HttpGet("{taskId}")]
    public async Task<ActionResult<TaskDto>> GetTask(int taskId)
    {
        var userId = GetUserId();
        
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

        if (task == null)
        {
            return NotFound(new { error = "Task not found" });
        }

        return Ok(new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            DueDate = task.DueDate,
            CompletionStatus = task.CompletionStatus,
            ProjectId = task.ProjectId,
            EstimatedHours = task.EstimatedHours,
            Dependencies = task.Dependencies
        });
    }

    [HttpPut("{taskId}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(int taskId, UpdateTaskDto dto)
    {
        var userId = GetUserId();
        
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

        if (task == null)
        {
            return NotFound(new { error = "Task not found" });
        }

        if (dto.Title != null) task.Title = dto.Title;
        if (dto.DueDate.HasValue) task.DueDate = dto.DueDate;
        if (dto.CompletionStatus.HasValue) task.CompletionStatus = dto.CompletionStatus.Value;
        if (dto.EstimatedHours.HasValue) task.EstimatedHours = dto.EstimatedHours.Value;
        if (dto.Dependencies != null) task.Dependencies = dto.Dependencies;

        await _context.SaveChangesAsync();

        return Ok(new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            DueDate = task.DueDate,
            CompletionStatus = task.CompletionStatus,
            ProjectId = task.ProjectId,
            EstimatedHours = task.EstimatedHours,
            Dependencies = task.Dependencies
        });
    }

    [HttpDelete("{taskId}")]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var userId = GetUserId();
        
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

        if (task == null)
        {
            return NotFound(new { error = "Task not found" });
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
