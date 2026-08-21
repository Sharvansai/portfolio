---
name: magic-mcp
description: 21st.dev Magic MCP design system & component intelligence skill. Use to search, fetch, and generate production-ready React, Tailwind, and Radix UI components directly from the 21st.dev component library.
---

# Magic MCP (21st.dev) — UI Component Intelligence

The **Magic MCP** skill enables AI agents to search, inspect, and generate production-grade UI components from the curated **21st.dev** component registry (shadcn/ui compatible, Tailwind CSS, Framer Motion, and React).

## MCP Server Connection

Configured in `mcp_config.json`:
```json
{
  "mcpServers": {
    "21st": {
      "url": "https://21st.dev/api/mcp",
      "headers": {
        "x-api-key": "$API_KEY_21ST"
      }
    }
  }
}
```

## Core Tools & Workflows

| Tool | Purpose |
| --- | --- |
| `search` / `catalog_search` | Search 21st.dev catalog for components, animations, buttons, cards, navigation bars, and landing page sections. |
| `generate` | Generate or refine modern UI components tailored to current project requirements. |
| `get_inspiration` | Retrieve curated component inspirations and design variants. |
| `search_logo` | Search and retrieve clean SVG logos for tech brands, tools, and platforms. |

## Supported Triggers & Patterns

- **Search Components**: "Search 21st for a glowing card / bento grid / interactive button"
- **Component Code**: Retrieve direct source code for React + Tailwind components.
- **Variant Exploration**: Explore light/dark, minimal, glassmorphic, or animated variants.
