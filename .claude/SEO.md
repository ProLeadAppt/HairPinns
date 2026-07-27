# Claude SEO in this repo

[claude-seo](https://github.com/AgriciDaniel/claude-seo) v2.2.4 (MIT) is wired
into this repo two ways, deliberately.

## 1. Vendored, works offline

`.claude/skills/seo*` and `.claude/agents/seo-*.md` are a committed copy of the
plugin: 31 skills (orchestrator + 21 core + framework + 8 extension mirrors)
and 18 specialist agents. Claude Code auto-discovers these on open, so anyone
who clones the repo has the full `/seo` surface with no install step.

## 2. Plugin reference, stays current

`.claude/settings.json` registers the upstream marketplace and enables the
plugin, so `/plugin update claude-seo` pulls new releases and the Python
runtime resolves through the plugin's `bin/claude-seo` launcher.

First-time setup on a new machine:

```
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup      # isolated Python venv + Playwright Chromium
/seo doctor     # confirm the runtime is ready
```

`/seo setup` creates an isolated environment under Claude's plugin data. It
does not install global Python packages or touch PATH.

## 3. Site context

`.claude/skills/seo-site-context/SKILL.md` holds this site's facts: domain,
stack, business model, the SEO artefacts that already exist and where they
live, and the known gaps. Read it before running any `/seo` command so the
audit reasons about the real site instead of generic assumptions. Keep it
current when the site changes, the same way you would an SOP.

## Common commands

```
/seo audit <url>        full audit, parallel agents, prioritised action plan
/seo technical <url>    crawlability, indexability, CWV, security, JS rendering
/seo schema <url>       detect, validate and generate JSON-LD
/seo content <url>      E-E-A-T and content quality
/seo geo <url>          AI Overviews / answer-engine citability
/seo local <url>        GBP, NAP, citations, reviews, map pack
/seo drift baseline <url> | compare <url>    regression tracking between deploys
```

Full command reference: `.claude/skills/seo/SKILL.md`.

## Note on the runtime

The bundled Python tools must run through `claude-seo run <script>.py`, never a
bare interpreter. If a command reports that setup is required, run `/seo setup`
rather than improvising a `pip install`.
