import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import css from "rollup-plugin-css-only";
import html from "rollup-plugin-html";

export default [
  {
    input: "src/index.js",
    output: {
      file: "unitgenerator/milsymbol-unit-generator.js",
      format: "iife",
      name: "milsymbolUnitGenerator"
    },
    plugins: [
      resolve(),
      commonjs(),
      css({ output: "unitgenerator/milsymbol-unit-generator.css" }),
      html({
        include: "**/*.html"
      })
    ]
  }
];
