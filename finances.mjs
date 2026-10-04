// Builds the Ship Finances dashboard (finances.html) from the vault note.
// The note is the source of truth; this page is regenerated on every sync.
//   node finances.mjs <note.md> <out.html>
// Prints the computed position so it can be checked against the note's summary line.
import { readFileSync, writeFileSync } from "node:fs"

const [notePath, outPath] = process.argv.slice(2)
if (!notePath || !outPath) throw new Error("usage: node finances.mjs <note.md> <out.html>")
const md = readFileSync(notePath, "utf8")

// --- parse -----------------------------------------------------------------
const section = (name) => {
  const m = md.match(new RegExp(`^###### ${name}\\s*$([\\s\\S]*?)(?=^###### |(?![\\s\\S]))`, "m"))
  if (!m) throw new Error(`Section missing: ${name}`)
  return m[1]
}
const table = (name) =>
  section(name)
    .split(/\r?\n/)
    .filter((l) => l.trim().startsWith("|"))
    .slice(2) // header + separator
    .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
const plain = (s) =>
  s.replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, "$1").replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/\*\*/g, "")
const cr = (s, where) => {
  const n = Number(s.replace(/[,\s]/g, "").replace("−", "-"))
  if (!Number.isFinite(n)) throw new Error(`Not a number in ${where}: "${s}"`)
  return n
}

const pos = Object.fromEntries(table("Position").map(([k, v]) => [k, v]))
const STATUSES = ["received", "paid", "owed", "due", "planned"]
const ledger = table("Ledger").map(([date, month, category, item, amount, status], i) => {
  if (!STATUSES.includes(status)) throw new Error(`Ledger row ${i + 1}: unknown status "${status}"`)
  return { date, month, category, item: plain(item), amount: cr(amount, `ledger row ${i + 1}`), status }
})
const fixed = table("Monthly fixed").map(([item, party, amount]) => ({
  item: plain(item), party: plain(party), amount: cr(amount, `fixed "${item}"`),
}))
const unknowns = section("Owed or due, amount unknown")
  .split(/\r?\n/).filter((l) => l.startsWith("- ")).map((l) => plain(l.slice(2)))

// --- compute ---------------------------------------------------------------
const sum = (rows) => rows.reduce((t, r) => t + r.amount, 0)
const where = (...s) => ledger.filter((r) => s.includes(r.status))
const funds = cr(pos["Opening balance"], "opening balance") + sum(where("received", "paid"))
const owed = sum(where("owed"))
const due = -sum(where("due"))
const projected = funds + owed - due
const planned = where("planned")
const nextNet = -sum(fixed)
const nextGross = -sum(fixed.filter((f) => f.amount < 0))
const mortgage = -(fixed.find((f) => /mortgage/i.test(f.item))?.amount ?? 0)
// Imperial dates are day-year; 365-day years.
const day = (d) => { const [dd, yy] = d.match(/(\d+)-(\d+)/).slice(1).map(Number); return yy * 365 + dd }
const daysToNext = day(pos["Next month due"]) - day(pos["Current date"])

console.log({ funds, owed, due, projected, nextNet, afterPlanned: projected + sum(planned), daysToNext })

// --- render ----------------------------------------------------------------
const fmt = (n) => `${n < 0 ? "−" : ""}Cr${Math.abs(n).toLocaleString("en-GB")}`
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
const cover = Math.max(0, Math.min(1, projected / nextNet))
const shortBy = nextNet - projected
const rows = (list) => list.map((r) =>
  `<tr><td>${esc(r.date)}</td><td>${esc(r.item)}</td><td class="num ${r.amount < 0 ? "neg" : "pos"}">${fmt(r.amount)}</td></tr>`).join("")
// Full timeline: opening balance, then every committed row in date order with a running total.
// Owed/due rows are included (marked pending) so it ends at the projected month end; planned rows aren't.
let running = cr(pos["Opening balance"], "opening balance")
const timeline = `<tr><td>Start</td><td>Opening balance</td><td class="num"></td><td class="num">${fmt(running)}</td></tr>` +
  ledger.map((r, i) => ({ ...r, i })).filter((r) => r.status !== "planned")
    .sort((a, b) => day(a.date) - day(b.date) || (b.amount > 0) - (a.amount > 0) || a.i - b.i) // same day: money in before money out
    .map((r) => {
      running += r.amount
      const pending = r.status === "owed" || r.status === "due"
      return `<tr class="${pending ? "pending" : ""}"><td>${esc(r.date)}</td><td>${esc(r.item)}${pending ? ` <span class="tag">${r.status}</span>` : ""}</td>` +
        `<td class="num ${r.amount < 0 ? "neg" : "pos"}">${fmt(r.amount)}</td><td class="num">${fmt(running)}</td></tr>`
    }).join("")
const whatIf = planned.map((p) => {
  const after = projected + p.amount
  return `<li><span>${esc(p.item)} <b class="neg">${fmt(p.amount)}</b></span><span>leaves <b class="${after < 0 ? "neg" : ""}">${fmt(after)}</b>${after < nextNet ? ` · Month ${Number(pos["Current month"]) + 1} short by <b class="neg">${fmt(nextNet - after)}</b>` : ""}</span></li>`
}).join("")

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ship Finances — Event Horizon</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
  :root{--void:#0a1220;--panel:#14213a;--hull:#1c2c4a;--line:#2a3d5f;--paper:#eee7d6;--dim:#b9c3d6;
        --amber:#f2a33b;--amber-2:#ffcd7a;--cyan:#4fd6c8;--red:#e8604c;}
  *{box-sizing:border-box}html,body{margin:0}
  body{background:radial-gradient(ellipse 1200px 700px at 15% -10%,rgba(242,163,59,.10),transparent 60%),var(--void);
       color:var(--paper);font-family:Inter,sans-serif;padding:28px 16px 60px;line-height:1.5}
  .sheet{max-width:1000px;margin:0 auto}
  .mono{font-family:'JetBrains Mono',monospace}
  header{border-bottom:1px solid var(--line);padding-bottom:16px;margin-bottom:24px}
  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--amber-2)}
  h1{font-family:Rajdhani,sans-serif;font-size:44px;line-height:1;margin:6px 0 0}
  h1 span{color:var(--amber)}
  h2{font-family:Rajdhani,sans-serif;font-size:22px;margin:0 0 12px;letter-spacing:.02em}
  .sub{color:var(--dim);font-size:14.5px;margin-top:6px}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:12px;margin-bottom:16px}
  .card,.panel{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:16px}
  .card .label{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
  .card .value{font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:700;margin-top:6px}
  .card .hint{font-size:12.5px;color:var(--dim);margin-top:2px}
  .card.key{border-color:var(--amber);background:linear-gradient(var(--hull),var(--panel))}
  .pos{color:var(--cyan)}.neg{color:var(--red)}.key .value{color:var(--amber)}
  .panel{margin-bottom:16px}
  .bar{height:14px;background:var(--void);border:1px solid var(--line);border-radius:7px;overflow:hidden;margin:12px 0 8px}
  .bar i{display:block;height:100%;background:var(--amber)}
  .row{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:14px;color:var(--dim)}
  .row b{color:var(--paper)}.row b.pos{color:var(--cyan)}.row b.neg{color:var(--red)}
  .countdown{font-family:Rajdhani,sans-serif;font-size:40px;font-weight:700;color:var(--amber);line-height:1}
  .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:16px}
  table{width:100%;border-collapse:collapse;font-size:14px}
  td{padding:7px 4px;border-top:1px solid var(--line)}
  td:first-child{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--dim);white-space:nowrap}
  .num{text-align:right;font-family:'JetBrains Mono',monospace;white-space:nowrap}
  ul{margin:0;padding-left:18px}li{margin:6px 0;font-size:14px}
  .whatif{list-style:none;padding:0}.whatif li{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
  details summary{cursor:pointer;font-family:Rajdhani,sans-serif;font-size:22px;font-weight:700;letter-spacing:.02em}
  details summary span{font-family:Inter,sans-serif;font-size:13px;font-weight:400;color:var(--dim);margin-left:8px}
  details table{margin-top:12px}
  th{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);text-align:left;padding:6px 4px;font-weight:500}
  th.num{text-align:right}
  tr.pending td{opacity:.75}
  .tag{font-family:'JetBrains Mono',monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;border:1px solid var(--line);border-radius:3px;padding:1px 5px;color:var(--amber-2)}
  footer{margin-top:28px;font-size:12.5px;color:var(--dim)}
  a{color:var(--amber-2)}
</style>
</head>
<body><div class="sheet">
<header>
  <div class="eyebrow">Event Horizon · Lab Ship · Secrets of the Ancients</div>
  <h1>Ship <span>Finances</span></h1>
  <div class="sub">As of <b class="mono">${esc(pos["Current date"])}</b> · Month ${esc(pos["Current month"])}, due ${esc(pos["Current month due"])}</div>
</header>

<div class="cards">
  <div class="card"><div class="label">Funds in hand</div><div class="value">${fmt(funds)}</div><div class="hint">received and paid so far</div></div>
  <div class="card"><div class="label">Owed to us</div><div class="value pos">${fmt(owed)}</div><div class="hint">${where("owed").length} items outstanding</div></div>
  <div class="card"><div class="label">Due to pay</div><div class="value neg">${fmt(-due)}</div><div class="hint">${where("due").length} known costs</div></div>
  <div class="card key"><div class="label">Projected month end</div><div class="value">${fmt(projected)}</div><div class="hint">funds + owed − due</div></div>
</div>

<div class="panel">
  <h2>Next month's bill</h2>
  <div class="row"><span>Month ${Number(pos["Current month"]) + 1} due <b class="mono">${esc(pos["Next month due"])}</b></span><span><span class="countdown">${daysToNext}</span> days</span></div>
  <div class="bar"><i style="width:${(cover * 100).toFixed(1)}%"></i></div>
  <div class="row">
    <span>Projected <b>${fmt(projected)}</b> against a net bill of <b>${fmt(nextNet)}</b></span>
    <span>${shortBy > 0 ? `<b class="neg">${fmt(shortBy)} short</b>` : `<b class="pos">covered ${(projected / nextNet).toFixed(1)}×</b>`}</span>
  </div>
  <div class="row" style="margin-top:6px"><span>Mortgage alone ${fmt(mortgage)} · gross outgoings ${fmt(nextGross)} if the charters stopped paying</span></div>
</div>

${planned.length ? `<div class="panel"><h2>If we…</h2><ul class="whatif">${whatIf}</ul></div>` : ""}

<div class="panel"><details>
  <summary>Full timeline<span>every transaction from Cr0, with running total</span></summary>
  <table><tr><th>Date</th><th>Item</th><th class="num">In / out</th><th class="num">Total</th></tr>${timeline}</table>
</details></div>

<div class="grid2">
  <div class="panel"><h2>Owed to us</h2><table>${rows(where("owed"))}</table></div>
  <div class="panel"><h2>Due to pay</h2><table>${rows(where("due"))}</table></div>
</div>

<div class="panel"><h2>Amounts not yet known</h2><ul>${unknowns.map((u) => `<li>${esc(u)}</li>`).join("")}</ul></div>

<div class="panel"><h2>Monthly fixed</h2><table>${fixed.map((f) =>
  `<tr><td>${esc(f.party)}</td><td>${esc(f.item)}</td><td class="num ${f.amount < 0 ? "neg" : "pos"}">${fmt(f.amount)}</td></tr>`).join("")}
  <tr><td></td><td><b>Net per month</b></td><td class="num neg"><b>${fmt(-nextNet)}</b></td></tr></table></div>

<footer>Built from the <a href="./Ship-Finances">Ship Finances</a> note on ${new Date().toISOString().slice(0, 10)}. Back to the <a href="./">campaign wiki</a>.</footer>
</div></body></html>
`
writeFileSync(outPath, html)
