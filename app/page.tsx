"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState({
    click_email: "",
    click_type: "",
  });

  useEffect(() => {
    const click_email = searchParams?.get("click_email") || "";
    const click_type = searchParams?.get("click_type") || "";

    // 状態を更新
    setParams({ click_email, click_type });

    // extract_parameters 関数の呼び出し
    extractParameters(click_email, click_type);
  }, [searchParams]);

  const extractParameters = (email, type) => {
    const parameters = {
      click_email: email,
      click_type: type,
    };

    console.log("Calling extract_parameters with:", parameters);

    // 実際の `extract_parameters` 呼び出し
    callExtractParameters(parameters);
  };

  const callExtractParameters = (parameters) => {
    console.log("Parameters to be sent:", parameters);
    // 必要に応じてシステムに統合
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
