// With this file my intention is to export any folder files, or file imports then I want to share this structure
// with an AI and ask it to restructure the imports in a way that makes sense.

const { Project } = require("ts-morph");
const fs = require("fs");

// Initialize a TypeScript project
const project = new Project();

// Add your source files to the project
const sourceFiles = project.addSourceFilesAtPaths("./components/**/*.{ts,tsx}");

// Initialize an empty object to hold the imports
const importsByFile = {};

// Iterate over each source file
sourceFiles.forEach((sourceFile) => {
  const filePath = sourceFile
    .getFilePath()
    .replace("/Users/marcelorl/Development", "");
  importsByFile[filePath] = [];

  // Iterate over each import declaration in the file
  sourceFile.getImportDeclarations().forEach((importDeclaration) => {
    const moduleSpecifier = importDeclaration.getModuleSpecifierValue();

    // if (!importDeclaration.getModuleSpecifierSourceFile()?.getBaseName()) {
    //   importsByFile[filePath].push(moduleSpecifier);
    // }
  });
});

// Generate and print the report

const reportPath = "./importsReport.json";

// Convert the object to a JSON string and write it to a file
fs.writeFileSync(
  reportPath,
  JSON.stringify(Object.keys(importsByFile), null, 2),
);
