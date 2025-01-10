const extractParameters = (query) => {
  const click_email = query.click_email || "";
  const click_type = query.click_type || "";

  // 必要なデータを整形して関数に渡す
  return {
    function: {
      name: "extract_parameters",
      arguments: {
        click_email: click_email,
        click_type: click_type,
      },
    },
  };
};

// クエリからデータを抽出
const query = {
  click_email: "test@example.com",
  click_type: "free",
};

// 関数呼び出し例
const result = extractParameters(query);
console.log(result);
