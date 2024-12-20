import React from "react";
import { Table } from "antd";
import { ContractType } from "../types/type";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import agreementStore from "../store/AgreementStore";

interface TableCustomProps {
  contracts: ContractType[];
  total: number;
  columns: TableColumnsType<ContractType>;
  loading: boolean;
}

const TableCustom: React.FC<TableCustomProps> = ({
  contracts,
  total,
  columns,
  loading,
}) => {
  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current && pagination.pageSize) {
      agreementStore.setPagination(pagination.current, pagination.pageSize);
    }
  };

  return (
    <>
      <Table<ContractType>
        columns={columns}
        loading={loading}
        dataSource={contracts}
        pagination={{
          current: agreementStore.current,
          pageSize: agreementStore.pageSize,
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
