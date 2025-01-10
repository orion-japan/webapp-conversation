"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState({
    click_email: "No email provided", // 初期値
    click_type: "No type provided",   // 初期値
  });

  useEffect(() => {
    const click_email = searchParams?.get("click_email") || "No email provided";
    const click_type = searchParams?.get("click_type") || "No type provided";

    setParams({ click_email, click_type });

    // `extract_parameters` 関数を呼び出す
    extractParameters(click_email, click_type);
  }, [searchParams]);

  const extractParameters = (email, type) => {
    const parameters = {
      click_email: email,
      click_type: type,
    };

    console.log("Calling extract_parameters with:", parameters);

    // 必要であれば実際の関数呼び出しに置き換える
    callExtractParameters(parameters);
  };

  const callExtractParameters = (parameters) => {
    console.log("Extracted Parameters:", parameters);
    // 実際のシステム統合処理をここに記述
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
