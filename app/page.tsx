"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const [parameters, setParameters] = useState({ click_email: "", click_type: "" });

  useEffect(() => {
    // クエリパラメーターを取得
    const email = searchParams.get("click_email") || "";
    const type = searchParams.get("click_type") || "";

    // 状態を更新
    setParameters({ click_email: email, click_type: type });

    // 確認用ログ
    console.log("Extracted Parameters:", { click_email: email, click_type: type });
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <h1>Welcome!</h1>
      <p>Email: {parameters.click_email}</p>
      <p>Click Type: {parameters.click_type}</p>
    </div>
  );
};

export default Page;
