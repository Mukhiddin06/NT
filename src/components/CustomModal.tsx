import React, { useEffect, useMemo } from "react";
import { Button, ButtonProps, Form, Input, Modal, Select, Upload } from "antd";
import { AttachmentType, CourseType, FormValues } from "../types/type";
import { PaperClipOutlined } from "@ant-design/icons";
import agreementStore from "../store/AgreementStore";
import toast from "react-hot-toast";
import { UploadChangeParam } from "antd/es/upload";
import { observer } from "mobx-react-lite";
import { uploadFileAttachment } from "../api/contracts";

const CustomModal: React.FC = () => {
  const [form] = Form.useForm();
  const courses = useMemo(
    () =>
      agreementStore.courses.map((item: CourseType) => ({
        label: item.name,
        value: item.id,
      })),
    []
  );
  const okButtonProps: ButtonProps = useMemo(() => {
    return {
      type: "primary",
      htmlType: "submit",
      className: "bg-[#0EB182] hover:!bg-[#0EB182]/80",
    };
  }, []);
  const cancelBtnProps: ButtonProps = useMemo(() => {
    return {
      htmlType: "reset",
      className: "!text-[#0EB182] hover:!border-[#0EB182]/80",
    };
  }, []);

  useEffect(() => {
    if (agreementStore.editContract) {
      form.setFieldsValue({
        title: agreementStore.editContract.title,
        courseId: agreementStore.editContract.course?.id,
        file: agreementStore.editContract.attachment
          ? [
              {
                uid: "-1",
                name: agreementStore.editContract.attachment.origName,
                status: "done",
                url: agreementStore.editContract.attachment.url,
              },
            ]
          : [],
      });
    }
  }, [agreementStore?.editContract?.id, agreementStore.isModalOpen, form]);

  const handleCancel = () => {
    agreementStore.setIsModalOpen(false);
    agreementStore.setEditContract(null);
    form.resetFields();
  };

  const normFile = (e: UploadChangeParam) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file: File) => {
    const isDocx =
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!isDocx) {
      toast.error("Faqat .docx formatdagi fayllarga ruxsat beriladi!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const onFinish = async (values: FormValues) => {
    try {
      agreementStore.setIsLoading(true);
      let attachment = agreementStore.editContract?.attachment;
      if (values.file[0].originFileObj) {
        const uploadResponse = await uploadFileAttachment(
          values.file[0].originFileObj
        );
        if (uploadResponse.success) {
          const uploadedFile = uploadResponse.data[0];
          attachment = {
            size: uploadedFile.size,
            url: uploadedFile.path,
            origName: uploadedFile.fileName,
          };
        }
      }

      const contractData = {
        title: values.title,
        courseId: values.courseId,
        attachment: attachment as AttachmentType,
      };

      const submitResponse = await agreementStore.handleSubmit(
        contractData,
        agreementStore.editContract?.id
      );

      if (submitResponse?.success) {
        toast.success(
          agreementStore.editContract
            ? "Shartnoma o'zgartirlidi!"
            : "Shartnoma qo'shildi!"
        );
        handleCancel();
        agreementStore.getAllContracts();
      }
    } catch (error) {
      console.error(error);
      toast.error("Xatolik yuz berdi!");
    } finally {
      agreementStore.setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={agreementStore.isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        onClose={handleCancel}
        confirmLoading={agreementStore.loading}
        title={
          agreementStore.editContract
            ? "Shartnoma o'zgartirish"
            : "Shartnoma yaratish"
        }
        okText={agreementStore.editContract ? "O'zgartirish" : "Saqlash"}
        okButtonProps={okButtonProps}
        cancelButtonProps={cancelBtnProps}
        cancelText="Bekor qilish"
      >
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
              options={courses}
            />
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
            <Upload maxCount={1} beforeUpload={beforeUpload}>
              <Button
                size="large"
                icon={<PaperClipOutlined className="text-[#0EB182] text-lg" />}
                type="dashed"
                className="w-full text-[#0EB182] hover:!text-[#0EB182]"
              >
                Fayl biriktiring
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default observer(CustomModal);
