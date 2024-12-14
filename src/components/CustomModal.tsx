import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select, Space, Upload } from "antd";
import { CourseType, ModalType } from "../types/type";
import { PaperClipOutlined } from "@ant-design/icons";
import coursesStore from "../store/CoursesStore";
import agreementStore from "../store/AgreementStore";
import toast, { Toaster } from "react-hot-toast";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { observer } from "mobx-react-lite";

export interface FormValues {
  courseId: string;
  title: string;
  file: UploadFile[];
}

const CustomModal: React.FC<ModalType> = observer(
  ({ isModalOpen, setIsModalOpen, id }) => {
    const [form] = Form.useForm();

    useEffect(() =>  {
      async function fetchContract(){
      if (id) {
       await  agreementStore.fetchGetById(id);
        if (agreementStore.contract) {
          form.setFieldsValue({
            title: agreementStore.contract.title,
            courseId: agreementStore.contract.course.id,
            file: agreementStore.contract.attachment
              ? [
                  {
                    uid: "-1",
                    name: agreementStore.contract.attachment.origName,
                    status: "done",
                    url: agreementStore.contract.attachment.url,
                  },
                ]
              : [],
          });
        }
      }}
      fetchContract()
    }, [id, isModalOpen, form]);
    // console.log(agreementStore.contract);

    useEffect(() => {
      coursesStore.fetchCourses()
    }, [])

    const handleOk = () => {
      setIsModalOpen(false);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const normFile = (e: UploadChangeParam) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    const onFinish = async (values: FormValues) => {

      if (id) {
        agreementStore.setName(values.title);
        agreementStore.setCourse(values.courseId);
        agreementStore.setFiles(values.file);
        await agreementStore.fetchPutContract(id);
      } else {
        agreementStore.setName(values.title);
        agreementStore.setCourse(values.courseId);
        agreementStore.setFiles(values.file);
        await agreementStore.handleCreateSubmit();
      }

      setIsModalOpen(false);
      form.resetFields();
    };

    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <h2 className="font-medium text-[18px] leading-[27px] text-[#0F1826]">
            Shartnoma yaratish
          </h2>
          <Form
            form={form}
            autoComplete="off"
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
            className="mt-[24px]"
          >
            <Form.Item
              label="Kurs"
              name="courseId"
              className="font-semibold text-[14px] leading-[21px] "
              rules={[{ required: true, message: "Kurs Kiriting!" }]}
            >
              <Select
                size="large"
                placeholder="Tanlang"
                style={{ fontWeight: "400" }}
              >
                {coursesStore.coureses.map((item: CourseType) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Nomi"
              name="title"
              className="font-semibold text-[14px] leading-[21px] "
              rules={[{ required: true, message: "Nom Kiriting!" }]}
            >
              <Input
                size="large"
                placeholder="Nom Kiriting"
                style={{ fontWeight: "400" }}
              />
            </Form.Item>
            <Form.Item
              name={"file"}
              valuePropName="fileList"
              rules={[{ required: true, message: "File biriktiring!" }]}
              getValueFromEvent={normFile}
            >
              <Upload
                beforeUpload={(file) => {
                  const isDocx =
                    file.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                  if (!isDocx) {
                    toast.error(
                      "Faqat .docx formatdagi fayllarga ruxsat beriladi!"
                    );
                    return Upload.LIST_IGNORE
                  }
                  return false // Fayl ro'yxatga qo'shilmaydi
                }}
              >
                <Button
                  size="large"
                  icon={
                    <PaperClipOutlined className="text-[#0EB182] text-lg" />
                  }
                  type="dashed"
                  className="w-full text-[#0EB182] hover:!text-[#0EB182]"
                >
                  Fayl biriktiring
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item className="text-end">
              <Space>
                <Button
                  htmlType="reset"
                  size="large"
                  onClick={() => setIsModalOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-[#0EB182] hover:!bg-[#20ca9a]"
                  htmlType="submit"
                >
                  Saqlash
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
);

export default CustomModal;