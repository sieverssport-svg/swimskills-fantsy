export type Lang = "en" | "ru";

type DictShape = {
  appName: string;
  currency: string;
  yourTeam: string;
  tournament: string;
  leaderboard: string;
  catalog: string;
  profile: string;
  teamBuilder: string;
  pickASwimmer: string;
  budget: string;
  remaining: string;
  captain: string;
  captainHint: string;
  setCaptain: string;
  captainSet: string;
  submit: string;
  teamLocked: string;
  edit: string;
  save: string;
  transfer: string;
  transferUsed: string;
  selected: string;
  notSelected: string;
  rules: string;
  rulesText: string;
  slotSprint: string;
  slotDistance: string;
  slotUniversal: string;
  slotWildcard: string;
  archetypeSprint: string;
  archetypeDistance: string;
  archetypeUniversal: string;
  archetypeOther: string;
  deadline: string;
  daysLeft: string;
  hoursLeft: string;
  countdownLocked: string;
  activeTournament: string;
  upcomingTournaments: string;
  enterTournament: string;
  viewTournament: string;
  open: string;
  upcoming: string;
  locked: string;
  live: string;
  finished: string;
  yourPosition: string;
  points: string;
  rank: string;
  team: string;
  score: string;
  you: string;
  total: string;
  pickGuide: string;
  filterAll: string;
  filterSprint: string;
  filterDistance: string;
  filterUniversal: string;
  filterWomen: string;
  filterMen: string;
  selectSlot: string;
  chooseSwimmer: string;
  addToSlot: string;
  remove: string;
  cancel: string;
  confirm: string;
  teamComplete: string;
  teamHasIssues: string;
  errBudget: string;
  errWomen: string;
  errMen: string;
  errCountry: string;
  errSprint: string;
  errDistance: string;
  errUniversal: string;
  errCaptain: string;
  errCount: string;
  welcome: string;
  welcomeText: string;
  start: string;
  share: string;
  shareText: string;
  notLogged: string;
  swimmer: string;
  country: string;
  archetype: string;
  events: string;
  ovr: string;
  price: string;
  yourScore: string;
  finalRank: string;
  transfersLeft: string;
  confirmLock: string;
  confirmLockHint: string;
  noActive: string;
  backHome: string;
  teamPreview: string;
  captainBadge: string;
  male: string;
  female: string;
};

export const dictionary: Record<Lang, DictShape> = {
  en: {
    appName: "Swim Skills Fantasy",
    currency: "SS",
    yourTeam: "Your Team",
    tournament: "Tournament",
    leaderboard: "Leaderboard",
    catalog: "Catalog",
    profile: "Profile",
    teamBuilder: "Team Builder",
    pickASwimmer: "Pick a swimmer",
    budget: "Budget",
    remaining: "Remaining",
    captain: "Captain",
    captainHint: "×2 points",
    setCaptain: "Set captain",
    captainSet: "Captain ✓",
    submit: "Lock team",
    teamLocked: "Team locked",
    edit: "Edit",
    save: "Save",
    transfer: "Transfer",
    transferUsed: "Transfer used",
    selected: "Selected",
    notSelected: "Empty",
    rules: "Rules",
    rulesText:
      "7 swimmers · 1000 SS budget · ≥2 women · ≥2 men · ≤3 from one country · 1 captain ×2",
    slotSprint: "Sprint",
    slotDistance: "Distance",
    slotUniversal: "Universal",
    slotWildcard: "Wildcard",
    archetypeSprint: "Sprint (≤100m)",
    archetypeDistance: "Distance (≥400m)",
    archetypeUniversal: "Universal (3+ events)",
    archetypeOther: "Specialist",
    deadline: "Deadline",
    daysLeft: "days left",
    hoursLeft: "h left",
    countdownLocked: "Team locked",
    activeTournament: "Active tournament",
    upcomingTournaments: "Upcoming tournaments",
    enterTournament: "Build team",
    viewTournament: "View",
    open: "Registration open",
    upcoming: "Upcoming",
    locked: "Locked",
    live: "Live",
    finished: "Finished",
    yourPosition: "Your rank",
    points: "pts",
    rank: "Rank",
    team: "Team",
    score: "Score",
    you: "You",
    total: "Total",
    pickGuide: "Pick to add → tap to remove",
    filterAll: "All",
    filterSprint: "Sprint",
    filterDistance: "Distance",
    filterUniversal: "Universal",
    filterWomen: "Women",
    filterMen: "Men",
    selectSlot: "Select slot",
    chooseSwimmer: "Choose swimmer",
    addToSlot: "Add",
    remove: "Remove",
    cancel: "Cancel",
    confirm: "Confirm",
    teamComplete: "Team is valid ✓",
    teamHasIssues: "Fix to continue:",
    errBudget: "Over budget",
    errWomen: "At least 2 women required",
    errMen: "At least 2 men required",
    errCountry: "Max 3 swimmers from one country",
    errSprint: "SPRINT slot needs sprint specialist",
    errDistance: "DISTANCE slot needs distance specialist",
    errUniversal: "UNIVERSAL slot needs versatile swimmer",
    errCaptain: "Pick a captain",
    errCount: "Need exactly 7 swimmers",
    welcome: "Welcome to Swim Skills Fantasy",
    welcomeText:
      "Build a 7-swimmer team within 1000 SS, pick your captain, and climb the leaderboard with real World Aquatics results.",
    start: "Start",
    share: "Share team",
    shareText: "I just built my team for",
    notLogged: "Not signed in",
    swimmer: "Swimmer",
    country: "Country",
    archetype: "Archetype",
    events: "Events",
    ovr: "OVR",
    price: "Price",
    yourScore: "Your score",
    finalRank: "Final rank",
    transfersLeft: "transfers left",
    confirmLock: "Lock team for this tournament?",
    confirmLockHint: "After locking you have 1 free transfer.",
    noActive: "No active tournaments yet",
    backHome: "Home",
    teamPreview: "Team preview",
    captainBadge: "C",
    male: "M",
    female: "W",
  },
  ru: {
    appName: "Swim Skills Fantasy",
    currency: "SS",
    yourTeam: "Команда",
    tournament: "Турнир",
    leaderboard: "Таблица",
    catalog: "Каталог",
    profile: "Профиль",
    teamBuilder: "Сборка команды",
    pickASwimmer: "Выбрать пловца",
    budget: "Бюджет",
    remaining: "Осталось",
    captain: "Капитан",
    captainHint: "×2 очки",
    setCaptain: "Назначить",
    captainSet: "Капитан ✓",
    submit: "Закрепить команду",
    teamLocked: "Команда закреплена",
    edit: "Изменить",
    save: "Сохранить",
    transfer: "Трансфер",
    transferUsed: "Трансфер использован",
    selected: "Выбрано",
    notSelected: "Пусто",
    rules: "Правила",
    rulesText:
      "7 пловцов · бюджет 1000 SS · ≥2 женщины · ≥2 мужчины · ≤3 из одной страны · 1 капитан ×2",
    slotSprint: "Спринт",
    slotDistance: "Стайер",
    slotUniversal: "Универсал",
    slotWildcard: "Свободный",
    archetypeSprint: "Спринт (≤100м)",
    archetypeDistance: "Стайер (≥400м)",
    archetypeUniversal: "Универсал (3+ дисциплины)",
    archetypeOther: "Специалист",
    deadline: "Дедлайн",
    daysLeft: "дн.",
    hoursLeft: "ч",
    countdownLocked: "Команда закреплена",
    activeTournament: "Активный турнир",
    upcomingTournaments: "Будущие турниры",
    enterTournament: "Собрать команду",
    viewTournament: "Открыть",
    open: "Регистрация открыта",
    upcoming: "Скоро",
    locked: "Закрыто",
    live: "Идёт",
    finished: "Завершён",
    yourPosition: "Твоё место",
    points: "очк",
    rank: "Место",
    team: "Команда",
    score: "Очки",
    you: "Ты",
    total: "Итого",
    pickGuide: "Тапни, чтобы добавить или убрать",
    filterAll: "Все",
    filterSprint: "Спринт",
    filterDistance: "Стайер",
    filterUniversal: "Универсал",
    filterWomen: "Ж",
    filterMen: "М",
    selectSlot: "Выбери слот",
    chooseSwimmer: "Выбери пловца",
    addToSlot: "Добавить",
    remove: "Убрать",
    cancel: "Отмена",
    confirm: "Подтвердить",
    teamComplete: "Команда готова ✓",
    teamHasIssues: "Исправь, чтобы продолжить:",
    errBudget: "Превышен бюджет",
    errWomen: "Минимум 2 женщины",
    errMen: "Минимум 2 мужчины",
    errCountry: "Не более 3 из одной страны",
    errSprint: "В слот SPRINT — только спринтер",
    errDistance: "В слот DISTANCE — только стайер",
    errUniversal: "В слот UNIVERSAL — только универсал",
    errCaptain: "Назначь капитана",
    errCount: "Нужно ровно 7 пловцов",
    welcome: "Welcome to Swim Skills Fantasy",
    welcomeText:
      "Собери команду из 7 пловцов в бюджет 1000 SS, назначь капитана и поднимайся в таблице по реальным результатам с турниров World Aquatics.",
    start: "Начать",
    share: "Поделиться",
    shareText: "Собрал команду на",
    notLogged: "Не авторизован",
    swimmer: "Пловец",
    country: "Страна",
    archetype: "Архетип",
    events: "Дистанции",
    ovr: "OVR",
    price: "Цена",
    yourScore: "Очки",
    finalRank: "Итоговое место",
    transfersLeft: "трансферов",
    confirmLock: "Закрепить команду на этот турнир?",
    confirmLockHint: "После закрепления у тебя 1 бесплатный трансфер.",
    noActive: "Нет активных турниров",
    backHome: "На главную",
    teamPreview: "Команда",
    captainBadge: "C",
    male: "М",
    female: "Ж",
  },
};

export type Dict = DictShape;

export function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  const tg = (window as unknown as {
    Telegram?: { WebApp?: { initDataUnsafe?: { user?: { language_code?: string } } } };
  }).Telegram;
  const code = tg?.WebApp?.initDataUnsafe?.user?.language_code ?? navigator.language ?? "en";
  return code.toLowerCase().startsWith("ru") ? "ru" : "en";
}
