(function (window) {
  window.__env = window.__env || {};

  // WarcraftLFG url
  window.__env.warcraftLfgUrl = 'https://www.warcraftlfg.com';

  // WarcraftProgress url
  window.__env.warcraftProgressUrl = 'https://www.warcraftprogress.com';

  // WarcraftParser url
  window.__env.warcraftParserUrl = 'https://www.warcraftparser.com';

  // API Url
  window.__env.apiUrl = 'https://api.warcrafthub.com';

  // API Progress
  window.__env.apiProgressUrl = 'https://api.warcraftprogress.com';

  // HTML5
  window.__env.hasbang = '#';

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
    "al": "es_MX#America",
    "br": "pt_BR#America",
    "de": "de_DE#Europe",
    "en": "en_GB#Europe",
    "es": "es_ES#Europe",
    "fr": "fr_FR#Europe",
    "it": "it_IT#Europe",
    "oc": "en_US#Australia",
    "pt": "pt_BR#Europe",
    "ru": "ru_RU#Europe",
  };

  window.__env.rankingRegions = rankingRegions;
  window.__env.rankingSubregions = rankingSubregions;

  var ilvlColor = {
    'legendary': 735,
    'epic': 725,
    'rare': 715,
    'uncommon': 700, 
  };

  window.__env.ilvlColor = ilvlColor;

  var tiers = { 
    "current": "18",
    "18": {
      "name": "Hellfire Citadel",
      "class": "hfc-18",
      "bosses":  ["Hellfire Assault", "Iron Reaver", "Kormrok", "Hellfire High Council", "Kilrogg Deadeye", "Gorefiend", "Shadow-Lord Iskar", "Socrethar the Eternal", "Tyrant Velhari", "Fel Lord Zakuun", "Xhul'horac", "Mannoroth", "Archimonde"],
    },
    "19": {
      "name": "The Emerald Nightmare",
      "class": "ten-19",
      "bosses": ["Nythendra", "Elerethe Renferal", "Il'gynoth, Heart of Corruption", "Ursoc", "Dragons of Nightmare", "Cenarius", "Xavius"],
    },
    "19.5": {
      "name": "The Nighthold",
      "class": "tn-19",
      "bosses": ["Skorpyron", "Chronomatic Anomaly", "Trilliax", "Spellblade Aluriel", "Tichondrius", "Krosus", "High Botanist Tel'arn", "Star Augur Etraeus", "Grand Magistrix Elisande", "Gul'dan"],
    }
  };

  window.__env.tiers = tiers;

  window.__env.itemSlot =  ["mainHand", "head", "neck", "shoulder", "back", "chest", "wrist", "hands", "waist", "legs", "feet", "finger1", "finger2", "trinket1", "trinket2"];

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));