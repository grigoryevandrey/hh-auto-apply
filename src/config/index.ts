export const config = {
  ROOT_PATH: process.cwd(),
  DEFAULT_URL: "https://hh.ru/",
  BROWSER: {
    PORT: process.env.PORT || 9213,
    HOST: "127.0.0.1",
  },
  SELECTOR: {
    VACANCY: 'a[data-qa="vacancy-serp__vacancy_response"]',
    RELOCATION_BUTTON: 'button[data-qa="relocation-warning-confirm"]',
    TEXTAREA: "textarea",
    SUBMIT_BUTTON: 'button[data-qa="vacancy-response-submit-popup"]',
    PAGER_NEXT: 'a[data-qa="pager-next"]',
    MULTIPLE_TEXTAREAS: "textarea.bloko-textarea",
    MULTIPLE_SUBMIT_BUTTON: 'button[data-qa="vacancy-response-submit-popup"]',
    AFTER_MULTIPLE_TEXTAREAS:
      '.bloko-button[data-qa="vacancy-response-link-view-topic"]',
    NOTIFICATION: "div.bloko-notification__content > div.bloko-translate-guard",
  },
  TEXT: {
    DAILY_LIMIT_REACHED: "В течение 24 часов можно совершить не более ",
  },
  FILLER: {
    TEXTAREA: "-",
  },
};
