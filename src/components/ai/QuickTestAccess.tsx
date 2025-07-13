/**
 * 🚀 Quick Access to Overnight AI Testing
 * Simple component that can be added to any page for immediate testing access
 */

import React, { useState } from 'react';
import { Button, Modal, Drawer } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { OvernightTestRunner } from './OvernightTestRunner';

export const QuickTestAccess: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showTestRunner = () => {
    setIsVisible(true);
  };

  const hideTestRunner = () => {
    setIsVisible(false);
  };

  return (
    <>
      {/* Quick Access Button */}
      <Button
        type="primary"
        icon={<ExperimentOutlined />}
        onClick={showTestRunner}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '50px',
          padding: '8px 16px',
          height: 'auto'
        }}
        size="large"
      >
        🌙 Overnight AI Test
      </Button>

      {/* Full-Screen Test Runner */}
      <Drawer
        title="🌙 Overnight AI Token Optimization Testing"
        placement="right"
        size="large"
        open={isVisible}
        onClose={hideTestRunner}
        width="90%"
        style={{ minWidth: '800px' }}
        bodyStyle={{ padding: 0 }}
      >
        <OvernightTestRunner />
      </Drawer>
    </>
  );
};

export default QuickTestAccess; 