import React, { useState } from "react";
import { Table } from "antd";
import { ContractType } from "../types/type";
import type { TableColumnsType, TablePaginationConfig } from "antd";

interface TableCustomProps {
  contracts: ContractType[];
  fetchContracts: (page: number, perPage: number) => void;
  total: number;
  columns: TableColumnsType<ContractType>
  loading: boolean;
}

const TableCustom: React.FC<TableCustomProps> = ({
  contracts,
  fetchContracts,
  total,
  columns,
  loading
}) => {

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });


  const handleTableChange = (paginationInfo: TablePaginationConfig) => {
    const { current, pageSize } = paginationInfo;
    setPagination({ current: current || 1, pageSize: pageSize || 10 });
    fetchContracts(current || 1, pageSize || 10);
  };




  return (
    <>
      <Table<ContractType>
        columns={columns}
        loading={loading}
        dataSource={contracts || []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          showSizeChanger: true,
        }}
        rowKey={"id"}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TableCustom;
