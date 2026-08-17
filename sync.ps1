#requires -version 5
# Copy the Secrets of the Ancients campaign notes out of the Obsidian vault into
# content/, then commit and push. Pushing triggers the Pages build.
#
# Excluded deliberately: Rulebook/ (copyrighted), CLAUDE.md (agent instructions,
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
  Where-Object { $_.Name -ne "CLAUDE.md" } |
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

$count = (Get-ChildItem $dest -Filter *.md).Count
Write-Host "Synced $count notes."

git -C $repo add -A
if (git -C $repo status --porcelain) {
  git -C $repo commit -m "Sync campaign notes $(Get-Date -f yyyy-MM-dd)"
  git -C $repo push
  Write-Host "Pushed. Site rebuilds at https://modoxc6.github.io/traveller-sota/"
} else {
  Write-Host "No changes to publish."
}
