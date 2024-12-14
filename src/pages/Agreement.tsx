import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import TableCustom from "../components/TableCustom";
import { observer } from "mobx-react-lite";
import agreementStore from "../store/AgreementStore";
import useDebounce from "../hooks/useDebounce";
import CustomModal from "../components/CustomModal";

const Agreement = observer(() => {
  const [search, setSearch] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const SearchTerm = useDebounce(search, 800);

  useEffect(() => {
    agreementStore.fetchContracts();
    agreementStore.setSearch(SearchTerm)
  }, [SearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="mx-[25px] mt-[25px] rounded-t-[12px] bg-[#FBFBFB] p-[24px] flex items-center justify-between border-x-[2px] border-t-[2px] border-[#EDEDED]">
        <Input
          placeholder="Qidiruv"
          variant="borderless"
          className="placeholder:text-[#667085] text-[19px] leading-[29px]"
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
          className="bg-[#0EB182] hover:!bg-[#20ca9a]"
          onClick={() => setIsModalOpen(true)}
        >
          Qo‘shish
        </Button>
      </div>
      <div className="mx-[25px] mb-[75px] rounded-b-[12px] border-x-[2px] border-b-[2px] border-[#EDEDED] px-[24px]">
        <TableCustom
          contracts={agreementStore.contracts}
          fetchContracts={agreementStore.setPagination}
          total={agreementStore.total}
        />
      </div>
      <CustomModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
});

export default Agreement;
