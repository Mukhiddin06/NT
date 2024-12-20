import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popover } from "antd";
import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { TableColumnsType } from "antd";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
import TableCustom from "../components/TableCustom";
import agreementStore from "../store/AgreementStore";
import useDebounce from "../hooks/useDebounce";
import CustomModal from "../components/CustomModal";
import { ContractType } from "../types/type";
import { Toaster } from "react-hot-toast";

const Agreement = observer(() => {
  const SearchTerm = useDebounce(agreementStore.search, 800);
  useEffect(() => {
    agreementStore.setSearch(SearchTerm);
    agreementStore.getAllContracts();
  }, [SearchTerm, agreementStore.current, agreementStore.pageSize]);

  useEffect(() => {
    agreementStore.getCourses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    agreementStore.setSearch(e.target.value);
  };

  function handleClickMore(contract: ContractType) {
    agreementStore.setEditContract(contract);
    agreementStore.setIsModalOpen(true);
  }

  function handleCreateOpenModal() {
    agreementStore.setIsModalOpen(true);
  }

  const columns: TableColumnsType<ContractType> = useMemo(
    () => [
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
            arrow={false}
            content={
              <Button
                type="text"
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
    ],
    []
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-[25px] mt-[25px] rounded-t-[12px] bg-[#FBFBFB] p-[24px] flex items-center justify-between border-x-[2px] border-t-[2px] border-[#EDEDED]">
        <Input
          placeholder="Qidiruv"
          variant="borderless"
          className="placeholder:text-[#667085] text-[19px] leading-[29px] w-[20%]"
          prefix={
            <SearchOutlined
              style={{
                color: "#667085",
                paddingRight: "10px",
                scale: "1.2",
                paddingTop: "3px",
              }}
            />
          }
          onChange={handleSearch}
        />
        <Button
          type="primary"
          htmlType="button"
          size="large"
          className="!bg-[#0EB182] hover:!bg-[#20ca9a]"
          onClick={handleCreateOpenModal}
        >
          Qo'shish
        </Button>
      </div>
      <div className="mx-[25px] mb-[75px] rounded-b-[12px] border-x-[2px] border-b-[2px] border-[#EDEDED] px-[24px]">
        <TableCustom
          contracts={agreementStore.allContracts.contracts}
          total={agreementStore.allContracts.total}
          columns={columns}
          loading={agreementStore.loading}
        />
      </div>
      {agreementStore.isModalOpen && <CustomModal />}
    </>
  );
});

export default Agreement;
