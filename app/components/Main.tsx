import React from 'react';

interface MainProps {
  params: {
    click_email: string;
    click_type: string;
  };
}

const Main: React.FC<MainProps> = ({ params }) => {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>Email: {params.click_email}</p>
      <p>Click Type: {params.click_type}</p>
    </div>
  );
};

export default Main;
