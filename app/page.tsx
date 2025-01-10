import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const App = () => {
  const router = useRouter();
  const [params, setParams] = useState({
    click_email: "No email provided", // デフォルト値
    click_type: "No type provided",   // デフォルト値
  });

  useEffect(() => {
    const { click_email, click_id } = router.query;

    // クエリパラメーターを設定
    setParams({
      click_email: click_email || "No email provided",
      click_type: click_id || "No type provided", // click_id を click_type として処理
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
