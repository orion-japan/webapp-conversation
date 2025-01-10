import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const App = () => {
  const router = useRouter();

  const [params, setParams] = useState<any>({
    click_email: '',
    click_type: '',
  });

  useEffect(() => {
    const { click_email, click_type } = router.query;

    // クエリパラメーターをデコードして設定
    setParams({
      click_email: click_email || '',
      click_type: click_type || '',
    });
  }, [router.query]);

  return (
    <div>
      <h1>クエリパラメーター取得結果</h1>
      <p>Email: {params.click_email || 'N/A'}</p>
      <p>Type: {params.click_type || 'N/A'}</p>
    </div>
  );
};

export default App;
