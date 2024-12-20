import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import NT from "../assets/Images/NT_img.png";
import Logo from "../assets/Images/LOGO Najot Ta'lim.svg";
import toast, { Toaster } from "react-hot-toast";
import { useAxios } from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import agreementStore from "../store/AgreementStore";

type FieldType = {
  login?: string;
  password?: string;
};

const Login = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      agreementStore.setIsLoading(true);
      const response = await useAxios().post("/api/staff/auth/sign-in", values);
      if (response) {
        toast.success("Tizimga kirildi!");
        localStorage.setItem(
          "token",
          JSON.stringify(response.data.data.accessToken)
        );
        navigate("/agreement");
      }
    } catch (error) {
      toast.error("Parol yoki loginda xatolik");
    } finally {
      agreementStore.setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex">
        <img
          className="h-[100vh] w-[50%] object-cover"
          src={NT}
          alt="NT photo"
          width={"50%"}
          height={"100%"}
        />
        <div className="pl-[65px]">
          <img
            className="h-[41px] w-[202px] mt-[60px] mb-[130px]"
            src={Logo}
            alt="Logo"
            width={202}
            height={41}
          />
          <h2 className="text-[32px] leading-[48px] mb-[32px] pl-[16px] font-semibold">
            Tizimga kirish
          </h2>
          <Form
            name="basic"
            layout="vertical"
            className="w-[380px] pl-[16px]"
            initialValues={{ layout: "vertical" }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Login"
              name="login"
              className="font-semibold text-[14px] leading-[21px] "
              rules={[{ required: true, message: "Login kiriting!" }]}
            >
              <Input
                size="large"
                className="placeholder:!font-normal"
                placeholder="Loginni kiriting"
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Parol"
              name="password"
              className="font-semibold text-[14px] leading-[21px] "
              rules={[{ required: true, message: "Parol kiriting!" }]}
            >
              <Input.Password
                size="large"
                style={{ fontWeight: "normal" }}
                placeholder="Parolni kiriting"
              />
            </Form.Item>
            <Form.Item>
              <Button
                loading={agreementStore.loading}
                type="primary"
                size="large"
                className="w-full bg-[#0EB182] hover:!bg-[#20ca9a]"
                htmlType="submit"
              >
                Kirish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
