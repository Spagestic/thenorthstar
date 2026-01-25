---
name: docker-manager
description: Manage Docker containers, images, and volumes. Use this when the user asks to "list containers", "check logs", or "run a container".
---

# Docker Manager Skill

This skill uses the Docker MCP server to manage your local Docker environment.

## Usage

Use `mcporter` to execute Docker tools.

**Command Template:**

```bash
npx mcporter call --command "docker run -i --rm -v /var/run/docker.sock:/var/run/docker.sock mcp/docker" --tool <tool_name> --args <json_args>
```

## Common Tools

- `list_containers`: List running or stopped containers.

- `read_logs`: Get logs from a specific container.

- `run_container`: Start a new container.

Example: List running containers

```bash
npx mcporter call --command "docker run -i --rm -v /var/run/docker.sock:/var/run/docker.sock mcp/docker" --tool list_containers --args '{"all": false}'
```
