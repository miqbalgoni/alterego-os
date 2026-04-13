// UI-chrome translations only. Question text remains in English.

export type LocaleKey =
  | "header.welcome"
  | "header.profile"
  | "header.language"
  | "header.logout"
  | "header.email"
  | "section.personal"
  | "section.review"
  | "section.thankYou"
  | "common.continue"
  | "common.back"
  | "common.next"
  | "common.submit"
  | "common.saving"
  | "landing.badge"
  | "landing.title.welcome"
  | "landing.title.brand"
  | "landing.subtitle"
  | "landing.description"
  | "landing.cta"
  | "landing.note"
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
  | "auth.switchToSignup";

export type Dict = Record<LocaleKey, string>;

const en: Dict = {
  "header.welcome": "Welcome",
  "header.profile": "Profile",
  "header.language": "Language",
  "header.logout": "Log out",
  "header.email": "Email",
  "section.personal": "Personal Information",
  "section.review": "Review & Submit",
  "section.thankYou": "Thank you",
  "common.continue": "Continue",
  "common.back": "Back",
  "common.next": "Next",
  "common.submit": "Submit",
  "common.saving": "Saving…",
  "landing.badge": "AI Onboarding",
  "landing.title.welcome": "Welcome to",
  "landing.title.brand": "ALTEREGO OS",
  "landing.subtitle": "The check-in for your entrepreneurial future.",
  "landing.description":
    "Help us understand who you are, which stage you're in, and how we can best support you with tailored mentoring, training, financing and investments.",
  "landing.cta": "Start Your Journey",
  "landing.note": "Takes ~15 minutes · Your progress is saved automatically",
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
};

const es: Dict = {
  "header.welcome": "Bienvenido",
  "header.profile": "Perfil",
  "header.language": "Idioma",
  "header.logout": "Cerrar sesión",
  "header.email": "Correo electrónico",
  "section.personal": "Información personal",
  "section.review": "Revisar y enviar",
  "section.thankYou": "Gracias",
  "common.continue": "Continuar",
  "common.back": "Atrás",
  "common.next": "Siguiente",
  "common.submit": "Enviar",
  "common.saving": "Guardando…",
  "landing.badge": "Onboarding con IA",
  "landing.title.welcome": "Bienvenido a",
  "landing.title.brand": "ALTEREGO OS",
  "landing.subtitle": "El check-in para tu futuro emprendedor.",
  "landing.description":
    "Ayúdanos a entender quién eres, en qué etapa te encuentras y cómo podemos apoyarte mejor con mentoría, formación, financiación e inversión a tu medida.",
  "landing.cta": "Comienza tu viaje",
  "landing.note": "Toma ~15 minutos · Tu progreso se guarda automáticamente",
  "auth.signupTitle": "Crea tu cuenta",
  "auth.loginTitle": "Bienvenido de nuevo",
  "auth.email": "Correo electrónico",
  "auth.password": "Contraseña",
  "auth.passwordHint": "Al menos 8 caracteres.",
  "auth.signupCta": "Crear cuenta",
  "auth.loginCta": "Iniciar sesión",
  "auth.haveAccount": "¿Ya tienes una cuenta?",
  "auth.noAccount": "¿No tienes una cuenta?",
  "auth.switchToLogin": "Iniciar sesión",
  "auth.switchToSignup": "Registrarse",
};

const fr: Dict = {
  "header.welcome": "Bienvenue",
  "header.profile": "Profil",
  "header.language": "Langue",
  "header.logout": "Déconnexion",
  "header.email": "E-mail",
  "section.personal": "Informations personnelles",
  "section.review": "Vérifier et envoyer",
  "section.thankYou": "Merci",
  "common.continue": "Continuer",
  "common.back": "Retour",
  "common.next": "Suivant",
  "common.submit": "Envoyer",
  "common.saving": "Enregistrement…",
  "landing.badge": "Onboarding IA",
  "landing.title.welcome": "Bienvenue sur",
  "landing.title.brand": "ALTEREGO OS",
  "landing.subtitle": "Le check-in pour votre avenir entrepreneurial.",
  "landing.description":
    "Aidez-nous à comprendre qui vous êtes, à quelle étape vous en êtes et comment nous pouvons vous accompagner au mieux avec un mentorat, une formation, un financement et des investissements sur mesure.",
  "landing.cta": "Commencez votre parcours",
  "landing.note": "Environ 15 minutes · Votre progression est enregistrée automatiquement",
  "auth.signupTitle": "Créez votre compte",
  "auth.loginTitle": "Bon retour",
  "auth.email": "Adresse e-mail",
  "auth.password": "Mot de passe",
  "auth.passwordHint": "Au moins 8 caractères.",
  "auth.signupCta": "Créer un compte",
  "auth.loginCta": "Se connecter",
  "auth.haveAccount": "Vous avez déjà un compte ?",
  "auth.noAccount": "Vous n'avez pas de compte ?",
  "auth.switchToLogin": "Se connecter",
  "auth.switchToSignup": "S'inscrire",
};

const de: Dict = {
  "header.welcome": "Willkommen",
  "header.profile": "Profil",
  "header.language": "Sprache",
  "header.logout": "Abmelden",
  "header.email": "E-Mail",
  "section.personal": "Persönliche Informationen",
  "section.review": "Überprüfen & Absenden",
  "section.thankYou": "Danke",
  "common.continue": "Weiter",
  "common.back": "Zurück",
  "common.next": "Weiter",
  "common.submit": "Absenden",
  "common.saving": "Speichern…",
  "landing.badge": "KI-Onboarding",
  "landing.title.welcome": "Willkommen bei",
  "landing.title.brand": "ALTEREGO OS",
  "landing.subtitle": "Das Check-in für deine unternehmerische Zukunft.",
  "landing.description":
    "Hilf uns zu verstehen, wer du bist, in welcher Phase du dich befindest und wie wir dich am besten mit maßgeschneidertem Mentoring, Training, Finanzierung und Investitionen unterstützen können.",
  "landing.cta": "Starte deine Reise",
  "landing.note": "Dauert ca. 15 Minuten · Dein Fortschritt wird automatisch gespeichert",
  "auth.signupTitle": "Erstelle dein Konto",
  "auth.loginTitle": "Willkommen zurück",
  "auth.email": "E-Mail-Adresse",
  "auth.password": "Passwort",
  "auth.passwordHint": "Mindestens 8 Zeichen.",
  "auth.signupCta": "Konto erstellen",
  "auth.loginCta": "Anmelden",
  "auth.haveAccount": "Hast du schon ein Konto?",
  "auth.noAccount": "Noch kein Konto?",
  "auth.switchToLogin": "Anmelden",
  "auth.switchToSignup": "Registrieren",
};

const it: Dict = {
  "header.welcome": "Benvenuto",
  "header.profile": "Profilo",
  "header.language": "Lingua",
  "header.logout": "Esci",
  "header.email": "Email",
  "section.personal": "Informazioni personali",
  "section.review": "Rivedi e invia",
  "section.thankYou": "Grazie",
  "common.continue": "Continua",
  "common.back": "Indietro",
  "common.next": "Avanti",
  "common.submit": "Invia",
  "common.saving": "Salvataggio…",
  "landing.badge": "Onboarding con AI",
  "landing.title.welcome": "Benvenuto in",
  "landing.title.brand": "ALTEREGO OS",
  "landing.subtitle": "Il check-in per il tuo futuro imprenditoriale.",
  "landing.description":
    "Aiutaci a capire chi sei, in quale fase ti trovi e come possiamo supportarti al meglio con mentoring, formazione, finanziamenti e investimenti su misura.",
  "landing.cta": "Inizia il tuo percorso",
  "landing.note": "Ci vogliono ~15 minuti · I tuoi progressi vengono salvati automaticamente",
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
};

const pt: Dict = {
  "header.welcome": "Bem-vindo",
  "header.profile": "Perfil",
  "header.language": "Idioma",
  "header.logout": "Sair",
  "header.email": "Email",
  "section.personal": "Informações pessoais",
  "section.review": "Revisar e enviar",
  "section.thankYou": "Obrigado",
  "common.continue": "Continuar",
  "common.back": "Voltar",
  "common.next": "Próximo",
  "common.submit": "Enviar",
  "common.saving": "Salvando…",
  "landing.badge": "Onboarding com IA",
  "landing.title.welcome": "Bem-vindo ao",
  "landing.title.brand": "ALTEREGO OS",
  "landing.subtitle": "O check-in para o seu futuro empreendedor.",
  "landing.description":
    "Ajude-nos a entender quem você é, em que estágio está e como podemos apoiá-lo melhor com mentoria, treinamento, financiamento e investimentos sob medida.",
  "landing.cta": "Comece sua jornada",
  "landing.note": "Leva ~15 minutos · Seu progresso é salvo automaticamente",
  "auth.signupTitle": "Crie sua conta",
  "auth.loginTitle": "Bem-vindo de volta",
  "auth.email": "Endereço de email",
  "auth.password": "Senha",
  "auth.passwordHint": "Pelo menos 8 caracteres.",
  "auth.signupCta": "Criar conta",
  "auth.loginCta": "Entrar",
  "auth.haveAccount": "Já tem uma conta?",
  "auth.noAccount": "Não tem uma conta?",
  "auth.switchToLogin": "Entrar",
  "auth.switchToSignup": "Cadastrar",
};

export const DICTIONARIES = { en, es, fr, de, it, pt } as const;

export const LOCALE_LABELS: Record<keyof typeof DICTIONARIES, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
};
