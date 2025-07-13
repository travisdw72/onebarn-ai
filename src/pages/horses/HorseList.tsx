import React from "react";
import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Tag, Avatar, Typography, Card, Statistic, Row, Col } from "antd";
import { useGetIdentity, usePermissions } from "@refinedev/core";
import { brandConfig } from "../../config/brandConfig";

const { Title, Text } = Typography;

// ============================================================================
// HORSE LIST PAGE - REFINE + LOCALSTORAGE INTEGRATION
// ============================================================================

export const HorseList: React.FC = () => {
  // Get user identity and permissions for RBAC
  const { data: identity } = useGetIdentity<any>();
  const { data: permissions } = usePermissions();

  // Refine's useTable hook with our localStorage provider
  const { tableProps, searchFormProps } = useTable({
    resource: "horses",
    // Apply tenant filtering automatically
    meta: {
      tenantId: (identity as any)?.tenantId,
    },
    // Default sorting
    sorters: {
      initial: [
        {
          field: "name",
          order: "asc",
        },
      ],
    },
    // Pagination
    pagination: {
      pageSize: 10,
    },
  });

  // Define columns based on user role (following our RBAC architecture)
  const getColumns = () => {
    const baseColumns = [
      {
        title: "Horse",
        dataIndex: "name",
        key: "name",
        render: (name: string, record: any) => (
          <Space>
            <Avatar 
              size="large" 
                             style={{ 
                 backgroundColor: brandConfig.colors.stableMahogany,
                 color: brandConfig.colors.arenaSand 
               }}
            >
              🐎
            </Avatar>
            <div>
              <Text strong style={{ color: brandConfig.colors.stableMahogany }}>
                {name}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeSm }}>
                {record.breed} • {record.age} years
              </Text>
            </div>
          </Space>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
                     <Tag 
             color={status === "active" ? brandConfig.colors.hunterGreen : brandConfig.colors.alertAmber}
             style={{ 
               borderRadius: brandConfig.layout.borderRadius,
               fontWeight: brandConfig.typography.weightMedium,
             }}
           >
            {status?.toUpperCase()}
          </Tag>
        ),
      },
    ];

    // Role-specific columns following our RBAC configuration
    if (identity?.role === "client") {
      return [
        ...baseColumns,
        {
          title: "Training Progress",
          dataIndex: "trainingProgress",
          key: "trainingProgress",
          render: (progress: number) => (
            <div style={{ width: 100 }}>
              <Text strong style={{ color: brandConfig.colors.hunterGreen }}>
                {progress || 0}%
              </Text>
              <div 
                style={{
                  width: '100%',
                  height: 4,
                  backgroundColor: brandConfig.colors.arenaSand,
                  borderRadius: 2,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: `${progress || 0}%`,
                    height: '100%',
                    backgroundColor: brandConfig.colors.hunterGreen,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          title: "Next Session",
          dataIndex: "nextSessionDate",
          key: "nextSessionDate",
          render: (date: string) => (
            <Text style={{ color: brandConfig.colors.stableMahogany }}>
              {date ? new Date(date).toLocaleDateString() : "Not scheduled"}
            </Text>
          ),
        },
      ];
    }

    if (identity?.role === "employee" || identity?.role === "admin") {
      return [
        ...baseColumns,
        {
          title: "Owner",
          dataIndex: "ownerId",
          key: "ownerId",
          render: (ownerId: string) => (
            <Text style={{ color: brandConfig.colors.stableMahogany }}>
              {ownerId || "Unassigned"}
            </Text>
          ),
        },
        {
          title: "Health Status",
          dataIndex: "healthStatus",
          key: "healthStatus",
          render: (status: string) => {
                         const colors = {
               excellent: brandConfig.colors.hunterGreen,
               good: brandConfig.colors.infoBlue,
               fair: brandConfig.colors.alertAmber,
               poor: brandConfig.colors.errorRed,
             };
             return (
               <Tag 
                 color={colors[status as keyof typeof colors] || brandConfig.colors.sterlingSilver}
                 style={{ borderRadius: brandConfig.layout.borderRadius }}
               >
                {status?.toUpperCase() || "UNKNOWN"}
              </Tag>
            );
          },
        },
      ];
    }

    return baseColumns;
  };

  // Actions column with permission checks
  const actionsColumn = {
    title: "Actions",
    dataIndex: "actions",
    render: (_: any, record: any) => (
      <Space size="small">
        <ShowButton hideText size="small" recordItemId={record.id} />
        {permissions?.includes("horses:write") && (
          <EditButton hideText size="small" recordItemId={record.id} />
        )}
        {permissions?.includes("horses:delete") && identity?.role === "admin" && (
          <DeleteButton hideText size="small" recordItemId={record.id} />
        )}
      </Space>
    ),
  };

  const columns = [...getColumns(), actionsColumn];

  // Summary statistics
  const getSummaryStats = () => {
    const data = tableProps.dataSource || [];
    return {
      total: data.length,
      active: data.filter((horse: any) => horse.status === "active").length,
      avgProgress: data.length > 0 
        ? Math.round(data.reduce((sum: number, horse: any) => sum + (horse.trainingProgress || 0), 0) / data.length)
        : 0,
    };
  };

  const stats = getSummaryStats();

  return (
    <div style={{ padding: brandConfig.spacing.lg }}>
      {/* Page Header */}
      <div style={{ marginBottom: brandConfig.spacing.xl }}>
        <Title 
          level={2} 
          style={{ 
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontDisplay,
            marginBottom: brandConfig.spacing.sm,
          }}
        >
          🐎 Horse Management
        </Title>
        <Text 
          type="secondary" 
          style={{ 
            fontSize: brandConfig.typography.fontSizeLg,
            color: brandConfig.colors.weatheredWood,
          }}
        >
          Manage your horses, track training progress, and monitor health status
        </Text>
      </div>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: brandConfig.spacing.xl }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Horses"
              value={stats.total}
              valueStyle={{ color: brandConfig.colors.stableMahogany }}
              prefix="🐎"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Horses"
              value={stats.active}
              valueStyle={{ color: brandConfig.colors.hunterGreen }}
              prefix="✅"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Avg Training Progress"
              value={stats.avgProgress}
              suffix="%"
              valueStyle={{ color: brandConfig.colors.skyBlue }}
              prefix="📈"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Data Table */}
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {permissions?.includes("horses:write") && <CreateButton />}
            {defaultButtons}
          </>
        )}
        title={
          <Text 
            style={{ 
              fontSize: brandConfig.typography.fontSizeXl,
              fontWeight: brandConfig.typography.weightBold,
              color: brandConfig.colors.stableMahogany,
            }}
          >
            All Horses ({stats.total})
          </Text>
        }
      >
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          size="middle"
          style={{
            backgroundColor: brandConfig.colors.barnWhite,
            borderRadius: brandConfig.layout.borderRadius,
          }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} horses`,
            style: {
              marginTop: brandConfig.spacing.lg,
            },
          }}
        />
      </List>

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card 
          size="small" 
          style={{ 
            marginTop: brandConfig.spacing.lg,
            backgroundColor: brandConfig.colors.arenaSand,
            border: `1px solid ${brandConfig.colors.stableMahogany}`,
          }}
        >
          <Text 
            type="secondary" 
            style={{ fontSize: brandConfig.typography.fontSizeSm }}
          >
            🏗️ <strong>Dev Info:</strong> Using localStorage data provider • 
            User: {identity?.role} • 
            Tenant: {identity?.tenantId} • 
            Permissions: {permissions?.join(", ")}
          </Text>
        </Card>
      )}
    </div>
  );
}; 