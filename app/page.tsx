"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState({
    click_email: "No email provided",
    click_type: "No type provided",
  });

  useEffect(() => {
    // クエリパラメーターを取得
    const click_email = searchParams?.get("click_email") || "No email provided";
    const click_type = searchParams?.get("click_type") || "No type provided";

    // 状態を更新
    setParams({ click_email, click_type });

    // extract_parameters を呼び出し
    extractParameters(click_email, click_type);
  }, [searchParams]);

  const extractParameters = (email, type) => {
    const parameters = {
      click_email: email,
      click_type: type,
    };

    console.log("Extracting parameters:", parameters);

    // システム関数（モック例）
    // replace this with your actual function call if necessary
    callExtractParameters(parameters);
  };

  const callExtractParameters = (parameters) => {
    console.log("Calling extract_parameters with:", parameters);
    // 実際の処理が必要な場合はここに書く
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Welcome!</h1>
      <p>Email: {params.click_email}</p>
      <p>Click Type: {params.click_type}</p>
    </div>
  );
};

export default Page;
