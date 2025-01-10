import React from 'react';

interface MainProps {
  params: {
    click_email: string;
    click_type: string;
  };
}

const Main: React.FC<MainProps> = ({ params }) => {
  const { click_email, click_type } = params;

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Email: {click_email}</p>
      <p>Click Type: {click_type}</p>
    </div>
  );
};

export default Main;

