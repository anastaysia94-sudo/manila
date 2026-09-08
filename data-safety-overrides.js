(()=>{
  'use strict';
  const m=window.MANILA;if(!m)return;
  const byId=id=>m.letterTypes.find(x=>x.id===id);
  const set=(id,patch)=>Object.assign(byId(id)||{},patch);

  m.sourceReview={
    reviewedAt:'2026-09-08',
    scope:'Federal IDEA baseline only. State law, district procedure, Section 504 procedure, recording law, and individual facts can differ and require current local verification.',
    sources:[
      {id:'IDEA-300.322',label:'34 C.F.R. § 300.322 — Parent participation',url:'https://sites.ed.gov/idea/regs/b/d/300.322'},
      {id:'IDEA-300.301',label:'34 C.F.R. § 300.301 — Initial evaluations',url:'https://sites.ed.gov/idea/regs/b/d/300.301'},
      {id:'IDEA-300.502',label:'34 C.F.R. § 300.502 — Independent educational evaluation',url:'https://sites.ed.gov/idea/regs/b/e/300.502'},
      {id:'IDEA-300.530',label:'34 C.F.R. § 300.530 — Discipline and manifestation determination',url:'https://sites.ed.gov/idea/regs/b/e/300.530'},
      {id:'PTI',label:'Center for Parent Information and Resources — Find your Parent Center',url:'https://www.parentcenterhub.org/find-your-center/'}
    ]
  };

  set('iep-invite',{
    meaning:'The school is calling an IEP Team meeting. IDEA requires the public agency to take steps to ensure parent participation, including notice early enough to attend and notice of the purpose, time, location, and who will attend.',
    doNext:[
      'Reply in writing that you will attend, or propose alternative times if needed.',
      'Ask for available draft materials and new evaluations early enough for meaningful participation; federal IDEA does not create one universal 2–3 day draft deadline.',
      'Open Meeting Prep and lock your top 3 concerns.',
      'Do not sign consent or agreement you do not understand. Ask what any signature means and request a copy.'
    ],
    deadlineHint:'Manila organization target: reply promptly. The federal rule is notice early enough for an opportunity to attend, not a universal 2-school-day response deadline.'
  });

  set('pwn',{
    ignore:'If you disagree, preserving the disagreement in writing can make the record clearer. Procedural deadlines depend on the action, state rules, and dispute path; silence should not be described as automatic legal acceptance.',
    deadlineHint:'No universal federal 7–10 day response deadline applies to every PWN. Read the notice and procedural safeguards, verify any state deadline, and respond promptly if you disagree.'
  });

  set('eval-consent',{
    meaning:'They want permission to evaluate your child, or they are responding to an evaluation request. Under the federal IDEA baseline, an initial evaluation must be completed within 60 days after parental consent unless the state establishes its own timeframe; regulatory exceptions also apply.',
    deadlineHint:'Record the date the agency receives consent, then verify the current state timeline and any exceptions. Do not assume every state uses the federal 60-day timeframe.'
  });

  set('eligibility',{
    ignore:'If you disagree with an eligibility decision, delaying can make records and next steps harder to organize. The relevant dispute timelines are jurisdiction- and procedure-specific.',
    deadlineHint:'No universal federal 10-day disagreement deadline applies to every eligibility decision. Review the procedural safeguards and current state rules promptly.'
  });

  set('504-invite',{
    meaning:'This concerns disability access under Section 504 rather than IDEA special-education eligibility alone. Supports should respond to the individual student’s disability-related needs; local procedures and documentation format can vary.',
    ignore:'Verbal or informal support can be hard to track across staff changes. Ask how approved accommodations will be documented, communicated, implemented, and reviewed.',
    deadlineHint:'Reply before the meeting when practical and verify any district or state-specific procedure shown in the notice.'
  });

  set('discipline',{
    meaning:'Days of removal matter, but the legal rules are more precise than a simple “10-day MDR” slogan. Under IDEA, services requirements change after 10 school days of removal in a school year, and a manifestation determination is required within 10 school days of a decision to make a disciplinary change of placement. Whether a pattern of removals is a change of placement depends on the regulation and facts.',
    doNext:[
      'Log each date, duration, setting, and stated reason for removal.',
      'Ask for the current total removal days this school year in writing.',
      'Request the IEP/BIP and document whether required supports were implemented.',
      'If the school proposes a disciplinary change of placement, ask when the manifestation determination will occur and review the procedural safeguards.'
    ],
    deadlineHint:'A manifestation determination is due within 10 school days of a decision to change placement for discipline. Not every removal automatically triggers an MDR.'
  });

  set('mdr',{
    meaning:'For a disciplinary change of placement, the LEA, parent, and relevant IEP Team members review whether the conduct was caused by or had a direct and substantial relationship to the disability, or was the direct result of the LEA’s failure to implement the IEP.',
    deadlineHint:'Federal IDEA: within 10 school days of the decision to change placement because of a code-of-conduct violation.'
  });

  set('iee',{
    meaning:'Under IDEA, a parent who disagrees with a public-agency evaluation has a right to request an independent educational evaluation at public expense, subject to the regulation. The agency must, without unnecessary delay, either file for due process to defend its evaluation or ensure an IEE at public expense, subject to the stated conditions.',
    doNext:[
      'Ask for the agency’s IEE criteria and information about where an IEE may be obtained.',
      'If you disagree with the agency evaluation, state the request in writing and keep a dated copy.',
      'The agency may ask why you disagree, but the federal rule says it may not require an explanation or unreasonably delay its response.',
      'Keep the evaluation, request, agency response, and any hearing paperwork together.'
    ],
    deadlineHint:'Federal IDEA uses “without unnecessary delay,” not one universal number of days.'
  });

  m.disclaimer='Manila is a preparation and documentation tool. It is not a lawyer, advocate, school official, legal deadline calculator, or substitute for current federal/state advice. Federal source links were checked on 2026-09-08; verify state rules, recording law, local procedure, and individual deadlines with a Parent Training and Information Center or qualified professional.';
})();
