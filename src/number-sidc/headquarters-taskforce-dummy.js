export default function headquartersTaskforceDummy(symbolset) {
  if (symbolset == "10" || true) {
    return [
      { code: 0, name: "Unspecified", sidc: "10031000000000000000" },
      { code: 1, name: "Feint/Dummy", sidc: "10031001000000000000" },
      { code: 2, name: "Headquarters", sidc: "10031002000000000000" },
      {
        code: 3,
        name: "Feint/Dummy Headquarters",
        sidc: "10031003000000000000"
      },
      { code: 4, name: "Task Force", sidc: "10031004000000000000" },
      {
        code: 5,
        name: "Feint/Dummy Task Force",
        sidc: "10031005000000000000"
      },
      {
        code: 6,
        name: "Task Force Headquarters",
        sidc: "10031006000000000000"
      },
      {
        code: 7,
        name: "Feint/Dummy Task Force Headquarters",
        sidc: "10031007000000000000"
      }
    ];
  }

  return undefined;
}
