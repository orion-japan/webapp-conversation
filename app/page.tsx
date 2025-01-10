import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import type { IMainProps } from '@/app/components';
import Main from '@/app/components';

const App: FC<IMainProps> = () => {
  const router = useRouter();

  // クエリパラメーターを保持する状態
  const [params, setParams] = useState<any>({
    click_email: null,
    click_type: null,
  });

  useEffect(() => {
    // クエリパラメーターを取得して状態にセット
    const { click_email, click_type } = router.query;

    setParams((prevParams: any) => ({
      ...prevParams,
      click_email: click_email || "default@example.com", // デフォルト値を設定
      click_type: click_type || "default_type",
    }));
  }, [router.query]);

  return <Main params={params} />;
};

export default React.memo(App);
