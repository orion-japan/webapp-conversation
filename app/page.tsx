"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const [parameters, setParameters] = useState({
    click_email: "",
    click_type: "",
  });

  useEffect(() => {
    // クエリパラメーターの取得
    const email = searchParams?.get("click_email") || "No email provided";
    const type = searchParams?.get("click_type") || "No type provided";

    // パラメーターを状態に保存
    setParameters({ click_email: email, click_type: type });

    // `extract_parameters` 関数の呼び出し
    callExtractParameters(email, type);
  }, [searchParams]);

  const callExtractParameters = (email, type) => {
    // 必要に応じてAPI通信やロジックを追加
    console.log("Extracted Parameters:", { click_email: email, click_type: type });

    // 以下は実際にAPI呼び出しを行う例
    fetch('/api/extract_parameters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ click_email: email, click_type: type }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Server Response:", data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div style={{ textAlign: 'center', margin: '50px' }}>
      <h1>Welcome!</h1>
      <p>Email: {parameters.click_email}</p>
      <p>Click Type: {parameters.click_type}</p>
    </div>
  );
};

export default Page;
