(function (window) {
  window.__env = window.__env || {};

  // WarcraftLFG url
  window.__env.warcraftLfgUrl = 'https://warcraftlfg.dev.com';

  // WarcraftProgress url
  window.__env.warcraftProgressUrl = 'https://warcraftprogress.dev.com';

  // WarcraftParser url
  window.__env.warcraftParserUrl = 'https://warcraftparser.dev.com';

  var realms = {
    "eu": ["eu.en_GB.Europe/Paris", "eu.de_DE.Europe/Paris", "eu.fr_FR.Europe/Paris", "eu.es_ES.Europe/Paris", "eu.ru_RU.Europe/Paris", "eu.it_IT.Europe/Paris", "eu.pt_BR.Europe/Paris"],
    "us": ["us.en_US.Australia/Melbourne", "us.es_MX.America/Chicago", "us.pt_BR.America/Sao_Paulo", "us.en_US.America/Los_Angeles", "us.en_US.America/Denver", "us.en_US.America/Chicago", "us.en_US.America/New_York"],
    "tw": ["tw.zh_TW.Asia/Taipei"],
    "kr": ["kr.ko_KR.Asia/Seoul"],
    "en": ["eu.en_GB.Europe/Paris"],
    "de": ["eu.de_DE.Europe/Paris"],
    "fr": ["eu.fr_FR.Europe/Paris"],
    "es": ["eu.es_ES.Europe/Paris"],
    "ru": ["eu.ru_RU.Europe/Paris"],
    "it": ["eu.it_IT.Europe/Paris"],
    "pt": ["eu.pt_BR.Europe/Paris"],
    "oc": ["us.en_US.Australia/Melbourne"],
    "al": ["us.es_MX.America/Chicago"],
    "br": ["us.pt_BR.America/Sao_Paulo"],
  };

  window.__env.realms = realms;

  var rankingRegions = {
    "eu": "eu",
    "us": "us",
    "tw": "tw",
    "kr": "kr",
  };

  var rankingSubregions = {
    "al": "es_MX_America",
    "br": "pt_BR_America",
    "de": "de_DE_Europe",
    "en": "en_GB_Europe",
    "es": "es_ES_Europe",
    "fr": "fr_FR_Europe",
    "it": "it_IT_Europe",
    "oc": "en_US_Australia",
    "pt": "pt_BR_Europe",
    "ru": "ru_RU_Europe",
  };

  window.__env.rankingRegions = rankingRegions;
  window.__env.rankingSubregions = rankingSubregions;

  var tiers = { 
    "current": "18",
    "18": {
      "name": "Hellfire Citadel",
      "bosses":  ["Hellfire Assault", "Iron Reaver", "Kormrok", "Hellfire High Council", "Kilrogg Deadeye", "Gorefiend", "Shadow-Lord Iskar", "Socrethar the Eternal", "Tyrant Velhari", "Fel Lord Zakuun", "Xhul'horac", "Mannoroth", "Archimonde"],
    },
    "19": {
      "name": "The Emerald Nightmare",
      "bosses": ["Nythendra", "Elerethe Renferal", "Il'gynoth, Heart of Corruption", "Ursoc", "Dragons of Nightmare", "Cenarius", "Xavius"],
    },
    "19.5": {
      "name": "The Nighthold",
      "bosses": ["Skorpyron", "Chronomatic Anomaly", "Trilliax", "Spellblade Aluriel", "Tichondrius", "Krosus", "High Botanist Tel'arn", "Star Augur Etraeus", "Grand Magistrix Elisande", "Gul'dan"],
    }
  };

  window.__env.tiers = tiers;

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));