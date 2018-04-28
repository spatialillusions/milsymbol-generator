export default function modifier2(battledimension, modifier1) {
  if (battledimension == "GRDTRK_UNT" || battledimension == "SOFUNT") {
    return {
      "-": { name: "Unspecified" },
      A: { name: "Team/Crew", sidc: "SFGP-------A" },
      B: { name: "Squad", sidc: "SFGP-------B" },
      C: { name: "Section", sidc: "SFGP-------C" },
      D: { name: "Platoon/Detachment", sidc: "SFGP-------D" },
      E: { name: "Company/Battery/Troop", sidc: "SFGP-------E" },
      F: { name: "Battalion/Squadron", sidc: "SFGP-------F" },
      G: { name: "Regiment/Group", sidc: "SFGP-------G" },
      H: { name: "Brigade", sidc: "SFGP-------H" },
      I: { name: "Division", sidc: "SFGP-------I" },
      J: { name: "Corps/Mef", sidc: "SFGP-------J" },
      K: { name: "Army", sidc: "SFGP-------K" },
      L: { name: "Army Group/Front", sidc: "SFGP-------L" },
      M: { name: "Region", sidc: "SFGP-------M" },
      N: { name: "Command", sidc: "SFGP-------N" }
    };
  }
  if (battledimension == "GRDTRK_EQT" && modifier1 == "M") {
    return {
      O: { name: "Wheeled/Limited", sidc: "SFGPE-----MO" },
      P: { name: "Wheeled", sidc: "SFGPE-----MP" },
      Q: { name: "Tracked", sidc: "SFGPE-----MQ" },
      R: { name: "Wheeled And Tracked", sidc: "SFGPE-----MR" },
      S: { name: "Towed", sidc: "SFGPE-----MS" },
      T: { name: "Railway", sidc: "SFGPE-----MT" },
      U: { name: "Over The Snow", sidc: "SFGPE-----MU" },
      V: { name: "Sled", sidc: "SFGPE-----MV" },
      W: { name: "Pack Animals", sidc: "SFGPE-----MW" },
      Y: { name: "Barge", sidc: "SFGPE-----MY" },
      Z: { name: "Amphibious", sidc: "SFGPE-----MZ" }
    };
  }
  if (
    (battledimension == "SSUF" || battledimension == "SBSUF") &&
    modifier1 == "N"
  ) {
    return {
      S: { name: "Towed Array (short)", sidc: "SFSPE-----NS" },
      L: { name: "Towed Array (long)", sidc: "SFSPE-----NL" }
    };
  }

  return undefined; //{ "-": { name: "-" } };
}
