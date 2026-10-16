const e=`<p class="hint">Tap a section to expand it. If you can read JSON, you can add any exchange: see sections 5 to 9. Colors, the block wall (sizes, embed, lock), icons and volume bars are in section 13.</p>

<details open><summary>1. Entries, naming &amp; reordering</summary>
<p>Type an entry in <b>Add</b> and press Enter. Tap ✎ in the list to edit or rename an entry.</p>
<table>
<tr><td><code>SOL</code></td><td>Hyperliquid perp (USDC). Short for <code>hyperliquid|perp:SOL</code>. Names are Hyperliquid's <i>API</i> names, which can differ from the website (section 4).</td></tr>
<tr><td><code>hyperliquid|spot:BTC</code></td><td>Hyperliquid <b>spot</b> instead of the perp. Full form: <code>{source}|{assettype}:{ticker}</code>.</td></tr>
<tr><td><code>binance|perp:SOL</code></td><td>Binance USDT-margined futures (the plain <code>binance:SOL</code> is spot).</td></tr>
<tr><td><code>xyz:GOLD</code></td><td>Builder-deployed Hyperliquid market: <code>deployer:TICKER</code>. USDJPY is <code>xyz:JPY</code>.</td></tr>
<tr><td><code>binance:SOL</code></td><td>Binance spot. Tries the exchange's quote list in order (USDC, then USDT).</td></tr>
<tr><td><code>coinbase:SOL-USDT</code></td><td>Force a quote with <code>-QUOTE</code> (<code>binance:SOLUSDT</code> also works).</td></tr>
<tr><td><code>bybit:SOL</code></td><td>Any exchange you add in the config (sections 5 to 9).</td></tr>
</table>
<p><b>Source and asset type.</b> Every entry is <code>[source|type:]ticker</code>. The <i>source</i> is an exchange id (or alias), the <i>type</i> is one of that exchange's market types (<code>perp</code>, <code>spot</code>, ...). Each exchange has a default type, and for it you may leave the <code>source|type:</code> part out (<code>BTC</code>, <code>binance:SOL</code>); the app always shows and saves the shortest form. <code>hyperliquid|perp:BTC</code> is saved as <code>BTC</code>; <code>hyperliquid|spot:BTC</code> stays as typed. Hyperliquid spot calls Bitcoin <code>UBTC</code> (ETH is <code>UETH</code>, SOL is <code>USOL</code>); the config maps <code>BTC</code> to it, so you can just type <code>hyperliquid|spot:BTC</code>. An unknown source or type gives an error naming the valid ones.</p>
<p><b>Custom icon:</b> put it in the name block: <code>{SOL:icon=https://example.com/sol.png}SOL</code> (details in section 13).</p>
<p><b>Reorder:</b> on the dashboard, drag a card (touch: press and hold for a moment, then drag; mouse: just drag). In this list, drag the ⠿ handle. Both share one order and stay in sync. Dragging near the top or bottom edge scrolls.</p>
</details>

<details><summary>2. Formulas &amp; renaming</summary>
<p>An entry is <code>{optional name}formula</code>. Formulas use symbols, numbers, <code>+ - * /</code> and brackets, nested as deep as you like. Symbols that are not on your list are fetched as hidden feeds.</p>
<table>
<tr><td><code>BTC/SOL</code></td><td>ratio of two prices</td></tr>
<tr><td><code>1/SOL</code></td><td>inverse</td></tr>
<tr><td><code>{bn SOL}binance:SOL</code></td><td>rename only (keeps the link and exchange chip)</td></tr>
<tr><td><code>{Sol bps}(binance:SOL/coinbase:SOL-1)*10000</code></td><td>basis in basis points between two exchanges</td></tr>
<tr><td><code>{Mix}(xyz:GOLD/xyz:SILVER)*0.5+2</code></td><td>constants are fine</td></tr>
</table>
<p>Only one <code>{}</code>, and it must come first. The change % compares today's value with the same formula on prices from the start of the range. A formula has no currency sign or volume.</p>
</details>

<details><summary>3. Cards, ranges &amp; the zoom popup</summary>
<p>The <b>1H 1D 1W 1M 1Y</b> chooser (top right) sets the range for every card and is saved. Tap a card for the zoomed chart; its own range chooser there is temporary. Drag on the chart to read exact values. For plain entries, tapping the chart (or <b>Open ↗</b>) opens the exchange page; formula entries do nothing.</p>
<p>The 1D range uses each exchange's own 24h change; other ranges measure from the first candle of the range. High/low in the popup use candle closes.</p>
</details>

<details><summary>4. How to find the right key</summary>
<p><b>Rule:</b> the key is the exchange's <i>API</i> symbol, which is not always what the website shows (the page says USDJPY; the API says <code>xyz:JPY</code>). Copying the website URL does not always work.</p>
<p><b>Hyperliquid, easiest way:</b> open Settings and start typing in the Add box. The suggestion list holds the exact names (for the default markets and every group in <code>markets.groups</code>). Try a part of the name: <code>JPY</code>, <code>OIL</code>, <code>GOLD</code>.</p>
<p><b>Hyperliquid, from the API</b> (browser console: press F12, open the Console tab, paste, Enter):</p>
<pre>// all native perp names
fetch('https://api.hyperliquid.xyz/info', {method:'POST',
  headers:{'Content-Type':'application/json'},
  body: JSON.stringify({type:'meta'})})
 .then(r=>r.json()).then(j=>console.log(j.universe.map(u=>u.name).join(' ')))

// names of one builder deployer: add "dex"
body: JSON.stringify({type:'meta', dex:'xyz'})

// list every deployer (look at the "name" fields)
body: JSON.stringify({type:'perpDexs'})</pre>
<p>Or with curl: <code>curl -s -X POST https://api.hyperliquid.xyz/info -H 'Content-Type: application/json' -d '{"type":"meta","dex":"xyz"}'</code>. Names under <code>universe</code> are your keys. Entries flagged <code>isDelisted</code> are hidden. Only perps are supported (spot names such as <code>@107</code> are not).</p>
<p><b>A deployer not in suggestions?</b> Find its name with <code>perpDexs</code>, then add it to the groups (section 9). Typing <code>name:TICKER</code> works even before that.</p>
<p><b>Other exchanges:</b> open the "does this symbol exist" URL in a browser tab and look for a real answer:</p>
<table>
<tr><td>Binance</td><td><code>https://api.binance.com/api/v3/exchangeInfo?symbol=SOLUSDT</code> (error 400 = no such pair)</td></tr>
<tr><td>Coinbase</td><td><code>https://api.exchange.coinbase.com/products/SOL-USDC</code> (the full list is <code>/products</code>)</td></tr>
<tr><td>Bybit</td><td><code>https://api.bybit.com/v5/market/instruments-info?category=spot&amp;symbol=SOLUSDT</code></td></tr>
</table>
<p>Then use <b>Config → Test</b> (section 10) to confirm the app can read it.</p>
</details>

<details><summary>5. Config JSON: where it lives</summary>
<p>Exchange parsing and most tunables live in JSON, so changes need no rebuild. Three layers are merged in this order:</p>
<ol>
<li><b>Built-in</b> defaults (compiled into the app).</li>
<li><b><code>config.json</code></b> next to <code>index.html</code> (optional; ships as <code>{}</code>). Edit it in <code>dist/</code> and upload it again; no rebuild.</li>
<li><b>Your overrides</b>, stored on this device: <b>Settings → Backup → Config</b>. They are included in Export / Copy backups.</li>
</ol>
<p><b>Merge rules:</b> objects merge key by key (change one field, e.g. only <code>quote.url</code>). Arrays and plain values replace. <code>null</code> deletes a key: <code>{"exchanges":{"coinbase":null}}</code>.</p>
<p>The editor refuses to save a config that fails validation and says why. A broken saved config is ignored (built-in is used), so the app always starts. Each exchange must allow cross-origin (CORS) requests from a browser; if one does not, no config can fix it.</p>
</details>

<details><summary>6. Settings reference</summary>
<p>All under <code>"settings"</code>:</p>
<table>
<tr><td><code>defaultRange</code></td><td>range on first run, e.g. <code>"1D"</code></td></tr>
<tr><td><code>defaultPairs</code></td><td>fallback list (BTC, ETH, SOL, HYPE, XRP, ADA, AVAX, SUI) used when the automatic top list cannot be fetched, or <code>bootstrap.enabled</code> is false</td></tr>
<tr><td><code>currencies</code></td><td>base currencies for the Base currency chooser: <code>{"EUR":{"rate":"1/xyz:EUR","prefix":"€"}}</code>. <code>rate</code> is a formula giving <b>units of that currency per 1 USD</b> (EUR: <code>1/xyz:EUR</code> because EURUSD is USD per EUR; JPY: <code>xyz:JPY</code> because USDJPY is already JPY per USD). USD is always the base. See section 13.</td></tr>
<tr><td><code>bootstrap</code></td><td>the automatic list: <code>{"enabled":true,"source":"hyperliquid","type":"perp","max":0,"tiers":[[5,[2,2]],[10,[1,2]]],"rest":[1,1]}</code>. See section 13.</td></tr>
<tr><td><code>extras</code></td><td><code>{"show":true,"height":0.14}</code>: the funding strip in the zoom chart (perps) and its height share</td></tr>
<tr><td><code>oi</code></td><td><code>{"sampleMs":900000,"keepMs":259200000}</code>: for exchanges without an OI history API, OI is sampled on this device every 15 min and kept 3 days</td></tr>
<tr><td><code>chartConcurrency</code></td><td>how many chart requests run at once (keeps big walls under rate limits)</td></tr>
<tr><td><code>tickMs</code></td><td>price refresh (ms), default 5000</td></tr>
<tr><td><code>chartCheckMs</code></td><td>how often chart refresh is checked (each range has its own <code>ttl</code>)</td></tr>
<tr><td><code>freshMs</code></td><td>status dot turns amber after this long without data</td></tr>
<tr><td><code>missCooldownMs</code>, <code>retryMs</code></td><td>wait before retrying a symbol that was not found / a chart that failed</td></tr>
<tr><td><code>timeoutMs</code></td><td>request timeout</td></tr>
<tr><td><code>currencyPrefix</code></td><td>sign before prices, default <code>"$"</code></td></tr>
<tr><td><code>format</code></td><td><code>{"locale":"en-US","tiers":[[1000,2],[1,3],[0.01,5]],"sig":4}</code>: at or above each threshold, that many decimals; smaller numbers use <code>sig</code> significant digits</td></tr>
<tr><td><code>theme</code></td><td><code>bg up down text muted accent1 accent2 accent3</code> (CSS colors)</td></tr>
<tr><td><code>symbols</code></td><td>per-symbol tweaks: <code>{"xyz:JPY":{"label":"USDJPY","prefix":"¥"}}</code> (<code>prefix:""</code> = no sign)</td></tr>
<tr><td><code>layout</code></td><td><code>max</code> (largest block, tiles), <code>unit</code> (target tile size px), <code>fit</code> (breathing range, 0.05 = 5%), <code>minCols</code>, <code>gap</code>/<code>gapPhone</code>, and <code>defaults</code> = starting size <code>[w,h]</code> per block type: <code>price</code>, <code>control</code>, <code>embed</code></td></tr>
<tr><td><code>blocks</code></td><td>edge colors: <code>ctl</code> (gray), <code>embed</code> (black)</td></tr>
<tr><td><code>heat</code></td><td>edge-line colors by % change: <code>steps</code> (13 thresholds) and <code>colors</code> (one more than steps). See section 13.</td></tr>
<tr><td><code>icons</code></td><td>icons by symbol or ticker: <code>{"SOL":"https://.../sol.png","DOGE":"🐶","BTC":""}</code> (<code>""</code> = letters only). See section 13.</td></tr>
<tr><td><code>volume</code></td><td><code>{"show":true,"cards":true,"height":0.2}</code>: volume bars in the zoom chart, on the cards, and their height share of the popup chart</td></tr>
<tr><td><code>ranges</code></td><td>chooser buttons. <code>i</code> candle interval id, <code>n</code> candle count, <code>s</code> seconds per candle, <code>ttl</code> refresh ms, <code>native:true</code> = use the exchange's own 24h change. Every exchange must support <code>i</code> (see <code>intervals</code>).</td></tr>
</table>
<pre>{
  "settings": {
    "tickMs": 3000,
    "theme": { "accent1": "#0ea5e9", "accent2": "#22c55e" },
    "ranges": { "6H": { "i": "5m", "n": 72, "s": 300, "ttl": 60000 } }
  }
}</pre>
</details>

<details><summary>7. Exchange JSON: every field</summary>
<p>Under <code>"exchanges"</code> each key is the id you type as the prefix (<code>bybit:SOL</code>). Exactly one exchange has <code>"default": true</code> (Hyperliquid); it handles entries without a known prefix, and unknown prefixes like <code>xyz:</code> are passed to it as a "group".</p>
<table>
<tr><td><code>name</code>, <code>tag</code></td><td>display name (chip, popup) and a short tag for formula labels (<code>SOL·BN</code>)</td></tr>
<tr><td><code>chip</code>, <code>aliases</code></td><td><code>false</code> hides the name chip; extra prefixes, e.g. <code>["bn"]</code></td></tr>
<tr><td><code>types</code>, <code>defaultType</code></td><td>market types of this exchange, e.g. <code>"types":{"perp":{...},"spot":{...}},"defaultType":"perp"</code>. Fields outside <code>types</code> are shared; each type's own fields override them. Entries use <code>id|type:ticker</code>. Without <code>types</code> the exchange has one type (<code>"type":"spot"</code> by default).</td></tr>
<tr><td><code>case</code></td><td><code>"upper"</code> (spot exchanges) or <code>"keep"</code></td></tr>
<tr><td><code>pairSep</code></td><td>separator that lets users force a quote: <code>"-"</code> means <code>SOL-USDT</code></td></tr>
<tr><td><code>quotes</code></td><td>quote currencies to try in order; the one that works is remembered</td></tr>
<tr><td><code>symbol</code></td><td>builds the exchange's own symbol: <code>"{base}{quote}"</code> gives SOLUSDT</td></tr>
<tr><td><code>labelFormat</code>, <code>link</code></td><td>card title template; page opened from the popup</td></tr>
<tr><td><code>quote</code></td><td>one request per symbol. <code>url</code> (+ optional <code>method</code>, <code>headers</code>, <code>body</code>); paths <code>price</code>, <code>open</code> (price 24h ago), <code>volume</code>. If the API has no 24h-ago price, use <code>pct</code> (24h change in percent) instead of <code>open</code>; <code>pctFraction:true</code> if it is a fraction (0.012). <code>volumeIsBase:true</code> multiplies a base-currency volume by price.</td></tr>
<tr><td><code>batch</code></td><td>instead of <code>quote</code>: one request lists many symbols. <code>request</code>, <code>names</code> (path to all names), <code>items</code> (path to the parallel list of data), optional <code>skip</code> (flags), and <code>price open volume</code> relative to one item. Optional: <code>oi</code> (open interest; <code>oiBase:true</code> = in base units, multiplied by price) and <code>funding</code> (funding rate) paths; <code>lookup</code> (names are indexes into another array, as in Hyperliquid spot); <code>lookupIndex</code> (path to each looked-up entry's own index, same idea), <code>itemIndex</code> (path to each market's own index when the data list is addressed by it instead of by position, as in Hyperliquid spot); <code>ids</code> (the API's own market id per item, usable as <code>{id}</code> in <code>symbol</code>/<code>link</code>); <code>only</code> (<code>{"path":"...","equals":"TRADING"}</code> keeps matching items)</td></tr>
<tr><td><code>aliases</code> (inside a type)</td><td>maps the ticker you type to the exchange's own name: <code>{"BTC":"UBTC"}</code></td></tr>
<tr><td><code>funding</code>, <code>oi</code> (history)</td><td>history for the zoom strips (perps). <code>funding</code>: <code>url/body</code>, <code>rows</code>, <code>t</code>, <code>v</code> paths, <code>pageSize</code>, <code>maxPoints</code>, <code>periodMs</code> (length of one funding period, e.g. 3600000 = hourly rate) and <code>label</code>. <code>oi</code>: same shape plus <code>intervals</code>/<code>maxLimit</code>, or <code>{"local":true}</code> when the exchange has no OI history: the app samples OI itself while the page is open.</td></tr>
<tr><td><code>markets</code></td><td>optional name list for suggestions: <code>request</code>, <code>groups</code>, <code>names</code>, <code>skip</code></td></tr>
<tr><td><code>candles</code></td><td><code>url</code> or <code>body</code>; <code>rows</code> path to the list (<code>""</code> = the response itself); <code>t c o</code> paths to time, close, open inside a row; <code>h</code> and <code>l</code> paths to the candle high / low (both needed for the K-line view; without them the popup stays a line chart); <code>v</code> path to the candle <i>volume</i> (optional: without it that exchange simply shows no volume bars); <code>tUnit:"s"</code> if times are seconds; <code>intervals</code> maps our ids (<code>1m 5m 15m 1h 1d</code>) to the exchange's values (a missing id = range unsupported); <code>maxLimit</code> caps <code>{limit}</code> (the chart then shows fewer candles); <code>pageSize</code> splits long ranges by time (needs start/end variables in the URL)</td></tr>
</table>
<p><b>Template variables</b> (in <code>url</code>, <code>body</code>, <code>symbol</code>, <code>link</code>, ...): <code>{base} {quote} {symbol} {name} {prefix}</code>; for candles also <code>{interval} {limit} {startMs} {endMs} {startS} {endS} {startISO} {endISO}</code>. A value that is exactly one variable keeps its type (numbers stay numbers in JSON bodies). Empty-string keys in a body are dropped.</p>
<p><b>Paths</b> are dot-separated: <code>result.list.0.lastPrice</code>. A number indexes an array (<code>0</code> = first), <code>*</code> maps over an array (<code>0.universe.*.name</code> = every name), <code>""</code> = the whole value.</p>
</details>

<details><summary>8. Tutorial: add any exchange, step by step</summary>
<p>You need two public (no API key) endpoints from the exchange's API docs: a <b>24h ticker</b> and <b>candles/klines</b>. Search for "&lt;exchange&gt; API spot ticker" and "&lt;exchange&gt; API kline".</p>
<p><b>Step 1: read the ticker response.</b> Open the ticker URL with a real symbol in a browser tab. Say it shows:</p>
<pre>{ "retCode": 0,
  "result": { "list": [ {
      "symbol": "SOLUSDT",
      "lastPrice": "150.5",
      "prevPrice24h": "148.2",
      "turnover24h": "123456789" } ] } }</pre>
<p><b>Step 2: write a path to each value.</b> Walk down the keys, joined by dots; arrays use their position number:</p>
<table>
<tr><td><code>result.list.0.lastPrice</code></td><td>150.5 &rarr; <code>price</code></td></tr>
<tr><td><code>result.list.0.prevPrice24h</code></td><td>148.2 &rarr; <code>open</code> (price 24h ago)</td></tr>
<tr><td><code>result.list.0.turnover24h</code></td><td>volume in quote currency &rarr; <code>volume</code></td></tr>
</table>
<p>No 24h-ago price but a "change %"? Use <code>pct</code> instead of <code>open</code>.</p>
<p><b>Step 3: read the candles response.</b> Typical shapes: a list of lists (<code>[time, open, high, low, close, ...]</code>) or a list of objects (<code>{"t":..,"o":..,"c":..}</code>). Find: where the list is (<code>rows</code>), and inside each row the time (<code>t</code>), open (<code>o</code>) and close (<code>c</code>). For a list of lists those are index numbers: <code>"0"</code>, <code>"1"</code>, <code>"4"</code>. If times are in seconds, add <code>"tUnit":"s"</code>. Order does not matter; the app sorts. If rows also carry a volume, give its position as <code>"v"</code> (Bybit: <code>"5"</code>) to get volume bars.</p>
<p><b>Step 4: intervals.</b> Our ids are <code>1m 5m 15m 1h 1d</code>. If the exchange names them differently, map them: <code>"intervals": {"1h":"60","1d":"D"}</code>. A range whose id is missing from the map is simply unavailable on that exchange.</p>
<p><b>Step 5: symbol format.</b> How is SOL + USDT written? <code>SOLUSDT</code> &rarr; <code>"{base}{quote}"</code>; <code>SOL-USDT</code> &rarr; <code>"{base}-{quote}"</code>; <code>SOL_USDT</code> &rarr; <code>"{base}_{quote}"</code>. Lowercase? Set <code>"case"</code> accordingly (the app uppercases by default; use a template or <code>"keep"</code> if the API needs lowercase).</p>
<p><b>Step 6: assemble, save, test.</b> Paste into <b>Config</b>, Save &amp; apply, type <code>myex:SOL</code> in Test. Fix whatever it reports (section 10), then add <code>myex:SOL</code> as an entry.</p>
<p><b>Blank template</b> (replace the ALL-CAPS parts):</p>
<pre>{
  "exchanges": {
    "myex": {
      "name": "MyEx", "tag": "MX", "case": "upper", "pairSep": "-",
      "quotes": ["USDT"],
      "symbol": "{base}{quote}",
      "link": "https://MYEX.COM/trade/{base}_{quote}",
      "quote": {
        "url": "TICKER_URL?symbol={symbol}",
        "price": "PATH", "open": "PATH", "volume": "PATH"
      },
      "candles": {
        "url": "KLINE_URL?symbol={symbol}&amp;interval={interval}&amp;limit={limit}",
        "rows": "PATH_TO_LIST", "t": "0", "o": "1", "c": "4"
      }
    }
  }
}</pre>
</details>

<details><summary>9. Example: Bybit (full, explained)</summary>
<p>Bybit's v5 API is public and returns the shapes from section 8. Paste this into <b>Config</b>:</p>
<pre>{
  "exchanges": {
    "bybit": {
      "name": "Bybit", "tag": "BB", "case": "upper", "pairSep": "-",
      "quotes": ["USDT", "USDC"],
      "symbol": "{base}{quote}",
      "labelFormat": "{base}-{quote}",
      "link": "https://www.bybit.com/en/trade/spot/{base}/{quote}",
      "quote": {
        "url": "https://api.bybit.com/v5/market/tickers?category=spot&amp;symbol={symbol}",
        "price": "result.list.0.lastPrice",
        "open": "result.list.0.prevPrice24h",
        "volume": "result.list.0.turnover24h"
      },
      "candles": {
        "url": "https://api.bybit.com/v5/market/kline?category=spot&amp;symbol={symbol}&amp;interval={interval}&amp;limit={limit}",
        "intervals": { "1m": "1", "5m": "5", "15m": "15", "1h": "60", "1d": "D" },
        "rows": "result.list", "t": "0", "o": "1", "c": "4", "v": "5"
      }
    }
  }
}</pre>
<table>
<tr><td><code>quotes</code></td><td>USDT is tried first, then USDC. Bybit returns an empty list for unknown symbols, which the app treats as "not found" and moves on.</td></tr>
<tr><td><code>intervals</code></td><td>Bybit names 1m, 5m, 15m, 1h, 1d as <code>1, 5, 15, 60, D</code>.</td></tr>
<tr><td><code>rows</code>, <code>t o c v</code></td><td>Candles come as <code>result.list</code>: rows of <code>[start ms, open, high, low, close, volume, turnover]</code>, newest first, so time is 0, open is 1, close is 4 and volume is 5.</td></tr>
</table>
<p>Now add <code>bybit:SOL</code>, <code>bybit:SOL-USDC</code>, or a formula like <code>{Bybit vs Binance}(bybit:SOL/binance:SOL-1)*10000</code>.</p>
<p><i>Written from Bybit's public docs; not run against the live API from here. Always confirm with Test.</i></p>
</details>

<details><summary>10. Test a feed &amp; troubleshooting</summary>
<p>In the Config editor, type a symbol in <b>Test symbol</b> and press Test. It runs the quote and candles (current range) with your <i>applied</i> config and prints what it parsed, or the exact error. Save &amp; apply first.</p>
<table>
<tr><td>no price in the response</td><td>the <code>price</code> path is wrong, or the symbol does not exist (many APIs answer an unknown symbol with HTTP 200 and an empty list)</td></tr>
<tr><td>HTTP 400 / 404</td><td>symbol format is wrong: check <code>symbol</code>, <code>quotes</code>, <code>case</code></td></tr>
<tr><td>HTTP 403 / 451</td><td>the exchange blocks your region or this browser</td></tr>
<tr><td>HTTP 429</td><td>rate limited: raise <code>tickMs</code>, or watch fewer symbols</td></tr>
<tr><td>Failed to fetch</td><td>CORS blocked, offline, or a typo in the URL (open the URL in a tab to compare)</td></tr>
<tr><td>range not supported</td><td><code>intervals</code> has no entry for this range's interval</td></tr>
<tr><td>Quote OK, candles fail</td><td>check <code>rows</code>, <code>t</code>, <code>c</code> paths and the interval names</td></tr>
<tr><td>Chart shorter than expected</td><td>the API caps rows per call: set <code>maxLimit</code>, or <code>pageSize</code> with start/end variables</td></tr>
<tr><td>Price right, change % wrong</td><td><code>open</code> must be the price 24h ago, not today's open (or use <code>pct</code>)</td></tr>
<tr><td>Card says No “X” market</td><td>the key was not found: check section 4</td></tr>
</table>
</details>

<details><summary>11. More examples (OKX, Gate, small tweaks)</summary>
<p><b>OKX</b> (candles are capped at 300 per request, so long ranges show the latest 300 candles):</p>
<pre>{
  "exchanges": {
    "okx": {
      "name": "OKX", "tag": "OK", "case": "upper", "pairSep": "-",
      "quotes": ["USDT", "USDC"],
      "symbol": "{base}-{quote}",
      "link": "https://www.okx.com/trade-spot/{base}-{quote}",
      "quote": {
        "url": "https://www.okx.com/api/v5/market/ticker?instId={symbol}",
        "price": "data.0.last", "open": "data.0.open24h", "volume": "data.0.volCcy24h"
      },
      "candles": {
        "url": "https://www.okx.com/api/v5/market/candles?instId={symbol}&amp;bar={interval}&amp;limit={limit}",
        "maxLimit": 300,
        "intervals": { "1m": "1m", "5m": "5m", "15m": "15m", "1h": "1H", "1d": "1D" },
        "rows": "data", "t": "0", "o": "1", "c": "4", "v": "5"
      }
    }
  }
}</pre>
<p><b>Gate</b> (no 24h-ago price in the ticker, only the change in percent, so it uses <code>pct</code>; candles are <code>[time(s), quote vol, close, high, low, open, ...]</code>):</p>
<pre>{
  "exchanges": {
    "gate": {
      "name": "Gate", "tag": "GT", "case": "upper", "pairSep": "-",
      "quotes": ["USDT", "USDC"],
      "symbol": "{base}_{quote}",
      "link": "https://www.gate.io/trade/{base}_{quote}",
      "quote": {
        "url": "https://api.gateio.ws/api/v4/spot/tickers?currency_pair={symbol}",
        "price": "0.last", "pct": "0.change_percentage", "volume": "0.quote_volume"
      },
      "candles": {
        "url": "https://api.gateio.ws/api/v4/spot/candlesticks?currency_pair={symbol}&amp;interval={interval}&amp;limit={limit}",
        "rows": "", "t": "0", "c": "2", "o": "5", "v": "6", "tUnit": "s"
      }
    }
  }
}</pre>
<p><i>These two are written from the exchanges' public docs and not run from here: confirm with Test.</i></p>
<p><b>Use Binance.US instead of Binance</b> (same API shape, only URLs change):</p>
<pre>{
  "exchanges": {
    "binance": {
      "quote":   { "url": "https://api.binance.us/api/v3/ticker/24hr?symbol={symbol}" },
      "candles": { "url": "https://api.binance.us/api/v3/klines?symbol={symbol}&amp;interval={interval}&amp;limit={limit}" }
    }
  }
}</pre>
<p><b>Name a market and drop its $:</b> <code>{ "settings": { "symbols": { "xyz:JPY": { "label": "USDJPY", "prefix": "" } } } }</code></p>
<p><b>More Hyperliquid deployers in suggestions:</b> <code>{ "exchanges": { "hyperliquid": { "markets": { "groups": ["", "xyz", "flx"] } } } }</code></p>
<p><b>Remove an exchange:</b> <code>{ "exchanges": { "coinbase": null } }</code></p>
<p><b>A "batch" feed</b> (one call lists every symbol, like Hyperliquid) uses <code>batch</code> instead of <code>quote</code>. Hyperliquid's own entry is the model: the response is <code>[meta, contexts]</code>, so <code>names</code> is <code>0.universe.*.name</code> and <code>items</code> is <code>1</code> (two parallel lists). Use <b>Load full config</b> in the editor to read it.</p>
</details>

<details><summary>12. Backup &amp; restore</summary>
<p><b>Export</b> saves a JSON file; <b>Copy</b> puts the same JSON on the clipboard. <b>Import</b> and <b>Paste</b> restore it (after a confirmation, replacing your list). A backup holds your entries (in order), chosen range and your config overrides. Prices and charts reload by themselves.</p>
</details>

<details><summary>13. Look &amp; feel: heat colors, block wall, embed, lock, icons, volume</summary>
<p><b>Edge color.</b> Every card has an edge line (and a matching % pill) colored by its % change for the selected range. There are 14 tiers, from strong red through muted tones near zero to strong green, split at <code>-10 -5 -2 -1 -0.5 -0.2 0 0.2 0.5 1 2 5 10</code> (%). Bigger moves also glow more. Change them in <code>settings.heat</code>:</p>
<pre>{ "settings": { "heat": {
    "steps":  [-5, -1, 0, 1, 5],
    "colors": ["#ff2d55", "#b4435a", "#7a4a5a", "#3b8e67", "#25b170", "#00eb7d"]
} } }</pre>
<p><code>colors</code> must have exactly one more entry than <code>steps</code>; use 6-digit <code>#rrggbb</code> so the pill text can pick black or white automatically. A card with no % shows a neutral edge.</p>

<p><b>The wall.</b> The page is only blocks, laid on a grid of square tiles that fills the screen (at least 4 tiles across; wide screens get more). Drag a block to reorder it (press and hold on touch). Drag its <b>bottom-right corner</b> to resize: sizes snap to whole tiles, 1 to 4 each way (1x1 up to 4x4). New price blocks start at 2x2. Sizes are saved, included in Export, and measured in tiles, so an import on another screen simply refits.</p>
<p><b>What each size shows.</b> 1x1: name, price, %. 2x1: adds a bigger layout. 1x2 / 2x2: chart with volume bars, change amount, 24h volume. 3-4 wide: chart beside or below the numbers, growing with the block.</p>
<p><b>Control block</b> (gray edge): the only one; it holds the title, update time, up/down count, time range chooser and the settings gear, plus a big clock when it is 3+ tiles tall; everything scales up as you enlarge it. Move and resize it like any block, from 1x1 (just the gear) up to 4x4; the content rearranges to fit every size.</p>
<p><b>Embed block</b> (black edge): add <code>embed:https://example.com</code> to show a page (or a direct video / mp3 link, which the browser plays in its own player) inside the block, sized to fill it with no bars. Drag it by its thin frame or the grip that appears on hover. Sites that forbid framing show blank or an error. A name works too: <code>{Radio}embed:https://…</code>. Old <code>media:</code> entries still work as embeds.</p>
<p><b>Raw HTML in an embed.</b> <code>embed:&lt;h1&gt;Hello&lt;/h1&gt;</code> shows your own HTML (and CSS / JavaScript) in the block. <b>No { } are needed:</b> anything after <code>embed:</code> that starts with <code>&lt;</code> is taken as HTML, all the way to the end, so braces inside your CSS or JavaScript cannot confuse it. If you like, <code>embed:{&lt;b&gt;hi&lt;/b&gt;}</code> also works (the outer { } are stripped). A name still goes first: <code>{Clock}embed:&lt;div&gt;…&lt;/div&gt;</code>. Type or paste it on one line (the add box drops line breaks), so minify it; avoid <code>//</code> comments in scripts. The HTML runs in its own sandbox, cannot touch this app, and gets a dark default style you can override.</p>
<p><b>Empty block.</b> Press Add (settings box or the right-click popup) with nothing typed to make an invisible spacer. It can be dragged, resized and closed like any block (hover to see its dashed outline, ✕ and corner). Make as many as you like to hold empty slots in the wall.</p>
<p><b>Lock.</b> In Settings, the padlock beside <b>?</b> locks the wall: moving, resizing, closing and right-click adding are switched off, and the ✕, grip and resize corner disappear. A small padlock shows on the gear while it is locked. Price blocks still open their zoom chart. Rotating the phone still refits the wall to portrait or landscape. Tap the padlock again to edit.</p>
<p><b>Perfect fit.</b> Tile widths are whole pixels. Tile height may differ from the width by up to 5% (<code>settings.layout.fit</code>): if the wall is only slightly taller than the screen it is squeezed to fit without scrolling; if it would leave only a small empty strip at the bottom it is stretched to fill it, with a whole number of pixels per row. With far fewer blocks the bottom stays empty; with many more it scrolls as usual; both use the default tile size.</p>
<p><b>Open interest and funding.</b> For perps, the zoom popup shows the funding rate as bars under the volume bars (above the midline in the up color = positive, below in the down color = negative; the number on the right is the latest rate). Current open interest and funding are in the stats row at the top of the popup, and blocks 3x3 or bigger (or 2 wide and 3+ tall) show them as text. Hyperliquid has no open-interest history, so OI is shown as a current number only. <b>Edit from the popup:</b> move the mouse over a popup and the ✎ button appears beside the close button (always visible on touch); it edits just that block's entry.</p>
<p><b>Automatic list.</b> On the first visit (or after <b>Reset to defaults</b>) the app fetches Hyperliquid's perps ranked by open interest (24h volume if there is no OI), and fills exactly one screen: the first 5 as 2x2, the next 5 as 1x2, the rest 1x1. How many fit is computed from your screen (columns x rows, with the 5% height tolerance), so a PC shows many, a tablet fewer and a phone the fewest; rotating or resizing re-fits it. If the fetch fails the fallback list <code>defaultPairs</code> is used. As long as you do not change the list, it is refreshed with the current top instruments on every open. Adding, removing, editing, moving or resizing any block counts as your own list and stops this; Reset starts it again. <code>max</code> 0 = as many as fit (all of Hyperliquid's perps if the screen has room); set a number to cap it. Tune it with <code>settings.bootstrap</code> (<code>tiers</code> are <code>[rank limit, [w,h]]</code>).</p>
<p><b>Candles and moving averages (zoom popup).</b> Small buttons at the top-left of the chart: <b>Line / Candle</b> (shown only when the exchange gives high and low for that entry; formulas and entries without them stay a line) and <b>MA20 / MA50</b> (simple moving average of the last 20 / 50 points of the shown range, amber and violet). Your choice is remembered on this device. While you slide over the chart the tooltip shows O/H/L/C and the MA values.</p>
<p><b>Base currency.</b> In Settings, <b>Base currency</b> switches how <i>prices</i> are shown on the blocks and in the zoom chart: USD (default), EUR and JPY (from Hyperliquid's <code>xyz:EUR</code> and <code>xyz:JPY</code> markets), or BTC, ETH, SOL (from their perp prices). Volume, open interest and funding always stay in USD. Only plain entries are converted; formulas (like <code>BTC/SOL</code>) and entries with their own unit (USDJPY) are left as they are. The choice is remembered and included in Export.</p>
<p><b>Custom currency.</b> Type <code>{NAME}formula</code> in the box under Base currency, where the formula gives units of NAME per 1 USD and may use any symbol (it is fetched as a hidden feed, never shown as a block): <code>{SGD}1/coinbase:XSGD</code> (XSGD is priced in USD, so invert it). A prefix can be given as <code>{SGD:S$}…</code> (default is <code>SGD </code>). <code>{SGD}</code> alone removes it. Custom currencies live in your config overrides (<code>settings.currencies</code>), so they are in Config and Export too.</p>
<p><b>Close and add.</b> Hover a block and click the ✕ at its top-right to close it (the control block cannot be closed). Right-click empty space (or press and hold on touch) to add a block from a small popup.</p>

<p><b>Icons.</b> BTC, ETH and SOL have built-in icons. Everything else shows its letters unless you give it an icon, in one of two ways:</p>
<ol>
<li><b>In the entry's name block</b> (only for that entry): <code>{Name:icon=VALUE}formula</code>. The name may be empty: <code>{:icon=VALUE}SOL</code>.</li>
<li><b>For every card of a symbol</b>, in config: <code>{"settings":{"icons":{"DOGE":"https://.../doge.png","xyz:GOLD":"🥇"}}}</code>. The key is the full symbol (<code>xyz:GOLD</code>) or just the ticker (<code>DOGE</code>, which also matches <code>binance:DOGE</code>). A value of <code>""</code> turns an icon off (for example <code>"BTC":""</code> to use letters instead of the built-in).</li>
</ol>
<table>
<tr><td><code>https://site/icon.png</code></td><td>image URL (also <code>./icons/x.png</code> if you ship the file next to <code>index.html</code>). If it cannot be loaded (blocked, 404), the letters are shown instead.</td></tr>
<tr><td><code>base64:iVBORw0KGgo...</code></td><td>the image itself, as base64: no hosting needed. PNG, JPEG, GIF, WebP and SVG are recognized from the start of the data.</td></tr>
<tr><td><code>data:image/png;base64,...</code></td><td>a full data URL, also accepted.</td></tr>
<tr><td><code>🔥</code></td><td>up to 4 characters are shown as text (emoji work well).</td></tr>
</table>
<pre>{SOL:icon=https://example.com/fancyicon.png}SOL
{B_S:icon=base64:iVBORw0KGgoAAAANSUhEUg...}BTC/SOL
{Gold:icon=🥇}xyz:GOLD
{:icon=🐶}binance:DOGE</pre>
<p><b>Making a base64 string:</b> macOS <code>base64 -i icon.png | tr -d '\\n'</code>, Linux <code>base64 -w0 icon.png</code>, Windows PowerShell <code>[Convert]::ToBase64String([IO.File]::ReadAllBytes("icon.png"))</code>. Keep icons small (64 to 128 px, a few KB): they are stored on this device and inside your entry list and backups, so a very large image makes both heavy. Prefer a URL for big pictures. Formula entries use the letter <b>ƒ</b> unless they have an icon.</p>

<p><b>Volume bars.</b> Plain entries (not formulas) show candle volume as bars under the chart: small bars on the cards and a full volume strip in the zoom popup (hover for the exact value, and the stats row shows the total). Formulas have no volume, and an exchange whose candle config has no <code>v</code> path shows none. Bar color is green when the candle (or group of candles) closed above its open, red otherwise. The unit is the exchange's own candle volume, usually in the base coin. Turn it off with <code>{"settings":{"volume":{"show":false}}}</code>, or only on the cards with <code>"cards":false</code>.</p>
</details>
`;export{e as default};
