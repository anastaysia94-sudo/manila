const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const store = {
  read() {
    try {
      return JSON.parse(localStorage.getItem("manila.v1")) || seed();
    } catch {
      return seed();
    }
  },
  write(data) {
    localStorage.setItem("manila.v1", JSON.stringify(data));
  }
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function seed() {
  const data = {
    child: {
      name: "",
      grade: "",
      state: "CA",
      school: "",
      disability: "",
      reviewDate: "",
      services: [
        { name: "Speech", promised: 30, delivered: 0, unit: "min/week" },
        { name: "OT", promised: 30, delivered: 0, unit: "min/week" }
      ]
    },
    letters: [],
    concerns: "",
    priorities: ["", "", ""],
    customQuestions: "",
    logs: [],
    removalDays: 0,
    access: { tier: "standard", status: "none" }
  };
  store.write(data);
  return data;
}

let state = store.read();
if (!state.access) state.access = { tier: "standard", status: "none" };
let view = "home";
let lastScan = null;
let activeLetter = null;
let liveIndex = 0;
let liveSeconds = 0;
let liveTick = null;

function classify(text) {
  const t = (text || "").toLowerCase();
  let best = MANILA.letterTypes.find((x) => x.id === "generic");
  let score = 0;
  for (const type of MANILA.letterTypes) {
    const hits = type.tags.filter((tag) => t.includes(tag)).length;
    if (hits > score) {
      score = hits;
      best = type;
    }
  }
  return best;
}

function save() {
  store.write(state);
}

function navTo(name, extra) {
  view = name;
  if (extra && extra.letterId) {
    activeLetter = state.letters.find((l) => l.id === extra.letterId) || null;
  }
  if (name === "live" && !liveTick) {
    liveTick = setInterval(() => {
      liveSeconds += 1;
      const el = $("#meetClock");
      if (el) el.textContent = clockLabel(liveSeconds);
    }, 1000);
  }
  if (name !== "live" && liveTick) {
    clearInterval(liveTick);
    liveTick = null;
  }
  render();
  window.scrollTo(0, 0);
}

const DEADLINE_DAYS = {
  "iep-invite": 10,
  pwn: 10,
  "eval-consent": 60,
  eligibility: 10,
  "504-invite": 7,
  discipline: 3,
  mdr: 10,
  progress: 21,
  placement: 3,
  iee: 14,
  truancy: 7,
  generic: 7
};

function addDays(iso, days) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function letterDeadlines() {
  return state.letters
    .map((l) => {
      const days = DEADLINE_DAYS[l.typeId] || 7;
      const start = l.received || l.noticeDate;
      const due = addDays(start, days);
      return { letter: l, due, days };
    })
    .filter((x) => x.due)
    .sort((a, b) => a.due.localeCompare(b.due));
}

function exportPacket() {
  const d = letterDeadlines()
    .map((x) => `- ${x.letter.title} due ${x.due}`)
    .join("\n");
  return `MANILA FILE
${state.child.name || "child"} · grade ${state.child.grade || "—"} · ${state.child.state}
${state.child.school || ""} · ${state.child.disability || ""}
Review: ${state.child.reviewDate || "not set"}
Removal days: ${state.removalDays}
Access: ${state.access && state.access.tier === "families" ? "Families First" : "standard"}

PRIORITIES
${state.priorities.filter(Boolean).map((p, i) => `${i + 1}. ${p}`).join("\n") || "(none)"}

CONCERNS
${state.concerns || "(none)"}

SERVICES
${(state.child.services || []).map((s) => `${s.name}: ${s.delivered}/${s.promised} ${s.unit}`).join("\n")}

DEADLINES
${d || "(none)"}

MEETING LOG
${state.logs.map((l) => `${l.at} — ${l.text}`).join("\n") || "(none)"}

LETTERS
${state.letters.map((l) => `${l.received} ${l.title} (${l.from})`).join("\n") || "(none)"}

${MANILA.disclaimer}
`;
}

function clockLabel(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function ingestLetter(from, text, noticeDate) {
  const type = classify(text);
  const letter = {
    id: uid(),
    typeId: type.id,
    title: type.name,
    urgency: type.urgency,
    from: from || "",
    noticeDate: noticeDate || "",
    received: new Date().toISOString().slice(0, 10),
    text,
    notes: "",
    draft: ""
  };
  letter.draft = draftResponse(letter);
  state.letters.push(letter);
  save();
  return letter;
}

function loadSamples() {
  if (state.letters.some((l) => l.from && l.from.includes("Lincoln Elementary"))) return;
  MANILA.samples.forEach((s) => ingestLetter(s.from, s.text));
  if (!state.child.name) {
    state.child.name = "Jordan";
    state.child.grade = "4";
    state.child.school = "Lincoln Elementary";
    state.child.disability = "ADHD / SLD";
    save();
  }
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function addDays(iso, n) {
  const d = iso ? new Date(iso + "T00:00:00") : new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function recordingRule(st) {
  const all = MANILA.recording.allParty.includes(st);
  return all
    ? "All-party / two-party consent state on our starter list. Ask before recording. Announce it."
    : "Likely one-party consent on our starter list — school policy may still require notice. Announce it.";
}

function draftResponse(letter) {
  const child = state.child.name || "[child]";
  const parent = "Parent / Guardian";
  const type = MANILA.letterTypes.find((t) => t.id === letter.typeId) || MANILA.letterTypes.at(-1);
  const today = new Date().toLocaleDateString();
  const base = `Date: ${today}

To: ${letter.from || "IEP / 504 Team / Administration"}
Re: ${child} — response to ${type.name}

I am writing regarding the notice dated ${letter.noticeDate || "[date on letter]"} about ${child}.

`;
  const bodies = {
    "iep-invite": `I will attend the IEP meeting. Please send the draft IEP and any new evaluation or progress data at least three school days before the meeting so I can participate meaningfully.

Please add the following to the agenda:
1. Parent concerns (attached / to be provided)
2. Service minutes delivered versus written
3. [priority]

I am not prepared to sign a completed IEP at the close of the meeting. Please send the revised draft afterward.`,
    pwn: `I have received the Prior Written Notice. I disagree with the following: ${letter.notes || "[describe]"}.

Please convene an IEP meeting to discuss this decision and provide any additional data the team relied on. Please confirm receipt of this disagreement in writing.`,
    "eval-consent": `I consent to a comprehensive evaluation of ${child}. Please evaluate in the areas of ${state.child.disability || "academics, speech/language, occupational therapy, behavior / attention, and any other area of suspected disability"}.

Please send the list of assessments you intend to use and calendar the due date from the day you receive this signed consent.`,
    eligibility: `I have received the eligibility decision. I disagree with the determination that ${child} ${letter.notes || "does not qualify / qualifies only under the stated category"}.

I am requesting a copy of the full evaluation report and Prior Written Notice of the decision. I am also requesting an Independent Educational Evaluation at public expense.`,
    "504-invite": `I will attend the 504 meeting. My requested accommodations for ${child} are listed below. I want each one written, with a person responsible and a plan for how we will know it is implemented.

${state.priorities.filter(Boolean).map((p, i) => `${i + 1}. ${p}`).join("\n") || "1. [accommodation]\n2. [accommodation]"}`,
    discipline: `I am writing about the disciplinary removal of ${child} on ${letter.noticeDate || "[date]"}. Please provide, in writing:
- the current total school days of removal this school year
- the incident report
- whether the IEP / BIP was being implemented that day

If this removal brings ${child} near 10 school days, I am requesting a Manifestation Determination Review.`,
    mdr: `I will attend the Manifestation Determination Review. Please send all incident reports, the current IEP and BIP, and service logs before the meeting.

The questions I want answered on the record:
1. Was the conduct caused by, or did it have a direct and substantial relationship to, the disability?
2. Was the conduct a direct result of a failure to implement the IEP?`,
    progress: `I reviewed the progress report for ${child}. I have questions about goals that show little or no measurable change. Please add goal progress and service-delivery minutes to the next IEP agenda.`,
    placement: `I do not consent to a change of placement for ${child} based on the notice dated ${letter.noticeDate || "[date]"}. Placement is an IEP team decision. Please convene the team before any move and send the data that the current setting cannot work with additional supports.`,
    iee: `I disagree with the district evaluation of ${child} and I am requesting an Independent Educational Evaluation at public expense. Please send the district's IEE criteria and any approved-evaluator information, without unnecessary delay.`,
    truancy: `I received the attendance notice regarding ${child}. Several absences are connected to disability-related needs / anxiety / medical issues. Please schedule an IEP or 504 meeting to address attendance as a student need rather than only as a parent compliance issue.`,
    generic: `Please confirm receipt of this letter and tell me, in writing, the deadline and what you are asking me to do regarding ${child}.`
  };
  return base + (bodies[letter.typeId] || bodies.generic) + `\n\nSincerely,\n${parent}\n`;
}

function meetingDeck() {
  const name = state.child.name || "my child";
  const pri = state.priorities.filter(Boolean);
  return `MEETING DECK — ${name}
Do not sign in the room.

Top priorities
${pri.length ? pri.map((p, i) => `${i + 1}. ${p}`).join("\n") : "1. \n2. \n3. "}

Parent concerns
${state.concerns || "(write these before the meeting — written concerns enter the record)"}

Questions I will ask
${MANILA.questions.slice(0, 5).map((q) => "• " + q).join("\n")}

Close
"Please send the revised draft. I will respond in writing. I am not signing tonight."
`;
}

function fapeCard() {
  const name = state.child.name || "my child";
  const f = MANILA.fape;
  return `FAPE CARD — ${name}
Free Appropriate Public Education  ·  not legal advice

THE SENTENCE
${f.endrew}

LEAST RESTRICTIVE ENVIRONMENT
${f.lre}

ASK IN THE ROOM
${f.question}

IF THEY REFUSE
${f.pwn}

CLOSE
${f.sign}

FAPE is not the best program money can buy.
FAPE is also not a junker program or a staffing chart.
Passing grades do not end FAPE.
`;
}

function lreCard() {
  const name = state.child.name || "my child";
  const l = MANILA.lre;
  return `LRE CARD — ${name}
Least Restrictive Environment  ·  not legal advice

THE STATUTE
${l.statute}

THE CONTINUUM
${l.continuum}

NOT LEGAL REASONS
${l.illegal}

ASK IN THE ROOM
${l.ask}
${l.questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

IF THEY MOVE THE CHILD
${l.pwn}

CLOSE
${MANILA.fape.sign}

LRE is not full inclusion at any cost.
LRE is also not a classroom assigned by eligibility label.
`;
}

function afterEmail() {
  const name = state.child.name || "[child]";
  const notes = state.logs.slice(-6).map((l) => `- ${l.text}`).join("\n") || "- [decision 1]\n- [decision 2]";
  return `Subject: Follow-up — IEP / 504 meeting for ${name}

Thank you for meeting today about ${name}.

My understanding of what the team decided:
${notes}

Please send the revised draft and Prior Written Notice for any refused requests. I will respond in writing after I review the draft. I did not sign a final plan at the meeting.

Please confirm anything I have misunderstood.

Thank you,
Parent / Guardian
`;
}

function layout(inner) {
  return `
    <header class="top">
      <div class="brand">
        <div class="logo">
          <svg viewBox="0 0 64 64" fill="none"><path d="M12 18h32c2 0 4 2 4 4v28c0 2-2 4-4 4H12c-2 0-4-2-4-4V22c0-2 2-4 4-4z" fill="#e8c07a"/><path d="M16 14h28c1.6 0 3 1.4 3 3v3H13v-3c0-1.6 1.4-3 3-3z" fill="#c9a45c"/></svg>
        </div>
        <div>
          <h1>Manila</h1>
          <small>Letters + war room</small>
        </div>
      </div>
      <button class="ghost" data-go="practice">${state.access && state.access.tier === "families" ? "Families First" : "Price"}</button>
    </header>
    ${inner}
    <nav class="nav">
      <button data-go="home" class="${view === "home" ? "active" : ""}"><b>▣</b>Inbox</button>
      <button data-go="decode" class="${view === "decode" ? "active" : ""}"><b>✉</b>Letter</button>
      <button data-go="prep" class="${view === "prep" || view === "live" ? "active" : ""}"><b>▤</b>Room</button>
      <button data-go="child" class="${view === "child" ? "active" : ""}"><b>◑</b>File</button>
      <button data-go="rights" class="${view === "rights" ? "active" : ""}"><b>§</b>Rights</button>
    </nav>
  `;
}

function viewHome() {
  const letters = [...state.letters].reverse();
  return layout(`
    <section class="hero">
      <h2>The letter arrived. The meeting is Thursday.</h2>
      <p>Decode the paper. Write it into the record. Walk in with three priorities and a spine.</p>
    </section>
    <div class="actions">
      <button class="btn primary" data-go="decode">New letter</button>
      <button class="btn secondary" data-go="live">Open live room</button>
    </div>
    ${
      state.access && state.access.tier === "families"
        ? `<section class="section"><div class="card okbox"><h4>Families First is on</h4><p>Advocacy rates are halved. School letters and the war room stay free.</p></div></section>`
        : `<section class="section"><div class="card list-item" data-go="aid"><h4>Can't float $150/hour?</h4><p class="muted">Upload Medicaid, EBT, or free-lunch proof. On-device scan. Auto-discount if it matches your state.</p></div></section>`
    }
    <section class="section">
      <h3>Inbox</h3>
      ${
        letters.length
          ? letters
              .map(
                (l) => `
        <article class="card list-item" data-open="${l.id}">
          <div class="row">
            <h4>${escapeHtml(l.title)}</h4>
            <span class="badge ${l.urgency}">${l.urgency}</span>
          </div>
          <p class="muted">${escapeHtml(l.from || "School")} · received ${formatDate(l.received)}</p>
        </article>`
              )
              .join("")
          : `<div class="card empty"><p>No letters yet. Photograph the paper, then paste what it says.</p>
             <div style="height:10px"></div>
             <button class="btn secondary" id="loadSamples">Load 3 sample letters</button></div>`
      }
    </section>
    <section class="section">
      <h3>This week</h3>
      <div class="card">
        <div class="row"><h4>${state.child.name || "Add your child"}</h4><span class="tiny">${state.child.state || ""}</span></div>
        <p class="muted">Review ${state.child.reviewDate ? formatDate(state.child.reviewDate) : "date not set"} · removal days logged: ${state.removalDays}</p>
      </div>
      ${
        state.removalDays >= 8
          ? `<div class="warn"><b>Removal clock.</b> ${state.removalDays} days logged. Near 10 school days, request a manifestation determination in writing.</div>`
          : ""
      }
    </section>
    ${
      letterDeadlines().length
        ? `<section class="section"><h3>Clocks</h3>${letterDeadlines()
            .slice(0, 5)
            .map((x) => {
              const soon = x.due <= new Date().toISOString().slice(0, 10);
              return `<div class="card list-item" data-open="${x.letter.id}"><div class="row"><h4>${escapeHtml(x.letter.title)}</h4><span class="badge ${soon ? "critical" : "high"}">${formatDate(x.due)}</span></div><p class="muted">${x.days} days from receipt · ${escapeHtml(x.letter.from || "")}</p></div>`;
            })
            .join("")}</section>`
        : ""
    }
  `);
}

function viewDecode() {
  return layout(`
    <section class="hero">
      <h2>Panic paper.</h2>
      <p>Paste the letter. Manila names it, tells you the cost of ignoring it, and drafts the reply.</p>
    </section>
    <section class="section">
      <div class="card">
        <label>Paste the letter text</label>
        <textarea id="letterText" placeholder="Dear Parent/Guardian, This letter is to invite you to an IEP team meeting..."></textarea>
        <label>Who sent it</label>
        <input id="letterFrom" placeholder="Lincoln Elementary / Special Education" />
        <label>Date on the letter</label>
        <input id="letterDate" type="date" />
        <div style="height:12px"></div>
        <button class="btn primary wide" id="classifyBtn">Decode this letter</button>
      </div>
      <div class="card">
        <h4>Try a sample</h4>
        <p class="muted">If you do not have a letter in hand, decode one of these.</p>
        <div class="chips" style="margin-top:8px">
          <button class="chip" data-sample="0">IEP invite</button>
          <button class="chip" data-sample="1">Prior Written Notice</button>
          <button class="chip" data-sample="2">Suspension</button>
        </div>
      </div>
      <p class="tiny">${MANILA.disclaimer}</p>
    </section>
  `);
}

function viewLetter() {
  if (!activeLetter) return viewDecode();
  const type = MANILA.letterTypes.find((t) => t.id === activeLetter.typeId) || MANILA.letterTypes.at(-1);
  return layout(`
    <section class="hero">
      <div class="row"><h2>${escapeHtml(type.name)}</h2><span class="badge ${type.urgency}">${type.urgency}</span></div>
      <p>${escapeHtml(type.meaning)}</p>
    </section>
    <section class="section">
      <div class="warn"><b>If you ignore it.</b> ${escapeHtml(type.ignore)}</div>
      <div class="card">
        <h3>Do this next</h3>
        ${type.doNext.map((d) => `<p>• ${escapeHtml(d)}</p>`).join("")}
        <p class="tiny" style="margin-top:8px">${escapeHtml(type.deadlineHint)}</p>
      </div>
      <div class="card">
        <h3>Reply draft</h3>
        <textarea id="draftBox">${escapeHtml(activeLetter.draft)}</textarea>
        <div style="height:10px"></div>
        <div class="grid2">
          <button class="btn secondary" id="copyDraft">Copy letter</button>
          <button class="btn primary" data-go="prep">Use in meeting prep</button>
        </div>
        <div style="height:8px"></div>
        <button class="btn wide" id="deleteLetter" style="background:#fff;border:1px solid var(--line)">Delete this letter</button>
      </div>
    </section>
  `);
}

function viewPrep() {
  return layout(`
    <section class="hero">
      <h2>Don’t walk in empty.</h2>
      <p>Written concerns enter the record. Verbal ones evaporate when the clock runs out.</p>
    </section>
    <section class="section">
      <div class="card">
        <label>Parent concerns (this becomes the letter)</label>
        <textarea id="concerns">${escapeHtml(state.concerns)}</textarea>
        <label>Priority 1</label>
        <input id="p1" value="${escapeHtml(state.priorities[0] || "")}" placeholder="Write speech minutes back to 60" />
        <label>Priority 2</label>
        <input id="p2" value="${escapeHtml(state.priorities[1] || "")}" placeholder="Testing accommodations in every class" />
        <label>Priority 3</label>
        <input id="p3" value="${escapeHtml(state.priorities[2] || "")}" placeholder="Behavior plan actually followed" />
        <div style="height:12px"></div>
        <button class="btn primary wide" id="savePrep">Save pack</button>
      </div>
      <div class="actions">
        <button class="btn secondary" data-go="live">Start live room</button>
        <button class="btn" id="copyDeck" style="background:#fff;border:1px solid var(--line)">Copy one-pager</button>
      </div>
      <div class="card">
        <h3>After the meeting</h3>
        <p class="muted">Send the reconstruction email the same night so their notes are not the only record.</p>
        <div style="height:8px"></div>
        <button class="btn secondary wide" id="copyAfter">Copy follow-up email</button>
      </div>
    </section>
  `);
}

function viewLive() {
  const item = MANILA.theySay[liveIndex];
  return layout(`
    <section class="hero">
      <div class="row">
        <h2>You are still at the table.</h2>
        <span class="badge high" id="meetClock">${clockLabel(liveSeconds)}</span>
      </div>
      <p>Card ${liveIndex + 1} of ${MANILA.theySay.length}. One line. Then log what they said.</p>
    </section>
    <section class="section">
      <div class="card live-card">
        <div>
          <div class="script"><div class="k">They say</div><h4>${escapeHtml(item.they)}</h4></div>
          <div class="script" style="border-left-color:#2f5d50"><div class="k">You say</div><h4>${escapeHtml(item.you)}</h4></div>
        </div>
        <div class="pager">
          <button class="btn secondary" id="prevCard">Prev</button>
          <button class="btn primary" id="nextCard" style="flex:1">Next card</button>
        </div>
      </div>
      <div class="card">
        <label>Log a sentence (who said what)</label>
        <input id="logLine" placeholder="AP: we don't have OT staff this year" />
        <div style="height:8px"></div>
        <button class="btn wide" id="addLog" style="background:#fff;border:1px solid var(--line)">Pin to file</button>
        ${state.logs
          .slice()
          .reverse()
          .slice(0, 5)
          .map((l) => `<p class="tiny" style="margin-top:8px">${escapeHtml(l.at)} — ${escapeHtml(l.text)}</p>`)
          .join("")}
      </div>
      <div class="warn"><b>Do not sign tonight.</b> “Please send the revised draft. I will respond in writing.”</div>
    </section>
  `);
}

function viewChild() {
  const svc = state.child.services
    .map(
      (s, i) => `
      <div class="card">
        <div class="row"><h4>${escapeHtml(s.name)}</h4><span class="tiny">${escapeHtml(s.unit)}</span></div>
        <div class="grid2">
          <div><label>Promised</label><input type="number" data-svc="${i}" data-field="promised" value="${s.promised}" /></div>
          <div><label>Delivered this week</label><input type="number" data-svc="${i}" data-field="delivered" value="${s.delivered}" /></div>
        </div>
      </div>`
    )
    .join("");
  return layout(`
    <section class="hero">
      <h2>The child file.</h2>
      <p>Promises live here. So do removal days. Advocates will ask for both.</p>
    </section>
    <section class="section">
      <div class="card">
        <label>Child name</label>
        <input id="cname" value="${escapeHtml(state.child.name)}" />
        <div class="grid2">
          <div><label>Grade</label><input id="cgrade" value="${escapeHtml(state.child.grade)}" /></div>
          <div>
            <label>State</label>
            <select id="cstate">${MANILA.states
              .map((s) => `<option ${s === state.child.state ? "selected" : ""}>${s}</option>`)
              .join("")}</select>
          </div>
        </div>
        <label>School</label>
        <input id="cschool" value="${escapeHtml(state.child.school)}" />
        <label>Disability / suspected need</label>
        <input id="cdis" value="${escapeHtml(state.child.disability)}" placeholder="ADHD, autism, SLD, speech…" />
        <label>Annual review date</label>
        <input id="creview" type="date" value="${state.child.reviewDate || ""}" />
        <div style="height:10px"></div>
        <button class="btn primary wide" id="saveChild">Save file</button>
      </div>
      <h3>Service minutes</h3>
      ${svc}
      <div class="card">
        <label>Disciplinary removal days this school year</label>
        <input id="removals" type="number" value="${state.removalDays}" />
        <p class="tiny">Near 10 school days, request a manifestation determination in writing.</p>
        <div style="height:8px"></div>
        <button class="btn secondary wide" id="saveRemovals">Update clock</button>
      </div>
      <button class="btn wide" id="exportFile" style="background:#fff;border:1px solid var(--line)">Copy whole file</button>
    </section>
  `);
}

function viewRights() {
  const st = state.child.state || "CA";
  const f = MANILA.fape;
  return layout(`
    <section class="hero">
      <h2>A short spine.</h2>
      <p>Not the whole of IDEA. The lines that change a Thursday meeting.</p>
    </section>
    <section class="section">
      <div class="card fape-card">
        <p class="tiny">One-page FAPE card</p>
        <h4>Free Appropriate Public Education</h4>
        <div class="script" style="margin-top:10px">
          <div class="k">The sentence — Endrew F. (2017)</div>
          <p>${escapeHtml(f.endrew)}</p>
        </div>
        <div class="script" style="border-left-color:#2f5d50">
          <div class="k">Least restrictive environment</div>
          <p>${escapeHtml(f.lre)}</p>
        </div>
        <div class="script" style="border-left-color:#9b2c2c">
          <div class="k">Ask in the room</div>
          <p>${escapeHtml(f.question)}</p>
        </div>
        <p style="margin-top:10px"><b>If they refuse.</b> ${escapeHtml(f.pwn)}</p>
        <p style="margin-top:8px"><b>Close.</b> ${escapeHtml(f.sign)}</p>
        <p class="tiny" style="margin-top:10px">Not the best program money can buy. Not a junker. Passing grades do not end FAPE.</p>
        <div style="height:10px"></div>
        <button class="btn primary wide" id="copyFape">Copy FAPE card</button>
      </div>
      <div class="card fape-card">
        <p class="tiny">One-page LRE card</p>
        <h4>Least Restrictive Environment</h4>
        <div class="script" style="margin-top:10px">
          <div class="k">The statute</div>
          <p>${escapeHtml(MANILA.lre.statute)}</p>
        </div>
        <div class="script" style="border-left-color:#2f5d50">
          <div class="k">Ask in the room</div>
          <p>${escapeHtml(MANILA.lre.ask)}</p>
        </div>
        ${MANILA.lre.questions.map((q) => `<p style="margin-top:8px">• ${escapeHtml(q)}</p>`).join("")}
        <p style="margin-top:10px"><b>Not legal reasons.</b> ${escapeHtml(MANILA.lre.illegal)}</p>
        <p style="margin-top:8px"><b>If they move the child.</b> ${escapeHtml(MANILA.lre.pwn)}</p>
        <p class="tiny" style="margin-top:10px">Not full inclusion at any cost. Not a room assigned by eligibility label. Neighborhood school unless the IEP requires otherwise.</p>
        <div style="height:10px"></div>
        <button class="btn secondary wide" id="copyLre">Copy LRE card</button>
      </div>
      <div class="card fape-card">
        <p class="tiny">Stay-put</p>
        <h4>${escapeHtml(MANILA.stayput.title)}</h4>
        <p style="margin-top:8px">${escapeHtml(MANILA.stayput.statute)}</p>
        <div class="script" style="margin-top:10px;border-left-color:#9b2c2c">
          <div class="k">Say in the room</div>
          <p>${escapeHtml(MANILA.stayput.say)}</p>
        </div>
        <p class="tiny" style="margin-top:10px">${escapeHtml(MANILA.stayput.close)}</p>
        <div style="height:10px"></div>
        <button class="btn secondary wide" id="copyStay">Copy stay-put card</button>
      </div>
      <div class="card fape-card">
        <p class="tiny">Compensatory education</p>
        <h4>${escapeHtml(MANILA.comped.title)}</h4>
        <p style="margin-top:8px">${escapeHtml(MANILA.comped.statute)}</p>
        <div class="script" style="margin-top:10px;border-left-color:#2f5d50">
          <div class="k">Say in the room</div>
          <p>${escapeHtml(MANILA.comped.say)}</p>
        </div>
        <p class="tiny" style="margin-top:10px">${escapeHtml(MANILA.comped.close)}</p>
        <div style="height:10px"></div>
        <button class="btn secondary wide" id="copyComp">Copy comp-ed card</button>
      </div>
      <div class="card">
        <h4>Recording in ${st}</h4>
        <p>${recordingRule(st)}</p>
        <p class="tiny">${MANILA.recording.note}</p>
      </div>
      <div class="card">
        <h4>You do not have to sign today</h4>
        <p>Ask for the draft. Take it home. Respond in writing. A signature in the last four minutes is how bad plans get locked.</p>
      </div>
      <div class="card">
        <h4>Prior Written Notice</h4>
        <p>If they refuse a request, ask for PWN: what they refused, why, what they considered, what data they used.</p>
      </div>
      <div class="card">
        <h4>Meaningful participation</h4>
        <p>You are a required team member. Ask for evaluations and the draft before the meeting. “We don’t do drafts” is a habit, not a federal rule.</p>
      </div>
      <div class="card">
        <h4>Find a human</h4>
        <p class="muted">Every state has a federally funded parent training and information center. Start here, then COPAA if you need a paid advocate.</p>
        <div style="height:8px"></div>
        <a class="btn secondary wide" style="display:block;text-align:center;text-decoration:none" href="${MANILA.parentCenters}" target="_blank" rel="noopener">Find your parent center</a>
      </div>
      <p class="tiny">${MANILA.disclaimer}</p>
    </section>
  `);
}

function scoreAid(text, program, st) {
  const t = String(text || "").toLowerCase();
  const hits = [];
  const national = MANILA.aid.national[program] || [];
  let nHits = 0;
  national.forEach((w) => {
    if (t.includes(w)) {
      hits.push(w);
      nHits += 1;
    }
  });
  const local = MANILA.aid.stateMarks[st] || [];
  let sHits = 0;
  local.forEach((w) => {
    if (t.includes(w)) {
      hits.push(w);
      sHits += 1;
    }
  });
  if (t.includes(st.toLowerCase())) {
    hits.push(st);
    sHits += 1;
  }
  const statusWords = /eligib|approved|active\b|benefits identification|member id|case number|recipient|household/.test(t);
  const approved = nHits >= 1 && (sHits >= 1 || nHits >= 2 || statusWords);
  const summary = approved
    ? `Document language matched ${program} plus ${st} or a live-benefit phrase. Families First applied.`
    : `Not enough overlap with ${st} ${program} templates. Add the visible text from the card or a clearer photo.`;
  return { approved, hits: [...new Set(hits)], summary, nHits, sHits };
}

async function runAidScan() {
  const program = $("#aidProgram").value;
  const st = $("#aidState").value;
  const typed = $("#aidText").value || "";
  const file = $("#aidFile").files && $("#aidFile").files[0];
  const btn = $("#scanAid");
  if (!typed.trim() && !file) {
    lastScan = { approved: false, hits: [], summary: "Add a photo or the words printed on the document." };
    render();
    return;
  }
  btn.disabled = true;
  btn.textContent = "Scanning against state templates…";
  let extracted = `${typed} ${file ? file.name : ""}`;
  if (file && file.type.startsWith("image/") && window.Tesseract) {
    try {
      const res = await window.Tesseract.recognize(file, "eng");
      extracted += " " + ((res.data && res.data.text) || "");
    } catch (err) {
      extracted += " ";
    }
  }
  const verdict = scoreAid(extracted, program, st);
  lastScan = verdict;
  if (verdict.approved) {
    const label = MANILA.aid.programs.find((p) => p.id === program);
    state.access = {
      tier: "families",
      status: "approved",
      program: label ? label.name : program,
      state: st,
      reason: verdict.summary,
      at: new Date().toISOString().slice(0, 10)
    };
    save();
  }
  navTo("aid");
}

function prices() {
  const off = state.access && state.access.tier === "families";
  return {
    off,
    zoom: off ? "$65–$99" : "$129–$199",
    review: off ? "$175–$300" : "$350–$600",
    sit: off ? "$375–$600" : "$750–$1,200",
    hour: off ? "$75" : "$150",
    app: off ? "Free" : "$9/month after the letter tools"
  };
}

function viewPractice() {
  const p = prices();
  return layout(`
    <section class="hero">
      <h2>${p.off ? "Families First rates." : "Run this at $150/hour."}</h2>
      <p>${p.off ? "Medicaid, EBT, or school-meal proof is on file. Same work. Half the invoice." : "Manila is the factory. You are the advocate in the chair — or the product sold to people who already are."}</p>
    </section>
    <section class="section">
      <div class="card">
        <div class="price">${p.zoom}</div>
        <p>60-minute strategy Zoom. Parent arrives with the letter decoded and the concerns draft.</p>
      </div>
      <div class="card">
        <div class="price">${p.review}</div>
        <p>Record review + parent concerns letter + one-page meeting deck.</p>
      </div>
      <div class="card">
        <div class="price">${p.sit}</div>
        <p>Prep plus you sit in the meeting. Same file. Live cards. After-email the same night.</p>
      </div>
      <div class="card okbox">
        <h4>${p.off ? "Families First · " + p.hour + "/hour" : "8 billable hours / week at $150"}</h4>
        <p>${p.off ? "Approved against " + escapeHtml(state.access.program || "benefits") + " patterns for " + escapeHtml(state.access.state || state.child.state) + "." : "About $62k on the side. 15 hours is six figures. August–November and April–June are the season."}</p>
      </div>
      <button class="btn secondary wide" data-go="aid">${p.off ? "Manage proof" : "Apply Families First"}</button>
      <p class="tiny" style="margin-top:10px">This screen is the business model, not a checkout. No fees are collected in this demo.</p>
    </section>
  `);
}

function viewAid() {
  const st = state.child.state || "CA";
  const marks = (MANILA.aid.stateMarks[st] || []).join(", ") || "state Medicaid / SNAP portal name";
  const access = state.access || { status: "none" };
  const scan = lastScan;
  return layout(`
    <section class="hero">
      <h2>Families First.</h2>
      <p>Upload Medicaid, EBT, or a free-lunch letter. The scan stays on this phone and is checked against ${st} document language.</p>
    </section>
    <section class="section">
      ${
        access.tier === "families"
          ? `<div class="card okbox"><h4>Approved</h4><p>${escapeHtml(access.program)} · ${escapeHtml(access.state)} · ${escapeHtml(access.reason || "")}</p>
             <div style="height:8px"></div><button class="btn" id="clearAid" style="background:#fff;border:1px solid var(--line)">Remove discount</button></div>`
          : ""
      }
      <div class="card">
        <label>Program</label>
        <select id="aidProgram">
          ${MANILA.aid.programs.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}
        </select>
        <label>State on the document</label>
        <select id="aidState">${MANILA.states.map((s) => `<option ${s === st ? "selected" : ""}>${s}</option>`).join("")}</select>
        <label>Photo or PDF of the card / approval letter</label>
        <input id="aidFile" type="file" accept="image/*,.pdf,application/pdf" />
        <label>Optional: type any text you can see (helps PDFs and blurry photos)</label>
        <textarea id="aidText" placeholder="Medi-Cal Benefits Identification Card, CalFresh EBT, Free and Reduced Price Meal approval…"></textarea>
        <div style="height:12px"></div>
        <button class="btn primary wide" id="scanAid">Scan and auto-approve</button>
        <p class="tiny" style="margin-top:8px">On-device compare. This demo does not upload your proof to a server. A live product should delete the image after the verdict.</p>
      </div>
      <div class="card">
        <h4>What ${st} proof usually looks like</h4>
        <p class="muted">Scanner looks for national program words plus local marks such as: ${escapeHtml(marks)}.</p>
      </div>
      <div id="aidResult">${
        scan
          ? `<div class="card ${scan.approved ? "okbox" : "warn"}"><h4>${scan.approved ? "Match — discount on" : "No automatic match"}</h4><p>${escapeHtml(scan.summary)}</p><p class="tiny">Hits: ${escapeHtml((scan.hits || []).join(", ") || "none")}</p></div>`
          : ""
      }</div>
    </section>
  `);
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  const root = $("#app");
  const map = {
    home: viewHome,
    decode: viewDecode,
    letter: viewLetter,
    prep: viewPrep,
    live: viewLive,
    child: viewChild,
    rights: viewRights,
    practice: viewPractice,
    aid: viewAid
  };
  root.innerHTML = (map[view] || viewHome)();
  bind();
}

function bind() {
  $$("[data-go]").forEach((b) => b.addEventListener("click", () => navTo(b.dataset.go)));
  $$("[data-open]").forEach((b) =>
    b.addEventListener("click", () => {
      activeLetter = state.letters.find((l) => l.id === b.dataset.open);
      navTo("letter");
    })
  );

  const loadSamplesBtn = $("#loadSamples");
  if (loadSamplesBtn) {
    loadSamplesBtn.onclick = () => {
      loadSamples();
      navTo("home");
    };
  }
  $$("[data-sample]").forEach((b) => {
    b.onclick = () => {
      const s = MANILA.samples[Number(b.dataset.sample)];
      if (!s) return;
      $("#letterText").value = s.text;
      $("#letterFrom").value = s.from;
    };
  });

  const classifyBtn = $("#classifyBtn");
  if (classifyBtn) {
    classifyBtn.onclick = () => {
      const text = $("#letterText").value.trim();
      if (!text) return;
      const type = classify(text);
      const letter = {
        id: uid(),
        typeId: type.id,
        title: type.name,
        urgency: type.urgency,
        from: $("#letterFrom").value,
        noticeDate: $("#letterDate").value,
        received: new Date().toISOString().slice(0, 10),
        text,
        notes: "",
        draft: ""
      };
      letter.draft = draftResponse(letter);
      state.letters.push(letter);
      save();
      activeLetter = letter;
      navTo("letter");
    };
  }

  const copyDraft = $("#copyDraft");
  if (copyDraft) {
    copyDraft.onclick = () => {
      const t = $("#draftBox").value;
      if (activeLetter) {
        activeLetter.draft = t;
        save();
      }
      navigator.clipboard.writeText(t);
      copyDraft.textContent = "Copied";
    };
  }

  const savePrep = $("#savePrep");
  if (savePrep) {
    savePrep.onclick = () => {
      state.concerns = $("#concerns").value;
      state.priorities = [$("#p1").value, $("#p2").value, $("#p3").value];
      save();
      savePrep.textContent = "Saved";
    };
  }
  const copyDeck = $("#copyDeck");
  if (copyDeck) copyDeck.onclick = () => navigator.clipboard.writeText(meetingDeck());
  const copyAfter = $("#copyAfter");
  if (copyAfter) copyAfter.onclick = () => navigator.clipboard.writeText(afterEmail());
  const copyFape = $("#copyFape");
  if (copyFape) {
    copyFape.onclick = () => {
      navigator.clipboard.writeText(fapeCard());
      copyFape.textContent = "Copied";
    };
  }
  const copyLre = $("#copyLre");
  if (copyLre) {
    copyLre.onclick = () => {
      navigator.clipboard.writeText(lreCard());
      copyLre.textContent = "Copied";
    };
  }
  const copyStay = $("#copyStay");
  if (copyStay) {
    copyStay.onclick = () => {
      const s = MANILA.stayput;
      navigator.clipboard.writeText(`STAY-PUT CARD\n\n${s.statute}\n\nSAY\n${s.say}\n\n${s.close}\n`);
      copyStay.textContent = "Copied";
    };
  }
  const copyComp = $("#copyComp");
  if (copyComp) {
    copyComp.onclick = () => {
      const s = MANILA.comped;
      navigator.clipboard.writeText(`COMPENSATORY EDUCATION CARD\n\n${s.statute}\n\nSAY\n${s.say}\n\n${s.close}\n`);
      copyComp.textContent = "Copied";
    };
  }
  const deleteLetter = $("#deleteLetter");
  if (deleteLetter && activeLetter) {
    deleteLetter.onclick = () => {
      state.letters = state.letters.filter((l) => l.id !== activeLetter.id);
      activeLetter = null;
      save();
      navTo("home");
    };
  }
  const exportFile = $("#exportFile");
  if (exportFile) {
    exportFile.onclick = () => {
      navigator.clipboard.writeText(exportPacket());
      exportFile.textContent = "Copied";
    };
  }

  const next = $("#nextCard");
  const prev = $("#prevCard");
  if (next)
    next.onclick = () => {
      liveIndex = (liveIndex + 1) % MANILA.theySay.length;
      render();
    };
  if (prev)
    prev.onclick = () => {
      liveIndex = (liveIndex - 1 + MANILA.theySay.length) % MANILA.theySay.length;
      render();
    };
  const addLog = $("#addLog");
  if (addLog) {
    addLog.onclick = () => {
      const text = $("#logLine").value.trim();
      if (!text) return;
      state.logs.push({ at: new Date().toLocaleString(), text });
      save();
      render();
    };
  }

  const saveChild = $("#saveChild");
  if (saveChild) {
    saveChild.onclick = () => {
      state.child.name = $("#cname").value;
      state.child.grade = $("#cgrade").value;
      state.child.state = $("#cstate").value;
      state.child.school = $("#cschool").value;
      state.child.disability = $("#cdis").value;
      state.child.reviewDate = $("#creview").value;
      save();
      saveChild.textContent = "Saved";
    };
  }
  $$("[data-svc]").forEach((inp) => {
    inp.addEventListener("change", () => {
      const i = Number(inp.dataset.svc);
      state.child.services[i][inp.dataset.field] = Number(inp.value || 0);
      save();
    });
  });
  const scanAid = $("#scanAid");
  if (scanAid) {
    scanAid.onclick = () => runAidScan();
  }
  const clearAid = $("#clearAid");
  if (clearAid) {
    clearAid.onclick = () => {
      state.access = { tier: "standard", status: "none" };
      lastScan = null;
      save();
      navTo("aid");
    };
  }

  const saveRemovals = $("#saveRemovals");
  if (saveRemovals) {
    saveRemovals.onclick = () => {
      state.removalDays = Number($("#removals").value || 0);
      save();
      saveRemovals.textContent = state.removalDays >= 8 ? "Near MDR line" : "Updated";
    };
  }
}

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
  render();
});
