import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const App = () => {
  const router = useRouter();

  // 初期状態
  const [params, setParams] = useState<any>({
    click_email: '',
    click_type: '',
  });

  useEffect(() => {
    // クエリパラメーターを取得
    const { click_email, click_type } = router.query;

    setParams({
      click_email: click_email || '', // デフォルト値を空文字に設定
      click_type: click_type || '', // デフォルト値を空文字に設定
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
