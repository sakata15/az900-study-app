import XLSX from "xlsx";
import fs from "fs";

const workbook = XLSX.readFile("./AZ900.xlsx");

const questions = [];

const targetSheets = [
  "演習テスト1",
  "演習テスト２",
  "演習テスト３",
];

targetSheets.forEach((sheetName) => {
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
  });

  let questionText = "";

  rows.forEach((row) => {
    // 問題開始
    if (
      row[0] &&
      String(row[0]).startsWith("問題")
    ) {
      questionText = "";
      return;
    }

    // 問題文
    if (row[1]) {
      questionText += row[1] + " ";
    }

    // A. が出たら答え
    if (row[2] === "A." && row[3]) {
      questions.push({
        question: questionText.trim(),
        answer: row[3],
      });

      questionText = "";
    }
  });
});

fs.writeFileSync(
  "./src/questions.json",
  JSON.stringify(questions, null, 2),
  "utf8"
);

console.log(
  `${questions.length}問を生成しました`
);