"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 修正: next/router → next/navigation

const App = () => {
  const router = useRouter();
  const [params, setParams] = useState({
    click_email: "",
    click_type: "",
  });

  useEffect(() => {
    console.log('Query Parameters:', router.query); // デバッグ用

    const { click_email, click_id } = router.query;

    setParams({
      click_email: click_email || "No email provided",
      click_type: click_id || "No type provided",
    });
  }, [router.query]);

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>Welcome!</h1>
      <p>Email: {params.click_email}</p>
      <p>Click Type: {params.click_type}</p>
    </div>
  );
};

export default App;
