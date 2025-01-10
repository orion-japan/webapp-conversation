import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const App = () => {
  const router = useRouter();
  const [params, setParams] = useState({
    click_email: "No email provided", // デフォルト値
    click_type: "No type provided",   // デフォルト値
  });

  useEffect(() => {
    const { click_email, click_type } = router.query;

    setParams({
      click_email: click_email || "No email provided",
      click_type: click_type || "No type provided",
    });
  }, [router.query]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome!</h1>
      <p>Email: {params.click_email}</p>
      <p>Click Type: {params.click_type}</p>
    </div>
  );
};

export default App;
