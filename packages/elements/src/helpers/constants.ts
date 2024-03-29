/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { v1, v5 } from "uuid";

/**
 * Session signature symbol.
 */
export const signature = Symbol(v5(v1(), v1()).toString());

/**
 * An array of timezones.
 */
export const Timezones = [
  "Africa/Algiers",
  "Atlantic/Cape_Verde",
  "Africa/Ndjamena",
  "Africa/Abidjan",
  "Africa/Bamako",
  "Africa/Banjul",
  "Africa/Conakry",
  "Africa/Dakar",
  "Africa/Freetown",
  "Africa/Lome",
  "Africa/Nouakchott",
  "Africa/Ouagadougou",
  "Atlantic/St_Helena",
  "Africa/Cairo",
  "Africa/Accra",
  "Africa/Bissau",
  "Africa/Nairobi",
  "Africa/Addis_Ababa",
  "Africa/Asmara",
  "Africa/Dar_es_Salaam",
  "Africa/Djibouti",
  "Africa/Kampala",
  "Africa/Mogadishu",
  "Indian/Antananarivo",
  "Indian/Comoro",
  "Indian/Mayotte",
  "Africa/Monrovia",
  "Africa/Tripoli",
  "Indian/Mauritius",
  "Africa/Casablanca",
  "Africa/El_Aaiun",
  "Africa/Maputo",
  "Africa/Blantyre",
  "Africa/Bujumbura",
  "Africa/Gaborone",
  "Africa/Harare",
  "Africa/Kigali",
  "Africa/Lubumbashi",
  "Africa/Lusaka",
  "Africa/Windhoek",
  "Africa/Lagos",
  "Africa/Bangui",
  "Africa/Brazzaville",
  "Africa/Douala",
  "Africa/Kinshasa",
  "Africa/Libreville",
  "Africa/Luanda",
  "Africa/Malabo",
  "Africa/Niamey",
  "Africa/Porto-Novo",
  "Indian/Reunion",
  "Africa/Sao_Tome",
  "Indian/Mahe",
  "Africa/Johannesburg",
  "Africa/Maseru",
  "Africa/Mbabane",
  "Africa/Khartoum",
  "Africa/Juba",
  "Africa/Tunis",
  "Antarctica/Casey",
  "Antarctica/Davis",
  "Antarctica/Mawson",
  "Indian/Kerguelen",
  "Antarctica/DumontDUrville",
  "Antarctica/Syowa",
  "Antarctica/Troll",
  "Antarctica/Vostok",
  "Antarctica/Rothera",
  "Asia/Kabul",
  "Asia/Yerevan",
  "Asia/Baku",
  "Asia/Dhaka",
  "Asia/Thimphu",
  "Indian/Chagos",
  "Asia/Brunei",
  "Asia/Yangon",
  "Asia/Shanghai",
  "Asia/Urumqi",
  "Asia/Hong_Kong",
  "Asia/Taipei",
  "Asia/Macau",
  "Asia/Nicosia",
  "Asia/Famagusta",
  "Europe/Nicosia",
  "Asia/Tbilisi",
  "Asia/Dili",
  "Asia/Kolkata",
  "Asia/Jakarta",
  "Asia/Pontianak",
  "Asia/Makassar",
  "Asia/Jayapura",
  "Asia/Tehran",
  "Asia/Baghdad",
  "Asia/Jerusalem",
  "Asia/Tokyo",
  "Asia/Amman",
  "Asia/Almaty",
  "Asia/Qyzylorda",
  "Asia/Qostanay",
  "Asia/Aqtobe",
  "Asia/Aqtau",
  "Asia/Atyrau",
  "Asia/Oral",
  "Asia/Bishkek",
  "Asia/Seoul",
  "Asia/Pyongyang",
  "Asia/Beirut",
  "Asia/Kuala_Lumpur",
  "Asia/Kuching",
  "Indian/Maldives",
  "Asia/Hovd",
  "Asia/Ulaanbaatar",
  "Asia/Choibalsan",
  "Asia/Kathmandu",
  "Asia/Karachi",
  "Asia/Gaza",
  "Asia/Hebron",
  "Asia/Manila",
  "Asia/Qatar",
  "Asia/Bahrain",
  "Asia/Riyadh",
  "Asia/Aden",
  "Asia/Kuwait",
  "Asia/Singapore",
  "Asia/Colombo",
  "Asia/Damascus",
  "Asia/Dushanbe",
  "Asia/Bangkok",
  "Asia/Phnom_Penh",
  "Asia/Vientiane",
  "Asia/Ashgabat",
  "Asia/Dubai",
  "Asia/Muscat",
  "Asia/Samarkand",
  "Asia/Tashkent",
  "Asia/Ho_Chi_Minh",
  "Australia/Darwin",
  "Australia/Perth",
  "Australia/Eucla",
  "Australia/Brisbane",
  "Australia/Lindeman",
  "Australia/Adelaide",
  "Australia/Hobart",
  "Australia/Currie",
  "Australia/Melbourne",
  "Australia/Sydney",
  "Australia/Broken_Hill",
  "Australia/Lord_Howe",
  "Antarctica/Macquarie",
  "Indian/Christmas",
  "Indian/Cocos",
  "Pacific/Fiji",
  "Pacific/Gambier",
  "Pacific/Marquesas",
  "Pacific/Tahiti",
  "Pacific/Guam",
  "Pacific/Saipan",
  "Pacific/Tarawa",
  "Pacific/Enderbury",
  "Pacific/Kiritimati",
  "Pacific/Majuro",
  "Pacific/Kwajalein",
  "Pacific/Chuuk",
  "Pacific/Pohnpei",
  "Pacific/Kosrae",
  "Pacific/Nauru",
  "Pacific/Noumea",
  "Pacific/Auckland",
  "Pacific/Chatham",
  "Antarctica/McMurdo",
  "Pacific/Rarotonga",
  "Pacific/Niue",
  "Pacific/Norfolk",
  "Pacific/Palau",
  "Pacific/Port_Moresby",
  "Pacific/Bougainville",
  "Pacific/Pitcairn",
  "Pacific/Pago_Pago",
  "Pacific/Midway",
  "Pacific/Apia",
  "Pacific/Guadalcanal",
  "Pacific/Fakaofo",
  "Pacific/Tongatapu",
  "Pacific/Funafuti",
  "Pacific/Wake",
  "Pacific/Efate",
  "Pacific/Wallis",
  "Africa/Asmera",
  "Africa/Timbuktu",
  "America/Argentina/ComodRivadavia",
  "America/Atka",
  "America/Buenos_Aires",
  "America/Catamarca",
  "America/Coral_Harbour",
  "America/Cordoba",
  "America/Ensenada",
  "America/Fort_Wayne",
  "America/Indianapolis",
  "America/Jujuy",
  "America/Knox_IN",
  "America/Louisville",
  "America/Mendoza",
  "America/Montreal",
  "America/Porto_Acre",
  "America/Rosario",
  "America/Santa_Isabel",
  "America/Shiprock",
  "America/Virgin",
  "Antarctica/South_Pole",
  "Asia/Ashkhabad",
  "Asia/Calcutta",
  "Asia/Chongqing",
  "Asia/Chungking",
  "Asia/Dacca",
  "Asia/Harbin",
  "Asia/Kashgar",
  "Asia/Katmandu",
  "Asia/Macao",
  "Asia/Rangoon",
  "Asia/Saigon",
  "Asia/Tel_Aviv",
  "Asia/Thimbu",
  "Asia/Ujung_Pandang",
  "Asia/Ulan_Bator",
  "Atlantic/Faeroe",
  "Atlantic/Jan_Mayen",
  "Australia/ACT",
  "Australia/Canberra",
  "Australia/LHI",
  "Australia/NSW",
  "Australia/North",
  "Australia/Queensland",
  "Australia/South",
  "Australia/Tasmania",
  "Australia/Victoria",
  "Australia/West",
  "Australia/Yancowinna",
  "Brazil/Acre",
  "Brazil/DeNoronha",
  "Brazil/East",
  "Brazil/West",
  "Canada/Atlantic",
  "Canada/Central",
  "Canada/Eastern",
  "Canada/Mountain",
  "Canada/Newfoundland",
  "Canada/Pacific",
  "Canada/Saskatchewan",
  "Canada/Yukon",
  "Chile/Continental",
  "Chile/EasterIsland",
  "Cuba",
  "Egypt",
  "Eire",
  "Etc/UCT",
  "Europe/Belfast",
  "Europe/Tiraspol",
  "GB",
  "GB-Eire",
  "GMT+0",
  "GMT-0",
  "GMT0",
  "Greenwich",
  "Hongkong",
  "Iceland",
  "Iran",
  "Israel",
  "Jamaica",
  "Japan",
  "Kwajalein",
  "Libya",
  "Mexico/BajaNorte",
  "Mexico/BajaSur",
  "Mexico/General",
  "NZ",
  "NZ-CHAT",
  "Navajo",
  "PRC",
  "Pacific/Johnston",
  "Pacific/Ponape",
  "Pacific/Samoa",
  "Pacific/Truk",
  "Pacific/Yap",
  "Poland",
  "Portugal",
  "ROC",
  "ROK",
  "Singapore",
  "Turkey",
  "UCT",
  "US/Alaska",
  "US/Aleutian",
  "US/Arizona",
  "US/Central",
  "US/East-Indiana",
  "US/Eastern",
  "US/Hawaii",
  "US/Indiana-Starke",
  "US/Michigan",
  "US/Mountain",
  "US/Pacific",
  "US/Samoa",
  "UTC",
  "Universal",
  "W-SU",
  "Zulu",
  "Etc/GMT",
  "Etc/UTC",
  "GMT",
  "Etc/Universal",
  "Etc/Zulu",
  "Etc/Greenwich",
  "Etc/GMT-0",
  "Etc/GMT+0",
  "Etc/GMT0",
  "Etc/GMT-14",
  "Etc/GMT-13",
  "Etc/GMT-12",
  "Etc/GMT-11",
  "Etc/GMT-10",
  "Etc/GMT-9",
  "Etc/GMT-8",
  "Etc/GMT-7",
  "Etc/GMT-6",
  "Etc/GMT-5",
  "Etc/GMT-4",
  "Etc/GMT-3",
  "Etc/GMT-2",
  "Etc/GMT-1",
  "Etc/GMT+1",
  "Etc/GMT+2",
  "Etc/GMT+3",
  "Etc/GMT+4",
  "Etc/GMT+5",
  "Etc/GMT+6",
  "Etc/GMT+7",
  "Etc/GMT+8",
  "Etc/GMT+9",
  "Etc/GMT+10",
  "Etc/GMT+11",
  "Etc/GMT+12",
  "Europe/London",
  "Europe/Jersey",
  "Europe/Guernsey",
  "Europe/Isle_of_Man",
  "Europe/Dublin",
  "WET",
  "CET",
  "MET",
  "EET",
  "Europe/Tirane",
  "Europe/Andorra",
  "Europe/Vienna",
  "Europe/Minsk",
  "Europe/Brussels",
  "Europe/Sofia",
  "Europe/Prague",
  "Europe/Copenhagen",
  "Atlantic/Faroe",
  "America/Danmarkshavn",
  "America/Scoresbysund",
  "America/Godthab",
  "America/Thule",
  "Europe/Tallinn",
  "Europe/Helsinki",
  "Europe/Mariehamn",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Busingen",
  "Europe/Gibraltar",
  "Europe/Athens",
  "Europe/Budapest",
  "Atlantic/Reykjavik",
  "Europe/Rome",
  "Europe/Vatican",
  "Europe/San_Marino",
  "Europe/Riga",
  "Europe/Vaduz",
  "Europe/Vilnius",
  "Europe/Luxembourg",
  "Europe/Malta",
  "Europe/Chisinau",
  "Europe/Monaco",
  "Europe/Amsterdam",
  "Europe/Oslo",
  "Arctic/Longyearbyen",
  "Europe/Warsaw",
  "Europe/Lisbon",
  "Atlantic/Azores",
  "Atlantic/Madeira",
  "Europe/Bucharest",
  "Europe/Kaliningrad",
  "Europe/Moscow",
  "Europe/Simferopol",
  "Europe/Astrakhan",
  "Europe/Volgograd",
  "Europe/Saratov",
  "Europe/Kirov",
  "Europe/Samara",
  "Europe/Ulyanovsk",
  "Asia/Yekaterinburg",
  "Asia/Omsk",
  "Asia/Barnaul",
  "Asia/Novosibirsk",
  "Asia/Tomsk",
  "Asia/Novokuznetsk",
  "Asia/Krasnoyarsk",
  "Asia/Irkutsk",
  "Asia/Chita",
  "Asia/Yakutsk",
  "Asia/Vladivostok",
  "Asia/Khandyga",
  "Asia/Sakhalin",
  "Asia/Magadan",
  "Asia/Srednekolymsk",
  "Asia/Ust-Nera",
  "Asia/Kamchatka",
  "Asia/Anadyr",
  "Europe/Belgrade",
  "Europe/Ljubljana",
  "Europe/Podgorica",
  "Europe/Sarajevo",
  "Europe/Skopje",
  "Europe/Zagreb",
  "Europe/Bratislava",
  "Europe/Madrid",
  "Africa/Ceuta",
  "Atlantic/Canary",
  "Europe/Stockholm",
  "Europe/Zurich",
  "Europe/Istanbul",
  "Asia/Istanbul",
  "Europe/Kiev",
  "Europe/Uzhgorod",
  "Europe/Zaporozhye",
  "Factory",
  "EST",
  "MST",
  "HST",
  "EST5EDT",
  "CST6CDT",
  "MST7MDT",
  "PST8PDT",
  "America/New_York",
  "America/Chicago",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/North_Dakota/Beulah",
  "America/Denver",
  "America/Los_Angeles",
  "America/Juneau",
  "America/Sitka",
  "America/Metlakatla",
  "America/Yakutat",
  "America/Anchorage",
  "America/Nome",
  "America/Adak",
  "Pacific/Honolulu",
  "America/Phoenix",
  "America/Boise",
  "America/Indiana/Indianapolis",
  "America/Indiana/Marengo",
  "America/Indiana/Vincennes",
  "America/Indiana/Tell_City",
  "America/Indiana/Petersburg",
  "America/Indiana/Knox",
  "America/Indiana/Winamac",
  "America/Indiana/Vevay",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Detroit",
  "America/Menominee",
  "America/St_Johns",
  "America/Goose_Bay",
  "America/Halifax",
  "America/Glace_Bay",
  "America/Moncton",
  "America/Blanc-Sablon",
  "America/Toronto",
  "America/Thunder_Bay",
  "America/Nipigon",
  "America/Rainy_River",
  "America/Atikokan",
  "America/Winnipeg",
  "America/Regina",
  "America/Swift_Current",
  "America/Edmonton",
  "America/Vancouver",
  "America/Dawson_Creek",
  "America/Fort_Nelson",
  "America/Creston",
  "America/Pangnirtung",
  "America/Iqaluit",
  "America/Resolute",
  "America/Rankin_Inlet",
  "America/Cambridge_Bay",
  "America/Yellowknife",
  "America/Inuvik",
  "America/Whitehorse",
  "America/Dawson",
  "America/Cancun",
  "America/Merida",
  "America/Matamoros",
  "America/Monterrey",
  "America/Mexico_City",
  "America/Ojinaga",
  "America/Chihuahua",
  "America/Hermosillo",
  "America/Mazatlan",
  "America/Bahia_Banderas",
  "America/Tijuana",
  "America/Nassau",
  "America/Barbados",
  "America/Belize",
  "Atlantic/Bermuda",
  "America/Costa_Rica",
  "America/Havana",
  "America/Santo_Domingo",
  "America/El_Salvador",
  "America/Guatemala",
  "America/Port-au-Prince",
  "America/Tegucigalpa",
  "America/Jamaica",
  "America/Martinique",
  "America/Managua",
  "America/Panama",
  "America/Cayman",
  "America/Puerto_Rico",
  "America/Miquelon",
  "America/Grand_Turk",
  "US/Pacific-New",
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Cordoba",
  "America/Argentina/Salta",
  "America/Argentina/Tucuman",
  "America/Argentina/La_Rioja",
  "America/Argentina/San_Juan",
  "America/Argentina/Jujuy",
  "America/Argentina/Catamarca",
  "America/Argentina/Mendoza",
  "America/Argentina/San_Luis",
  "America/Argentina/Rio_Gallegos",
  "America/Argentina/Ushuaia",
  "America/Aruba",
  "America/La_Paz",
  "America/Noronha",
  "America/Belem",
  "America/Santarem",
  "America/Fortaleza",
  "America/Recife",
  "America/Araguaina",
  "America/Maceio",
  "America/Bahia",
  "America/Sao_Paulo",
  "America/Campo_Grande",
  "America/Cuiaba",
  "America/Porto_Velho",
  "America/Boa_Vista",
  "America/Manaus",
  "America/Eirunepe",
  "America/Rio_Branco",
  "America/Santiago",
  "America/Punta_Arenas",
  "Pacific/Easter",
  "Antarctica/Palmer",
  "America/Bogota",
  "America/Curacao",
  "America/Lower_Princes",
  "America/Kralendijk",
  "America/Guayaquil",
  "Pacific/Galapagos",
  "Atlantic/Stanley",
  "America/Cayenne",
  "America/Guyana",
  "America/Asuncion",
  "America/Lima",
  "Atlantic/South_Georgia",
  "America/Paramaribo",
  "America/Port_of_Spain",
  "America/Anguilla",
  "America/Antigua",
  "America/Dominica",
  "America/Grenada",
  "America/Guadeloupe",
  "America/Marigot",
  "America/Montserrat",
  "America/St_Barthelemy",
  "America/St_Kitts",
  "America/St_Lucia",
  "America/St_Thomas",
  "America/St_Vincent",
  "America/Tortola",
  "America/Montevideo",
  "America/Caracas",
];

/**
 * `IoElement` name RegExp.
 */
export const IO_NAME_REGEXP =
  /^(?:[a-z])+[a-z0-9]*(?:[-_.][a-z0-9]+)*\.[a-z]{2,6}$/;

/**
 * `IoElement` host url RegExp.
 */
export const IO_HOST_REGEXP = /.*/;

/**
 * `IoElement` tenant RegExp.
 */
export const IO_TENANT_REGEXP =
  /^(?:[a-z])+[a-z0-9-_]*(?:[-_][a-z0-9]+)*$/;

/**
 * `IoElement` token RegExp.
 */
export const IO_TOKEN_REGEXP = /^([a-zA-Z0-9_.\-+/=]*)$/;

/**
 * `ModelElement` name RegExp.
 */
export const MODEL_NAME_REGEXP = /^[a-zA-Z0-9_]*$/;

/**
 * The `TableElement` `name` attribute RegExp.
 */
export const TABLE_NAME_REGEXP = /^[a-zA-Z0-9_]*$/;

/**
 * The `TableElement` `type` attribute RegExp.
 */
export const TABLE_TYPE_REGEXP = /^(json|csv|table|query)$/;

/**
 * The `TableElement` `source` attribute RegExp.
 */
export const TABLE_SOURCE_REGEXP = /.*/;

/**
 * The `FieldElement` `name` attribute RegExp.
 */
export const FIELD_NAME_REGEXP = /^[a-zA-Z0-9_]*$/;

/**
 * The `TableElement` `origin` attribute RegExp.
 */
export const FIELD_ORIGIN_REGEXP = /.*/;

/**
 * The `TableElement` `clause` attribute RegExp.
 */
export const FIELD_CLAUSE_REGEXP = /.*/;

/**
 * The `FieldElement` `type` attribute RegExp.
 */
export const FIELD_TYPE_REGEXP = new RegExp(
  "^(int-8|int-16|int-32|int-64|uint-8|uint-16|uint-32|uint-64|" +
    "float-16|float-32|float-64|binary|utf-8|decimal|" +
    "date|time|timestamp)$",
);

/**
 * The `FieldElement` `nullable` attribute RegExp.
 */
export const FIELD_NULLABLE_REGEXP = /^(true|false|nullable)$/;

/**
 * The `FieldElement` `scale` attribute RegExp.
 */
export const FIELD_SCALE_REGEXP = /^[0-9]*$/;

/**
 * The `FieldElement` `precision` attribute RegExp.
 */
export const FIELD_PRECISION_REGEXP = /^[0-9]*$/;

/**
 * The `FieldElement` `bit-width` attribute RegExp.
 */
export const FIELD_BIT_WIDTH_REGEXP = /^(128|256)$/;

/**
 * The `FieldElement` date `unit` attribute RegExp.
 */
export const FIELD_DATE_UNIT_REGEXP = /^(second|millisecond)$/;

/**
 * The `FieldElement` time `unit` attribute RegExp.
 */
export const FIELD_TIME_UNIT_REGEXP =
  /^(second|millisecond|microsecond|nanosecond)$/;

/**
 * The `FieldElement` `timezone` attribute RegExp.
 */
export const FIELD_TZ_REGEXP = new RegExp(
  `^(${Timezones.join("|")})$`,
);

/**
 * The `FieldElement` `agg` attribute RegExp.
 */
export const FIELD_AGG_REGEXP =
  /^(none|count|countDistinct|countDistinctApprox|sum|avg|min|max)$/;

/**
 * The `FieldElement` `asc` attribute RegExp.
 */
export const FIELD_ASC_REGEXP = /^(true|false|asc)$/;

/**
 * The `JoinElement` `type` attribute RegExp.
 */
export const JOIN_TYPE_REGEXP =
  /^(cross|inner|full|left|right|full-outer|left-outer|right-outer)$/;

/**
 * The `ConnectiveElement` `operator` attribute RegExp.
 */
export const CONNECTIVE_OP_REGEXP = /^(or|and|none)$/;

/**
 * The `FilterElement` `type` attribute RegExp.
 */
export const FILTER_TYPE_REGEXP = /^(expr|keys|named)$/;

/**
 * The `FilterElement` `name` attribute RegExp.
 */
export const FILTER_NAME_REGEXP = new RegExp(
  "^(equals|not-equals|contains|not-contains|starts-with|ends-with|" +
    "greater|greater-equal|less|less-equal|is-null|is-not-null|" +
    "between)$",
);

/**
 * The `FilterElement` `clause` attribute RegExp.
 */
export const FILTER_CLAUSE_REGEXP = /.*/;

/**
 * The `FrameElement` `name` attribute RegExp.
 */
export const FRAME_NAME_REGEXP = /^[a-zA-Z0-9_]*$/;

/**
 * The `FrameElement` `source` attribute RegExp.
 */
export const FRAME_SOURCE_REGEXP = /.*/;

/**
 * The `FrameElement` `offset` attribute RegExp.
 */
export const FRAME_OFFSET_REGEXP = /^[0-9]*$/;

/**
 * The `FrameElement` `limit` attribute RegExp.
 */
export const FRAME_LIMIT_REGEXP = /^[0-9]*$/;
