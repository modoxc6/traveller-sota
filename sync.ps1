#requires -version 5
# Copy the Secrets of the Ancients campaign notes out of the Obsidian vault into
# content/, then commit and push. Pushing triggers the Pages build.
#
# Excluded deliberately: Rulebook/ (copyrighted), CLAUDE.md / AGENTS.md (agent instructions,
# not campaign content), Regina Situation Board.html (already published from the
# `personal` repo -- linked, not duplicated).

$ErrorActionPreference = "Stop"

$vault = "D:\Obsidian\Personal\TTRPG\TTRPG Games"
$src   = Join-Path $vault "Traveller Secrets of the Ancients"
$index = Join-Path $vault "Traveller Secrets of the Ancients.md"
$repo  = $PSScriptRoot
$dest  = Join-Path $repo "content"

if (-not (Test-Path $src))   { throw "Campaign folder not found: $src" }
if (-not (Test-Path $index)) { throw "Campaign index note not found: $index" }

# Rebuild content/ from scratch so deleted notes don't linger on the site.
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest | Out-Null

Get-ChildItem $src -Filter *.md |
  Where-Object { $_.Name -ne "CLAUDE.md" -and $_.Name -ne "AGENTS.md" } |
  Copy-Item -Destination $dest

Copy-Item (Join-Path $src "Attachments") $dest -Recurse
Copy-Item $index (Join-Path $dest "index.md")

# Every note's line 2 is [[Traveller Secrets of the Ancients]], but the homepage
# has to live at content/index.md -- repoint the wikilink, keep the display text.
Get-ChildItem $dest -Filter *.md | ForEach-Object {
  $text = [IO.File]::ReadAllText($_.FullName)
  $text = $text.Replace(
    "[[Traveller Secrets of the Ancients]]",
    "[[index|Traveller Secrets of the Ancients]]")
  [IO.File]::WriteAllText($_.FullName, $text)
}

# Some notes embed images that live in the shared TTRPG attachments folder one
# level up rather than in the campaign's own Attachments/. Pull across just the
# ones actually referenced -- the shared folder also serves other campaigns, and
# copying it wholesale would publish unrelated material.
$attach = Join-Path $dest "Attachments"
$shared = Join-Path $vault "Attachments"

$embeds = Get-ChildItem $dest -Filter *.md | ForEach-Object {
  [regex]::Matches([IO.File]::ReadAllText($_.FullName), '!\[\[([^\]|#]+)') |
    ForEach-Object { $_.Groups[1].Value.Trim() }
} | Where-Object { $_ -match '\.\w{2,4}$' } | Sort-Object -Unique

foreach ($embed in $embeds) {
  if (Test-Path -LiteralPath (Join-Path $attach $embed)) { continue }
  $found = Join-Path $shared $embed
  if (Test-Path -LiteralPath $found) {
    Copy-Item -LiteralPath $found -Destination $attach
  } else {
    Write-Warning "Embedded file not found in either attachments folder: $embed"
  }
}

$count = (Get-ChildItem $dest -Filter *.md).Count
$imgs  = (Get-ChildItem $attach).Count
Write-Host "Synced $count notes and $imgs attachments."

git -C $repo add -A
if (git -C $repo status --porcelain) {
  git -C $repo commit -m "Sync campaign notes $(Get-Date -f yyyy-MM-dd)"
  git -C $repo push
} else {
  Write-Host "Notes unchanged; rebuilding anyway."
}

# --- Build and publish ------------------------------------------------------
# The site is served from the gh-pages branch rather than built by Actions,
# because the local gh token has no `workflow` scope and so can't push a
# workflow file. To switch to CI builds: run `gh auth refresh -s workflow`,
# move .deploy-workflow\deploy.yml back to .github\workflows\, push, and set
# the Pages source back to "GitHub Actions" -- then delete this section.

# Quartz resolves its config and content from the current directory, so this
# has to run with the repo as cwd regardless of where the script was invoked.
Push-Location $repo
try {
  node quartz/bootstrap-cli.mjs build
  if ($LASTEXITCODE -ne 0) { throw "Quartz build failed." }
} finally {
  Pop-Location
}

$deploy = Join-Path $repo ".deploy"
if (-not (Test-Path $deploy)) {
  git -C $repo worktree add -B gh-pages $deploy
}

# Wipe the worktree (except its git link) so deleted pages don't survive.
Get-ChildItem $deploy -Force | Where-Object { $_.Name -ne ".git" } |
  Remove-Item -Recurse -Force
Copy-Item (Join-Path $repo "public\*") $deploy -Recurse
# Pages runs Jekyll on branch deploys otherwise, which eats some asset paths.
New-Item -ItemType File -Path (Join-Path $deploy ".nojekyll") -Force | Out-Null
# Build output is generated, never hand-edited -- don't let git normalise line
# endings on it, which otherwise warns about every one of the ~250 files.
Set-Content -Path (Join-Path $deploy ".gitattributes") -Value "* -text" -Encoding utf8

git -C $deploy add -A
if (git -C $deploy status --porcelain) {
  git -C $deploy commit -q -m "Build $(Get-Date -f 'yyyy-MM-dd HH:mm')"
  git -C $deploy push -q origin gh-pages
  Write-Host "Published: https://modoxc6.github.io/traveller-sota/"
} else {
  Write-Host "Site output unchanged; nothing to publish."
}

# --- Stamp the projects hub -------------------------------------------------
# The hub card carries a "last published" date. Updating it here rather than by
# hand is the only way it stays honest.
$hub = "D:\Code\personal"
$hubIndex = Join-Path $hub "index.html"
$today = Get-Date -f "dd-MM-yy"

if (Test-Path $hubIndex) {
  git -C $hub pull -q --ff-only
  $html = [IO.File]::ReadAllText($hubIndex)
  $pattern = "(Full notes wiki for the SotA campaign, last published )\d{2}-\d{2}-\d{2}"
  if ($html -notmatch $pattern) {
    Write-Warning "Hub card not found in $hubIndex -- date not updated."
  } else {
    [IO.File]::WriteAllText($hubIndex, [regex]::Replace($html, $pattern, "`${1}$today"))
    git -C $hub add index.html
    if (git -C $hub status --porcelain) {
      git -C $hub commit -q -m "Stamp SotA wiki publish date $today"
      git -C $hub push -q
      Write-Host "Hub card stamped $today."
    } else {
      Write-Host "Hub card already stamped $today."
    }
  }
} else {
  Write-Warning "Projects hub not found at $hub -- skipping date stamp."
}
