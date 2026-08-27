window.MANILA = {
  disclaimer:
    "Manila is a preparation and documentation tool. It is not a lawyer, advocate, or school official. It does not give legal advice. Confirm deadlines and recording rules with your state parent training center or a qualified advocate.",

  letterTypes: [
    {
      id: "iep-invite",
      name: "IEP meeting invitation",
      urgency: "high",
      tags: ["iep", "meeting", "invitation", "team meeting", "annual review", "iep team"],
      meaning:
        "The school is calling an IEP team meeting. Under IDEA you are a required member. They must notify you early enough to attend and tell you the purpose, time, location, and who will be there.",
      ignore:
        "If you skip it, they can often hold the meeting without you after documented attempts. Decisions get written while you are not in the room.",
      doNext: [
        "Reply in writing that you will attend, or propose two other times.",
        "Ask for the draft IEP and any new evaluations at least 2–3 school days before.",
        "Open Meeting Prep and lock your top 3 concerns.",
        "Decide now: you will not sign in the room."
      ],
      deadlineHint: "Reply within 2 school days. Ask for the draft immediately."
    },
    {
      id: "pwn",
      name: "Prior Written Notice (PWN)",
      urgency: "high",
      tags: ["prior written notice", "pwn", "notice of action", "refused", "proposes to"],
      meaning:
        "This is the school's official written explanation of something they want to start, change, or refuse. It is one of the most important papers in special education. Read every box: what they propose, why, what they considered, and what data they used.",
      ignore:
        "Silence is treated as acceptance of their version of events. Appeal clocks and stay-put arguments get harder without a written disagreement.",
      doNext: [
        "Mark what you agree with and what you do not.",
        "Send a same-week email: 'I disagree with X. Please convene the IEP team.'",
        "Save the PWN in the child file. Advocates live on these.",
        "If they refused an evaluation or service, ask what data would change the decision."
      ],
      deadlineHint: "Respond in writing within 7–10 calendar days so the record is clean."
    },
    {
      id: "eval-consent",
      name: "Evaluation / consent form",
      urgency: "high",
      tags: ["consent", "evaluation", "assess", "permission to evaluate", "initial evaluation"],
      meaning:
        "They want permission to test your child, or they are answering your request for testing. Consent starts the federal evaluation clock (generally 60 calendar days unless your state is stricter).",
      ignore:
        "If you never consent, they cannot evaluate (except in limited override cases). If you requested the eval and they stall, the timeline never starts.",
      doNext: [
        "If you asked for this, sign and date. Keep a copy.",
        "Write on the form which areas you want tested (academic, speech, OT, behavior, autism, ADHD).",
        "Ask for the list of assessments they will use.",
        "Calendar the due date the day you sign."
      ],
      deadlineHint: "Clock usually starts the day they receive signed consent."
    },
    {
      id: "eligibility",
      name: "Eligibility determination",
      urgency: "high",
      tags: ["eligibility", "does not qualify", "qualified", "not eligible", "disability category"],
      meaning:
        "The team decided whether your child qualifies for an IEP. 'Not eligible' is not the end — it is a decision you can challenge with more data or an independent evaluation (IEE).",
      ignore:
        "Waiting a year to 'see how they do' is how kids lose a grade. 504 may still apply even if IDEA does not.",
      doNext: [
        "Ask for the evaluation report in writing if you do not have it.",
        "If you disagree, request an IEE in writing.",
        "Ask whether a 504 plan is being considered.",
        "Request PWN of the eligibility decision."
      ],
      deadlineHint: "Put disagreement in writing within 10 days."
    },
    {
      id: "504-invite",
      name: "504 meeting notice",
      urgency: "medium",
      tags: ["504", "section 504", "accommodation plan", "504 team"],
      meaning:
        "This is a civil-rights meeting, not special education. Accommodations must be individualized. 'We already differentiate for everyone' is not a 504 plan.",
      ignore:
        "Without a written 504, teachers are not required to provide those supports when the nice classroom teacher leaves.",
      doNext: [
        "Bring diagnosis or physician note if you have one.",
        "List the 5 accommodations that actually matter in class and testing.",
        "Ask who implements each one and how you will know.",
        "Do not accept 'we'll try it' — ask it to be written."
      ],
      deadlineHint: "Reply and send your accommodation list before the meeting."
    },
    {
      id: "discipline",
      name: "Discipline / suspension / bus removal",
      urgency: "critical",
      tags: ["suspension", "expel", "discipline", "bus suspension", "removed from", "office referral", "iss", "oss"],
      meaning:
        "Days of removal add up. Around 10 school days in a year, the school generally must hold a Manifestation Determination Review to ask whether the behavior was caused by the disability or by a failure to implement the IEP.",
      ignore:
        "Informal 'just pick them up' days still count in many analyses. Pattern of removals can be a change of placement.",
      doNext: [
        "Log the date, hours, and stated reason today.",
        "Ask for the current total days of removal this school year, in writing.",
        "Request the IEP/BIP and ask if it was followed.",
        "If approaching 10 days, request the MDR in writing."
      ],
      deadlineHint: "Log today. MDR timing is short — days, not weeks."
    },
    {
      id: "mdr",
      name: "Manifestation determination",
      urgency: "critical",
      tags: ["manifestation", "mdr", "manifestation determination"],
      meaning:
        "The team must decide if the conduct was a manifestation of the disability or of the school's failure to implement the IEP. This meeting changes placement, services, and sometimes the rest of the year.",
      ignore:
        "If you miss it, they decide without your data from home, therapy, and prior incidents.",
      doNext: [
        "Bring the IEP, BIP, and a timeline of what the school actually provided.",
        "Ask: was the BIP followed the day of the incident?",
        "Ask for all incident reports and videos in the file.",
        "Do not debate character. Debate manifestation and implementation."
      ],
      deadlineHint: "IDEA expects this meeting within 10 school days of the decision to change placement."
    },
    {
      id: "progress",
      name: "IEP progress report",
      urgency: "medium",
      tags: ["progress report", "goal progress", "marking period", "progress on goals"],
      meaning:
        "This is how you know whether the IEP is working. 'Making progress' with no numbers is not progress reporting.",
      ignore:
        "A year of vague progress is how a child stays on the same goal until they age out of it.",
      doNext: [
        "Compare each goal to the last report. Did the number move?",
        "If a goal is 'not started' mid-year, ask why in writing.",
        "Put unmet goals on the next meeting agenda.",
        "Log service minutes delivered vs promised."
      ],
      deadlineHint: "Reply with questions before the next marking period."
    },
    {
      id: "placement",
      name: "Placement or school change",
      urgency: "critical",
      tags: ["placement", "change of placement", "self-contained", "out of district", "homebound", "alternative school"],
      meaning:
        "Placement is an IEP team decision, not a principal decision. More restrictive settings require data that the current setting cannot work even with supports.",
      ignore:
        "Showing up after the child has already been moved is how 'temporary' becomes the new placement.",
      doNext: [
        "Request an IEP meeting before any move.",
        "Ask for the data that says the current setting failed.",
        "Ask what would have to be added to keep them in the current setting.",
        "Ask about stay-put if you file a disagreement."
      ],
      deadlineHint: "Object in writing immediately. Do not wait for the move date."
    },
    {
      id: "iee",
      name: "Independent evaluation (IEE) response",
      urgency: "high",
      tags: ["iee", "independent educational evaluation", "independent evaluation"],
      meaning:
        "You have a right to request an independent educational evaluation at public expense if you disagree with the school's evaluation. The school must either pay or file for a hearing to defend its eval.",
      ignore:
        "Letting their letter sit unanswered can look like you accepted their evaluation.",
      doNext: [
        "If they agreed, get the criteria and approved evaluator list — then pick.",
        "If they refused, they should be filing for a hearing or reconsidering.",
        "Do not let them 'offer a new school eval' as a stall if you already disagreed.",
        "Keep every letter. IEE fights are paper fights."
      ],
      deadlineHint: "School must respond without unnecessary delay."
    },
    {
      id: "truancy",
      name: "Attendance / truancy notice",
      urgency: "high",
      tags: ["truant", "attendance", "absences", "chronic absence", "unexcused"],
      meaning:
        "For a child with a disability, attendance is often a service and anxiety/medical issue, not a character issue. Courts and districts still treat the letter as a parent problem unless you reframe it.",
      ignore:
        "Ignored truancy letters become court and child-welfare problems even when the root is school refusal or unimplemented supports.",
      doNext: [
        "List each absence reason you know.",
        "Ask the IEP team to address attendance as a need, not a punishment.",
        "Request homebound/home instruction criteria if anxiety or medical is involved.",
        "Do not ignore a court date if one is listed."
      ],
      deadlineHint: "Answer the letter before the next attendance threshold."
    },
    {
      id: "generic",
      name: "Other school letter",
      urgency: "medium",
      tags: ["dear parent", "district", "board of education"],
      meaning:
        "Not every letter is special education — but anything that changes time, placement, transportation, or money can still belong in the child file.",
      ignore: "One 'small' letter is how patterns get denied later.",
      doNext: [
        "Save a photo and the date you received it.",
        "Circle any date, amount, or meeting.",
        "If you are unsure, treat it as higher stakes until proven otherwise."
      ],
      deadlineHint: "Find the date on the page. Calendar it today."
    }
  ],

  theySay: [
    {
      they: "We don't have the staff for that.",
      you: "Need is not based on staffing. If you are refusing the service, I am requesting Prior Written Notice with the data you used."
    },
    {
      they: "That's against our policy.",
      you: "Please put the policy in writing and attach it to the PWN. Policy cannot override IDEA if the child needs the service."
    },
    {
      they: "They're doing fine. Look at their grades.",
      you: "I need us to define 'fine' with data — work completion, stamina, how much adult support it takes, and what happens after school."
    },
    {
      they: "We already differentiate for every student.",
      you: "I want the supports written in the plan so they follow my child to the next teacher."
    },
    {
      they: "Let's try this IEP and meet again in a few months.",
      you: "If we are already doing it, please write it in the IEP today. I don't want a handshake plan."
    },
    {
      they: "The other kids will think it's unfair.",
      you: "Accommodations are not a reward. They are how my child accesses the same curriculum."
    },
    {
      they: "We can't give you the draft before the meeting.",
      you: "I need the draft and evaluations with enough time to participate meaningfully. Please send what you have now."
    },
    {
      they: "We're out of time. Just sign and we'll fix it later.",
      you: "I am not signing today. Please send the updated draft. I will respond in writing."
    },
    {
      they: "They can get that from the counselor as needed.",
      you: "As needed is not a service. I want minutes, frequency, and a provider written in the plan."
    },
    {
      they: "That's a home issue.",
      you: "What I am seeing at home is data about the school day. I want it in the present levels."
    },
    {
      they: "An IEE is not necessary. We can just retest.",
      you: "I disagree with the current evaluation and I am requesting an IEE at public expense."
    },
    {
      they: "We don't allow recording.",
      you: "I will follow state law. If consent is required, I am asking for it now and I want the refusal in writing if you deny it."
    },
    {
      they: "They're passing, so they don't need more services.",
      you: "Passing grades do not end FAPE. Is this IEP reasonably calculated so my child makes progress appropriate in light of their circumstances?"
    },
    {
      they: "This is the program we have for kids like this.",
      you: "FAPE is not a slot in a program. I need a plan for this child, with ambitious goals and services written in minutes."
    },
    {
      they: "They need modifications, so they can't stay in general education.",
      you: "The regulations say a child is not removed from age-appropriate regular classrooms solely because the curriculum needs modifying. What supports would make the regular class work?"
    },
    {
      they: "The self-contained class has better services.",
      you: "If those services make it look superior, which of them cannot be delivered in the current school with supports? Placement follows the IEP. The IEP does not follow the empty seat."
    },
    {
      they: "That's where we put kids with this eligibility.",
      you: "Category, severity label, staffing, and space are not legal placement reasons. Start from general education and justify each step more restrictive."
    },
    {
      they: "We'll move them Monday and fix the paperwork later.",
      you: "Placement is an IEP team decision. If we disagree, I want stay-put addressed before any move. Put the offer in Prior Written Notice."
    },
    {
      they: "We missed some sessions. We'll try to catch up if we can.",
      you: "I want the missed minutes written as compensatory services — amount, schedule, provider — or Prior Written Notice if you refuse."
    }
  ],

  questions: [
    "What data shows this goal is ambitious and measurable?",
    "Who is responsible for each accommodation, in which class periods?",
    "How many minutes of [service] were actually delivered last quarter vs written?",
    "What would we add to this setting before we discuss a more restrictive one?",
    "If we refuse this request, will I receive Prior Written Notice?",
    "When will I get the draft and the evaluation reports?",
    "How will we measure progress besides report-card grades?",
    "Was the behavior plan being followed on the day of the incident?",
    "Is this IEP reasonably calculated so my child makes progress appropriate in light of their circumstances?",
    "What supplementary aids were tried in the regular class before this placement was proposed?",
    "If we change placement, what access to nondisabled peers remains?"
  ],

  fape: {
    endrew:
      "To meet its substantive obligation under the IDEA, a school must offer an IEP reasonably calculated to enable a child to make progress appropriate in light of the child's circumstances. (Endrew F., 2017)",
    lre:
      "To the maximum extent appropriate, children with disabilities are educated with children who are not disabled. Removal from regular classes happens only when education there cannot be achieved satisfactorily even with supplementary aids and services.",
    pwn:
      "If the team refuses a request: 'Please provide Prior Written Notice — what you refused, why, what you considered, and what data you used.'",
    sign:
      "I am not signing tonight. Please send the revised draft. I will respond in writing.",
    question:
      "Is this IEP reasonably calculated so my child makes progress appropriate in light of their circumstances — and will these minutes actually be delivered?"
  },

  lre: {
    statute:
      "To the maximum extent appropriate, children with disabilities are educated with children who are not disabled. Removal from the regular class occurs only if education there, with supplementary aids and services, cannot be achieved satisfactorily. (20 U.S.C. § 1412(a)(5); 34 C.F.R. § 300.114)",
    continuum:
      "Districts must keep a continuum: regular class, resource / pull-out, special class, special school, home, hospital — and combination services. Jumping to a separate campus because 'that is the program' is not a continuum.",
    illegal:
      "Placement may not be based on disability category, severity label, staffing, space, the shape of the delivery system, or administrative convenience. Needed modifications to the curriculum are not, by themselves, a reason to remove.",
    questions: [
      "What supplementary aids were tried in the regular class?",
      "What data says it still cannot work there?",
      "If that setting looks 'superior,' which services cannot travel?",
      "If we move, what access to nondisabled peers remains — including lunch, recess, and electives?"
    ],
    ask:
      "General education is the starting point. Can this child's FAPE be delivered in the regular class with supports? If not, what is the next least-restrictive step — not the jump to a separate site?",
    pwn:
      "If you change placement, I want the data, the harmful-effect analysis, and Prior Written Notice."
  },

  stayput: {
    title: "Stay-put",
    statute:
      "During a due process complaint, the child generally stays in the then-current educational placement unless you and the district agree otherwise. That is stay-put. It is not automatic for every disagreement — it attaches when you file.",
    say:
      "If we cannot agree, I will put the disagreement in writing. I want to know whether stay-put applies before any move.",
    close:
      "Do not treat a 'temporary' classroom, shortened day, or home pickup as a new placement without an IEP team decision."
  },

  comped: {
    title: "Compensatory education",
    statute:
      "If the district denied FAPE — services not delivered, late evaluation, no plan — a remedy can be make-up services. That is compensatory education. It is not a gift. It is owed time.",
    say:
      "These minutes were written and not delivered. I am requesting compensatory services equal to the shortfall, with a schedule, a provider, and Prior Written Notice of any refusal.",
    close:
      "Track promised vs delivered every week. Comp ed arguments die without a log."
  },

  recording: {
    allParty: ["CA", "CT", "DE", "FL", "IL", "MD", "MA", "MI", "MT", "NV", "NH", "OR", "PA", "WA"],
    note: "School policy may still require notice even in one-party states. Always announce that you are recording unless counsel tells you otherwise. This list is a starting point, not a legal opinion."
  },

  states: [
    "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
  ],

  parentCenters: "https://www.parentcenterhub.org/find-your-center/",

  samples: [
    {
      from: "Lincoln Elementary Special Education",
      text: "Dear Parent/Guardian: This letter is to invite you to an IEP team meeting for the annual review of your child's Individualized Education Program. The meeting is scheduled for Thursday at 2:00 p.m. in the conference room. Team members will include the special education teacher, general education teacher, administrator, and school psychologist. Please let us know if you can attend."
    },
    {
      from: "Office of Special Education",
      text: "PRIOR WRITTEN NOTICE: The district proposes to reduce occupational therapy from 60 minutes per week to 30 minutes per week. The team refused the request to maintain current minutes. This action is based on progress reports. Other options considered included keeping current services."
    },
    {
      from: "Assistant Principal",
      text: "This letter is to inform you that your child was assigned two days of out-of-school suspension for an office referral. Please pick up dismissal paperwork. Repeated discipline may result in further removal from school."
    }
  ],

  aid: {
    programs: [
      { id: "medicaid", name: "Medicaid / CHIP" },
      { id: "ebt", name: "EBT / SNAP" },
      { id: "lunch", name: "Free or reduced school meals" }
    ],
    national: {
      medicaid: ["medicaid", "chip", "medical assistance", "beneficiary", "recipient id", "member id", "cms", "title xix", "title xxi"],
      ebt: ["ebt", "snap", "supplemental nutrition", "food stamp", "quest card", "electronic benefit", "thrifty food"],
      lunch: ["free lunch", "reduced-price", "reduced price", "nslp", "school meals", "free and reduced", "frpl", "child nutrition", "direct certification", "community eligibility"]
    },
    stateMarks: {
      CA: ["medi-cal", "calfresh", "calworks", "covered california"],
      NY: ["new york state of health", "otda", "nyc free lunch", "hra"],
      TX: ["your texas benefits", "lone star", "hhsc", "texas medicaid"],
      FL: ["access florida", "ahca", "florida medicaid"],
      IL: ["abe.illinois", "medical card", "link card", "hfs"],
      PA: ["compass", "access card", "dhs pennsylvania"],
      OH: ["ohio benefits", "medicaid card", "odjfs"],
      MI: ["mibridges", "bridge card"],
      WA: ["apple health", "washington connection", "dshs"],
      MA: ["masshealth", "dta", "ebt massachusetts"],
      GA: ["gateway", "peachcare", "dfcs"],
      NC: ["epass", "nc medicaid", "e-snap"],
      NJ: ["njfamilycare", "snap nj"],
      VA: ["commonhelp", "famis", "vdss"],
      AZ: ["health-e-arizona", "nutrition assistance"],
      CO: ["health first colorado", "peak", "colorado snap"],
      WI: ["badgercare", "foodshare", "forwardhealth"],
      MN: ["mnbenefits", "medical assistance"],
      OR: ["oregon health plan", "one.oregon"],
      TN: ["tenncare", "tanf tennessee"],
      OK: ["soonercare", "okdhhs"],
      MD: ["marylandhealthconnection", "dhs ebt"],
      DC: ["dc healthy families", "economic security administration"]
    }
  }
};
