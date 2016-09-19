angular
    .module('app.character')
    .directive('wlfgItemArtifact', wlfgItemArtifact);

function wlfgItemArtifact() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/directive/item/character.item-artifact.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.artifactTraits = {  
           "1136":{  
              "spellID":209577,
              "name":"Warbreaker",
              "icon":"inv_sword_2h_artifactarathor_d_01"
           },
           "1137":{  
              "spellID":209574,
              "name":"Shattered Defenses",
              "icon":"warrior_talent_icon_igniteweapon"
           },
           "1138":{  
              "spellID":209573,
              "name":"Void Cleave",
              "icon":"inv_enchant_voidsphere"
           },
           "1139":{  
              "spellID":209566,
              "name":"Corrupted Blood of Zakajz",
              "icon":"inv_artifact_corruptedbloodofzakajz"
           },
           "1140":{  
              "spellID":209559,
              "name":"Defensive Measures",
              "icon":"ability_warrior_challange"
           },
           "1141":{  
              "spellID":209554,
              "name":"Focus in Battle",
              "icon":"ability_warrior_unrelentingassault"
           },
           "1142":{  
              "spellID":209548,
              "name":"Will of the First King",
              "icon":"ability_warrior_improveddisciplines"
           },
           "1143":{  
              "spellID":209459,
              "name":"Unending Rage",
              "icon":"ability_warrior_intensifyrage"
           },
           "1144":{  
              "spellID":209462,
              "name":"One Against Many",
              "icon":"ability_warrior_cleave"
           },
           "1145":{  
              "spellID":209472,
              "name":"Crushing Blows",
              "icon":"ability_warrior_decisivestrike"
           },
           "1146":{  
              "spellID":216274,
              "name":"Many Will Fall",
              "icon":"ability_whirlwind"
           },
           "1147":{  
              "spellID":209481,
              "name":"Deathblow",
              "icon":"inv_sword_48"
           },
           "1148":{  
              "spellID":209483,
              "name":"Tactical Advance",
              "icon":"ability_heroicleap"
           },
           "1149":{  
              "spellID":209492,
              "name":"Precise Strikes",
              "icon":"ability_warrior_colossussmash"
           },
           "1150":{  
              "spellID":209494,
              "name":"Exploit the Weakness",
              "icon":"ability_warrior_warbringer"
           },
           "1151":{  
              "spellID":209541,
              "name":"Touch of Zakajz",
              "icon":"ability_warrior_bloodbath"
           },
           "1220":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1356":{  
              "spellID":209480,
              "name":"Thoradin's Might",
              "icon":"ability_warrior_savageblow"
           },
           "1393":{  
              "spellID":214937,
              "name":"Unbreakable Steel",
              "icon":"inv_sword_2h_artifactarathor_d_02"
           },
           "980":{  
              "spellID":200875,
              "name":"Juggernaut",
              "icon":"warrior_talent_icon_skirmisher"
           },
           "981":{  
              "spellID":200845,
              "name":"Rage of the Valarjar",
              "icon":"ability_warrior_intensifyrage"
           },
           "982":{  
              "spellID":200872,
              "name":"Odyn's Champion",
              "icon":"ability_warrior_improveddisciplines"
           },
           "984":{  
              "spellID":205545,
              "name":"Odyn's Fury",
              "icon":"inv_sword_1h_artifactvigfus_d_01"
           },
           "985":{  
              "spellID":200871,
              "name":"Focus In Chaos",
              "icon":"ability_warrior_focusedrage"
           },
           "986":{  
              "spellID":200870,
              "name":"Helya's Wrath",
              "icon":"warrior_talent_icon_innerrage"
           },
           "987":{  
              "spellID":200863,
              "name":"Sense Death",
              "icon":"warrior_skullbanner"
           },
           "988":{  
              "spellID":200846,
              "name":"Deathdealer",
              "icon":"inv_sword_48"
           },
           "989":{  
              "spellID":216273,
              "name":"Wild Slashes",
              "icon":"ability_warrior_weaponmastery"
           },
           "990":{  
              "spellID":200849,
              "name":"Wrath and Fury",
              "icon":"warrior_wild_strike"
           },
           "991":{  
              "spellID":200853,
              "name":"Unstoppable",
              "icon":"ability_warrior_rampage"
           },
           "992":{  
              "spellID":200856,
              "name":"Uncontrolled Rage",
              "icon":"ability_warrior_charge"
           },
           "993":{  
              "spellID":200857,
              "name":"Battle Scars",
              "icon":"ability_warrior_innerrage"
           },
           "994":{  
              "spellID":200859,
              "name":"Bloodcraze",
              "icon":"ability_warrior_bloodsurge"
           },
           "995":{  
              "spellID":200860,
              "name":"Unrivaled Strength",
              "icon":"ability_warrior_strengthofarms"
           },
           "996":{  
              "spellID":200861,
              "name":"Raging Berserker",
              "icon":"ability_warrior_endlessrage"
           },
           "1221":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1357":{  
              "spellID":200847,
              "name":"Thirst for Battle",
              "icon":"ability_warrior_bloodfrenzy"
           },
           "1394":{  
              "spellID":214938,
              "name":"Titanic Power",
              "icon":"inv_sword_1h_artifactvigfus_d_01dual"
           },
           "91":{  
              "spellID":203524,
              "name":"Neltharion's Fury",
              "icon":"inv_shield_1h_artifactmagnar_d_01"
           },
           "92":{  
              "spellID":189059,
              "name":"Scales of Earth",
              "icon":"inv_elemental_eternal_earth"
           },
           "93":{  
              "spellID":203576,
              "name":"Dragon Scales",
              "icon":"inv_artifact_dragonscales"
           },
           "94":{  
              "spellID":188778,
              "name":"Might of the Vrykul",
              "icon":"inv_misc_head_vrykul"
           },
           "95":{  
              "spellID":188635,
              "name":"Vrykul Shield Training",
              "icon":"inv_misc_monsterscales_07"
           },
           "96":{  
              "spellID":216272,
              "name":"Rage of the Fallen",
              "icon":"ability_warrior_revenge"
           },
           "97":{  
              "spellID":188651,
              "name":"Rumbling Voice",
              "icon":"ability_warrior_battleshout"
           },
           "98":{  
              "spellID":188683,
              "name":"Will to Survive",
              "icon":"spell_holy_ashestoashes"
           },
           "99":{  
              "spellID":203230,
              "name":"Leaping Giants",
              "icon":"ability_heroicleap"
           },
           "100":{  
              "spellID":203225,
              "name":"Dragon Skin",
              "icon":"ability_warrior_intensifyrage"
           },
           "101":{  
              "spellID":203227,
              "name":"Intolerance",
              "icon":"warrior_talent_icon_furyintheblood"
           },
           "102":{  
              "spellID":188639,
              "name":"Shatter the Bones",
              "icon":"inv_shield_05"
           },
           "103":{  
              "spellID":203261,
              "name":"Wall of Steel",
              "icon":"ability_warrior_victoryrush"
           },
           "104":{  
              "spellID":188672,
              "name":"Reflective Plating",
              "icon":"ability_warrior_shieldreflection"
           },
           "105":{  
              "spellID":188632,
              "name":"Toughness",
              "icon":"ability_warrior_rallyingcry"
           },
           "106":{  
              "spellID":188644,
              "name":"Thunder Crash",
              "icon":"spell_nature_thunderclap"
           },
           "1222":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1358":{  
              "spellID":188647,
              "name":"Strength of the Earth Aspect",
              "icon":"inv_sword_11"
           },
           "1395":{  
              "spellID":214939,
              "name":"Unbreakable Bulwark",
              "icon":"inv_shield_1h_artifactmagnar_d_02"
           },
           "1456":{  
              "spellID":226829,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "963":{  
              "spellID":200474,
              "name":"Power of the Silver Hand",
              "icon":"ability_paladin_blessedhands"
           },
           "964":{  
              "spellID":200430,
              "name":"Protection of Tyr",
              "icon":"spell_holy_auramastery"
           },
           "965":{  
              "spellID":200652,
              "name":"Tyr's Deliverance",
              "icon":"inv_mace_2h_artifactsilverhand_d_01"
           },
           "966":{  
              "spellID":200421,
              "name":"The Light Saves",
              "icon":"spell_holy_holyguidance"
           },
           "967":{  
              "spellID":200407,
              "name":"Protection of the Light",
              "icon":"spell_holy_divineprotection"
           },
           "968":{  
              "spellID":200373,
              "name":"Vindicator",
              "icon":"spell_holy_avenginewrath"
           },
           "969":{  
              "spellID":200327,
              "name":"Share the Burden",
              "icon":"spell_holy_sealofsacrifice"
           },
           "970":{  
              "spellID":200326,
              "name":"Focused Healing",
              "icon":"spell_holy_layonhands"
           },
           "971":{  
              "spellID":200316,
              "name":"Justice through Sacrifice",
              "icon":"spell_holy_power"
           },
           "972":{  
              "spellID":200315,
              "name":"Shock Treatment",
              "icon":"spell_holy_searinglight"
           },
           "973":{  
              "spellID":200311,
              "name":"Templar of the Light",
              "icon":"ability_paladin_righteousvengeance"
           },
           "974":{  
              "spellID":200302,
              "name":"Knight of the Silver Hand",
              "icon":"spell_holy_righteousfury"
           },
           "975":{  
              "spellID":200298,
              "name":"Blessings of the Silver Hand",
              "icon":"spell_holy_sealofprotection"
           },
           "976":{  
              "spellID":200296,
              "name":"Expel the Darkness",
              "icon":"spell_paladin_lightofdawn"
           },
           "977":{  
              "spellID":200294,
              "name":"Deliver the Light",
              "icon":"spell_holy_surgeoflight"
           },
           "1186":{  
              "spellID":200482,
              "name":"Second Sunrise",
              "icon":"spell_paladin_lightofdawn"
           },
           "1205":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1256":{  
              "spellID":213428,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "1342":{  
              "spellID":222648,
              "name":"Virtues of the Light",
              "icon":"spell_holy_divinepurpose"
           },
           "1377":{  
              "spellID":214923,
              "name":"Silver Touch",
              "icon":"inv_mace_2h_artifactsilverhand_d_02"
           },
           "1120":{  
              "spellID":209202,
              "name":"Eye of Tyr",
              "icon":"inv_shield_1h_artifactnorgannon_d_01"
           },
           "1121":{  
              "spellID":209229,
              "name":"Hammer Time",
              "icon":"ability_paladin_hammeroftherighteous"
           },
           "1122":{  
              "spellID":209217,
              "name":"Stern Judgment",
              "icon":"ability_paladin_judgementred"
           },
           "1123":{  
              "spellID":209220,
              "name":"Unflinching Defense",
              "icon":"spell_holy_ardentdefender"
           },
           "1124":{  
              "spellID":213570,
              "name":"Righteous Crusader",
              "icon":"ability_paladin_shieldofvengeance"
           },
           "1125":{  
              "spellID":209223,
              "name":"Scatter the Shadows",
              "icon":"ability_priest_holybolts01"
           },
           "1126":{  
              "spellID":209218,
              "name":"Consecration in Flame",
              "icon":"spell_holy_innerfire"
           },
           "1127":{  
              "spellID":209216,
              "name":"Bastion of Truth",
              "icon":"ability_defend"
           },
           "1128":{  
              "spellID":209224,
              "name":"Resolve of Truth",
              "icon":"inv_ragnaros_heart"
           },
           "1129":{  
              "spellID":211912,
              "name":"Faith's Armor",
              "icon":"inv_misc_armorkit_23"
           },
           "1130":{  
              "spellID":209341,
              "name":"Painful Truths",
              "icon":"spell_holy_ardentdefender"
           },
           "1131":{  
              "spellID":209285,
              "name":"Sacrifice of the Just",
              "icon":"spell_holy_divineshield"
           },
           "1132":{  
              "spellID":209376,
              "name":"Forbearant Faithful",
              "icon":"spell_holy_divineshield"
           },
           "1133":{  
              "spellID":209389,
              "name":"Bulwark of Order",
              "icon":"spell_holy_pureofheart"
           },
           "1134":{  
              "spellID":209539,
              "name":"Light of the Titans",
              "icon":"spell_paladin_lightofdawn"
           },
           "1135":{  
              "spellID":209474,
              "name":"Tyr's Enforcer",
              "icon":"spell_holy_avengersshield"
           },
           "1206":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1343":{  
              "spellID":221841,
              "name":"Truthguard's Light",
              "icon":"ability_priest_flashoflight"
           },
           "1378":{  
              "spellID":214924,
              "name":"Unrelenting Light",
              "icon":"inv_shield_1h_artifactnorgannon_d_02"
           },
           "1455":{  
              "spellID":226829,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "40":{  
              "spellID":205273,
              "name":"Wake of Ashes",
              "icon":"inv_sword_2h_artifactashbringer_d_01"
           },
           "41":{  
              "spellID":186941,
              "name":"Highlord's Judgment",
              "icon":"spell_holy_righteousfury"
           },
           "42":{  
              "spellID":184759,
              "name":"Sharpened Edge",
              "icon":"ability_paladin_empoweredsealstruth"
           },
           "43":{  
              "spellID":184843,
              "name":"Righteous Blade",
              "icon":"ability_paladin_judgementofthepure"
           },
           "44":{  
              "spellID":186934,
              "name":"Embrace the Light",
              "icon":"spell_holy_divineprovidence"
           },
           "47":{  
              "spellID":184778,
              "name":"Deflection",
              "icon":"ability_paladin_gaurdedbythelight"
           },
           "49":{  
              "spellID":186773,
              "name":"Divine Tempest",
              "icon":"ability_paladin_divinestorm"
           },
           "50":{  
              "spellID":186927,
              "name":"Deliver the Justice",
              "icon":"spell_holy_sealofvengeance"
           },
           "51":{  
              "spellID":185368,
              "name":"Might of the Templar",
              "icon":"spell_holy_blessedresillience"
           },
           "52":{  
              "spellID":186944,
              "name":"Protector of the Ashen Blade",
              "icon":"spell_holy_sealofprotection"
           },
           "53":{  
              "spellID":186945,
              "name":"Wrath of the Ashbringer",
              "icon":"ability_paladin_sanctifiedwrath"
           },
           "54":{  
              "spellID":186788,
              "name":"Echo of the Highlord",
              "icon":"ability_paladin_sheathoflight"
           },
           "350":{  
              "spellID":185086,
              "name":"Endless Resolve",
              "icon":"ability_paladin_righteousvengeance"
           },
           "351":{  
              "spellID":182234,
              "name":"Unbreakable Will",
              "icon":"spell_paladin_clarityofpurpose"
           },
           "352":{  
              "spellID":193058,
              "name":"Healing Storm",
              "icon":"spell_priest_divinestar"
           },
           "353":{  
              "spellID":179546,
              "name":"Ashes to Ashes",
              "icon":"inv_artifact_ashes_to_ashes"
           },
           "1118":{  
              "spellID":207604,
              "name":"Ashbringer's Light",
              "icon":"inv_sword_2h_artifactashbringerpurified_d_03"
           },
           "1207":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1275":{  
              "spellID":214081,
              "name":"Blade of Light",
              "icon":"ability_paladin_swiftretribution"
           },
           "868":{  
              "spellID":197038,
              "name":"Wilderness Expert",
              "icon":"ability_druid_ferociousbite"
           },
           "869":{  
              "spellID":197047,
              "name":"Furious Swipes",
              "icon":"ability_hunter_longevity"
           },
           "870":{  
              "spellID":197080,
              "name":"Pack Leader",
              "icon":"ability_hunter_killcommand"
           },
           "871":{  
              "spellID":197138,
              "name":"Natural Reflexes",
              "icon":"ability_hunter_huntervswild"
           },
           "872":{  
              "spellID":197139,
              "name":"Focus of the Titans",
              "icon":"ability_hunter_aspectoftheviper"
           },
           "873":{  
              "spellID":197140,
              "name":"Spitting Cobras",
              "icon":"ability_hunter_snaketrap"
           },
           "874":{  
              "spellID":197160,
              "name":"Mimiron's Shell",
              "icon":"ability_hunter_pet_turtle"
           },
           "875":{  
              "spellID":197162,
              "name":"Jaws of Thunder",
              "icon":"ability_thunderking_balllightning"
           },
           "876":{  
              "spellID":197178,
              "name":"Hunter's Advantage",
              "icon":"ability_hunter_misdirection"
           },
           "877":{  
              "spellID":197199,
              "name":"Spirit Bond",
              "icon":"ability_hunter_invigeration"
           },
           "878":{  
              "spellID":197248,
              "name":"Master of Beasts",
              "icon":"ability_hunter_masterscall"
           },
           "879":{  
              "spellID":207068,
              "name":"Titan's Thunder",
              "icon":"inv_firearm_2h_artifactlegion_d_01"
           },
           "880":{  
              "spellID":197343,
              "name":"Pathfinder",
              "icon":"ability_mount_jungletiger"
           },
           "881":{  
              "spellID":197344,
              "name":"Hati's Bond",
              "icon":"ability_hunter_ferociousinspiration"
           },
           "882":{  
              "spellID":197354,
              "name":"Surge of the Stormgod",
              "icon":"ability_monk_forcesphere"
           },
           "1095":{  
              "spellID":206910,
              "name":"Unleash the Beast",
              "icon":"ability_hunter_longevity"
           },
           "1196":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1336":{  
              "spellID":215779,
              "name":"Beast Master",
              "icon":"ability_hunter_longevity"
           },
           "1368":{  
              "spellID":214914,
              "name":"Spiritbound",
              "icon":"spell_beastmaster_wolf"
           },
           "307":{  
              "spellID":204147,
              "name":"Windburst",
              "icon":"inv_bow_1h_artifactwindrunner_d_02"
           },
           "308":{  
              "spellID":204219,
              "name":"Mark of the Windrunner",
              "icon":"ability_hunter_markedfordeath"
           },
           "309":{  
              "spellID":191328,
              "name":"Critical Focus",
              "icon":"ability_impalingbolt"
           },
           "310":{  
              "spellID":191339,
              "name":"Rapid Killing",
              "icon":"ability_marksmanship"
           },
           "311":{  
              "spellID":191048,
              "name":"Call of the Hunter",
              "icon":"ability_hunter_assassinate"
           },
           "312":{  
              "spellID":190449,
              "name":"Deadly Aim",
              "icon":"spell_hunter_focusingshot"
           },
           "313":{  
              "spellID":190457,
              "name":"Windrunner's Guidance",
              "icon":"ability_hunter_markedshot"
           },
           "314":{  
              "spellID":190462,
              "name":"Quick Shot",
              "icon":"ability_trueshot"
           },
           "315":{  
              "spellID":190467,
              "name":"Called Shot",
              "icon":"ability_upgrademoonglaive"
           },
           "316":{  
              "spellID":190503,
              "name":"Healing Shell",
              "icon":"ability_vehicle_shellshieldgenerator"
           },
           "317":{  
              "spellID":190514,
              "name":"Survival of the Fittest",
              "icon":"ability_rogue_feint"
           },
           "318":{  
              "spellID":190520,
              "name":"Precision",
              "icon":"ability_hunter_zenarchery"
           },
           "319":{  
              "spellID":190529,
              "name":"Marked for Death",
              "icon":"ability_hunter_mastermarksman"
           },
           "320":{  
              "spellID":190567,
              "name":"Gust of Wind",
              "icon":"spell_sandexplosion"
           },
           "321":{  
              "spellID":190852,
              "name":"Legacy of the Windrunners",
              "icon":"artifactability_marksmanhunter_legacyofthewindrunners"
           },
           "322":{  
              "spellID":204089,
              "name":"Bullseye",
              "icon":"ability_hunter_focusedaim"
           },
           "1197":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1337":{  
              "spellID":214826,
              "name":"Wind Arrows",
              "icon":"inv_spear_07"
           },
           "1369":{  
              "spellID":214915,
              "name":"Windflight Arrows",
              "icon":"inv_bow_1h_artifactwindrunner_d_02"
           },
           "1068":{  
              "spellID":203415,
              "name":"Fury of the Eagle",
              "icon":"inv_polearm_2h_artifacteagle_d_01"
           },
           "1070":{  
              "spellID":203566,
              "name":"Sharpened Fang",
              "icon":"ability_hunter_mongoosebite"
           },
           "1071":{  
              "spellID":203577,
              "name":"My Beloved Monster",
              "icon":"ability_hunter_invigeration"
           },
           "1072":{  
              "spellID":203578,
              "name":"Lacerating Talons",
              "icon":"ability_hunter_laceration"
           },
           "1073":{  
              "spellID":203638,
              "name":"Raptor's Cry",
              "icon":"ability_hunter_raptorstrike"
           },
           "1074":{  
              "spellID":203669,
              "name":"Fluffy, Go",
              "icon":"ability_mount_blackdirewolf"
           },
           "1075":{  
              "spellID":203670,
              "name":"Explosive Force",
              "icon":"spell_fire_selfdestruct"
           },
           "1076":{  
              "spellID":203673,
              "name":"Hellcarver",
              "icon":"ability_hunter_carve"
           },
           "1077":{  
              "spellID":224764,
              "name":"Bird of Prey",
              "icon":"ability_hunter_eagleeye"
           },
           "1078":{  
              "spellID":203749,
              "name":"Hunter's Bounty",
              "icon":"inv_firstaid_healingsalve2"
           },
           "1079":{  
              "spellID":225092,
              "name":"Embrace of the Aspects",
              "icon":"spell_hunter_aspectofthehawk"
           },
           "1080":{  
              "spellID":203752,
              "name":"Hunter's Guile",
              "icon":"ability_mage_potentspirit"
           },
           "1081":{  
              "spellID":203754,
              "name":"Terms of Engagement",
              "icon":"ability_hunter_harpoon"
           },
           "1082":{  
              "spellID":203755,
              "name":"Aspect of the Skylord",
              "icon":"inv_pet_undeadeagle"
           },
           "1083":{  
              "spellID":203563,
              "name":"Talon Strike",
              "icon":"inv_misc_bone_06"
           },
           "1084":{  
              "spellID":203757,
              "name":"Eagle's Bite",
              "icon":"artifactability_survivalhunter_eaglesbite"
           },
           "1198":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1338":{  
              "spellID":221773,
              "name":"Iron Talons",
              "icon":"inv_misc_wailingbone"
           },
           "1370":{  
              "spellID":214916,
              "name":"Voice of the Wild Gods",
              "icon":"inv_polearm_2h_artifacteagle_d_02"
           },
           "323":{  
              "spellID":192310,
              "name":"Toxic Blades",
              "icon":"ability_rogue_disembowel"
           },
           "324":{  
              "spellID":192315,
              "name":"Serrated Edge",
              "icon":"ability_warrior_bloodbath"
           },
           "325":{  
              "spellID":192318,
              "name":"Master Alchemist",
              "icon":"trade_brewpoison"
           },
           "326":{  
              "spellID":192323,
              "name":"Fade into Shadows",
              "icon":"spell_shadow_nethercloak"
           },
           "327":{  
              "spellID":192326,
              "name":"Balanced Blades",
              "icon":"ability_rogue_restlessblades"
           },
           "328":{  
              "spellID":192329,
              "name":"Gushing Wound",
              "icon":"ability_rogue_bloodsplatter"
           },
           "329":{  
              "spellID":192345,
              "name":"Shadow Walker",
              "icon":"ability_rogue_sprint"
           },
           "330":{  
              "spellID":192349,
              "name":"Master Assassin",
              "icon":"ability_rogue_deadliness"
           },
           "331":{  
              "spellID":192376,
              "name":"Poison Knives",
              "icon":"ability_rogue_dualweild"
           },
           "332":{  
              "spellID":192384,
              "name":"Urge to Kill",
              "icon":"ability_rogue_improvedrecuperate"
           },
           "333":{  
              "spellID":192422,
              "name":"Shadow Swiftness",
              "icon":"rogue_burstofspeed"
           },
           "334":{  
              "spellID":192424,
              "name":"Surge of Toxins",
              "icon":"ability_rogue_deviouspoisons"
           },
           "335":{  
              "spellID":192428,
              "name":"From the Shadows",
              "icon":"ability_rogue_deadlybrew"
           },
           "337":{  
              "spellID":192657,
              "name":"Bag of Tricks",
              "icon":"rogue_paralytic_poison"
           },
           "346":{  
              "spellID":192759,
              "name":"Kingsbane",
              "icon":"inv_knife_1h_artifactgarona_d_01"
           },
           "347":{  
              "spellID":192923,
              "name":"Blood of the Assassinated",
              "icon":"inv_artifact_bloodoftheassassinated"
           },
           "1211":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1276":{  
              "spellID":214368,
              "name":"Assassin's Blades",
              "icon":"ability_rogue_shadowstrikes"
           },
           "1384":{  
              "spellID":214928,
              "name":"Slayer's Precision",
              "icon":"inv_knife_1h_artifactgarona_d_02dual"
           },
           "1052":{  
              "spellID":202665,
              "name":"Curse of the Dreadblades",
              "icon":"inv_sword_1h_artifactskywall_d_01dual"
           },
           "1053":{  
              "spellID":202897,
              "name":"Blunderbuss",
              "icon":"inv_weapon_rifle_01"
           },
           "1054":{  
              "spellID":202820,
              "name":"Greed",
              "icon":"warrior_skullbanner"
           },
           "1055":{  
              "spellID":202769,
              "name":"Blurred Time",
              "icon":"ability_rogue_quickrecovery"
           },
           "1056":{  
              "spellID":202755,
              "name":"Deception",
              "icon":"ability_rogue_disguise"
           },
           "1057":{  
              "spellID":202753,
              "name":"Hidden Blade",
              "icon":"ability_ironmaidens_bladerush"
           },
           "1058":{  
              "spellID":202628,
              "name":"Blademaster",
              "icon":"ability_warrior_challange"
           },
           "1059":{  
              "spellID":216230,
              "name":"Black Powder",
              "icon":"inv_weapon_rifle_01"
           },
           "1060":{  
              "spellID":202507,
              "name":"Blade Dancer",
              "icon":"ability_warrior_bladestorm"
           },
           "1061":{  
              "spellID":202514,
              "name":"Fate's Thirst",
              "icon":"ability_rogue_waylay"
           },
           "1062":{  
              "spellID":202521,
              "name":"Fortune's Strike",
              "icon":"spell_rogue_deathfromabove"
           },
           "1063":{  
              "spellID":202522,
              "name":"Gunslinger",
              "icon":"inv_weapon_rifle_07"
           },
           "1064":{  
              "spellID":202524,
              "name":"Fatebringer",
              "icon":"ability_rogue_cuttothechase"
           },
           "1065":{  
              "spellID":202530,
              "name":"Fortune Strikes",
              "icon":"ability_rogue_improvedrecuperate"
           },
           "1066":{  
              "spellID":202533,
              "name":"Ghostly Shell",
              "icon":"spell_shadow_nethercloak"
           },
           "1067":{  
              "spellID":202907,
              "name":"Fortune's Boon",
              "icon":"ability_rogue_surpriseattack2"
           },
           "1212":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1348":{  
              "spellID":202463,
              "name":"Cursed Edges",
              "icon":"inv_sword_33"
           },
           "1385":{  
              "spellID":214929,
              "name":"Cursed Steel",
              "icon":"inv_sword_1h_artifactskywall_d_02dual"
           },
           "851":{  
              "spellID":209782,
              "name":"Goremaw's Bite",
              "icon":"inv_knife_1h_artifactfangs_d_01"
           },
           "852":{  
              "spellID":197231,
              "name":"The Quiet Knife",
              "icon":"ability_backstab"
           },
           "853":{  
              "spellID":197233,
              "name":"Demon's Kiss",
              "icon":"ability_priest_voidentropy"
           },
           "854":{  
              "spellID":197234,
              "name":"Gutripper",
              "icon":"ability_rogue_eviscerate"
           },
           "855":{  
              "spellID":197235,
              "name":"Precision Strike",
              "icon":"ability_rogue_unfairadvantage"
           },
           "856":{  
              "spellID":197369,
              "name":"Fortune's Bite",
              "icon":"ability_rogue_masterofsubtlety"
           },
           "857":{  
              "spellID":197386,
              "name":"Soul Shadows",
              "icon":"inv_knife_1h_grimbatolraid_d_03"
           },
           "858":{  
              "spellID":197239,
              "name":"Energetic Stabbing",
              "icon":"inv_knife_1h_pvppandarias3_c_02"
           },
           "859":{  
              "spellID":210144,
              "name":"Catlike Reflexes",
              "icon":"inv_pet_cats_calicocat"
           },
           "860":{  
              "spellID":197244,
              "name":"Ghost Armor",
              "icon":"achievement_halloween_ghost_01"
           },
           "861":{  
              "spellID":197610,
              "name":"Second Shuriken",
              "icon":"inv_throwingknife_07"
           },
           "862":{  
              "spellID":197256,
              "name":"Flickering Shadows",
              "icon":"ability_rogue_sprint_blue"
           },
           "863":{  
              "spellID":197604,
              "name":"Embrace of Darkness",
              "icon":"ability_stealth"
           },
           "864":{  
              "spellID":209835,
              "name":"Akaari's Soul",
              "icon":"ability_warlock_soullink"
           },
           "865":{  
              "spellID":209781,
              "name":"Shadow Nova",
              "icon":"spell_fire_twilightnova"
           },
           "866":{  
              "spellID":197406,
              "name":"Finality",
              "icon":"ability_rogue_eviscerate"
           },
           "1213":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1349":{  
              "spellID":221856,
              "name":"Shadow Fangs",
              "icon":"inv_misc_blacksaberonfang"
           },
           "1386":{  
              "spellID":214930,
              "name":"Legionblade",
              "icon":"inv_knife_1h_artifactfangs_d_02dual"
           },
           "883":{  
              "spellID":207946,
              "name":"Light's Wrath",
              "icon":"inv_staff_2h_artifacttome_d_01"
           },
           "884":{  
              "spellID":197779,
              "name":"Taming the Shadows",
              "icon":"spell_shadow_shadowmend"
           },
           "885":{  
              "spellID":197781,
              "name":"Share in the Light",
              "icon":"spell_holy_devineaegis"
           },
           "886":{  
              "spellID":197815,
              "name":"Barrier for the Devoted",
              "icon":"spell_holy_powerwordbarrier"
           },
           "887":{  
              "spellID":198074,
              "name":"Sins of the Many",
              "icon":"spell_holy_holyguidance"
           },
           "888":{  
              "spellID":197708,
              "name":"Confession",
              "icon":"spell_holy_penance"
           },
           "889":{  
              "spellID":197711,
              "name":"Vestments of Discipline",
              "icon":"inv_shoulder_robe_raidpriest_k_01"
           },
           "890":{  
              "spellID":197713,
              "name":"Pain is in Your Mind",
              "icon":"spell_holy_painsupression"
           },
           "891":{  
              "spellID":197715,
              "name":"The Edge of Dark and Light",
              "icon":"spell_shadow_shadowwordpain"
           },
           "892":{  
              "spellID":197716,
              "name":"Burst of Light",
              "icon":"spell_holy_holynova"
           },
           "893":{  
              "spellID":197727,
              "name":"Doomsayer",
              "icon":"spell_holy_rapture"
           },
           "894":{  
              "spellID":197729,
              "name":"Shield of Faith",
              "icon":"spell_holy_powerwordshield"
           },
           "895":{  
              "spellID":197762,
              "name":"Borrowed Time",
              "icon":"ability_priest_angelicbulwark"
           },
           "896":{  
              "spellID":216212,
              "name":"Darkest Shadows",
              "icon":"spell_shadow_shadowmend"
           },
           "897":{  
              "spellID":198068,
              "name":"Power of the Dark Side",
              "icon":"inv_artifact_powerofthedarkside"
           },
           "898":{  
              "spellID":197766,
              "name":"Speed of the Pious",
              "icon":"ability_paladin_speedoflight"
           },
           "1208":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1345":{  
              "spellID":216122,
              "name":"Invoke the Light",
              "icon":"spell_holy_holysmite"
           },
           "1379":{  
              "spellID":214925,
              "name":"Forbidden Flame",
              "icon":"inv_staff_2h_artifacttome_d_02"
           },
           "1436":{  
              "spellID":219655,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "834":{  
              "spellID":196684,
              "name":"Invoke the Naaru",
              "icon":"ability_priest_ascension"
           },
           "835":{  
              "spellID":196492,
              "name":"Renew the Faith",
              "icon":"spell_holy_divinehymn"
           },
           "836":{  
              "spellID":208065,
              "name":"Light of T'uure",
              "icon":"inv_staff_2h_artifactheartofkure_d_01"
           },
           "837":{  
              "spellID":196578,
              "name":"Blessing of T'uure",
              "icon":"inv_pet_naaru"
           },
           "838":{  
              "spellID":196489,
              "name":"Power of the Naaru",
              "icon":"spell_holy_pureofheart"
           },
           "839":{  
              "spellID":196437,
              "name":"Guardians of the Light",
              "icon":"spell_holy_guardianspirit"
           },
           "840":{  
              "spellID":196779,
              "name":"Holy Mending",
              "icon":"ability_priest_archangel"
           },
           "841":{  
              "spellID":196355,
              "name":"Trust in the Light",
              "icon":"priest_spell_leapoffaith_a"
           },
           "842":{  
              "spellID":196358,
              "name":"Say Your Prayers",
              "icon":"spell_holy_prayerofmendingtga"
           },
           "843":{  
              "spellID":196416,
              "name":"Serenity Now",
              "icon":"ability_priest_flashoflight"
           },
           "844":{  
              "spellID":196418,
              "name":"Reverence",
              "icon":"spell_holy_holyguidance"
           },
           "845":{  
              "spellID":196419,
              "name":"Focus in the Light",
              "icon":"spell_holy_unyieldingfaith"
           },
           "846":{  
              "spellID":196422,
              "name":"Holy Hands",
              "icon":"spell_holy_renew"
           },
           "847":{  
              "spellID":196429,
              "name":"Hallowed Ground",
              "icon":"spell_holy_divineprovidence"
           },
           "848":{  
              "spellID":196430,
              "name":"Words of Healing",
              "icon":"spell_holy_persecution"
           },
           "849":{  
              "spellID":196434,
              "name":"Holy Guidance",
              "icon":"spell_holy_prayerofhealing02"
           },
           "1209":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1257":{  
              "spellID":213428,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "1346":{  
              "spellID":222646,
              "name":"Follower of the Light",
              "icon":"ability_priest_ascendance"
           },
           "1380":{  
              "spellID":214926,
              "name":"Beacon of Light",
              "icon":"inv_staff_2h_artifactheartofkure_d_02"
           },
           "764":{  
              "spellID":205065,
              "name":"Void Torrent",
              "icon":"inv_knife_1h_artifactcthun_d_01"
           },
           "765":{  
              "spellID":194024,
              "name":"Thrive in the Shadows",
              "icon":"ability_priest_voidentropy"
           },
           "766":{  
              "spellID":194026,
              "name":"Sinister Thoughts",
              "icon":"ability_ironmaidens_convulsiveshadows"
           },
           "767":{  
              "spellID":194093,
              "name":"Unleash the Shadows",
              "icon":"ability_priest_shadowyapparition"
           },
           "768":{  
              "spellID":193371,
              "name":"Call to the Void",
              "icon":"spell_shadow_skull"
           },
           "769":{  
              "spellID":194179,
              "name":"Sphere of Insanity",
              "icon":"spell_priest_shadoworbs"
           },
           "770":{  
              "spellID":194378,
              "name":"Mass Hysteria",
              "icon":"ability_priest_auspiciousspirits"
           },
           "771":{  
              "spellID":193642,
              "name":"From the Shadows",
              "icon":"spell_shadow_summonvoidwalker"
           },
           "772":{  
              "spellID":193643,
              "name":"Mind Shattering",
              "icon":"ability_kaztik_dominatemind"
           },
           "773":{  
              "spellID":193644,
              "name":"To the Pain",
              "icon":"spell_shadow_shadowwordpain"
           },
           "774":{  
              "spellID":193645,
              "name":"Death's Embrace",
              "icon":"spell_shadow_demonicfortitude"
           },
           "775":{  
              "spellID":193647,
              "name":"Thoughts of Insanity",
              "icon":"spell_shadow_skull"
           },
           "776":{  
              "spellID":194002,
              "name":"Creeping Shadows",
              "icon":"spell_priest_voidtendrils"
           },
           "777":{  
              "spellID":194007,
              "name":"Touch of Darkness",
              "icon":"spell_shadow_chilltouch"
           },
           "778":{  
              "spellID":194016,
              "name":"Void Corruption",
              "icon":"spell_priest_voidshift"
           },
           "779":{  
              "spellID":194018,
              "name":"Mental Fortitude",
              "icon":"ability_priest_clarityofpower"
           },
           "1210":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1347":{  
              "spellID":215322,
              "name":"Void Siphon",
              "icon":"spell_shadow_siphonmana"
           },
           "1381":{  
              "spellID":214927,
              "name":"Darkening Whispers",
              "icon":"inv_knife_1h_artifactcthun_d_02"
           },
           "272":{  
              "spellID":192450,
              "name":"Iron Heart",
              "icon":"inv_ragnaros_heart"
           },
           "273":{  
              "spellID":192453,
              "name":"Meat Shield",
              "icon":"ability_toughness"
           },
           "274":{  
              "spellID":192447,
              "name":"Grim Perseverance",
              "icon":"ability_deathknight_sanguinfortitude"
           },
           "275":{  
              "spellID":192457,
              "name":"Veinrender",
              "icon":"ability_skeer_bloodletting"
           },
           "276":{  
              "spellID":192460,
              "name":"Coagulopathy",
              "icon":"spell_deathknight_bloodplague"
           },
           "277":{  
              "spellID":192543,
              "name":"Vampiric Fangs",
              "icon":"trade_archaeology_trolltooth_w_goldfilling"
           },
           "278":{  
              "spellID":192464,
              "name":"All-Consuming Rot",
              "icon":"spell_shadow_deathanddecay"
           },
           "279":{  
              "spellID":192514,
              "name":"Dance of Darkness",
              "icon":"spell_shadow_rune"
           },
           "280":{  
              "spellID":192538,
              "name":"Bonebreaker",
              "icon":"trade_archaeology_fossil_dinosaurbone"
           },
           "281":{  
              "spellID":192557,
              "name":"Rattling Bones",
              "icon":"ability_deathknight_boneshield"
           },
           "282":{  
              "spellID":192548,
              "name":"Blood Feast",
              "icon":"ability_deathwing_bloodcorruption_death"
           },
           "283":{  
              "spellID":192570,
              "name":"Mouth of Hell",
              "icon":"spell_deathknight_darkconviction"
           },
           "284":{  
              "spellID":192558,
              "name":"Skeletal Shattering",
              "icon":"trade_archaeology_bones_of_transformation"
           },
           "285":{  
              "spellID":192567,
              "name":"Unending Thirst",
              "icon":"ability_ironmaidens_whirlofblood"
           },
           "286":{  
              "spellID":193213,
              "name":"Umbilicus Eternus",
              "icon":"artifactability_blooddeathknight_umbilicuseternus"
           },
           "289":{  
              "spellID":205223,
              "name":"Consumption",
              "icon":"inv_axe_2h_artifactmaw_d_01"
           },
           "1187":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1331":{  
              "spellID":221775,
              "name":"Sanguinary Affinity",
              "icon":"spell_shadow_vampiricaura"
           },
           "1359":{  
              "spellID":214903,
              "name":"The Hungering Maw",
              "icon":"inv_axe_2h_artifactmaw_d_02"
           },
           "1451":{  
              "spellID":226829,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "108":{  
              "spellID":189080,
              "name":"Cold as Ice",
              "icon":"inv_misc_frostemblem_01"
           },
           "109":{  
              "spellID":189086,
              "name":"Blast Radius",
              "icon":"spell_mage_frostbomb"
           },
           "110":{  
              "spellID":189092,
              "name":"Ambidexterity",
              "icon":"ability_butcher_heavyhanded"
           },
           "111":{  
              "spellID":189097,
              "name":"Over-Powered",
              "icon":"spell_mage_runeofpower"
           },
           "113":{  
              "spellID":189144,
              "name":"Nothing but the Boots",
              "icon":"spell_sandexplosion"
           },
           "114":{  
              "spellID":189147,
              "name":"Bad to the Bone",
              "icon":"ability_mage_chilledtothebone"
           },
           "115":{  
              "spellID":189154,
              "name":"Ice in Your Veins",
              "icon":"achievement_dungeon_ulduarraid_icegiant_01"
           },
           "117":{  
              "spellID":189164,
              "name":"Dead of Winter",
              "icon":"ability_deathknight_remorselesswinters"
           },
           "119":{  
              "spellID":189179,
              "name":"Frozen Core",
              "icon":"spell_frost_frozenorb"
           },
           "120":{  
              "spellID":189180,
              "name":"Mirror Ball",
              "icon":"inv_misc_discoball_01"
           },
           "122":{  
              "spellID":189186,
              "name":"Crystalline Swords",
              "icon":"inv_sword_160"
           },
           "123":{  
              "spellID":189185,
              "name":"Hypothermia",
              "icon":"ability_mage_frostjaw"
           },
           "124":{  
              "spellID":190778,
              "name":"Sindragosa's Fury",
              "icon":"achievement_boss_sindragosa"
           },
           "1090":{  
              "spellID":204875,
              "name":"Frozen Skin",
              "icon":"inv_misc_permafrostshard"
           },
           "1091":{  
              "spellID":205209,
              "name":"Chill of the Grave",
              "icon":"achievement_boss_svalasorrowgrave"
           },
           "1092":{  
              "spellID":189184,
              "name":"Frozen Soul",
              "icon":"spell_frost_frozencore"
           },
           "1188":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1332":{  
              "spellID":218931,
              "name":"Blades of Frost",
              "icon":"spell_frost_piercing_chill"
           },
           "1360":{  
              "spellID":214904,
              "name":"Soulbiter",
              "icon":"inv_sword_1h_artifactruneblade_d02dual"
           },
           "149":{  
              "spellID":220143,
              "name":"Apocalypse",
              "icon":"artifactability_unholydeathknight_deathsembrace"
           },
           "150":{  
              "spellID":191760,
              "name":"The Shambler",
              "icon":"spell_deathknight_explode_ghoul"
           },
           "151":{  
              "spellID":191741,
              "name":"Double Doom",
              "icon":"spell_deathknight_unholypresence"
           },
           "152":{  
              "spellID":191747,
              "name":"Scourge of Worlds",
              "icon":"artifactability_unholydeathknight_flagellation"
           },
           "153":{  
              "spellID":191637,
              "name":"Portal to the Underworld",
              "icon":"spell_shadow_deathanddecay"
           },
           "154":{  
              "spellID":191731,
              "name":"Armies of the Damned",
              "icon":"spell_shadow_raisedead"
           },
           "156":{  
              "spellID":191419,
              "name":"Deadliest Coil",
              "icon":"spell_shadow_deathcoil"
           },
           "157":{  
              "spellID":191442,
              "name":"Rotten Touch",
              "icon":"spell_shadow_unholystrength"
           },
           "158":{  
              "spellID":191485,
              "name":"Plaguebearer",
              "icon":"ability_creature_disease_02"
           },
           "262":{  
              "spellID":191565,
              "name":"Deadly Durability",
              "icon":"warrior_talent_icon_furyintheblood"
           },
           "263":{  
              "spellID":191721,
              "name":"Gravitational Pull",
              "icon":"ability_deathknight_icygrip"
           },
           "264":{  
              "spellID":191593,
              "name":"Runic Tattoos",
              "icon":"achievement_dungeon_icecrown_frostmourne"
           },
           "265":{  
              "spellID":191494,
              "name":"Scourge the Unbeliever",
              "icon":"spell_deathknight_plaguestrike"
           },
           "266":{  
              "spellID":191488,
              "name":"The Darkest Crusade",
              "icon":"spell_deathknight_vendetta"
           },
           "267":{  
              "spellID":191584,
              "name":"Unholy Endurance",
              "icon":"inv_legendary_shield"
           },
           "1119":{  
              "spellID":208598,
              "name":"Eternal Agony",
              "icon":"achievement_boss_festergutrotface"
           },
           "1189":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1333":{  
              "spellID":218280,
              "name":"Feast of Souls",
              "icon":"ability_warlock_improvedsoulleech"
           },
           "1361":{  
              "spellID":214906,
              "name":"Fleshsearer",
              "icon":"inv_sword_2h_artifactsoulrend_d_02"
           },
           "291":{  
              "spellID":205495,
              "name":"Stormkeeper",
              "icon":"inv_hand_1h_artifactstormfist_d_01"
           },
           "292":{  
              "spellID":191602,
              "name":"Static Overload",
              "icon":"ability_thunderking_lightningwhip"
           },
           "293":{  
              "spellID":191647,
              "name":"Master of the Elements",
              "icon":"ability_shaman_ascendance"
           },
           "294":{  
              "spellID":191512,
              "name":"Elementalist",
              "icon":"spell_fire_elemental_totem"
           },
           "295":{  
              "spellID":191717,
              "name":"Fury of the Storms",
              "icon":"ability_thunderking_overcharge"
           },
           "296":{  
              "spellID":191861,
              "name":"Power of the Maelstrom",
              "icon":"spell_fire_masterofelements"
           },
           "297":{  
              "spellID":192630,
              "name":"Volcanic Inferno",
              "icon":"spell_shaman_lavaflow"
           },
           "298":{  
              "spellID":191493,
              "name":"Call the Thunder",
              "icon":"spell_shaman_thunderstorm"
           },
           "299":{  
              "spellID":191499,
              "name":"The Ground Trembles",
              "icon":"spell_shaman_earthquake"
           },
           "300":{  
              "spellID":191504,
              "name":"Lava Imbued",
              "icon":"spell_shaman_lavaburst"
           },
           "301":{  
              "spellID":191740,
              "name":"Firestorm",
              "icon":"spell_fire_flameshock"
           },
           "302":{  
              "spellID":191569,
              "name":"Protection of the Elements",
              "icon":"spell_nature_healingway"
           },
           "303":{  
              "spellID":191572,
              "name":"Molten Blast",
              "icon":"spell_shaman_shockinglava"
           },
           "304":{  
              "spellID":191577,
              "name":"Electric Discharge",
              "icon":"spell_nature_chainlightning"
           },
           "305":{  
              "spellID":191582,
              "name":"Shamanistic Healing",
              "icon":"spell_shaman_blessingofeternals"
           },
           "306":{  
              "spellID":191598,
              "name":"Earthen Attunement",
              "icon":"spell_nature_earthshock"
           },
           "1214":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1350":{  
              "spellID":215414,
              "name":"Surge of Power",
              "icon":"spell_lightning_lightningbolt01"
           },
           "1387":{  
              "spellID":214931,
              "name":"Stormkeeper's Power",
              "icon":"inv_hand_1h_artifactstormfist_d_02dual"
           },
           "899":{  
              "spellID":204945,
              "name":"Doom Winds",
              "icon":"inv_mace_1h_artifactdoomhammer_d_01"
           },
           "900":{  
              "spellID":198736,
              "name":"Unleash Doom",
              "icon":"shaman_talent_unleashedfury"
           },
           "901":{  
              "spellID":198505,
              "name":"Doom Wolves",
              "icon":"spell_nature_spiritwolf"
           },
           "902":{  
              "spellID":198361,
              "name":"Raging Storms",
              "icon":"spell_shaman_maelstromweapon"
           },
           "903":{  
              "spellID":198367,
              "name":"Stormflurry",
              "icon":"ability_shaman_stormstrike"
           },
           "904":{  
              "spellID":198434,
              "name":"Alpha Wolf",
              "icon":"spell_beastmaster_wolf"
           },
           "905":{  
              "spellID":215381,
              "name":"Weapons of the Elements",
              "icon":"spell_shaman_unleashweapon_flame"
           },
           "906":{  
              "spellID":198236,
              "name":"Forged in Lava",
              "icon":"spell_shaman_improvelavalash"
           },
           "907":{  
              "spellID":198238,
              "name":"Spirit of the Maelstrom",
              "icon":"ability_shaman_freedomwolf"
           },
           "908":{  
              "spellID":198247,
              "name":"Wind Surge",
              "icon":"spell_shaman_unleashweapon_wind"
           },
           "909":{  
              "spellID":198248,
              "name":"Elemental Healing",
              "icon":"spell_shaman_improvedreincarnation"
           },
           "910":{  
              "spellID":198292,
              "name":"Wind Strikes",
              "icon":"ability_skyreach_four_wind"
           },
           "911":{  
              "spellID":198296,
              "name":"Spiritual Healing",
              "icon":"spell_nature_healingwavegreater"
           },
           "912":{  
              "spellID":198299,
              "name":"Gathering Storms",
              "icon":"spell_shaman_hightide"
           },
           "913":{  
              "spellID":198349,
              "name":"Gathering of the Maelstrom",
              "icon":"spell_shaman_staticshock"
           },
           "930":{  
              "spellID":199107,
              "name":"Doom Vortex",
              "icon":"spell_shaman_improvelavalash"
           },
           "1215":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1351":{  
              "spellID":198228,
              "name":"Hammer of Storms",
              "icon":"ability_shaman_stormstrike"
           },
           "1388":{  
              "spellID":214932,
              "name":"Earthshattering Blows",
              "icon":"inv_mace_1h_artifactdoomhammer_d_02"
           },
           "1102":{  
              "spellID":207778,
              "name":"Gift of the Queen",
              "icon":"inv_mace_1h_artifactazshara_d_02"
           },
           "1103":{  
              "spellID":207088,
              "name":"Tidal Chains",
              "icon":"spell_frost_chainsofice"
           },
           "1104":{  
              "spellID":207092,
              "name":"Buffeting Waves",
              "icon":"ability_skyreach_four_wind"
           },
           "1105":{  
              "spellID":210029,
              "name":"Pull of the Sea",
              "icon":"inv_tradeskillitem_sorcererswater"
           },
           "1106":{  
              "spellID":207206,
              "name":"Wavecrash",
              "icon":"inv_spear_04"
           },
           "1107":{  
              "spellID":207255,
              "name":"Empowered Droplets",
              "icon":"spell_nature_giftofthewaterspirit"
           },
           "1108":{  
              "spellID":207285,
              "name":"Queen Ascendant",
              "icon":"ability_shaman_watershield"
           },
           "1109":{  
              "spellID":207348,
              "name":"Floodwaters",
              "icon":"spell_nature_healingwavegreater"
           },
           "1110":{  
              "spellID":207351,
              "name":"Ghost in the Mist",
              "icon":"spell_hunter_lonewolf"
           },
           "1111":{  
              "spellID":207354,
              "name":"Caress of the Tidemother",
              "icon":"spell_shadow_fingerofdeath"
           },
           "1112":{  
              "spellID":207355,
              "name":"Sense of Urgency",
              "icon":"inv_misc_pocketwatch_02"
           },
           "1113":{  
              "spellID":207356,
              "name":"Refreshing Currents",
              "icon":"ability_monk_cracklingjadelightning"
           },
           "1114":{  
              "spellID":207357,
              "name":"Servant of the Queen",
              "icon":"inv_crown_02"
           },
           "1115":{  
              "spellID":207358,
              "name":"Tidal Pools",
              "icon":"achievement_dungeon_throne_of_the_tides"
           },
           "1116":{  
              "spellID":207360,
              "name":"Queen's Decree",
              "icon":"inv_misc_volatilewater"
           },
           "1117":{  
              "spellID":207362,
              "name":"Cumulative Upkeep",
              "icon":"ability_shaman_healingtide"
           },
           "1216":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1258":{  
              "spellID":213428,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "1352":{  
              "spellID":224841,
              "name":"Grace of the Sea",
              "icon":"inv_elemental_crystal_water"
           },
           "1389":{  
              "spellID":214933,
              "name":"Flow of the Tides",
              "icon":"inv_mace_1h_artifactazshara_d_02"
           },
           "72":{  
              "spellID":187304,
              "name":"Torrential Barrage",
              "icon":"spell_arcane_arcanepotency"
           },
           "73":{  
              "spellID":188006,
              "name":"Arcane Rebound",
              "icon":"ability_mage_arcanebarrage"
           },
           "74":{  
              "spellID":187258,
              "name":"Blasting Rod",
              "icon":"spell_arcane_blast"
           },
           "75":{  
              "spellID":187321,
              "name":"Aegwynn's Wrath",
              "icon":"spell_arcane_arcanetorrent"
           },
           "77":{  
              "spellID":187313,
              "name":"Arcane Purification",
              "icon":"spell_arcane_arcane04"
           },
           "78":{  
              "spellID":187310,
              "name":"Crackling Energy",
              "icon":"spell_arcane_arcane01"
           },
           "79":{  
              "spellID":187287,
              "name":"Aegwynn's Fury",
              "icon":"spell_arcane_arcane03"
           },
           "80":{  
              "spellID":215463,
              "name":"Rule of Threes",
              "icon":"spell_arcane_starfire"
           },
           "81":{  
              "spellID":187276,
              "name":"Ethereal Sensitivity",
              "icon":"ability_socererking_arcanereplication"
           },
           "82":{  
              "spellID":187264,
              "name":"Aegwynn's Imperative",
              "icon":"ability_socererking_arcanefortification"
           },
           "83":{  
              "spellID":187301,
              "name":"Everywhere At Once",
              "icon":"spell_arcane_blink"
           },
           "84":{  
              "spellID":210716,
              "name":"Mana Shield",
              "icon":"spell_shadow_detectlesserinvisibility"
           },
           "86":{  
              "spellID":210725,
              "name":"Touch of the Magi",
              "icon":"spell_mage_icenova"
           },
           "87":{  
              "spellID":187680,
              "name":"Aegwynn's Ascendance",
              "icon":"spell_mage_icenova"
           },
           "290":{  
              "spellID":224968,
              "name":"Mark of Aluneth",
              "icon":"inv_staff_2h_artifactaegwynsstaff_d_01"
           },
           "1169":{  
              "spellID":210730,
              "name":"Sloooow Down",
              "icon":"spell_nature_slow"
           },
           "1199":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1339":{  
              "spellID":187318,
              "name":"Might of the Guardians",
              "icon":"inv_enchant_essencearcanelarge"
           },
           "1371":{  
              "spellID":214917,
              "name":"Ancient Power",
              "icon":"inv_staff_2h_artifactaegwynsstaff_d_02"
           },
           "748":{  
              "spellID":194466,
              "name":"Phoenix's Flames",
              "icon":"artifactability_firemage_phoenixbolt"
           },
           "749":{  
              "spellID":194224,
              "name":"Fire at Will",
              "icon":"spell_fire_fireball"
           },
           "750":{  
              "spellID":194234,
              "name":"Reignition Overdrive",
              "icon":"spell_mage_infernoblast"
           },
           "751":{  
              "spellID":194239,
              "name":"Pyroclasmic Paranoia",
              "icon":"spell_fire_volcano"
           },
           "752":{  
              "spellID":194312,
              "name":"Burning Gaze",
              "icon":"inv_darkmoon_eye"
           },
           "753":{  
              "spellID":210182,
              "name":"Blue Flame Special",
              "icon":"spell_fire_blueflamestrike"
           },
           "754":{  
              "spellID":194313,
              "name":"Great Balls of Fire",
              "icon":"ability_ironmaidens_rapidfire"
           },
           "755":{  
              "spellID":194314,
              "name":"Everburning Consumption",
              "icon":"ability_felarakkoa_feldetonation_red"
           },
           "756":{  
              "spellID":194318,
              "name":"Cauterizing Blink",
              "icon":"spell_arcane_blink"
           },
           "757":{  
              "spellID":194315,
              "name":"Molten Skin",
              "icon":"ability_mage_moltenarmor"
           },
           "758":{  
              "spellID":194487,
              "name":"Blast Furnace",
              "icon":"achievement_boss_furyfurnace"
           },
           "759":{  
              "spellID":215796,
              "name":"Big Mouth",
              "icon":"spell_arcane_arcanepotency"
           },
           "760":{  
              "spellID":227481,
              "name":"Scorched Earth",
              "icon":"inv_pet_scorchedstone"
           },
           "761":{  
              "spellID":194431,
              "name":"Aftershocks",
              "icon":"inv_elemental_primal_fire"
           },
           "762":{  
              "spellID":215773,
              "name":"Phoenix Reborn",
              "icon":"inv_sword_1h_artifactfelomelorn_d_01"
           },
           "763":{  
              "spellID":194331,
              "name":"Pyretic Incantation",
              "icon":"inv_misc_enchantedpearld"
           },
           "1201":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1340":{  
              "spellID":221844,
              "name":"Wings of Flame",
              "icon":"inv_shoulder_leather_firelandsdruid_d_01"
           },
           "1372":{  
              "spellID":214918,
              "name":"Empowered Spellblade",
              "icon":"inv_sword_1h_artifactfelomelorn_d_02"
           },
           "783":{  
              "spellID":214634,
              "name":"Ebonbolt",
              "icon":"artifactability_frostmage_ebonbolt"
           },
           "784":{  
              "spellID":195315,
              "name":"Icy Caress",
              "icon":"spell_frost_frostbolt02"
           },
           "785":{  
              "spellID":195317,
              "name":"Ice Age",
              "icon":"ability_warlock_burningembersblue"
           },
           "786":{  
              "spellID":195322,
              "name":"Let It Go",
              "icon":"spell_frost_frostblast"
           },
           "787":{  
              "spellID":195323,
              "name":"Orbital Strike",
              "icon":"spell_frost_frozenorb"
           },
           "788":{  
              "spellID":195345,
              "name":"Frozen Veins",
              "icon":"spell_frost_coldhearted"
           },
           "789":{  
              "spellID":195351,
              "name":"Clarity of Thought",
              "icon":"ability_mage_brainfreeze"
           },
           "790":{  
              "spellID":195352,
              "name":"The Storm Rages",
              "icon":"spell_frost_icestorm"
           },
           "791":{  
              "spellID":195354,
              "name":"Shield of Alodi",
              "icon":"spell_ice_lament"
           },
           "792":{  
              "spellID":214626,
              "name":"Jouster",
              "icon":"spell_frost_frostarmor02"
           },
           "793":{  
              "spellID":195419,
              "name":"Chain Reaction",
              "icon":"spell_frost_frostbolt"
           },
           "794":{  
              "spellID":214664,
              "name":"Ice Nine",
              "icon":"spell_frost_iceshard"
           },
           "795":{  
              "spellID":220817,
              "name":"Icy Hand",
              "icon":"spell_frost_iceclaw"
           },
           "796":{  
              "spellID":214776,
              "name":"It's Cold Outside",
              "icon":"spell_frost_iceshard"
           },
           "797":{  
              "spellID":195615,
              "name":"Black Ice",
              "icon":"artifactability_frostmage_blackicicles"
           },
           "798":{  
              "spellID":195448,
              "name":"Chilled to the Core",
              "icon":"spell_frost_coldhearted"
           },
           "1200":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1296":{  
              "spellID":214629,
              "name":"Shattering Bolts",
              "icon":"spell_frost_frostbolt02"
           },
           "1373":{  
              "spellID":214919,
              "name":"Spellborne",
              "icon":"inv_staff_2h_artifactantonidas_d_02"
           },
           "915":{  
              "spellID":199111,
              "name":"Inimitable Agony",
              "icon":"spell_shadow_curseofsargeras"
           },
           "916":{  
              "spellID":199112,
              "name":"Hideous Corruption",
              "icon":"spell_shadow_abominationexplosion"
           },
           "917":{  
              "spellID":199120,
              "name":"Drained to a Husk",
              "icon":"spell_shadow_lifedrain02"
           },
           "918":{  
              "spellID":199152,
              "name":"Inherently Unstable",
              "icon":"spell_shadow_unstableaffliction_3"
           },
           "919":{  
              "spellID":199153,
              "name":"Seeds of Doom",
              "icon":"spell_shadow_seedofdestruction"
           },
           "920":{  
              "spellID":199158,
              "name":"Perdition",
              "icon":"6bf_blackrock_nova"
           },
           "921":{  
              "spellID":199163,
              "name":"Shadowy Incantations",
              "icon":"inv_misc_volatileshadow"
           },
           "922":{  
              "spellID":199212,
              "name":"Shadows of the Flesh",
              "icon":"inv_misc_food_meat_forestboarmeat"
           },
           "923":{  
              "spellID":199214,
              "name":"Long Dark Night of the Soul",
              "icon":"spell_shadow_soulleech"
           },
           "924":{  
              "spellID":199220,
              "name":"Sweet Souls",
              "icon":"spell_shadow_soulleech"
           },
           "925":{  
              "spellID":199257,
              "name":"Fatal Echoes",
              "icon":"inv_misc_bell_01"
           },
           "926":{  
              "spellID":199282,
              "name":"Compounding Horror",
              "icon":"achievement_dungeon_shadowmoonhideout"
           },
           "927":{  
              "spellID":199471,
              "name":"Soul Flame",
              "icon":"achievement_firelands_raid_ragnaros"
           },
           "928":{  
              "spellID":199472,
              "name":"Wrath of Consumption",
              "icon":"spell_holy_consumemagic"
           },
           "929":{  
              "spellID":201424,
              "name":"Harvester of Souls",
              "icon":"warlock_spelldrain"
           },
           "999":{  
              "spellID":216698,
              "name":"Reap Souls",
              "icon":"inv_staff_2h_artifactdeadwind_d_01"
           },
           "1217":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1353":{  
              "spellID":221862,
              "name":"Crystalline Shadows",
              "icon":"inv_jewelcrafting_shadowsongamethyst_01"
           },
           "1390":{  
              "spellID":214934,
              "name":"Soulstealer",
              "icon":"inv_staff_2h_artifactdeadwind_d_02"
           },
           "1170":{  
              "spellID":211714,
              "name":"Thal'kiel's Consumption",
              "icon":"inv_offhand_1h_artifactskulloferedar_d_01"
           },
           "1171":{  
              "spellID":211108,
              "name":"Summoner's Prowess",
              "icon":"spell_shadow_demonicempathy"
           },
           "1172":{  
              "spellID":211126,
              "name":"Legionwrath",
              "icon":"ability_warlock_demonicpower"
           },
           "1173":{  
              "spellID":211106,
              "name":"The Doom of Azeroth",
              "icon":"spell_shadow_auraofdarkness"
           },
           "1174":{  
              "spellID":211123,
              "name":"Sharpened Dreadfangs",
              "icon":"inv_feldreadravenmount"
           },
           "1175":{  
              "spellID":211105,
              "name":"Dirty Hands",
              "icon":"ability_warlock_handofguldan"
           },
           "1176":{  
              "spellID":211119,
              "name":"Infernal Furnace",
              "icon":"spell_fire_firebolt02"
           },
           "1177":{  
              "spellID":211099,
              "name":"Maw of Shadows",
              "icon":"spell_shadow_shadowbolt"
           },
           "1178":{  
              "spellID":211144,
              "name":"Open Link",
              "icon":"ability_warlock_soullink"
           },
           "1179":{  
              "spellID":211131,
              "name":"Firm Resolve",
              "icon":"spell_shadow_demonictactics"
           },
           "1180":{  
              "spellID":211158,
              "name":"Imp-erator",
              "icon":"spell_warlock_summonimpoutland"
           },
           "1181":{  
              "spellID":218567,
              "name":"Soul Skin",
              "icon":"spell_shadow_felarmour"
           },
           "1182":{  
              "spellID":218572,
              "name":"Doom, Doubled",
              "icon":"spell_shadow_auraofdarkness"
           },
           "1183":{  
              "spellID":211219,
              "name":"The Expendables",
              "icon":"ability_warlock_impoweredimp"
           },
           "1184":{  
              "spellID":211720,
              "name":"Thal'kiel's Discord",
              "icon":"spell_shadow_skull"
           },
           "1185":{  
              "spellID":211530,
              "name":"Stolen Power",
              "icon":"ability_bossfelmagnaron_waveempowered"
           },
           "1218":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1354":{  
              "spellID":221882,
              "name":"Breath of Thal'kiel",
              "icon":"spell_fire_twilightflamebreath"
           },
           "1391":{  
              "spellID":214935,
              "name":"Thal'kiel's Lingering Power",
              "icon":"inv_offhand_1h_artifactskulloferedar_d_02"
           },
           "803":{  
              "spellID":196586,
              "name":"Dimensional Rift",
              "icon":"spell_warlock_demonicportal_purple"
           },
           "804":{  
              "spellID":196211,
              "name":"Master of Disaster",
              "icon":"spell_fire_burnout"
           },
           "805":{  
              "spellID":196217,
              "name":"Chaotic Instability",
              "icon":"ability_warlock_chaosbolt"
           },
           "806":{  
              "spellID":196222,
              "name":"Fire and the Flames",
              "icon":"ability_warlock_backdraft"
           },
           "807":{  
              "spellID":196227,
              "name":"Residual Flames",
              "icon":"spell_fire_immolation"
           },
           "808":{  
              "spellID":196236,
              "name":"Soulsnatcher",
              "icon":"ability_warlock_chaosbolt"
           },
           "809":{  
              "spellID":196432,
              "name":"Burning Hunger",
              "icon":"spell_fire_immolation"
           },
           "810":{  
              "spellID":196258,
              "name":"Fire From the Sky",
              "icon":"spell_shadow_rainoffire"
           },
           "811":{  
              "spellID":196301,
              "name":"Devourer of Life",
              "icon":"spell_shadow_lifedrain02"
           },
           "812":{  
              "spellID":196305,
              "name":"Eternal Struggle",
              "icon":"spell_shadow_lifedrain02"
           },
           "813":{  
              "spellID":196675,
              "name":"Planeswalker",
              "icon":"spell_warlock_demonicportal_purple"
           },
           "814":{  
              "spellID":215223,
              "name":"Demonic Durability",
              "icon":"spell_shadow_demonictactics"
           },
           "815":{  
              "spellID":215273,
              "name":"Impish Incineration",
              "icon":"spell_warlock_summonimpoutland"
           },
           "816":{  
              "spellID":219415,
              "name":"Dimension Ripper",
              "icon":"spell_fire_burnout"
           },
           "817":{  
              "spellID":219195,
              "name":"Conflagration of Chaos",
              "icon":"spell_fire_fireball"
           },
           "818":{  
              "spellID":224103,
              "name":"Lord of Flames",
              "icon":"spell_shadow_summoninfernal"
           },
           "1219":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1355":{  
              "spellID":215183,
              "name":"Flames of the Pit",
              "icon":"spell_fire_playingwithfiregreen"
           },
           "1392":{  
              "spellID":214936,
              "name":"Stolen Power",
              "icon":"inv_staff_2h_artifactsargeras_d_02"
           },
           "1202":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1277":{  
              "spellID":214326,
              "name":"Exploding Keg",
              "icon":"inv_staff_2h_artifactmonkeyking_d_02"
           },
           "1278":{  
              "spellID":213051,
              "name":"Obsidian Fists",
              "icon":"ability_monk_blackoutkick"
           },
           "1279":{  
              "spellID":227683,
              "name":"Hot Blooded",
              "icon":"ability_monk_breathoffire"
           },
           "1280":{  
              "spellID":213180,
              "name":"Overflow",
              "icon":"inv_drink_05"
           },
           "1281":{  
              "spellID":227688,
              "name":"Dark Side of the Moon",
              "icon":"ability_monk_blackoutkick"
           },
           "1282":{  
              "spellID":213055,
              "name":"Staggering Around",
              "icon":"ability_monk_fortifyingale_new"
           },
           "1283":{  
              "spellID":213133,
              "name":"Healthy Appetite",
              "icon":"inv_misc_food_100_hardcheese"
           },
           "1284":{  
              "spellID":213136,
              "name":"Gifted Student",
              "icon":"monk_stance_drunkenox"
           },
           "1285":{  
              "spellID":213047,
              "name":"Potent Kick",
              "icon":"ability_monk_ironskinbrew"
           },
           "1286":{  
              "spellID":213116,
              "name":"Face Palm",
              "icon":"ability_monk_tigerpalm"
           },
           "1287":{  
              "spellID":213161,
              "name":"Swift as a Coursing River",
              "icon":"ability_rogue_sprint_blue"
           },
           "1288":{  
              "spellID":216424,
              "name":"Obstinate Determination",
              "icon":"inv_drink_05"
           },
           "1289":{  
              "spellID":213050,
              "name":"Smashed",
              "icon":"achievement_brewery_2"
           },
           "1290":{  
              "spellID":213183,
              "name":"Dragonfire Brew",
              "icon":"spell_fire_burnout"
           },
           "1291":{  
              "spellID":214372,
              "name":"Brew-Stache",
              "icon":"inv_misc_archaeology_vrykuldrinkinghorn"
           },
           "1292":{  
              "spellID":213340,
              "name":"Fortification",
              "icon":"achievement_faction_brewmaster"
           },
           "1293":{  
              "spellID":214428,
              "name":"Full Keg",
              "icon":"achievement_brewery_2"
           },
           "1374":{  
              "spellID":214920,
              "name":"Wanderer's Hardiness",
              "icon":"inv_staff_2h_artifactmonkeyking_d_02"
           },
           "1454":{  
              "spellID":226829,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "931":{  
              "spellID":205406,
              "name":"Sheilun's Gift",
              "icon":"inv_staff_2h_artifactshaohao_d_01"
           },
           "932":{  
              "spellID":199887,
              "name":"The Mists of Sheilun",
              "icon":"ability_monk_chibrew"
           },
           "933":{  
              "spellID":199665,
              "name":"Blessings of Yu'lon",
              "icon":"ability_monk_summonserpentstatue"
           },
           "934":{  
              "spellID":199640,
              "name":"Celestial Breath",
              "icon":"ability_monk_dragonkick"
           },
           "935":{  
              "spellID":199401,
              "name":"Light on Your Feet",
              "icon":"ability_monk_chiexplosion"
           },
           "936":{  
              "spellID":199563,
              "name":"Mists of Life",
              "icon":"ability_monk_chicocoon"
           },
           "937":{  
              "spellID":199573,
              "name":"Dancing Mists",
              "icon":"ability_monk_souldance"
           },
           "938":{  
              "spellID":199364,
              "name":"Coalescing Mists",
              "icon":"ability_monk_effuse"
           },
           "939":{  
              "spellID":199365,
              "name":"Shroud of Mist",
              "icon":"ability_monk_expelharm"
           },
           "940":{  
              "spellID":199366,
              "name":"Way of the Mistweaver",
              "icon":"spell_monk_envelopingmist"
           },
           "941":{  
              "spellID":199367,
              "name":"Protection of Shaohao",
              "icon":"ability_monk_chicocoon"
           },
           "942":{  
              "spellID":199372,
              "name":"Extended Healing",
              "icon":"ability_monk_renewingmists"
           },
           "943":{  
              "spellID":199377,
              "name":"Soothing Remedies",
              "icon":"ability_monk_soothingmists"
           },
           "944":{  
              "spellID":199380,
              "name":"Infusion of Life",
              "icon":"ability_monk_vivify"
           },
           "945":{  
              "spellID":199384,
              "name":"Spirit Tether",
              "icon":"monk_ability_transcendence"
           },
           "946":{  
              "spellID":199485,
              "name":"Essence of the Mists",
              "icon":"ability_monk_essencefont"
           },
           "1203":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1255":{  
              "spellID":213428,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "1295":{  
              "spellID":214516,
              "name":"Mists of Wisdom",
              "icon":"ability_monk_uplift"
           },
           "1375":{  
              "spellID":214921,
              "name":"Mistweaving",
              "icon":"inv_staff_2h_artifactshaohao_d_02"
           },
           "800":{  
              "spellID":195243,
              "name":"Inner Peace",
              "icon":"ability_monk_jasmineforcetea"
           },
           "801":{  
              "spellID":195244,
              "name":"Light on Your Feet",
              "icon":"ability_monk_ridethewind"
           },
           "820":{  
              "spellID":195263,
              "name":"Rising Winds",
              "icon":"ability_monk_risingsunkick"
           },
           "821":{  
              "spellID":218607,
              "name":"Tiger Claws",
              "icon":"ability_monk_tigerpalm"
           },
           "822":{  
              "spellID":195266,
              "name":"Death Art",
              "icon":"ability_monk_touchofdeath"
           },
           "824":{  
              "spellID":195269,
              "name":"Power of a Thousand Cranes",
              "icon":"ability_monk_cranekick_new"
           },
           "825":{  
              "spellID":195291,
              "name":"Fists of the Wind",
              "icon":"ability_monk_jab"
           },
           "826":{  
              "spellID":195295,
              "name":"Good Karma",
              "icon":"ability_monk_touchofkarma"
           },
           "827":{  
              "spellID":195298,
              "name":"Spiritual Focus",
              "icon":"spell_nature_giftofthewild"
           },
           "828":{  
              "spellID":195300,
              "name":"Transfer the Power",
              "icon":"monk_ability_fistoffury"
           },
           "829":{  
              "spellID":195380,
              "name":"Healing Winds",
              "icon":"monk_ability_transcendence"
           },
           "830":{  
              "spellID":195399,
              "name":"Gale Burst",
              "icon":"ability_monk_palmstrike"
           },
           "831":{  
              "spellID":205320,
              "name":"Strike of the Windlord",
              "icon":"inv_hand_1h_artifactskywall_d_01"
           },
           "832":{  
              "spellID":195650,
              "name":"Crosswinds",
              "icon":"ability_monk_cranekick"
           },
           "833":{  
              "spellID":196082,
              "name":"Tornado Kicks",
              "icon":"ability_monk_quitornado"
           },
           "1094":{  
              "spellID":195267,
              "name":"Strength of Xuen",
              "icon":"ability_monk_summontigerstatue"
           },
           "1204":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1341":{  
              "spellID":195265,
              "name":"Dark Skies",
              "icon":"ability_monk_roundhousekick"
           },
           "1376":{  
              "spellID":214922,
              "name":"Windborne Blows",
              "icon":"inv_hand_1h_artifactskywall_d_02dual"
           },
           "1034":{  
              "spellID":202302,
              "name":"Bladed Feathers",
              "icon":"ability_skyreach_fourblades"
           },
           "1035":{  
              "spellID":203018,
              "name":"Touch of the Moon",
              "icon":"spell_nature_healingtouch"
           },
           "1036":{  
              "spellID":202384,
              "name":"Dark Side of the Moon",
              "icon":"sha_spell_shadow_shadesofdarkness"
           },
           "1037":{  
              "spellID":202386,
              "name":"Twilight Glow",
              "icon":"spell_nature_moonglow"
           },
           "1038":{  
              "spellID":202426,
              "name":"Solar Stabbing",
              "icon":"ability_skyreach_solar_burst"
           },
           "1039":{  
              "spellID":202433,
              "name":"Scythe of the Stars",
              "icon":"sha_ability_mage_firestarter"
           },
           "1040":{  
              "spellID":202445,
              "name":"Falling Star",
              "icon":"spell_nature_starfall"
           },
           "1041":{  
              "spellID":202466,
              "name":"Sunfire Burns",
              "icon":"spell_druid_sunfall"
           },
           "1042":{  
              "spellID":202464,
              "name":"Empowerment",
              "icon":"ability_socererking_arcanemines"
           },
           "1043":{  
              "spellID":202890,
              "name":"Rapid Innervation",
              "icon":"spell_druid_germination_rejuvenation"
           },
           "1044":{  
              "spellID":202918,
              "name":"Light of the Sun",
              "icon":"ability_vehicle_sonicshockwave"
           },
           "1045":{  
              "spellID":213682,
              "name":"Sunblind",
              "icon":"ability_mage_firestarter"
           },
           "1046":{  
              "spellID":202940,
              "name":"Moon and Stars",
              "icon":"artifactability_balancedruid_moonandstars"
           },
           "1047":{  
              "spellID":202996,
              "name":"Power of Goldrinn",
              "icon":"inv_mount_spectralwolf"
           },
           "1048":{  
              "spellID":214508,
              "name":"Echoing Stars",
              "icon":"ability_socererking_forcenova"
           },
           "1049":{  
              "spellID":202767,
              "name":"New Moon",
              "icon":"artifactability_balancedruid_newmoon"
           },
           "1192":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1294":{  
              "spellID":214514,
              "name":"Skywrath",
              "icon":"inv_enchant_shardglowinglarge"
           },
           "1364":{  
              "spellID":214910,
              "name":"Goldrinn's Fury",
              "icon":"inv_staff_2h_artifactelune_d_02"
           },
           "948":{  
              "spellID":200395,
              "name":"Reinforced Fur",
              "icon":"spell_druid_malfurionstenacity"
           },
           "949":{  
              "spellID":200399,
              "name":"Ursoc's Endurance",
              "icon":"ability_hunter_pet_bear"
           },
           "950":{  
              "spellID":200400,
              "name":"Wildflesh",
              "icon":"ability_bullrush"
           },
           "951":{  
              "spellID":200402,
              "name":"Perpetual Spring",
              "icon":"spell_nature_stoneclawtotem"
           },
           "952":{  
              "spellID":200409,
              "name":"Jagged Claws",
              "icon":"inv_misc_monsterclaw_03"
           },
           "953":{  
              "spellID":200414,
              "name":"Bestial Fortitude",
              "icon":"icon_upgradestone_beast_uncommon"
           },
           "954":{  
              "spellID":200415,
              "name":"Sharpened Instincts",
              "icon":"spell_druid_savagery"
           },
           "955":{  
              "spellID":208762,
              "name":"Mauler",
              "icon":"ability_druid_maul"
           },
           "956":{  
              "spellID":200440,
              "name":"Vicious Bites",
              "icon":"ability_druid_mangle2"
           },
           "957":{  
              "spellID":215799,
              "name":"Bear Hug",
              "icon":"spell_druid_bearhug"
           },
           "958":{  
              "spellID":200515,
              "name":"Bloody Paws",
              "icon":"spell_druid_thrash"
           },
           "959":{  
              "spellID":214996,
              "name":"Roar of the Crowd",
              "icon":"spell_druid_stampedingroar_cat"
           },
           "960":{  
              "spellID":200851,
              "name":"Rage of the Sleeper",
              "icon":"inv_hand_1h_artifactursoc_d_01"
           },
           "961":{  
              "spellID":200855,
              "name":"Embrace of the Nightmare",
              "icon":"inv_misc_herb_nightmarevine"
           },
           "962":{  
              "spellID":200854,
              "name":"Gory Fur",
              "icon":"artifactability_guardiandruid_goryfur"
           },
           "979":{  
              "spellID":200850,
              "name":"Adaptive Fur",
              "icon":"artifactability_guardiandruid_adaptivefur"
           },
           "1194":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1334":{  
              "spellID":215061,
              "name":"Iron Claws",
              "icon":"inv_knife_1h_pvphorde_a_01"
           },
           "1366":{  
              "spellID":214912,
              "name":"Ursoc's Bond",
              "icon":"inv_hand_1h_artifactursoc_d_01dual"
           },
           "1453":{  
              "spellID":226829,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "125":{  
              "spellID":208253,
              "name":"Essence of G'Hanir",
              "icon":"inv_staff_2h_artifactnordrassil_d_01"
           },
           "126":{  
              "spellID":189849,
              "name":"Dreamwalker",
              "icon":"ability_druid_healinginstincts"
           },
           "127":{  
              "spellID":189857,
              "name":"Tranquil Mind",
              "icon":"spell_nature_tranquility"
           },
           "128":{  
              "spellID":189870,
              "name":"Power of the Archdruid",
              "icon":"spell_druid_rampantgrowth"
           },
           "129":{  
              "spellID":189787,
              "name":"Nature's Essence",
              "icon":"ability_druid_flourish"
           },
           "130":{  
              "spellID":189772,
              "name":"Knowledge of the Ancients",
              "icon":"ability_druid_manatree"
           },
           "131":{  
              "spellID":189768,
              "name":"Seeds of the World Tree",
              "icon":"ability_druid_giftoftheearthmother"
           },
           "132":{  
              "spellID":189760,
              "name":"Essence of Nordrassil",
              "icon":"inv_misc_herb_talandrasrose"
           },
           "133":{  
              "spellID":189757,
              "name":"Infusion of Nature",
              "icon":"ability_druid_flourish"
           },
           "134":{  
              "spellID":189754,
              "name":"Armor of the Ancients",
              "icon":"spell_druid_ironbark"
           },
           "135":{  
              "spellID":189749,
              "name":"Natural Mending",
              "icon":"inv_relics_idolofrejuvenation"
           },
           "136":{  
              "spellID":189744,
              "name":"Blessing of the World Tree",
              "icon":"ability_druid_naturalperfection"
           },
           "137":{  
              "spellID":186396,
              "name":"Persistence",
              "icon":"spell_nature_starfall"
           },
           "138":{  
              "spellID":186393,
              "name":"Blooms of G'Hanir",
              "icon":"inv_misc_herb_felblossom"
           },
           "139":{  
              "spellID":186372,
              "name":"Mark of Shifting",
              "icon":"spell_druid_tirelesspursuit"
           },
           "140":{  
              "spellID":186320,
              "name":"Grovewalker",
              "icon":"spell_nature_healingtouch"
           },
           "1195":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1254":{  
              "spellID":213428,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           },
           "1335":{  
              "spellID":222644,
              "name":"Nature's Vigor",
              "icon":"spell_nature_rejuvenation"
           },
           "1367":{  
              "spellID":214913,
              "name":"G'Hanir's Bloom",
              "icon":"inv_staff_2h_artifactnordrassil_d_02"
           },
           "1153":{  
              "spellID":210722,
              "name":"Ashamane's Frenzy",
              "icon":"inv_knife_1h_artifactfrostsaber_d_01"
           },
           "1154":{  
              "spellID":210702,
              "name":"Ashamane's Bite",
              "icon":"artifactability_feraldruid_ashamanesbite"
           },
           "1155":{  
              "spellID":210676,
              "name":"Shadow Thrash",
              "icon":"spell_druid_displacement"
           },
           "1156":{  
              "spellID":210666,
              "name":"Open Wounds",
              "icon":"artifactability_feraldruid_openwounds"
           },
           "1157":{  
              "spellID":210663,
              "name":"Scent of Blood",
              "icon":"spell_druid_thrash"
           },
           "1158":{  
              "spellID":210650,
              "name":"Protection of Ashamane",
              "icon":"ability_druid_catform"
           },
           "1159":{  
              "spellID":210638,
              "name":"Hardened Roots",
              "icon":"spell_druid_massentanglement"
           },
           "1160":{  
              "spellID":210557,
              "name":"Honed Instincts",
              "icon":"ability_druid_tigersroar"
           },
           "1161":{  
              "spellID":210570,
              "name":"Razor Fangs",
              "icon":"spell_druid_bloodythrash"
           },
           "1162":{  
              "spellID":210571,
              "name":"Feral Power",
              "icon":"ability_druid_ravage"
           },
           "1163":{  
              "spellID":210575,
              "name":"Powerful Bite",
              "icon":"ability_druid_ferociousbite"
           },
           "1164":{  
              "spellID":210579,
              "name":"Ashamane's Energy",
              "icon":"ability_mount_jungletiger"
           },
           "1165":{  
              "spellID":210590,
              "name":"Attuned to Nature",
              "icon":"spell_nature_healingtouch"
           },
           "1166":{  
              "spellID":210593,
              "name":"Tear the Flesh",
              "icon":"ability_druid_disembowel"
           },
           "1167":{  
              "spellID":210631,
              "name":"Feral Instinct",
              "icon":"ability_druid_berserk"
           },
           "1168":{  
              "spellID":210637,
              "name":"Sharpened Claws",
              "icon":"ability_druid_rake"
           },
           "1193":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1327":{  
              "spellID":214736,
              "name":"Shredder Fangs",
              "icon":"spell_shadow_vampiricaura"
           },
           "1365":{  
              "spellID":214911,
              "name":"Fangs of the First",
              "icon":"inv_knife_1h_artifactfrostsaber_d_01dual"
           },
           "1000":{  
              "spellID":201454,
              "name":"Contained Fury",
              "icon":"ability_warrior_improveddisciplines"
           },
           "1001":{  
              "spellID":201455,
              "name":"Critical Chaos",
              "icon":"ability_demonhunter_chaosstrike"
           },
           "1002":{  
              "spellID":201456,
              "name":"Chaos Vision",
              "icon":"ability_demonhunter_eyebeam"
           },
           "1003":{  
              "spellID":201457,
              "name":"Sharpened Glaives",
              "icon":"ability_demonhunter_throwglaive"
           },
           "1004":{  
              "spellID":201458,
              "name":"Demon Rage",
              "icon":"inv_weapon_glave_01"
           },
           "1005":{  
              "spellID":201459,
              "name":"Illidari Knowledge",
              "icon":"spell_mage_overpowered"
           },
           "1006":{  
              "spellID":201460,
              "name":"Unleashed Demons",
              "icon":"ability_demonhunter_metamorphasisdps"
           },
           "1007":{  
              "spellID":201463,
              "name":"Deceiver's Fury",
              "icon":"rogue_burstofspeed"
           },
           "1008":{  
              "spellID":201464,
              "name":"Overwhelming Power",
              "icon":"spell_fire_felfirenova"
           },
           "1010":{  
              "spellID":201467,
              "name":"Fury of the Illidari",
              "icon":"inv_glaive_1h_artifactazgalor_d_01"
           },
           "1011":{  
              "spellID":201468,
              "name":"Feast on the Souls",
              "icon":"spell_warlock_soulburn"
           },
           "1012":{  
              "spellID":201469,
              "name":"Demon Speed",
              "icon":"ability_demonhunter_felrush"
           },
           "1013":{  
              "spellID":201470,
              "name":"Balanced Blades",
              "icon":"ability_demonhunter_bladedance"
           },
           "1014":{  
              "spellID":201471,
              "name":"Inner Demons",
              "icon":"ability_demonhunter_glide"
           },
           "1015":{  
              "spellID":201472,
              "name":"Rage of the Illidari",
              "icon":"ability_demonhunter_torment"
           },
           "1016":{  
              "spellID":201473,
              "name":"Anguish of the Deceiver",
              "icon":"artifactability_havocdemonhunter_anguishofthedeceiver"
           },
           "1190":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1330":{  
              "spellID":214795,
              "name":"Warglaives of Chaos",
              "icon":"ability_demonhunter_chaosstrike"
           },
           "1362":{  
              "spellID":214907,
              "name":"Chaos Burn",
              "icon":"inv_glaive_1h_artifactazgalor_d_02dual"
           },
           "1096":{  
              "spellID":207407,
              "name":"Soul Carver",
              "icon":"inv_glaive_1h_artifactaldrochi_d_01"
           },
           "1097":{  
              "spellID":212894,
              "name":"Demonic Flames",
              "icon":"ability_demonhunter_fierybrand"
           },
           "1098":{  
              "spellID":207387,
              "name":"Painbringer",
              "icon":"artifactability_vengeancedemonhunter_painbringer"
           },
           "1099":{  
              "spellID":207343,
              "name":"Aldrachi Design",
              "icon":"inv_glaive_1h_artifactaldrochi_d_01dual"
           },
           "1100":{  
              "spellID":207347,
              "name":"Aura of Pain",
              "icon":"ability_demonhunter_immolation"
           },
           "1101":{  
              "spellID":207352,
              "name":"Honed Warblades",
              "icon":"ability_demonhunter_hatefulstrike"
           },
           "1191":{  
              "spellID":211309,
              "name":"Artificial Stamina",
              "icon":"spell_holy_wordfortitude"
           },
           "1228":{  
              "spellID":212829,
              "name":"Defensive Spikes",
              "icon":"ability_demonhunter_demonspikes"
           },
           "1229":{  
              "spellID":207375,
              "name":"Infernal Force",
              "icon":"ability_demonhunter_infernalstrike1"
           },
           "1230":{  
              "spellID":212816,
              "name":"Embrace the Pain",
              "icon":"ability_demonhunter_metamorphasistank"
           },
           "1231":{  
              "spellID":212817,
              "name":"Fiery Demise",
              "icon":"ability_demonhunter_fierybrand"
           },
           "1232":{  
              "spellID":212819,
              "name":"Will of the Illidari",
              "icon":"ability_demonhunter_spectank"
           },
           "1233":{  
              "spellID":212821,
              "name":"Devour Souls",
              "icon":"ability_demonhunter_soulcleave"
           },
           "1234":{  
              "spellID":212827,
              "name":"Shatter the Souls",
              "icon":"ability_demonhunter_shatteredsouls"
           },
           "1235":{  
              "spellID":213010,
              "name":"Charred Warblades",
              "icon":"spell_fire_incinerate"
           },
           "1236":{  
              "spellID":213017,
              "name":"Fueled by Pain",
              "icon":"ability_demonhunter_metamorphasistank"
           },
           "1328":{  
              "spellID":214744,
              "name":"Tormented Souls",
              "icon":"ability_demonhunter_soulcleave"
           },
           "1363":{  
              "spellID":214909,
              "name":"Soulgorger",
              "icon":"inv_glaive_1h_artifactaldrochi_d_02dual"
           },
           "1434":{  
              "spellID":218910,
              "name":"Siphon Power",
              "icon":"ability_demonhunter_reversemagic"
           },
           "1452":{  
              "spellID":226829,
              "name":"Artificial Damage",
              "icon":"inv_misc_bone_skull_01"
           }
        };

        scope.$watch(attrs.wlfgItemArtifact, function(items) {
            if (items) {
                scope.traits = items.artifactTraits;

                scope.traitsRight = Math.floor(items.artifactTraits.length / 2)*-1;
                console.log(scope.traitsRight);
                if (items.artifactTraits.length % 2) {
                    scope.traitsLeft = Math.floor(items.artifactTraits.length / 2);
                } else {
                    scope.traitsLeft = Math.floor(items.artifactTraits.length / 2)+1;
                }
            }
        }, true);
    }
}