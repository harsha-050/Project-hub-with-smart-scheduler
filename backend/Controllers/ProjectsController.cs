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
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProjectsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
    {
        var userId = GetUserId();
        
        var projects = await _context.Projects
            .Where(p => p.UserId == userId)
            .Include(p => p.Tasks)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                CreationDate = p.CreationDate,
                TaskCount = p.Tasks.Count
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDetailsDto>> GetProject(int id)
    {
        var userId = GetUserId();
        
        var project = await _context.Projects
            .Where(p => p.Id == id && p.UserId == userId)
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync();

        if (project == null)
        {
            return NotFound(new { error = "Project not found" });
        }

        return Ok(new ProjectDetailsDto
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            CreationDate = project.CreationDate,
            Tasks = project.Tasks.Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                DueDate = t.DueDate,
                CompletionStatus = t.CompletionStatus,
                ProjectId = t.ProjectId,
                EstimatedHours = t.EstimatedHours,
                Dependencies = t.Dependencies
            }).ToList()
        });
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto dto)
    {
        var userId = GetUserId();

        var project = new Project
        {
            Title = dto.Title,
            Description = dto.Description,
            UserId = userId
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, new ProjectDto
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            CreationDate = project.CreationDate,
            TaskCount = 0
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var userId = GetUserId();
        
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (project == null)
        {
            return NotFound(new { error = "Project not found" });
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
