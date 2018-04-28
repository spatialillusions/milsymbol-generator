export default function modifier1(battledimension) {
  if (battledimension == "GRDTRK_UNT") {
    return {
      "-": { name: "Not Applicable" },
      A: { name: "Headquarters", sidc: "SFGP------A" },
      B: { name: "Task Force HQ", sidc: "SFGP------B" },
      C: { name: "Feint Dummy HQ", sidc: "SFGP------C" },
      D: { name: "Feint Dummy/Task Force HQ", sidc: "SFGP------D" },
      E: { name: "Task Force", sidc: "SFGP------E" },
      F: { name: "Feint Dummy", sidc: "SFGP------F" },
      G: { name: "Feint Dummy/Task Force", sidc: "SFGP------G" }
    };
  }
  if (battledimension == "GRDTRK_EQT") {
    return {
      "-": { name: "Unspecified" },
      M: { name: "Mobility" }
    };
  }
  if (battledimension == "GRDTRK_INS") {
    return {
      H: { name: "Installation", sidc: "SFGP------H" }
    };
  }
  if (battledimension == "SSUF" || battledimension == "SBSUF") {
    return {
      "-": { name: "Unspecified" },
      N: { name: "Towed array" }
    };
  }

  return undefined; //{ "-": { name: "-" } };
}
