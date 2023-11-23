import { Button } from 'antd';

type eventType = () => void;

interface IBtnSignIn {
  isLoading: boolean;
  title?: string;
}

interface IBtnNotYou {
  event: eventType;
  title?: string;
}

export const BtnSignIn = ({ isLoading, title }: IBtnSignIn) => {
  return (
    <Button
      type="primary"
      size="large"
      loading={isLoading}
      style={{ marginTop: 20 }}
      htmlType="submit"
      shape="round"
      block
    >
      {title ? title : 'Sign in'}
    </Button>
  );
};

export const BtnNotYou = ({ event, title }: IBtnNotYou) => {
  return (
    <Button
      type="text"
      size="small"
      style={{ marginTop: 5 }}
      htmlType="button"
      shape="round"
      block
      onClick={() => event()}
    >
      {title ? title : 'Not you?'}
    </Button>
  );
};
