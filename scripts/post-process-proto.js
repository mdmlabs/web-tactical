const fs = require("node:fs");
const path = require("node:path");

const GENERATED_DIR = path.join(__dirname, "../src/generated");
const TARGET_FILE = path.join(GENERATED_DIR, "operator_pb.js");

console.log(" Постобработка protobuf файлов...");

if (!fs.existsSync(TARGET_FILE)) {
  console.error(` Файл не найден: ${TARGET_FILE}`);
  process.exit(1);
}

let content = fs.readFileSync(TARGET_FILE, "utf8");

// первое: замена комон джиес  импортов на ES6
console.log("Конвертация в ES6 модули...");

// проверяем, есть ли уже ES6 импорты
if (!content.includes("import * as jspb")) {
  const es6Imports = `import * as jspb from "google-protobuf";
import * as google_protobuf_wrappers_pb from "google-protobuf/google/protobuf/wrappers_pb.js";

var goog = jspb;
var global = globalThis;

var proto = {};

proto.google = proto.google || {};
proto.google.protobuf = proto.google.protobuf || {};
goog.object.extend(proto, google_protobuf_wrappers_pb);

if (google_protobuf_wrappers_pb.StringValue) {
  proto.google.protobuf.StringValue = google_protobuf_wrappers_pb.StringValue;
}
if (google_protobuf_wrappers_pb.BoolValue) {
  proto.google.protobuf.BoolValue = google_protobuf_wrappers_pb.BoolValue;
}
if (google_protobuf_wrappers_pb.Int32Value) {
  proto.google.protobuf.Int32Value = google_protobuf_wrappers_pb.Int32Value;
}
if (google_protobuf_wrappers_pb.Int64Value) {
  proto.google.protobuf.Int64Value = google_protobuf_wrappers_pb.Int64Value;
}

proto.laborato = proto.laborato || {};
proto.laborato.mesh = proto.laborato.mesh || {};
proto.laborato.mesh.operator = proto.laborato.mesh.operator || {};
proto.laborato.mesh.operator.v1 = proto.laborato.mesh.operator.v1 || {};

`;

  // вставляем импорты после комментариев заголовка
  content = content.replace(
    /(\/\/ GENERATED CODE -- DO NOT EDIT!\n\/\* eslint-disable \*\/\n\/\/ @ts-nocheck\n\n)/,
    `$1${es6Imports}`,
  );
}

// второе: извлечение всех экспортируемых символов из goog.exportSymbol
console.log("извлечение экспортируемых классов...");

const exportedClasses = new Set();
const exportedEnums = new Set();

// ищем все goog.exportSymbol вызовы (поддерживаем и одинарные и двойные кавычки)
const exportSymbolRegex =
  /goog\.exportSymbol\(['"]proto\.laborato\.mesh\.operator\.v1\.(\w+)['"]/g;
let match;

while ((match = exportSymbolRegex.exec(content)) !== null) {
  const className = match[1];
  exportedClasses.add(className);
}

// также извлекаем enum'ы - они объявлены в конце файла
const enumRegex = /proto\.laborato\.mesh\.operator\.v1\.(\w+) = \{[\s\S]*?\};/g;
const potentialEnums = [];
while ((match = enumRegex.exec(content)) !== null) {
  potentialEnums.push({
    name: match[1],
    content: match[0],
    position: match.index,
  });
}

// фильтруем только настоящие enum'ы (они содержат константы в uppercase)
potentialEnums.forEach(({ name, content: enumContent }) => {
  // Enum должен содержать uppercase ключи и не быть прототипом
  const hasEnumPattern = /[A-Z_]+:\s*\d+/.test(enumContent);
  const isNotPrototype = !/prototype/.test(enumContent);

  if (hasEnumPattern && isNotPrototype && exportedClasses.has(name)) {
    exportedEnums.add(name);
  }
});

console.log(`Найдено классов: ${exportedClasses.size}`);
console.log(`Найдено enum'ов: ${exportedEnums.size}`);

//третье: генерация экспортов
console.log("Генерация экспортов...");

// удаляем старые экспорты если есть
content = content.replace(/\n\/\/ Экспорт для ES модулей[\s\S]*$/, "");
content = content.replace(/\nconst namespace = [\s\S]*$/, "");
content = content.replace(/\nconst isDevMode[\s\S]*$/, "");
content = content.replace(/\nconst operator_pb_exports[\s\S]*$/, "");
content = content.replace(/\nexport default[\s\S]*$/, "");
content = content.replace(/\nexport const [\s\S]*$/, "");

// убедимся что контент заканчивается переносом строки
content = content.trimEnd() + "\n";

// генерируем новый блок экспортов
const exportLines = [];

// namespace экспорт
exportLines.push("const namespace = proto.laborato.mesh.operator.v1;");
exportLines.push("");

// debug режим для проверки классов
exportLines.push("const isDevMode =");
exportLines.push('  typeof process !== "undefined" &&');
exportLines.push("  process.env &&");
exportLines.push('  process.env.NODE_ENV === "development";');
exportLines.push("const isDebugMode =");
exportLines.push("  isDevMode ||");
exportLines.push('  (typeof globalThis.window !== "undefined" &&');
exportLines.push("    globalThis.window &&");
exportLines.push("    globalThis.window.__DEBUG__);");
exportLines.push("if (isDebugMode) {");

// cписок основных request классов для проверки
const requiredClasses = Array.from(exportedClasses).filter(
  (cls) => cls.endsWith("Request") && !cls.includes("Response"),
);

exportLines.push("  const requiredClasses = [");
requiredClasses.forEach((cls, idx) => {
  const comma = idx < requiredClasses.length - 1 ? "," : "";
  exportLines.push(`    "${cls}"${comma}`);
});
exportLines.push("  ];");
exportLines.push("");
exportLines.push(
  "  const missingClasses = requiredClasses.filter((cls) => !namespace[cls]);",
);
exportLines.push("  if (missingClasses.length > 0) {");
exportLines.push(
  '    console.warn("[operator_pb] Missing classes in namespace:", missingClasses);',
);
exportLines.push("  } else {");
exportLines.push("    // console.log(");
exportLines.push(
  '    //   "[operator_pb] All required classes are available in namespace",',
);
exportLines.push("    // );");
exportLines.push("  }");
exportLines.push("}");
exportLines.push("");

// default экспорт
exportLines.push("const operator_pb_exports = namespace;");
exportLines.push("");
exportLines.push("export default operator_pb_exports;");
exportLines.push("");

// именованные экспорты для всех классов
const sortedClasses = Array.from(exportedClasses).sort();
sortedClasses.forEach((className) => {
  exportLines.push(
    `export const ${className} = operator_pb_exports.${className};`,
  );
});

// добавляем экспорты в файл
const exportsBlock = "\n" + exportLines.join("\n") + "\n";
fs.writeFileSync(TARGET_FILE, content + exportsBlock, "utf8");

console.log("Постобработка завершена успешно!");
console.log(`Обработан файл: ${TARGET_FILE}`);
console.log(`Экспортировано классов: ${exportedClasses.size}`);
