"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState({
    click_email: "Loading...", // 初期値
    click_type: "Loading...", // 初期値
  });

  useEffect(() => {
    // クエリパラメーターを取得して状態を更新
    const click_email = searchParams?.get("click_email") || "No email provided";
    const click_type = searchParams?.get("click_type") || "No type provided";

    setParams({
      click_email,
      click_type,
    });
  }, [searchParams]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Welcome!</h1>
      <p>Email: {params.click_email}</p>
      <p>Click Type: {params.click_type}</p>
    </div>
  );
};

export default Page;
