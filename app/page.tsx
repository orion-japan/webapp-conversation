function extractParameters(context) {
  const result = {
    click_email: "",
    click_type: "",
  };

  // ここでコンテキストを解析して値を抽出
  if (context.includes("click_email")) {
    result.click_email = "extracted_email@example.com"; // 抽出ロジックを実装
  }

  if (context.includes("click_type")) {
    result.click_type = "extracted_type"; // 抽出ロジックを実装
  }

  return result;
}

// テストデータ
const context = "click_email=extracted_email@example.com&click_type=extracted_type";
const parameters = extractParameters(context);

console.log(parameters);
/*
{
  click_email: "extracted_email@example.com",
  click_type: "extracted_type"
}
*/
