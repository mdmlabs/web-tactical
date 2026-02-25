const fs = require("node:fs");
const path = require("node:path");

const GENERATED_DIR = path.join(__dirname, "../src/generated");

// функция для обработки одного proto файла
function processProtoFile(filePath, packageName) {
  console.log(`\n Обработка: ${path.relative(GENERATED_DIR, filePath)}`);

  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");

  const imports = getImportsForFile(filePath);
  if (!content.includes("import * as jspb")) {
    console.log("Конвертация в ES6 модули...");

    const es6Imports = generateES6Imports(imports, packageName, filePath);
    content = content.replace(
      /(\/\/ GENERATED CODE -- DO NOT EDIT!\n\/\* eslint-disable \*\/\n\/\/ @ts-nocheck\n\n)/,
      `$1${es6Imports}`,
    );
  }

  content = fixImportPaths(content, filePath);
  const { classes, enums } = extractExportedSymbols(content, packageName);

  // debug: если ничего не найдено, покажем примеры строк
  if (classes.size === 0) {
    console.log("DEBUG: Поиск goog.exportSymbol в файле...");
    const exportMatches = content.match(/goog\.exportSymbol\([^)]+\)/g);
    if (exportMatches) {
      console.log(`Найдено ${exportMatches.length} экспортов, примеры:`);
      exportMatches.slice(0, 3).forEach((m) => console.log(`    ${m}`));
    } else {
      console.log("goog.exportSymbol не найден!");
    }
  }

  content = cleanOldExports(content);
  content = content.trimEnd() + "\n";

  const exportsBlock = generateExportsBlock(classes, enums, packageName);
  fs.writeFileSync(filePath, content + exportsBlock, "utf8");
  return true;
}

function getImportsForFile(filePath) {
  const fileName = path.basename(filePath);
  const fileDir = path.dirname(filePath);
  const inMeshDir = fileDir.endsWith("mesh");
  const imports = {
    jspb: true,
    wrappers: false,
    timestamp: false,
    empty: false,
    user: false,
    node: false,
    operator: false,
  };

  if (fileName === "operator_pb.js") {
    imports.wrappers = true;
    imports.user = true;
    imports.node = true;
  } else if (inMeshDir && fileName === "user_service_pb.js") {
    imports.wrappers = true;
    imports.user = true;
  } else if (fileName === "user_service_pb.js") {
    imports.wrappers = true;
    imports.user = true;
    imports.operator = true; // UserGroupTarget использует laborato.mesh.operator.v1.*
  } else if (fileName === "agent_category_service_pb.js") {
    imports.wrappers = true;
    imports.empty = true;
  } else if (fileName === "mesh_pb.js") {
    imports.node = true;
    imports.timestamp = true;
    imports.empty = true;
  } else if (fileName === "user_pb.js") {
    imports.wrappers = true;
    imports.timestamp = true;
  } else if (fileName === "node_pb.js") {
    imports.timestamp = true;
    imports.user = true;
  }

  return imports;
}

function generateES6Imports(imports, packageName, filePath) {
  const lines = [];
  const fileDir = path.dirname(filePath);
  const relToGenerated = path.relative(fileDir, GENERATED_DIR);
  const base = relToGenerated ? relToGenerated + "/" : "./";

  lines.push('import * as jspb from "google-protobuf";');

  if (imports.wrappers) {
    lines.push(
      'import * as google_protobuf_wrappers_pb from "google-protobuf/google/protobuf/wrappers_pb.js";',
    );
  }
  if (imports.timestamp) {
    lines.push(
      'import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb.js";',
    );
  }
  if (imports.empty) {
    lines.push(
      'import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb.js";',
    );
  }

  if (imports.user) {
    lines.push(`import * as common_user_pb from "${base}common/user_pb.js";`);
  }
  if (imports.node) {
    lines.push(`import * as common_node_pb from "${base}common/node_pb.js";`);
  }
  if (imports.operator) {
    lines.push(`import "${base}operator_pb.js";`);
  }

  lines.push("");
  lines.push("var goog = jspb;");
  lines.push("var global = globalThis;");
  lines.push("");
  lines.push(
    "var proto = (typeof globalThis !== 'undefined' && globalThis.__grpc_web_proto__) || {};",
  );
  lines.push(
    "if (typeof globalThis !== 'undefined') { globalThis.__grpc_web_proto__ = proto; }",
  );
  lines.push("");

  if (packageName.startsWith("laborato.mesh.operator")) {
    lines.push("proto.laborato = proto.laborato || {};");
    lines.push("proto.laborato.mesh = proto.laborato.mesh || {};");
    lines.push(
      "proto.laborato.mesh.operator = proto.laborato.mesh.operator || {};",
    );
    lines.push(
      "proto.laborato.mesh.operator.v1 = proto.laborato.mesh.operator.v1 || {};",
    );

    if (imports.wrappers) {
      lines.push("");
      lines.push("proto.google = proto.google || {};");
      lines.push("proto.google.protobuf = proto.google.protobuf || {};");
      lines.push("goog.object.extend(proto, google_protobuf_wrappers_pb);");
      lines.push("");
      lines.push("if (google_protobuf_wrappers_pb.StringValue) {");
      lines.push(
        "  proto.google.protobuf.StringValue = google_protobuf_wrappers_pb.StringValue;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.BoolValue) {");
      lines.push(
        "  proto.google.protobuf.BoolValue = google_protobuf_wrappers_pb.BoolValue;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.Int32Value) {");
      lines.push(
        "  proto.google.protobuf.Int32Value = google_protobuf_wrappers_pb.Int32Value;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.Int64Value) {");
      lines.push(
        "  proto.google.protobuf.Int64Value = google_protobuf_wrappers_pb.Int64Value;",
      );
      lines.push("}");
    }

    if (imports.user) {
      lines.push("");
      lines.push("proto.laborato.common = proto.laborato.common || {};");
      lines.push("proto.laborato.common.user = common_user_pb;");
    }

    if (imports.node) {
      lines.push("");
      lines.push("proto.laborato.common = proto.laborato.common || {};");
      lines.push("proto.laborato.common.node = common_node_pb;");
    }
  } else if (packageName.startsWith("laborato.operator.service")) {
    lines.push("proto.laborato = proto.laborato || {};");
    lines.push("proto.laborato.operator = proto.laborato.operator || {};");
    lines.push(
      "proto.laborato.operator.service = proto.laborato.operator.service || {};",
    );

    if (imports.wrappers) {
      lines.push("");
      lines.push("proto.google = proto.google || {};");
      lines.push("proto.google.protobuf = proto.google.protobuf || {};");
      lines.push("goog.object.extend(proto, google_protobuf_wrappers_pb);");
      lines.push("");
      lines.push("if (google_protobuf_wrappers_pb.StringValue) {");
      lines.push(
        "  proto.google.protobuf.StringValue = google_protobuf_wrappers_pb.StringValue;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.BoolValue) {");
      lines.push(
        "  proto.google.protobuf.BoolValue = google_protobuf_wrappers_pb.BoolValue;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.Int32Value) {");
      lines.push(
        "  proto.google.protobuf.Int32Value = google_protobuf_wrappers_pb.Int32Value;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.Int64Value) {");
      lines.push(
        "  proto.google.protobuf.Int64Value = google_protobuf_wrappers_pb.Int64Value;",
      );
      lines.push("}");
    }

    if (imports.user) {
      lines.push("");
      lines.push("proto.laborato.common = proto.laborato.common || {};");
      lines.push("proto.laborato.common.user = common_user_pb;");
    }

    if (imports.empty) {
      lines.push("");
      lines.push("proto.google = proto.google || {};");
      lines.push("proto.google.protobuf = proto.google.protobuf || {};");
      lines.push("goog.object.extend(proto, google_protobuf_empty_pb);");
    }
  } else if (packageName.startsWith("laborato.common.user")) {
    lines.push("proto.laborato = proto.laborato || {};");
    lines.push("proto.laborato.common = proto.laborato.common || {};");
    lines.push(
      "proto.laborato.common.user = proto.laborato.common.user || {};",
    );

    if (imports.wrappers || imports.timestamp) {
      lines.push("");
      lines.push("proto.google = proto.google || {};");
      lines.push("proto.google.protobuf = proto.google.protobuf || {};");
    }

    if (imports.wrappers) {
      lines.push("goog.object.extend(proto, google_protobuf_wrappers_pb);");
    }
    if (imports.timestamp) {
      lines.push("goog.object.extend(proto, google_protobuf_timestamp_pb);");
      lines.push(
        "if (google_protobuf_timestamp_pb.Timestamp) { proto.google.protobuf.Timestamp = google_protobuf_timestamp_pb.Timestamp; }",
      );
    }

    // явно присваиваем враппер а то проблемы для корректной сериализации
    if (imports.wrappers) {
      lines.push("");
      lines.push("if (google_protobuf_wrappers_pb.StringValue) {");
      lines.push(
        "  proto.google.protobuf.StringValue = google_protobuf_wrappers_pb.StringValue;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.BoolValue) {");
      lines.push(
        "  proto.google.protobuf.BoolValue = google_protobuf_wrappers_pb.BoolValue;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.Int32Value) {");
      lines.push(
        "  proto.google.protobuf.Int32Value = google_protobuf_wrappers_pb.Int32Value;",
      );
      lines.push("}");
      lines.push("if (google_protobuf_wrappers_pb.Int64Value) {");
      lines.push(
        "  proto.google.protobuf.Int64Value = google_protobuf_wrappers_pb.Int64Value;",
      );
      lines.push("}");
    }
  } else if (packageName.startsWith("laborato.common.target")) {
    lines.push("proto.laborato = proto.laborato || {};");
    lines.push("proto.laborato.common = proto.laborato.common || {};");
    lines.push(
      "proto.laborato.common.target = proto.laborato.common.target || {};",
    );
  } else if (packageName.startsWith("laborato.common.node")) {
    lines.push("proto.laborato = proto.laborato || {};");
    lines.push("proto.laborato.common = proto.laborato.common || {};");
    lines.push(
      "proto.laborato.common.node = proto.laborato.common.node || {};",
    );

    if (imports.user) {
      lines.push("proto.laborato.common.user = common_user_pb;");
    }

    if (imports.timestamp || imports.empty) {
      lines.push("");
      lines.push("proto.google = proto.google || {};");
      lines.push("proto.google.protobuf = proto.google.protobuf || {};");
    }

    if (imports.timestamp) {
      lines.push("goog.object.extend(proto, google_protobuf_timestamp_pb);");
      lines.push(
        "if (google_protobuf_timestamp_pb.Timestamp) { proto.google.protobuf.Timestamp = google_protobuf_timestamp_pb.Timestamp; }",
      );
    }
    if (imports.empty) {
      lines.push("goog.object.extend(proto, google_protobuf_empty_pb);");
    }
  } else if (packageName.startsWith("laborato.mesh.service")) {
    lines.push("proto.laborato = proto.laborato || {};");
    lines.push("proto.laborato.mesh = proto.laborato.mesh || {};");
    lines.push(
      "proto.laborato.mesh.service = proto.laborato.mesh.service || {};",
    );

    if (imports.wrappers) {
      lines.push("");
      lines.push("proto.google = proto.google || {};");
      lines.push("proto.google.protobuf = proto.google.protobuf || {};");
      lines.push("goog.object.extend(proto, google_protobuf_wrappers_pb);");
      lines.push("");
      lines.push("if (google_protobuf_wrappers_pb.StringValue) {");
      lines.push(
        "  proto.google.protobuf.StringValue = google_protobuf_wrappers_pb.StringValue;",
      );
      lines.push("}");
    }

    if (imports.user) {
      lines.push("");
      lines.push("proto.laborato.common = proto.laborato.common || {};");
      lines.push("proto.laborato.common.user = common_user_pb;");
    }
  } else if (packageName === "laborato.mesh") {
    lines.push("proto.laborato = proto.laborato || {};");
    lines.push("proto.laborato.mesh = proto.laborato.mesh || {};");

    if (imports.node) {
      lines.push("");
      lines.push("proto.laborato.common = proto.laborato.common || {};");
      lines.push("proto.laborato.common.node = common_node_pb;");
    }

    if (imports.timestamp || imports.empty) {
      lines.push("");
      lines.push("proto.google = proto.google || {};");
      lines.push("proto.google.protobuf = proto.google.protobuf || {};");
    }

    if (imports.timestamp) {
      lines.push("goog.object.extend(proto, google_protobuf_timestamp_pb);");
      lines.push(
        "if (google_protobuf_timestamp_pb.Timestamp) { proto.google.protobuf.Timestamp = google_protobuf_timestamp_pb.Timestamp; }",
      );
    }
    if (imports.empty) {
      lines.push("goog.object.extend(proto, google_protobuf_empty_pb);");
    }
  }

  lines.push("");
  lines.push("");

  return lines.join("\n");
}

function fixImportPaths(content, filePath) {
  const fileName = path.basename(filePath);
  const fileDir = path.dirname(filePath);

  if (fileDir.endsWith("common")) {
    if (fileName === "node_pb.js") {
      content = content.replace(
        /import \* as common_user_pb from ["']\.\.\/\.\.\/generated\/common\/user_pb\.js["'];/g,
        'import * as common_user_pb from "./user_pb.js";',
      );
      content = content.replace(
        /import \* as common_user_pb from ["']\.\/common\/user_pb\.js["'];/g,
        'import * as common_user_pb from "./user_pb.js";',
      );
    }
  }

  if (fileDir.endsWith("mesh")) {
    content = content.replace(
      /import \* as common_user_pb from ["']\.\/common\/user_pb\.js["'];/g,
      'import * as common_user_pb from "../common/user_pb.js";',
    );
  }

  return content;
}

function extractExportedSymbols(content, packageName) {
  const classes = new Set();
  const enums = new Set();
  const packagePath = packageName.replace(/\./g, "\\.");
  const regex1 = new RegExp(
    `goog\\.exportSymbol\\(['"]${packagePath}\\.(\\w+)['"]`,
    "g",
  );
  const regex2 = new RegExp(
    `goog\\.exportSymbol\\(['"]${packageName}\\.(\\w+)['"]`,
    "g",
  );
  const regex3 = /goog\.exportSymbol\(['"][\w.]+\.(\w+)['"]/g;

  let match;
  while ((match = regex1.exec(content)) !== null) {
    classes.add(match[1]);
  }
  if (classes.size === 0) {
    while ((match = regex2.exec(content)) !== null) {
      classes.add(match[1]);
    }
  }
  if (classes.size === 0) {
    while ((match = regex3.exec(content)) !== null) {
      classes.add(match[1]);
    }
  }
  if (classes.size > 0) {
    const enumRegex = /proto\.[\w.]+\.(\w+) = \{[\s\S]*?\};/g;
    const potentialEnums = [];

    while ((match = enumRegex.exec(content)) !== null) {
      potentialEnums.push({
        name: match[1],
        enumContent: match[0],
      });
    }

    potentialEnums.forEach((item) => {
      const hasEnumPattern = /[A-Z_]+:\s*\d+/.test(item.enumContent);
      const isNotPrototype = !/prototype/.test(item.enumContent);

      if (hasEnumPattern && isNotPrototype && classes.has(item.name)) {
        enums.add(item.name);
      }
    });
  }

  return { classes, enums };
}

function cleanOldExports(content) {
  content = content.replace(/\n\/\/ Экспорт для ES модулей[\s\S]*$/, "");
  content = content.replace(/\nconst namespace = [\s\S]*$/, "");
  content = content.replace(/\nconst isDevMode[\s\S]*$/, "");
  content = content.replace(/\nconst \w+_pb_exports[\s\S]*$/, "");
  content = content.replace(/\nexport default[\s\S]*$/, "");
  content = content.replace(/\nexport const [\s\S]*$/, "");
  return content;
}

function generateExportsBlock(classes, enums, packageName) {
  const exportLines = [];
  const namespacePath = packageName.split(".").join(".");
  const exportName = packageName.split(".").pop() + "_pb_exports";

  exportLines.push(`const namespace = proto.${namespacePath};`);
  exportLines.push("");
  exportLines.push("const isDevMode =");
  exportLines.push('  typeof process !== "undefined" &&');
  exportLines.push("  process.env &&");
  exportLines.push('  process.env.NODE_ENV === "development";');
  exportLines.push("");
  exportLines.push("if (isDevMode && Object.keys(namespace).length === 0) {");
  exportLines.push(`  console.warn("[${packageName}] Namespace is empty!");`);
  exportLines.push("}");
  exportLines.push("");
  exportLines.push(`const ${exportName} = namespace;`);
  exportLines.push("");
  exportLines.push(`export default ${exportName};`);
  exportLines.push("");

  const sortedClasses = Array.from(classes).sort();
  sortedClasses.forEach((className) => {
    exportLines.push(`export const ${className} = ${exportName}.${className};`);
  });

  return "\n" + exportLines.join("\n") + "\n";
}

function main() {
  const files = [
    {
      path: path.join(GENERATED_DIR, "common/user_pb.js"),
      package: "laborato.common.user",
    },
    {
      path: path.join(GENERATED_DIR, "common/node_pb.js"),
      package: "laborato.common.node",
    },
    {
      path: path.join(GENERATED_DIR, "common/target_pb.js"),
      package: "laborato.common.target",
    },
    {
      path: path.join(GENERATED_DIR, "operator_pb.js"),
      package: "laborato.mesh.operator.v1",
    },
    {
      path: path.join(GENERATED_DIR, "user_service_pb.js"),
      package: "laborato.operator.service",
    },
    {
      path: path.join(GENERATED_DIR, "agent_category_service_pb.js"),
      package: "laborato.operator.service",
    },
    {
      path: path.join(GENERATED_DIR, "mesh_pb.js"),
      package: "laborato.mesh",
    },
    {
      path: path.join(GENERATED_DIR, "mesh/user_service_pb.js"),
      package: "laborato.mesh.service",
    },
  ];

  let success = true;

  files.forEach((fileInfo) => {
    if (fs.existsSync(fileInfo.path)) {
      if (!processProtoFile(fileInfo.path, fileInfo.package)) {
        success = false;
      }
    } else {
      console.log(
        `пункт ${path.relative(GENERATED_DIR, fileInfo.path)} (не найден)`,
      );
    }
  });

  if (success) {
    console.log("постобработка успешно!");
  } else {
    console.error("постобработка ошибками");
    process.exit(1);
  }
}
main();
