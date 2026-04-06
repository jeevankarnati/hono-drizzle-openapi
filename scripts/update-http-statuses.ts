/**
 * Copied it from https://github.com/w3cj/stoker/blob/main/scripts/update-http-statuses.ts
 */

import { Project, VariableDeclarationKind } from "ts-morph";

interface JsonCodeComment {
  doc: string;
  description: string;
}

interface JsonCode {
  code: number;
  phrase: string;
  constant: string;
  comment: JsonCodeComment;
  isDeprecated?: boolean;
}

const run = async () => {
  // oxlint-disable-next-line no-console
  console.log("Updating src/http-status-codes.ts and src/http-status-phrases.ts");

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  });

  const response = await fetch(
    "https://raw.githubusercontent.com/prettymuchbryce/http-status-codes/refs/heads/master/codes.json"
  );
  if (!response.ok) {
    throw new Error(`Error retrieving codes: ${response.statusText}`);
  }
  const Codes = (await response.json()) as JsonCode[];

  const statusCodeFile = project.createSourceFile(
    "src/helpers/http-status-codes.ts",
    {},
    {
      overwrite: true,
    }
  );

  statusCodeFile.insertStatements(0, "// Generated file. Do not edit\n");
  statusCodeFile.insertStatements(
    1,
    `// Codes retrieved on ${new Date().toUTCString()} from https://raw.githubusercontent.com/prettymuchbryce/http-status-codes/refs/heads/master/codes.json`
  );

  Codes.forEach(({ code, constant, comment, isDeprecated }) => {
    statusCodeFile
      .addVariableStatement({
        isExported: true,
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: constant,
            initializer: code.toString(),
          },
        ],
      })
      .addJsDoc({
        description: `${isDeprecated ? "@deprecated\n" : ""}${comment.doc}\n\n${comment.description}`,
      });
  });

  const phrasesFile = project.createSourceFile(
    "src/helpers/http-status-phrases.ts",
    {},
    {
      overwrite: true,
    }
  );

  phrasesFile.insertStatements(0, "// Generated file. Do not edit\n");
  phrasesFile.insertStatements(
    1,
    `// Phrases retrieved on ${new Date().toUTCString()} from https://raw.githubusercontent.com/prettymuchbryce/http-status-codes/refs/heads/master/codes.json`
  );

  Codes.forEach(({ constant, phrase, comment, isDeprecated }) => {
    phrasesFile
      .addVariableStatement({
        isExported: true,
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: constant,
            initializer: `"${phrase}"`,
          },
        ],
      })
      .addJsDoc({
        description: `${isDeprecated ? "@deprecated\n" : ""}${comment.doc}\n\n${comment.description}`,
      });
  });

  await project.save();
  // oxlint-disable-next-line no-console
  console.log(
    "Successfully generated src/helpers/http-status-codes.ts and src/helpers/http-status-phrases.ts"
  );
};

void run();
