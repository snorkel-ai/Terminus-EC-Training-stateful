# Video: Running Your Task

Learn how to interact with your task environment and test your solution locally.

## Video Tutorial

<video-loom id="22449b76123d41e6abff0efb39d0b960" title="Running Your Task"></video-loom>

## What You'll Learn

- How to start your task container in interactive mode
- Navigating the task environment
- Testing commands before adding them to your solution
- Debugging environment issues

## Key Commands

### Start Interactive Mode

```bash
# GitHub workflow
uv run harbor tasks start-env --path harbor_tasks/<task-name> --interactive

# Platform workflow
tb tasks interact -t <task-name>
```

### Inside the Container

Once inside, you can:
- Navigate the filesystem
- Run your solution commands
- Test that everything works as expected
- Debug any issues

### Exit the Container

```bash
exit
```

## Tips

1. **Test everything manually first** — Run each command of your solution inside the container before writing `solve.sh`

2. **Check file paths** — Verify that all paths in task.yaml exist

3. **Verify dependencies** — Make sure all required packages are installed

4. **Note exact commands** — Copy the working commands for your solution file

## Common Issues

| Problem | Solution |
|---------|----------|
| Container won't start | Check Docker is running |
| Permission denied | Run Docker Desktop with admin rights |
| Missing packages | Add to Dockerfile and rebuild |
| Wrong working directory | Check WORKDIR in Dockerfile |

---

## Related Videos

- [Creating a solution.sh](/portal/docs/creating-tasks/videos/creating-solution)
- [Creating tests for your task](/portal/docs/creating-tasks/videos/creating-tests)
