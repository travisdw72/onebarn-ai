/**
 * 🌙 Overnight AI Testing Page
 * Page wrapper for the Overnight AI Optimization Test Runner
 */

import React from 'react';
import { Layout, Typography } from 'antd';
import { OvernightTestRunner } from '../../components/ai/OvernightTestRunner';

const { Content } = Layout;
const { Title } = Typography;

export const OvernightTestPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
          <Title level={1} style={{ textAlign: 'center', marginBottom: '32px' }}>
            🌙 AI Token Optimization - Overnight Testing
          </Title>
          
          <OvernightTestRunner />
        </div>
      </Content>
    </Layout>
  );
};

export default OvernightTestPage; 