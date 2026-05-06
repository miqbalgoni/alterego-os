// UI-chrome translations. EVERY user-visible string in components/pages
// should map to a key here. Two locales exposed: en, it.

export type LocaleKey =
  // Header / nav / global chrome
  | "header.welcome"
  | "header.profile"
  | "header.language"
  | "header.logout"
  | "header.email"
  | "header.home"
  // Section names
  | "section.personal"
  | "section.review"
  | "section.thankYou"
  // Common buttons / states
  | "common.continue"
  | "common.back"
  | "common.next"
  | "common.submit"
  | "common.saving"
  | "common.saved"
  | "common.save"
  | "common.skip"
  | "common.edit"
  | "common.loading"
  | "common.cancel"
  | "common.required"
  | "common.optional"
  | "common.minutes"
  | "common.minute"
  | "common.error"
  | "common.tryAgain"
  | "common.startNow"
  | "common.saveForLater"
  | "common.markComplete"
  | "common.continueNext"
  | "common.notAnswered"
  | "common.selectMin"
  | "common.selectMax"
  | "common.invalidEmail"
  | "common.fieldRequired"
  | "common.specify"
  // Landing
  | "landing.badge"
  | "landing.title.welcome"
  | "landing.title.brand"
  | "landing.subtitle"
  | "landing.description"
  | "landing.cta"
  | "landing.note"
  // Auth
  | "auth.signupTitle"
  | "auth.loginTitle"
  | "auth.email"
  | "auth.password"
  | "auth.passwordHint"
  | "auth.signupCta"
  | "auth.loginCta"
  | "auth.haveAccount"
  | "auth.noAccount"
  | "auth.switchToLogin"
  | "auth.switchToSignup"
  // Onboarding form
  | "form.autosaveNote"
  | "form.saveAndExit"
  | "form.saveAndExitMsg"
  | "form.review"
  | "form.loadingSession"
  | "form.errorScroll"
  // Review page
  | "review.title"
  | "review.subtitle"
  | "review.readinessMap"
  | "review.headline.empty"
  | "review.headline.partial"
  | "review.headline.complete"
  | "review.composite.prefix"
  | "review.composite.suffix"
  | "review.subheadline.complete"
  | "review.subheadline.partial"
  | "review.subheadline.empty"
  | "review.scoreRemaining"
  | "review.computingReadiness"
  | "review.scoreRemainingPlural"
  | "review.legend.heading"
  | "review.legend.score"
  | "review.legend.threshold"
  | "review.legend.notAssessed"
  | "review.legend.overall"
  | "review.legend.tally"
  | "review.legend.tally.click"
  | "review.radar.overall"
  // Result page
  | "result.eyebrow"
  | "result.title"
  | "result.score.label"
  | "result.gauge.ready"
  | "result.gauge.needsWork"
  | "result.strengths"
  | "result.gaps"
  | "result.recommendations.headline"
  | "result.recommendations.subheadline"
  | "result.passed"
  | "result.optional.eyebrow"
  | "result.optional.title"
  | "result.optional.subtitle"
  | "result.optional.completed"
  | "result.continue"
  | "result.error"
  | "result.reviewing"
  | "result.savedNote"
  // Module card
  | "moduleCard.suggested"
  | "moduleCard.startNow"
  | "moduleCard.saveForLater"
  | "moduleCard.skip"
  | "moduleCard.loading"
  // Lesson player
  | "lesson.back"
  | "lesson.backFull"
  | "lesson.modules"
  | "lesson.prevModule"
  | "lesson.nextModule"
  | "lesson.youreDone"
  | "lesson.backToReview"
  | "lesson.footerSavedNote"
  | "lesson.moduleOf"
  | "lesson.preparing"
  | "lesson.loadingMore"
  | "lesson.loadFailed"
  // A2UI component labels
  | "a2ui.keyIdea"
  | "a2ui.example"
  | "a2ui.quickCheck"
  | "a2ui.checkAnswer"
  | "a2ui.checking"
  | "a2ui.right"
  | "a2ui.notQuite"
  | "a2ui.applyToStartup"
  | "a2ui.bmcTitle"
  | "a2ui.bmcSubtitle"
  | "a2ui.bmcRightSide"
  | "a2ui.bmcLeftSide"
  | "a2ui.bmcSave"
  | "a2ui.bmcHypothesis"
  | "a2ui.valueProp"
  | "a2ui.valueProp.preview"
  | "a2ui.tamSamSom"
  | "a2ui.tamSamSom.tam"
  | "a2ui.tamSamSom.sam"
  | "a2ui.tamSamSom.som"
  | "a2ui.tamSamSom.totalMarket"
  | "a2ui.tamSamSom.reachable"
  | "a2ui.tamSamSom.year1Target"
  | "a2ui.tamSamSom.assumptions"
  | "a2ui.tamSamSom.assumptionsHelp"
  | "a2ui.checklistDone"
  | "a2ui.exerciseSubmit"
  | "a2ui.exerciseWritePrompt"
  | "a2ui.mentorFeedback"
  | "a2ui.outroEyebrow"
  | "a2ui.outroDone"
  | "a2ui.outroNext"
  | "a2ui.lessonHeaderStep"
  | "a2ui.deepDive.go"
  | "a2ui.deepDive.close"
  | "a2ui.deepDive.reopen"
  | "a2ui.deepDive.crafting"
  | "a2ui.deepDive.unavailable"
  | "a2ui.deepDive.unavailableBody"
  // BMC block names
  | "bmc.customerSegments"
  | "bmc.valuePropositions"
  | "bmc.channels"
  | "bmc.customerRelationships"
  | "bmc.revenueStreams"
  | "bmc.keyResources"
  | "bmc.keyActivities"
  | "bmc.keyPartners"
  | "bmc.costStructure"
  | "bmc.hint.customerSegments"
  | "bmc.hint.valuePropositions"
  | "bmc.hint.channels"
  | "bmc.hint.customerRelationships"
  | "bmc.hint.revenueStreams"
  | "bmc.hint.keyResources"
  | "bmc.hint.keyActivities"
  | "bmc.hint.keyPartners"
  | "bmc.hint.costStructure"
  // ValueProp formula labels
  | "vp.target"
  | "vp.problem"
  | "vp.solution"
  | "vp.result"
  | "vp.competitors"
  | "vp.sentence.target"
  | "vp.sentence.problem"
  | "vp.sentence.solution"
  | "vp.sentence.result"
  | "vp.sentence.competitors"
  // Section / IRL labels
  | "irl.short.idea"
  | "irl.short.market"
  | "irl.short.validation"
  | "irl.short.mvp"
  | "irl.short.pmf"
  | "irl.short.revenue"
  | "irl.short.prototype"
  | "irl.short.operations"
  | "irl.short.metrics"
  | "irl.long.0"
  | "irl.long.1"
  | "irl.long.2"
  | "irl.long.3"
  | "irl.long.4"
  | "irl.long.5"
  | "irl.long.6"
  | "irl.long.7"
  | "irl.long.8"
  | "irl.long.9"
  | "irl.subtitle.0"
  | "irl.subtitle.1"
  | "irl.subtitle.2"
  | "irl.subtitle.3"
  | "irl.subtitle.4"
  | "irl.subtitle.5"
  | "irl.subtitle.6"
  | "irl.subtitle.7"
  | "irl.subtitle.8"
  | "irl.subtitle.9"
  // IRL 0 — Foundation library (no scored questions)
  | "irl0.eyebrow"
  | "irl0.title"
  | "irl0.subtitle"
  | "irl0.modulesHeading"
  | "irl0.modulesCount"
  | "irl0.openModule"
  | "irl0.backToPersonal"
  | "irl0.continueToIrl1"
  | "irl0.short"
  // SectionVideos panel
  | "sectionVideos.toggle"
  | "sectionVideos.toggle.one"
  | "sectionVideos.openExternal"
  // AskMe widget
  | "askme.title"
  | "askme.placeholder"
  | "askme.send"
  | "askme.empty"
  // Thank-you page
  | "thankYou.title"
  | "thankYou.subtitle"
  | "thankYou.subtitleExtra"
  | "thankYou.viewReport"
  | "thankYou.cta"
  // Report card
  | "report.eyebrow"
  | "report.title"
  | "report.subtitle"
  | "report.issuedTo"
  | "report.startup"
  | "report.date"
  | "report.compositeLabel"
  | "report.compositeOf"
  | "report.tier.exceptional"
  | "report.tier.strong"
  | "report.tier.developing"
  | "report.tier.early"
  | "report.tier.notReady"
  | "report.profile"
  | "report.profileSub"
  | "report.marks"
  | "report.marksSub"
  | "report.col.dimension"
  | "report.col.score"
  | "report.col.status"
  | "report.col.signal"
  | "report.status.passed"
  | "report.status.gap"
  | "report.status.pending"
  | "report.signature"
  | "report.signature.role"
  | "report.seal"
  | "report.download"
  | "report.downloading"
  | "report.continue"
  | "report.notAssessed"
  | "report.footnote"
  | "report.page"
  | "report.of"
  // Personal info field labels (keys p_*)
  | "personal.email"
  | "personal.fullName"
  | "personal.phone"
  | "personal.address"
  | "personal.startupName"
  | "personal.industries"
  | "personal.industries.help"
  | "personal.stage"
  // Stage options
  | "stage.idea"
  | "stage.preseed"
  | "stage.marketReady"
  | "stage.growth";

export type Dict = Record<LocaleKey, string>;

const en: Dict = {
  // Header
  "header.welcome": "Welcome",
  "header.profile": "Profile",
  "header.language": "Language",
  "header.logout": "Log out",
  "header.email": "Email",
  "header.home": "Home",
  // Sections
  "section.personal": "Personal Information",
  "section.review": "Review & Submit",
  "section.thankYou": "Thank you",
  // Common
  "common.continue": "Continue",
  "common.back": "Back",
  "common.next": "Next",
  "common.submit": "Submit",
  "common.saving": "Saving…",
  "common.saved": "Saved",
  "common.save": "Save",
  "common.skip": "Skip",
  "common.edit": "Edit",
  "common.loading": "Loading…",
  "common.cancel": "Cancel",
  "common.required": "Required",
  "common.optional": "Optional",
  "common.minutes": "minutes",
  "common.minute": "min",
  "common.error": "Error",
  "common.tryAgain": "Try again",
  "common.startNow": "Start now",
  "common.saveForLater": "Save for later",
  "common.markComplete": "Mark complete",
  "common.continueNext": "Continue to next section",
  "common.notAnswered": "— not answered —",
  "common.selectMin": "Please select at least",
  "common.selectMax": "Please select at most",
  "common.invalidEmail": "Enter a valid email address.",
  "common.fieldRequired": "This field is required.",
  "common.specify": "Please specify…",
  // Landing
  "landing.badge": "AI Onboarding",
  "landing.title.welcome": "Welcome to",
  "landing.title.brand": "ALTEREGO OS",
  "landing.subtitle": "The check-in for your entrepreneurial future.",
  "landing.description":
    "Help us understand who you are, which stage you're in, and how we can best support you with tailored mentoring, training, financing and investments.",
  "landing.cta": "Start Your Journey",
  "landing.note": "Takes ~15 minutes · Your progress is saved automatically",
  // Auth
  "auth.signupTitle": "Create your account",
  "auth.loginTitle": "Welcome back",
  "auth.email": "Email address",
  "auth.password": "Password",
  "auth.passwordHint": "At least 8 characters.",
  "auth.signupCta": "Create account",
  "auth.loginCta": "Log in",
  "auth.haveAccount": "Already have an account?",
  "auth.noAccount": "Don't have an account?",
  "auth.switchToLogin": "Log in",
  "auth.switchToSignup": "Sign up",
  // Form
  "form.autosaveNote": "Your answers are saved automatically as you type.",
  "form.saveAndExit": "Save & Visit Later",
  "form.saveAndExitMsg": "Your progress is saved. Log back in any time to resume right where you left off.",
  "form.review": "Review",
  "form.loadingSession": "Loading your session…",
  "form.errorScroll": "Please complete the highlighted fields.",
  // Review
  "review.title": "Review your responses",
  "review.subtitle": "Confirm everything looks right. Tap Edit on any section to jump back.",
  "review.readinessMap": "Your readiness map",
  "review.headline.empty": "Map your IRL readiness in one view",
  "review.headline.partial": "Map your IRL readiness in one view",
  "review.headline.complete": "Map your IRL readiness in one view",
  "review.composite.prefix": "You're a",
  "review.composite.suffix": "/100 founder right now",
  "review.subheadline.complete":
    "All nine IRL dimensions scored. The shape of your polygon shows where you're balanced — and where to focus next.",
  "review.subheadline.partial":
    "of 9 dimensions scored. Click any axis to drill into that section.",
  "review.subheadline.empty":
    "Fill out the sections below to see your radar bloom across nine dimensions of investment readiness.",
  "review.scoreRemaining": "Score remaining section",
  "review.scoreRemainingPlural": "Score remaining sections",
  "review.computingReadiness": "Computing your readiness…",
  "review.legend.heading": "Reading the map",
  "review.legend.score": "per-section score under each axis label",
  "review.legend.threshold": "readiness threshold",
  "review.legend.notAssessed": "not yet assessed",
  "review.legend.overall": "center number = overall (average of assessed sections)",
  "review.legend.tally": "{{a}} of {{b}} sections assessed. Click any axis to dive in.",
  "review.legend.tally.click": "Click any axis to dive in.",
  "review.radar.overall": "OVERALL",
  // Result
  "result.eyebrow": "IRL",
  "result.title": "Your readiness review",
  "result.score.label": "Score",
  "result.gauge.ready": "Ready",
  "result.gauge.needsWork": "Needs work",
  "result.strengths": "What's strong",
  "result.gaps": "What to strengthen",
  "result.recommendations.headline":
    "We picked {{n}} {{module}} to level up",
  "result.recommendations.subheadline":
    "~{{m}} minutes total. Free, interactive, personalized to your answers.",
  "result.passed": "You're ready for the next section. Strong work.",
  "result.optional.eyebrow": "Optional · go further",
  "result.optional.title": "More modules in",
  "result.optional.subtitle":
    "Take any of these to deepen mastery. Already completed ones are marked.",
  "result.optional.completed": "✓ Completed",
  "result.continue": "Continue to next section",
  "result.error": "Couldn't load your readiness review.",
  "result.reviewing": "Reviewing your answers…",
  "result.savedNote":
    "Your readiness is saved. You can re-take any section after a module to see your score improve.",
  // Module card
  "moduleCard.suggested": "Suggested module",
  "moduleCard.startNow": "Start now",
  "moduleCard.saveForLater": "Save for later",
  "moduleCard.skip": "Skip",
  "moduleCard.loading": "Loading…",
  // Lesson
  "lesson.back": "Back",
  "lesson.backFull": "Readiness review",
  "lesson.modules": "Modules",
  "lesson.prevModule": "Previous module",
  "lesson.nextModule": "Next module",
  "lesson.youreDone": "You're done",
  "lesson.backToReview": "Back to your readiness review",
  "lesson.footerSavedNote":
    "{{label}} · all answers you provide are saved to your profile",
  "lesson.moduleOf": "Module {{a}} of {{b}}",
  "lesson.preparing": "Preparing your lesson…",
  "lesson.loadingMore": "Loading more…",
  "lesson.loadFailed": "Couldn't load this lesson.",
  // A2UI
  "a2ui.keyIdea": "Key idea",
  "a2ui.example": "Practical example",
  "a2ui.quickCheck": "Quick check",
  "a2ui.checkAnswer": "Check answer",
  "a2ui.checking": "Checking…",
  "a2ui.right": "Right.",
  "a2ui.notQuite": "Not quite.",
  "a2ui.applyToStartup": "Apply to your startup",
  "a2ui.bmcTitle": "Your Business Model Canvas",
  "a2ui.bmcSubtitle":
    "Start with the right side (the customer-facing blocks). It's okay to leave blocks empty — that's where your next experiments go.",
  "a2ui.bmcRightSide": "What the customer sees",
  "a2ui.bmcLeftSide": "How you deliver",
  "a2ui.bmcSave": "Save my BMC",
  "a2ui.bmcHypothesis": "Your hypothesis…",
  "a2ui.valueProp": "Your value proposition",
  "a2ui.valueProp.preview": "Preview",
  "a2ui.tamSamSom": "Estimate TAM · SAM · SOM",
  "a2ui.tamSamSom.tam": "TAM (€/year)",
  "a2ui.tamSamSom.sam": "SAM (€/year)",
  "a2ui.tamSamSom.som": "SOM (€/year)",
  "a2ui.tamSamSom.totalMarket": "Total market",
  "a2ui.tamSamSom.reachable": "Reachable",
  "a2ui.tamSamSom.year1Target": "Year-1 target",
  "a2ui.tamSamSom.assumptions": "Your assumptions",
  "a2ui.tamSamSom.assumptionsHelp":
    "Be explicit: data sources, segments included/excluded, average price × volume, etc.",
  "a2ui.checklistDone": "{{a}} of {{b}} done",
  "a2ui.exerciseSubmit": "Submit",
  "a2ui.exerciseWritePrompt": "Write your response here…",
  "a2ui.mentorFeedback": "Mentor feedback",
  "a2ui.outroEyebrow": "Wrap-up",
  "a2ui.outroDone": "Module completed — taking you back…",
  "a2ui.outroNext": "Mark complete",
  "a2ui.lessonHeaderStep": "Step {{a}} of {{b}}",
  "a2ui.deepDive.go": "Go deeper on this idea",
  "a2ui.deepDive.close": "Close deep dive",
  "a2ui.deepDive.reopen": "Reopen deep dive",
  "a2ui.deepDive.crafting": "Crafting your deep dive…",
  "a2ui.deepDive.unavailable": "Deep dive unavailable",
  "a2ui.deepDive.unavailableBody":
    "Couldn't compose this deep dive. Please try again in a moment.",
  // BMC blocks
  "bmc.customerSegments": "Customer Segments",
  "bmc.valuePropositions": "Value Propositions",
  "bmc.channels": "Channels",
  "bmc.customerRelationships": "Customer Relationships",
  "bmc.revenueStreams": "Revenue Streams",
  "bmc.keyResources": "Key Resources",
  "bmc.keyActivities": "Key Activities",
  "bmc.keyPartners": "Key Partners",
  "bmc.costStructure": "Cost Structure",
  "bmc.hint.customerSegments": "Who exactly?",
  "bmc.hint.valuePropositions": "What value, for whom?",
  "bmc.hint.channels": "How do you reach them?",
  "bmc.hint.customerRelationships": "How do you keep them?",
  "bmc.hint.revenueStreams": "How do you get paid?",
  "bmc.hint.keyResources": "What's essential?",
  "bmc.hint.keyActivities": "What do you do?",
  "bmc.hint.keyPartners": "Who helps you?",
  "bmc.hint.costStructure": "What does it cost?",
  // Value Prop formula
  "vp.target": "Target",
  "vp.problem": "Problem",
  "vp.solution": "Solution",
  "vp.result": "Unique result",
  "vp.competitors": "Unlike…",
  "vp.sentence.target": "For",
  "vp.sentence.problem": "who has",
  "vp.sentence.solution": "we offer",
  "vp.sentence.result": "that enables",
  "vp.sentence.competitors": "unlike",
  // IRL section short labels
  "irl.short.idea": "Idea & BMC",
  "irl.short.market": "Market",
  "irl.short.validation": "Validation",
  "irl.short.mvp": "MVP",
  "irl.short.pmf": "PMF",
  "irl.short.revenue": "Revenue",
  "irl.short.prototype": "Prototype",
  "irl.short.operations": "Operations",
  "irl.short.metrics": "Metrics",
  "irl.long.0": "IRL 0 — Foundation",
  "irl.long.1": "IRL 1 — Idea & Business Model Canvas",
  "irl.long.2": "IRL 2 — Market & Competition",
  "irl.long.3": "IRL 3 — Problem Validation & Value Proposition",
  "irl.long.4": "IRL 4 — Low-Fidelity MVP Testing",
  "irl.long.5": "IRL 5 — Product / Market Fit",
  "irl.long.6": "IRL 6 — Revenue Model Validation",
  "irl.long.7": "IRL 7 — High-Fidelity MVP & Prototype",
  "irl.long.8": "IRL 8 — Operations, Scalability & Delivery",
  "irl.long.9": "IRL 9 — Fundamental Metrics",
  "irl.subtitle.0": "Foundational concepts every founder should share before the assessment.",
  "irl.subtitle.1": "Formalize your value proposition and validate initial hypotheses.",
  "irl.subtitle.2": "Understand the landscape you're entering.",
  "irl.subtitle.3": "Confirm there is a real need worth solving.",
  "irl.subtitle.4": "Test the idea with a basic prototype.",
  "irl.subtitle.5": "Find the sweet spot between your product and the market.",
  "irl.subtitle.6": "Prove people will pay — and how much.",
  "irl.subtitle.7": "Ship something close to the real product.",
  "irl.subtitle.8": "Can you deliver consistently and grow?",
  "irl.subtitle.9": "Track what matters and act on it.",
  // IRL 0 — Foundation library
  "irl0.eyebrow": "IRL 0 · Foundation",
  "irl0.title": "Before the assessment, the foundations",
  "irl0.subtitle":
    "IRL 0 isn't scored — it's the shared language every founder needs before the IRL 1–9 assessment makes full sense. Browse the 12 modules below and the curated videos. Come back any time.",
  "irl0.modulesHeading": "foundation modules",
  "irl0.modulesCount": "{count} foundation modules",
  "irl0.openModule": "Open module",
  "irl0.backToPersonal": "Back to personal info",
  "irl0.continueToIrl1": "Continue to IRL 1 assessment",
  "irl0.short": "Foundation",
  // SectionVideos
  "sectionVideos.toggle": "Watch · {count} videos for this section",
  "sectionVideos.toggle.one": "Watch · 1 video for this section",
  "sectionVideos.openExternal": "Open ↗",
  // Ask Me
  "askme.title": "Ask Me",
  "askme.placeholder": "Ask anything about the form…",
  "askme.send": "Send",
  "askme.empty":
    "Hi! I'm your HIVE guide. If any question in the form feels unclear, ask me and I'll explain in plain language. I can also help with the Italian Startup Act, the Business Model Canvas, IRL stages, and more.",
  // Thank you
  "thankYou.title": "Thank you!",
  "thankYou.subtitle": "Your ALTEREGO OS check-in has been submitted successfully.",
  "thankYou.subtitleExtra":
    "Our team will review your responses and get in touch soon with the next steps of your entrepreneurial journey.",
  "thankYou.viewReport": "View report card",
  "thankYou.cta": "Back to home",
  // Report card
  "report.eyebrow": "Founder Report Card",
  "report.title": "Your IRL Readiness Report",
  "report.subtitle":
    "A snapshot of where you stand across the nine dimensions of investment readiness.",
  "report.issuedTo": "Issued to",
  "report.startup": "Startup",
  "report.date": "Date",
  "report.compositeLabel": "Composite Score",
  "report.compositeOf": "out of 100",
  "report.tier.exceptional": "Exceptional readiness",
  "report.tier.strong": "Strong readiness",
  "report.tier.developing": "Developing readiness",
  "report.tier.early": "Early readiness",
  "report.tier.notReady": "Foundations forming",
  "report.profile": "Readiness Radar",
  "report.profileSub":
    "Each axis is one IRL dimension. The greener and rounder, the more investor-ready.",
  "report.marks": "IRL Marks",
  "report.marksSub": "Per-dimension scores out of 100, with passing threshold at 65.",
  "report.col.dimension": "Dimension",
  "report.col.score": "Score",
  "report.col.status": "Status",
  "report.col.signal": "Signal",
  "report.status.passed": "Passed",
  "report.status.gap": "Needs work",
  "report.status.pending": "Pending",
  "report.signature": "Reviewed by ALTEREGO OS",
  "report.signature.role": "Investment Readiness Engine",
  "report.seal": "Verified",
  "report.download": "Download report",
  "report.downloading": "Preparing PDF…",
  "report.continue": "Continue",
  "report.notAssessed": "Not assessed",
  "report.footnote":
    "This report is generated from your responses and the IRL rubric. Re-take any section after a learning module to see your score evolve.",
  "report.page": "Page",
  "report.of": "of",
  // Personal
  "personal.email": "Email",
  "personal.fullName": "Full Name",
  "personal.phone": "Phone",
  "personal.address": "Address",
  "personal.startupName": "Startup Name",
  "personal.industries": "Industry / Field of Activity",
  "personal.industries.help": "Select 1 to 3 fields that apply.",
  "personal.stage": "Startup development stage",
  // Stage options
  "stage.idea": "Initial idea",
  "stage.preseed": "Pre-seed: Prototype ready / First version of product",
  "stage.marketReady": "Product market-ready",
  "stage.growth": "Growth and expansion",
};

const it: Dict = {
  // Header
  "header.welcome": "Benvenuto",
  "header.profile": "Profilo",
  "header.language": "Lingua",
  "header.logout": "Esci",
  "header.email": "Email",
  "header.home": "Home",
  // Sections
  "section.personal": "Informazioni personali",
  "section.review": "Rivedi e invia",
  "section.thankYou": "Grazie",
  // Common
  "common.continue": "Continua",
  "common.back": "Indietro",
  "common.next": "Avanti",
  "common.submit": "Invia",
  "common.saving": "Salvataggio…",
  "common.saved": "Salvato",
  "common.save": "Salva",
  "common.skip": "Salta",
  "common.edit": "Modifica",
  "common.loading": "Caricamento…",
  "common.cancel": "Annulla",
  "common.required": "Obbligatorio",
  "common.optional": "Facoltativo",
  "common.minutes": "minuti",
  "common.minute": "min",
  "common.error": "Errore",
  "common.tryAgain": "Riprova",
  "common.startNow": "Inizia ora",
  "common.saveForLater": "Salva per dopo",
  "common.markComplete": "Segna come completato",
  "common.continueNext": "Continua alla prossima sezione",
  "common.notAnswered": "— non risposto —",
  "common.selectMin": "Seleziona almeno",
  "common.selectMax": "Seleziona al massimo",
  "common.invalidEmail": "Inserisci un indirizzo email valido.",
  "common.fieldRequired": "Questo campo è obbligatorio.",
  "common.specify": "Specifica…",
  // Landing
  "landing.badge": "Onboarding con AI",
  "landing.title.welcome": "Benvenuto in",
  "landing.title.brand": "ALTEREGO OS",
  "landing.subtitle": "Il check-in per il tuo futuro imprenditoriale.",
  "landing.description":
    "Aiutaci a capire chi sei, in quale fase ti trovi e come possiamo supportarti al meglio con mentoring, formazione, finanziamenti e investimenti su misura.",
  "landing.cta": "Inizia il tuo percorso",
  "landing.note": "Ci vogliono ~15 minuti · I tuoi progressi vengono salvati automaticamente",
  // Auth
  "auth.signupTitle": "Crea il tuo account",
  "auth.loginTitle": "Bentornato",
  "auth.email": "Indirizzo email",
  "auth.password": "Password",
  "auth.passwordHint": "Almeno 8 caratteri.",
  "auth.signupCta": "Crea account",
  "auth.loginCta": "Accedi",
  "auth.haveAccount": "Hai già un account?",
  "auth.noAccount": "Non hai un account?",
  "auth.switchToLogin": "Accedi",
  "auth.switchToSignup": "Registrati",
  // Form
  "form.autosaveNote": "Le tue risposte vengono salvate automaticamente mentre scrivi.",
  "form.saveAndExit": "Salva e torna dopo",
  "form.saveAndExitMsg":
    "I tuoi progressi sono stati salvati. Accedi di nuovo in qualsiasi momento per riprendere da dove hai lasciato.",
  "form.review": "Rivedi",
  "form.loadingSession": "Carico la tua sessione…",
  "form.errorScroll": "Completa i campi evidenziati.",
  // Review
  "review.title": "Rivedi le tue risposte",
  "review.subtitle":
    "Verifica che tutto sia corretto. Tocca Modifica su qualsiasi sezione per tornare indietro.",
  "review.readinessMap": "La tua mappa di readiness",
  "review.headline.empty": "Visualizza la tua readiness IRL in un colpo d'occhio",
  "review.headline.partial": "Visualizza la tua readiness IRL in un colpo d'occhio",
  "review.headline.complete": "Visualizza la tua readiness IRL in un colpo d'occhio",
  "review.composite.prefix": "Sei un founder da",
  "review.composite.suffix": "/100 in questo momento",
  "review.subheadline.complete":
    "Tutte e nove le dimensioni IRL valutate. La forma del poligono mostra dove sei equilibrato e dove concentrarti.",
  "review.subheadline.partial":
    "di 9 dimensioni valutate. Clicca su un asse per esplorare quella sezione.",
  "review.subheadline.empty":
    "Compila le sezioni qui sotto per vedere il tuo radar fiorire su nove dimensioni di readiness.",
  "review.scoreRemaining": "Valuta la sezione mancante",
  "review.scoreRemainingPlural": "Valuta le sezioni mancanti",
  "review.computingReadiness": "Calcolo la tua readiness…",
  "review.legend.heading": "Leggere la mappa",
  "review.legend.score": "punteggio per sezione sotto ogni etichetta dell'asse",
  "review.legend.threshold": "soglia di readiness",
  "review.legend.notAssessed": "non ancora valutato",
  "review.legend.overall": "numero al centro = totale (media delle sezioni valutate)",
  "review.legend.tally": "{{a}} di {{b}} sezioni valutate. Clicca su un asse per esplorare.",
  "review.legend.tally.click": "Clicca su un asse per esplorare.",
  "review.radar.overall": "TOTALE",
  // Result
  "result.eyebrow": "IRL",
  "result.title": "La tua valutazione di readiness",
  "result.score.label": "Punteggio",
  "result.gauge.ready": "Pronto",
  "result.gauge.needsWork": "Da rafforzare",
  "result.strengths": "Punti di forza",
  "result.gaps": "Cosa rafforzare",
  "result.recommendations.headline":
    "Abbiamo scelto {{n}} {{module}} per farti crescere",
  "result.recommendations.subheadline":
    "~{{m}} minuti in totale. Gratuiti, interattivi, personalizzati sulle tue risposte.",
  "result.passed": "Sei pronto per la prossima sezione. Ottimo lavoro.",
  "result.optional.eyebrow": "Facoltativo · vai oltre",
  "result.optional.title": "Altri moduli in",
  "result.optional.subtitle":
    "Prendi uno qualsiasi di questi per approfondire. Quelli già completati sono evidenziati.",
  "result.optional.completed": "✓ Completato",
  "result.continue": "Continua alla prossima sezione",
  "result.error": "Impossibile caricare la tua valutazione.",
  "result.reviewing": "Esamino le tue risposte…",
  "result.savedNote":
    "La tua readiness è salvata. Puoi rifare ogni sezione dopo un modulo per vedere il punteggio migliorare.",
  // Module card
  "moduleCard.suggested": "Modulo suggerito",
  "moduleCard.startNow": "Inizia ora",
  "moduleCard.saveForLater": "Salva per dopo",
  "moduleCard.skip": "Salta",
  "moduleCard.loading": "Caricamento…",
  // Lesson
  "lesson.back": "Indietro",
  "lesson.backFull": "Valutazione di readiness",
  "lesson.modules": "Moduli",
  "lesson.prevModule": "Modulo precedente",
  "lesson.nextModule": "Modulo successivo",
  "lesson.youreDone": "Hai finito",
  "lesson.backToReview": "Torna alla tua valutazione di readiness",
  "lesson.footerSavedNote":
    "{{label}} · tutte le risposte che dai vengono salvate nel tuo profilo",
  "lesson.moduleOf": "Modulo {{a}} di {{b}}",
  "lesson.preparing": "Preparo la tua lezione…",
  "lesson.loadingMore": "Carico altro…",
  "lesson.loadFailed": "Impossibile caricare questa lezione.",
  // A2UI
  "a2ui.keyIdea": "Idea chiave",
  "a2ui.example": "Esempio pratico",
  "a2ui.quickCheck": "Verifica rapida",
  "a2ui.checkAnswer": "Verifica risposta",
  "a2ui.checking": "Verifico…",
  "a2ui.right": "Giusto.",
  "a2ui.notQuite": "Non proprio.",
  "a2ui.applyToStartup": "Applica alla tua startup",
  "a2ui.bmcTitle": "Il tuo Business Model Canvas",
  "a2ui.bmcSubtitle":
    "Inizia dal lato destro (i blocchi rivolti al cliente). Va bene lasciare alcuni blocchi vuoti — sono i tuoi prossimi esperimenti.",
  "a2ui.bmcRightSide": "Cosa vede il cliente",
  "a2ui.bmcLeftSide": "Come crei valore",
  "a2ui.bmcSave": "Salva il mio BMC",
  "a2ui.bmcHypothesis": "La tua ipotesi…",
  "a2ui.valueProp": "La tua value proposition",
  "a2ui.valueProp.preview": "Anteprima",
  "a2ui.tamSamSom": "Stima TAM · SAM · SOM",
  "a2ui.tamSamSom.tam": "TAM (€/anno)",
  "a2ui.tamSamSom.sam": "SAM (€/anno)",
  "a2ui.tamSamSom.som": "SOM (€/anno)",
  "a2ui.tamSamSom.totalMarket": "Mercato totale",
  "a2ui.tamSamSom.reachable": "Raggiungibile",
  "a2ui.tamSamSom.year1Target": "Obiettivo anno 1",
  "a2ui.tamSamSom.assumptions": "Le tue ipotesi",
  "a2ui.tamSamSom.assumptionsHelp":
    "Sii esplicito: fonti dati, segmenti inclusi/esclusi, prezzo medio × volume, ecc.",
  "a2ui.checklistDone": "{{a}} di {{b}} fatti",
  "a2ui.exerciseSubmit": "Invia",
  "a2ui.exerciseWritePrompt": "Scrivi qui la tua risposta…",
  "a2ui.mentorFeedback": "Feedback del mentor",
  "a2ui.outroEyebrow": "Conclusione",
  "a2ui.outroDone": "Modulo completato — ti riporto indietro…",
  "a2ui.outroNext": "Segna come completato",
  "a2ui.lessonHeaderStep": "Passo {{a}} di {{b}}",
  "a2ui.deepDive.go": "Approfondisci questa idea",
  "a2ui.deepDive.close": "Chiudi approfondimento",
  "a2ui.deepDive.reopen": "Riapri approfondimento",
  "a2ui.deepDive.crafting": "Creo il tuo approfondimento…",
  "a2ui.deepDive.unavailable": "Approfondimento non disponibile",
  "a2ui.deepDive.unavailableBody":
    "Non sono riuscito a comporre questo approfondimento. Riprova tra un momento.",
  // BMC blocks
  "bmc.customerSegments": "Segmenti di clientela",
  "bmc.valuePropositions": "Proposte di valore",
  "bmc.channels": "Canali",
  "bmc.customerRelationships": "Relazioni con i clienti",
  "bmc.revenueStreams": "Flussi di ricavi",
  "bmc.keyResources": "Risorse chiave",
  "bmc.keyActivities": "Attività chiave",
  "bmc.keyPartners": "Partner chiave",
  "bmc.costStructure": "Struttura dei costi",
  "bmc.hint.customerSegments": "Chi esattamente?",
  "bmc.hint.valuePropositions": "Quale valore, per chi?",
  "bmc.hint.channels": "Come li raggiungi?",
  "bmc.hint.customerRelationships": "Come li mantieni?",
  "bmc.hint.revenueStreams": "Come vieni pagato?",
  "bmc.hint.keyResources": "Cosa è essenziale?",
  "bmc.hint.keyActivities": "Cosa fai?",
  "bmc.hint.keyPartners": "Chi ti aiuta?",
  "bmc.hint.costStructure": "Quanto costa?",
  // Value Prop
  "vp.target": "Target",
  "vp.problem": "Problema",
  "vp.solution": "Soluzione",
  "vp.result": "Risultato unico",
  "vp.competitors": "A differenza di…",
  "vp.sentence.target": "Per",
  "vp.sentence.problem": "che ha",
  "vp.sentence.solution": "offriamo",
  "vp.sentence.result": "che permette",
  "vp.sentence.competitors": "a differenza di",
  // IRL labels
  "irl.short.idea": "Idea & BMC",
  "irl.short.market": "Mercato",
  "irl.short.validation": "Validazione",
  "irl.short.mvp": "MVP",
  "irl.short.pmf": "PMF",
  "irl.short.revenue": "Ricavi",
  "irl.short.prototype": "Prototipo",
  "irl.short.operations": "Operatività",
  "irl.short.metrics": "Metriche",
  "irl.long.0": "IRL 0 — Fondamenta",
  "irl.long.1": "IRL 1 — Idea e Business Model Canvas",
  "irl.long.2": "IRL 2 — Mercato e concorrenza",
  "irl.long.3": "IRL 3 — Validazione del problema e Value Proposition",
  "irl.long.4": "IRL 4 — MVP a bassa fedeltà",
  "irl.long.5": "IRL 5 — Product / Market Fit",
  "irl.long.6": "IRL 6 — Validazione del modello di ricavi",
  "irl.long.7": "IRL 7 — MVP e prototipo ad alta fedeltà",
  "irl.long.8": "IRL 8 — Operatività, scalabilità e delivery",
  "irl.long.9": "IRL 9 — Metriche fondamentali",
  "irl.subtitle.0": "Concetti fondamentali da condividere prima dell'assessment.",
  "irl.subtitle.1": "Formalizza la tua proposta di valore e valida le ipotesi iniziali.",
  "irl.subtitle.2": "Comprendi il contesto in cui stai entrando.",
  "irl.subtitle.3": "Conferma che ci sia un bisogno reale da risolvere.",
  "irl.subtitle.4": "Testa l'idea con un prototipo di base.",
  "irl.subtitle.5": "Trova il punto d'incontro tra il tuo prodotto e il mercato.",
  "irl.subtitle.6": "Dimostra che le persone pagheranno — e quanto.",
  "irl.subtitle.7": "Rilascia qualcosa di vicino al prodotto reale.",
  "irl.subtitle.8": "Riesci a consegnare in modo consistente e a crescere?",
  "irl.subtitle.9": "Misura ciò che conta e agisci di conseguenza.",
  // IRL 0 — Foundation library
  "irl0.eyebrow": "IRL 0 · Fondamenta",
  "irl0.title": "Prima dell'assessment, le fondamenta",
  "irl0.subtitle":
    "L'IRL 0 non si valuta — è il linguaggio condiviso che ogni founder dovrebbe avere prima che l'assessment IRL 1–9 abbia senso pieno. Esplora i 12 moduli qui sotto e i video curati. Torna quando vuoi.",
  "irl0.modulesHeading": "moduli fondamentali",
  "irl0.modulesCount": "{count} moduli fondamentali",
  "irl0.openModule": "Apri modulo",
  "irl0.backToPersonal": "Torna alle informazioni personali",
  "irl0.continueToIrl1": "Continua con l'assessment IRL 1",
  "irl0.short": "Fondamenta",
  // SectionVideos
  "sectionVideos.toggle": "Guarda · {count} video per questa sezione",
  "sectionVideos.toggle.one": "Guarda · 1 video per questa sezione",
  "sectionVideos.openExternal": "Apri ↗",
  // Ask Me
  "askme.title": "Chiedimi",
  "askme.placeholder": "Chiedimi qualsiasi cosa sul modulo…",
  "askme.send": "Invia",
  "askme.empty":
    "Ciao! Sono la tua guida HIVE. Se una domanda del modulo non ti è chiara, chiedimelo e te la spiego in parole semplici. Posso aiutarti anche con lo Startup Act italiano, il Business Model Canvas, le fasi IRL e altro ancora.",
  // Thank you
  "thankYou.title": "Grazie!",
  "thankYou.subtitle": "Il tuo check-in di ALTEREGO OS è stato inviato con successo.",
  "thankYou.subtitleExtra":
    "Il nostro team esaminerà le tue risposte e ti contatterà a breve con i prossimi passi del tuo percorso imprenditoriale.",
  "thankYou.viewReport": "Vedi la pagella",
  "thankYou.cta": "Torna alla home",
  // Report card
  "report.eyebrow": "Pagella del Founder",
  "report.title": "Il tuo Report di Readiness IRL",
  "report.subtitle":
    "Una fotografia del tuo livello sulle nove dimensioni della investment readiness.",
  "report.issuedTo": "Rilasciato a",
  "report.startup": "Startup",
  "report.date": "Data",
  "report.compositeLabel": "Punteggio complessivo",
  "report.compositeOf": "su 100",
  "report.tier.exceptional": "Readiness eccezionale",
  "report.tier.strong": "Readiness solida",
  "report.tier.developing": "Readiness in sviluppo",
  "report.tier.early": "Readiness iniziale",
  "report.tier.notReady": "Fondamenta in formazione",
  "report.profile": "Radar di Readiness",
  "report.profileSub":
    "Ogni asse è una dimensione IRL. Più verde e rotonda, più sei pronto per gli investitori.",
  "report.marks": "Voti IRL",
  "report.marksSub":
    "Punteggi per dimensione su 100, con soglia di superamento a 65.",
  "report.col.dimension": "Dimensione",
  "report.col.score": "Punteggio",
  "report.col.status": "Stato",
  "report.col.signal": "Segnale",
  "report.status.passed": "Superato",
  "report.status.gap": "Da rafforzare",
  "report.status.pending": "In sospeso",
  "report.signature": "Verificato da ALTEREGO OS",
  "report.signature.role": "Investment Readiness Engine",
  "report.seal": "Verificato",
  "report.download": "Scarica report",
  "report.downloading": "Preparo il PDF…",
  "report.continue": "Continua",
  "report.notAssessed": "Non valutato",
  "report.footnote":
    "Questo report è generato dalle tue risposte e dalla rubrica IRL. Rifai una sezione dopo un modulo per vedere il punteggio evolvere.",
  "report.page": "Pagina",
  "report.of": "di",
  // Personal
  "personal.email": "Email",
  "personal.fullName": "Nome completo",
  "personal.phone": "Telefono",
  "personal.address": "Indirizzo",
  "personal.startupName": "Nome della startup",
  "personal.industries": "Settore / Ambito di attività",
  "personal.industries.help": "Seleziona da 1 a 3 ambiti.",
  "personal.stage": "Fase di sviluppo della startup",
  // Stage options
  "stage.idea": "Idea iniziale",
  "stage.preseed": "Pre-seed: prototipo pronto / prima versione del prodotto",
  "stage.marketReady": "Prodotto pronto per il mercato",
  "stage.growth": "Crescita ed espansione",
};

// Only English and Italian are exposed in the language menu.
export const DICTIONARIES = { en, it } as const;

export const LOCALE_LABELS: Record<keyof typeof DICTIONARIES, string> = {
  en: "English",
  it: "Italiano",
};
