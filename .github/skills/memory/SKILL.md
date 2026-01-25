---
name: project-memory
description: Store and retrieve long-term project information. Use this to "remember" facts or "recall" project context.
---

# Memory Skill

Uses `@modelcontextprotocol/server-memory` to store a knowledge graph.

## Usage

**Command Template:**

```bash
npx mcporter call --command "npx -y @modelcontextprotocol/server-memory" --tool <tool_name> --args <json_args>
```

## Common Tools

- `create_entities`: Store new information.

- `open_nodes`: Retrieve information about specific topics.
  Example: Recall details about "auth"

```bash
npx mcporter call --command "npx -y @modelcontextprotocol/server-memory" --tool open_nodes --args '{"names": ["auth"]}'
```
