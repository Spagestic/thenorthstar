---
name: context7-docs
description: Fetch up-to-date documentation for libraries and frameworks using Context7. Use this when the user asks for "latest docs", "API reference", or code examples for specific libraries.
---

# Context7 Documentation Skill

This skill allows you to query the Context7 service to get the latest documentation for various libraries.

## Usage

To search for documentation, use the `mcporter` tool to bridge the CLI.

**Command Template:**

```bash
npx mcporter call --command "npx -y @upstash/context7-mcp" --tool <tool_name> --args <json_args>
```
