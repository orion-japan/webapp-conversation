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

    // 状態の更新
    setParameters({ click_email: email, click_type: type });

    // extract_parameters 関数の呼び出し
    callExtractParameters(email, type);
  }, [searchParams]);

  const callExtractParameters = (email, type) => {
    const params = {
      click_email: email,
      click_type: type,
    };

    console.log("Calling extract_parameters with:", params);

    // 実際の関数呼び出しをここに追加（必要に応じてAPI通信など）
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
