export default function echelonMobilityTowedarray(symbolset) {
  if (symbolset == "10") {
    return [
      { code: "00", name: "Unspecified", sidc: "10031000000000000000" },
      { code: "11", name: "Team/Crew", sidc: "10031000110000000000" },
      { code: "12", name: "Squad", sidc: "10031000120000000000" },
      { code: "13", name: "Section", sidc: "10031000130000000000" },
      { code: "14", name: "Platoon/Detachment", sidc: "10031000140000000000" },
      {
        code: "15",
        name: "Company/Battery/Troop",
        sidc: "10031000150000000000"
      },
      { code: "16", name: "Battalion/Squadron", sidc: "10031000160000000000" },
      { code: "17", name: "Regiment/Group", sidc: "10031000170000000000" },
      { code: "18", name: "Brigade", sidc: "10031000180000000000" },
      { code: "21", name: "Division", sidc: "10031000210000000000" },
      { code: "22", name: "Corps/MEF", sidc: "10031000220000000000" },
      { code: "23", name: "Army", sidc: "10031000230000000000" },
      { code: "24", name: "Army Group/Front", sidc: "10031000240000000000" },
      { code: "25", name: "Region/Theater", sidc: "10031000250000000000" },
      {
        code: "26",
        name: "Command",
        sidc: "10031000260000000000"
      }
    ];
  }
  // add signals intelligence
  if (symbolset == "15") {
    return [
      { code: "00", name: "Unspecified", sidc: "10031500000000000000" },
      {
        code: "31",
        name: "Wheeled limited cross country",
        sidc: "10031500310000000000"
      },
      {
        code: "32",
        name: "Wheeled cross country",
        sidc: "10031500320000000000"
      },
      { code: "33", name: "Tracked", sidc: "10031500330000000000" },
      {
        code: "34",
        name: "Wheeled and tracked combination",
        sidc: "10031500340000000000"
      },
      { code: "35", name: "Towed", sidc: "10031500350000000000" },
      { code: "36", name: "Railway", sidc: "10031500360000000000" },
      { code: "37", name: "Pack animals", sidc: "10031500370000000000" },
      {
        code: "41",
        name: "Over snow (prime mover)",
        sidc: "10031500410000000000"
      },
      { code: "42", name: "Sled", sidc: "10031500420000000000" },
      { code: "51", name: "Barge", sidc: "10031500510000000000" },
      { code: "52", name: "Amphibious", sidc: "10031500520000000000" }
    ];
  }
  if (symbolset == "27") {
    return [
      { code: "00", name: "Unspecified", sidc: "10032700000000000000" },
      { code: "71", name: "Leader", sidc: "10032700710000000000" }
    ];
  }
  if (symbolset == "30" || symbolset == "35") {
    return [
      { code: "00", name: "Unspecified", sidc: "10033000000000000000" },
      { code: "61", name: "Short towed array", sidc: "10033000610000000000" },
      { code: "62", name: "Long towed array", sidc: "10033000620000000000" }
    ];
  }

  return undefined;
}
