import React, { useState } from "react";
import { Button, Popover, Table } from "antd";
import type { TableColumnsType } from "antd";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
import { ContractType } from "../types/type";
import type { TablePaginationConfig } from "antd";
import CustomModal from "./CustomModal";

interface TableCustomProps {
  contracts: ContractType[];
  fetchContracts: (page: number, perPage: number) => void;
  total: number;
}

const TableCustom: React.FC<TableCustomProps> = ({
  contracts,
  fetchContracts,
  total,
}) => {

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });


  const handleTableChange = (paginationInfo: TablePaginationConfig) => {
    const { current, pageSize } = paginationInfo;
    setPagination({ current: current || 1, pageSize: pageSize || 10 });
    fetchContracts(current || 1, pageSize || 10);
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);

  function handleClickMore(contract: ContractType) {
    setId(contract.id);
    setIsOpen(true);
  }

  const columns: TableColumnsType<ContractType> = [
    { title: "#", dataIndex: "id", key: "id" },
    {
      title: "Nomi",
      dataIndex: "attachment",
      key: "attachment",
      render: (attachment) =>
        attachment ? attachment.origName : "Fayl mavjud emas",
    },
    {
      title: "Kurs",
      dataIndex: "course",
      key: "course",
      render: (course) => (course ? course.name : "Kurs mavjud emas"),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Popover
          title={
            <Button
              type="text"
              size="large"
              className="text-[#667085] text-[16px] leading-[24px] w-full"
              icon={<EditOutlined className="text-[#667085]" />}
              onClick={() => handleClickMore(record)}
            >
              Tahrirlash
            </Button>
          }
          placement="left"
        >
          <Button type="text">
            <MoreOutlined className="scale-[2]" />
          </Button>
        </Popover>
      ),
    },
  ];

  return (
    <>
      <Table<ContractType>
        columns={columns}
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
      <CustomModal isModalOpen={isOpen} setIsModalOpen={setIsOpen} id={id as number}/>
    </>
  );
};

export default TableCustom;
