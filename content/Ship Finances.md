#traveller #sota #ship #finances
[[index|Secrets of the Ancients]]

The [[Event Horizon]]'s money. Replaces Rich's "Traveller P&L" Google Sheet (Ship Finances tab), retired 2026-10-04. The published dashboard is built from this note when the wiki syncs: [Ship Finances dashboard](https://modoxc6.github.io/traveller-sota/finances.html).

**Position at 219-1105: Cr388,000 in hand. Cr329,000 owed to the ship and Cr452,474 due, so Cr264,526 after Month 1 is settled. Month 2's bill (net Cr123,474) falls due c. 249-1105. Restocking missiles would leave Cr14,526.**

###### How this works
- **Ledger** is the record: one row per transaction. **Status** says whether money has moved:
	- `received` / `paid`: done, counts towards funds in hand
	- `owed`: income expected, not yet in
	- `due`: a cost that has to be paid
	- `planned`: a cost being considered, not committed
- **Funds in hand** = opening balance + every `received` and `paid` row. **Projected month end** = funds + `owed` − `due`. `planned` rows are shown separately as "if we do this"
- **Monthly fixed** is the standing bill. At each month end its rows are copied into the ledger as `due`, then switched to `paid` / `received` when settled
- The opening balance is **Cr0**: the ship started Month 1 with nothing (confirmed by Rich). The charter rents are still owed
- A month is taken as **30 days** for now. The due dates are estimates until the GM gives one

###### Position
| Field | Value |
| --- | --- |
| Opening balance | 0 |
| Current date | 219-1105 |
| Current month | 1 |
| Current month due | 219-1105 |
| Next month due | 249-1105 |

###### Monthly fixed
| Item | Party | Cr |
| --- | --- | --- |
| Ship mortgage | Ship | -396744 |
| Life support | Ship | -24000 |
| Maintenance | Ship | -22730 |
| Crew wages ([[Talia]] 4,000, [[Gunner Gunnerson]] 4,000, [[Atticus Brown]]) | Ship | -9000 |
| Rent | [[Helix]] | 100000 |
| Maintenance | [[Helix]] | 5000 |
| Rent | [[Black Horizon]] | 200000 |
| Life support | [[Black Horizon]] | 24000 |

Net **−Cr123,474 a month**. Without the two charters it would be **−Cr452,474**. Crew wages were under Variable in the sheet and are counted as fixed here.

###### Ledger
| Date | Month | Category | Item | Cr | Status |
| --- | --- | --- | --- | --- | --- |
| c. 185-1105 | 1 | Cargo | Cargo bought for Regina | -54000 | paid |
| 193-1105 | 1 | Passengers | Passengers to Regina | 70000 | received |
| 195-1105 | 1 | Cargo | Cargo sold at Regina (to Winter Shipping) | 72000 | received |
| 219-1105 | 1 | Passengers | High passage to Alell, 5 × 60,000 | 300000 | received |
| 219-1105 | 1 | Fixed | Ship mortgage | -396744 | due |
| 219-1105 | 1 | Fixed | Life support | -24000 | due |
| 219-1105 | 1 | Fixed | Maintenance | -22730 | due |
| 219-1105 | 1 | Fixed | Crew wages | -9000 | due |
| 219-1105 | 1 | Charter | Helix rent | 100000 | owed |
| 219-1105 | 1 | Charter | Helix maintenance | 5000 | owed |
| 219-1105 | 1 | Charter | Black Horizon rent | 200000 | owed |
| 219-1105 | 1 | Charter | Black Horizon life support | 24000 | owed |
| 219-1105 | 1 | Ship | Missile restock, 12 missiles | -250000 | planned |

###### Owed or due, amount unknown
- **[[Black Horizon]]'s "appreciation"** for bringing the carthuses back alive. Promised, never quantified, not mentioned since
- **[[Helix]] royalties**: 2% of any breakthrough, capped at Cr1,000,000. Nothing yet
- **Hull repairs**: 77 damage, Hull 47 of 124. No yard at Alell. Cost unknown
- **Jump drive repair** (Severity 1, DM−2 to jump checks). Cost unknown
- **Fuel**: one jump in the tanks, no gas giant at Alell. Buying fuel and shuttling it up with the [[Implacable]] costs something; jumping back to [[Whanga]] to skim is free
- **Berthing** at Alell's surface starport for the Implacable. Unknown
- **Possible new crew member**: the friendly passenger, if he joins. Wage unknown
- Spare hard point: a fourth turret is an option when there's money

###### Month close-outs
| Month | Due | Fixed | Variable | Net | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | 219-1105 | -123474 | 88000 | -35474 | From the sheet. Variable is passengers to Regina and the Regina cargo. Alell fares not included in the sheet's figure |

###### Notes
- Retired sheet's Month 1 total: **−Cr35,474**. That's correct; the Event Horizon note's "Cr33,500 short" was a misremembering
- The sheet's Armoury tab moved to [[Event Horizon]]
- [[Session 2026-10-04]]: Cr300,000 fares collected; all 12 missiles fired; the month falls due at Alell
