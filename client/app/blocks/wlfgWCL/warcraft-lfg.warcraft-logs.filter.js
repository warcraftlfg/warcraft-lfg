angular
    .module('blocks.wlfgWCL')
    .filter('wclrealm', wlfgWCLRealms);

function removeDiacritic(str) {
  str = str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç";
  var to   = "aaaaeeeeiiiioooouuuunc";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  return str;
}

function wlfgWCLRealms() {
	//For russian Ream wowprogress use ru locale ...
	var russianRealms = {
	    "Gordunni":"гордунни",
	    "Howling Fjord":"ревущии-фьорд",
	    "Blackscar":"черныи-шрам",
	    "Ashenvale":"ясеневыи-лес",
	    "Soulflayer":"свежеватель-душ",
	    "Razuvious":"разувии",
	    "Azuregos":"азурегос",
	    "Booty Bay":"пиратская-бухта",
	    "Eversong":"вечная-песня",
	    "Deathguard":"страж-смерти",
	    "Lich King":"корольлич",
	    "Fordragon":"дракономор",
	    "Borean Tundra":"бореиская-тундра",
	    "Goldrinn":"голдринн",
	    "Grom":"гром",
	    "Galakrond":"галакронд"
	};

	return function(realm, region) {
		if (region.toLowerCase() == "eu" && russianRealms[realm]) {
		    realm = russianRealms[realm];
		}

		// TODO 
		/*if (region.toLowerCase() == "tw" && taiwanRealms[realm]) {
		    realm = taiwanRealms[realm];
		}

		if (region.toLowerCase() == "kr" && koreaRealms[realm]) {
		    realm = koreaRealms[realm];
		}

		if (region.toLowerCase() == "cn" && chinaRealms[realm]) {
		    realm = chinaRealms[realm];
		}*/

	    realm = realm.replace(" (Português)", '-portugues');
	    realm = realm.split(" ").join("-");
	    realm = realm.split("'").join("");
	    realm = removeDiacritic(realm);

		return realm;
	};
}