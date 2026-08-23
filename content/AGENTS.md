# AGENTS.md — Traveller: Secrets of the Ancients

Campaign notes for the *Secrets of the Ancients* Traveller game. The campaign note one level up at `TTRPG Games/Traveller Secrets of the Ancients.md` is the **index** — campaign metadata, useful links, and a list of every note in this folder grouped by category. It holds no content of its own. **Everything else about the campaign lives in this folder**, one note per subject, flat — no subfolders except `Attachments/`, which holds images (portraits, maps, handouts) embedded into those notes.

This is a wiki with a lightweight chronological session log alongside it. Everything that happens is eventually filed onto the note for the person, place, item or clue it concerns; during live play, however, updates go only into the dated session note until the end-of-session wrap-up. It's built to be queried by asking questions of an agent, so bias towards more notes rather than fewer.

## Every note in this folder
Starts with these two lines, nothing above them:

```
#traveller #sota #<type>
[[index|Traveller Secrets of the Ancients]]
```

- Inline tags on line 1, not YAML frontmatter — matches the rest of the TTRPG notes.
- `#traveller #sota` are non-negotiable. Add the type tag and any others that genuinely apply.
- The backlink on line 2 is non-negotiable too.
- `Templates/SotA Entry.md` is the stub for this.

## Rules questions
The Mongoose Traveller Core Rulebook is in `Rulebook/` in this folder. **Answer rules questions from these files — don't answer from memory and don't go to the web.**

- `Rulebook/TravellerCoreRulebook.txt` — full text dump. Grep this first; it's the fastest way to find a rule.
- `Rulebook/Traveller Core Rulebook<pages> <Chapter>.pdf` — the same book split by chapter, page range in the filename (e.g. `7480 Combat.pdf`, `8197 Encounters and Dangers.pdf`). Use these when the text dump mangles a table or you need the layout.

Quote the rule, say which chapter it's from, then apply it to the character's actual numbers. Where a rule is silent on the specific case, say so rather than filling the gap.

## Type tags
One primary type tag per note:

| Tag | For |
|---|---|
| `#character` | Player characters |
| `#npc` | Anyone we've met or heard of who isn't a PC |
| `#location` | Worlds, systems, stations, ships-as-places, bars, districts |
| `#ship` | Named vessels |
| `#faction` | Governments, corps, crews, cults, navies |
| `#species` | Sophont species and races — and animals/beasts too; no separate creature tag |
| `#event` | Historical events — wars, disasters, anything the setting dates |
| `#law` | Laws, legal processes and institutional powers |
| `#item` | Physical objects worth tracking |
| `#clue` | Loose threads, mysteries, unexplained things |
| `#session` | One dated chronological record of play per session |

The index note's headings mirror this table. Add secondary tags freely where they help (`#ancients`, `#imperium`, `#debt`, world or faction names). Don't invent a new *primary* type tag without asking — extend the table instead.

## Links
- Any person, place, ship, faction or item mentioned in a note is written as a wikilink: `[[Kostas Backett]]`, not "Kostas".
- **First mention of something new = create its note**, with the header block above and whatever's known so far, even if that's one line. A stub beats an unlinked name — thin notes are fine and expected.
- Filename is the name as spoken at the table, title-cased. Don't disambiguate with parentheses unless there's an actual collision.
- Unnamed walk-ons ("some bartender") stay as plain text until they get a name.
- **Every new note gets a line in the index note**, under the heading matching its type tag: `- [[Note Name]] — short description`. One line, enough to tell it apart from its neighbours. Keep each group alphabetical. If a note's description goes stale as things develop, update the index line too.
- If a name might be an alias, a rumour, or the same thing under two names, say so in the note rather than silently merging.

## Updates from chat
Anything Rich says about the game in chat is an instruction to write it down — no need to ask "shall I note that?":
- **During a live session, update only the current session note.** Do not update or create other campaign notes unless Rich explicitly asks for that specific wiki update.
- **At the end-of-session wrap-up**, use the completed session log to update every subject note it touches, create notes for anything new, and add the links.
- Outside a live session, update the subject notes directly as normal.
- Append to existing sections; don't rewrite or tidy away what's already there.
- Record what happened at the table. Don't invent plot, motives, or connections that weren't stated — if something is a guess or an inference, mark it as one.
- Uncertain in-fiction information stays uncertain in the note ("the crew claim…", "unconfirmed").
- Then say briefly what was touched and what was created.

## Session logs
- Create one note per session in this folder, kept flat with the other campaign notes: `Session YYYY-MM-DD.md`.
- Start it with the standard two-line header using `#traveller #sota #session`, then record the real session date and current in-fiction date.
- Use these sections: `Starting position`, `Live notes`, `Decisions and discoveries`, `End position`, and `Priorities for next session`.
- During play, append Rich's updates to `Live notes` in chronological order. Record suspicions and uncertain identifications as unconfirmed rather than facts.
- During live play, write only to the session note unless Rich explicitly requests another note be updated. Keep confirmations very brief.
- At the end of the session, fill in `End position` and `Priorities for next session`, reconcile the session into all relevant subject notes, then give Rich a concise summary.
- Add every session note to a `Sessions` section in the campaign index, newest first.
