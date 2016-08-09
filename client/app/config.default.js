(function (window) {
  window.__env = window.__env || {};

  // WarcraftLFG url
  window.__env.warcraftLfgUrl = 'http://warcraftlfg.dev.com';

  // WarcraftProgress url
  window.__env.warcraftProgressUrl = 'http://warcraftprogress.dev.com';

  // WarcraftParser url
  window.__env.warcraftParserUrl = 'http://warcraftparser.dev.com';

  var tiers = { 
    "current": "t18",
    "t18": {
      "name": "Hellfire Citadel",
      "bosses":  ["Hellfire Assault", "Iron Reaver", "Kormrok", "Hellfire High Council", "Kilrogg Deadeye", "Gorefiend", "Shadow-Lord Iskar", "Socrethar the Eternal", "Tyrant Velhari", "Fel Lord Zakuun", "Xhul'horac", "Mannoroth", "Archimonde"],
    },
    "t19": {
      "name": "The Emerald Nightmare",
      "bosses": ["Nythendra", "Elerethe Renferal", "Il'gynoth, Heart of Corruption", "Ursoc", "Dragons of Nightmare", "Cenarius", "Xavius"],
    },
    "t19.5": {
      "name": "The Nighthold",
      "bosses": ["Skorpyron", "Chronomatic Anomaly", "Trilliax", "Spellblade Aluriel", "Tichondrius", "Krosus", "High Botanist Tel'arn", "Star Augur Etraeus", "Grand Magistrix Elisande", "Gul'dan"],
    }
  };

  window.__env.tiers = tiers;

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));