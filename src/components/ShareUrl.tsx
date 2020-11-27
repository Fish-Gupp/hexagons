import React, { useRef } from 'react';
import { Input } from 'antd';
import { SnippetsOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const ShareUrl = (): JSX.Element => {
  const inputRef = useRef<Input>(null);

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.select();
    document.execCommand('copy');
    inputRef.current.blur();
    toast('Copied to clipboard!');
  };

  return (
    <div onClick={handleClick}>
      <Input
        ref={inputRef}
        size="large"
        value={window.location.href}
        addonAfter={<SnippetsOutlined />}
      />
    </div>
  );
};

export default ShareUrl;
