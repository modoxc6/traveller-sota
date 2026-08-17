# Secrets of the Ancients

Campaign wiki for a *Mongoose Traveller* game, published from Obsidian notes.

Live at **https://modoxc6.github.io/traveller-sota/**

## How it works

The notes are authored in Obsidian at `D:\Obsidian\Personal\TTRPG\TTRPG Games\Traveller Secrets of the Ancients`.
They are not edited here — `content/` is generated. To publish:

```powershell
.\sync.ps1
```

That copies the notes into `content/`, commits them to `main`, builds the site
with [Quartz](https://quartz.jzhao.xyz), and force-updates the `gh-pages` branch
that Pages serves from.

### Why not GitHub Actions?

The local `gh` token has `repo` but not `workflow` scope, so it cannot push a
file under `.github/workflows/`. The ready-made workflow is parked at
`.deploy-workflow/deploy.yml`. To switch to CI builds:

```bash
gh auth refresh -s workflow
```

then move that file to `.github/workflows/deploy.yml`, push, set the Pages
source back to "GitHub Actions", and delete the build-and-publish section at the
bottom of `sync.ps1`.

Deliberately not published:

- `Rulebook/` — the Mongoose Core Rulebook. Copyrighted; never goes up.
- `CLAUDE.md` — agent instructions, not campaign content.
- `Regina Situation Board.html` — already published from the `personal` repo.

## Local preview

```bash
node quartz/bootstrap-cli.mjs build --serve
```

## Theming

- `quartz.config.yaml` — palette (light and dark), fonts, which plugins run.
- `quartz/styles/custom.scss` — the campaign look on top of that.

Two things worth knowing before editing the config:

- Fonts come from the `quartz-fonts` **plugin options**, not
  `configuration.theme.typography`. The latter is ignored.
- The `note-properties` plugin is what parses frontmatter. Disabling it retitles
  every page to "Untitled"; to hide the YAML block, set `hidePropertiesView: true`
  instead.
