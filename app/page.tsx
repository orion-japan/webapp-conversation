function extractParameters(context) {
  const params = {
    click_email: "",
    click_type: "",
  };

  // 入力データをパース（例: "&" 区切りの場合）
  const pairs = context.split("&");
  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");

    if (key === "click_email" && isValidEmail(value)) {
      params.click_email = value;
    } else if (key === "click_type" && isValidType(value)) {
      params.click_type = value;
    }
  });

  return params;
}

// テスト例
const context = "click_email=test@example.com&click_type=free";
const extractedParams = extractParameters(context);

console.log(extractedParams);
/*
{
  click_email: "test@example.com",
  click_type: "free"
}
*/
