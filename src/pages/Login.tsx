/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import type { LoginInputs } from "../types";
import { ClipLoader } from "react-spinners";
import { signIn } from "../services/auth";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const [isViewPassword, setIsViewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loginSchema = yup.object({
    email: yup
      .string()
      .email("This email is not valid")
      .required("Email is required"),
    password: yup
      .string()
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
        message:
          "Password must have at least 6 characters, one symbol, one number, and one uppercase letter.",
      }),
  });
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(loginSchema) as Resolver<LoginInputs, any>,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    await signIn({
      email: data.email,
      password: data.password,
      dispatch,
      setLoading: setIsLoading,
    });
  };

  return (
    <main
      className={`w-full h-full px-[2%] py-[15px] flex flex-col items-center justify-center gap-[20px]`}
    >
      <h3 className={`text-center font-[800] text-[24px] text-[#000]`}>
        Sign in into your account
      </h3>
      <div
        className={`w-[40%] h-[55vh] flex flex-col overflow-y-scroll rounded-[10px] no-scrollbar bg-[#fff] drop-shadow-xl px-[2%] py-[3%] gap-[28px]`}
      >
        <div className={`flex flex-col w-full items-start`}>
          <input
            {...register("email", { required: true })}
            type="text"
            className={`w-full px-[12px] py-[10px] rounded-[10px] border-[#00000066] border-solid border-[1px] outline-none`}
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-400 text-[12px] ml-[10px]">
              {errors?.email?.message}
            </span>
          )}
        </div>
        <div className={`flex flex-col w-full items-start relative`}>
          <input
            {...register("password", { required: true })}
            type={isViewPassword ? "text" : "password"}
            className={`w-full px-[12px] py-[10px] rounded-[10px] border-[#00000066] border-solid border-[1px] outline-none`}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-red-400 text-[12px] ml-[10px]">
              {errors?.password?.message}
            </span>
          )}

          {isViewPassword ? (
            <IconEyeClosed
              className={`w-[28px] h-[28px] absolute top-[8px] right-[10px]`}
              onClick={() => setIsViewPassword((prev) => !prev)}
            />
          ) : (
            <IconEye
              className={`w-[28px] h-[28px] absolute top-[8px] right-[10px]`}
              onClick={() => setIsViewPassword((prev) => !prev)}
            />
          )}
        </div>

        <button
          className={`bg-blue-500 text-[#fff] text-[15px] font-[500] py-[13px] rounded-[10px] mt-[15px]`}
          onClick={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <ClipLoader size={25} color={"#fff"} loading={isLoading} />
          ) : (
            "Login"
          )}
        </button>

        <p className={`text-center text-[12px]`}>
          Don't have an account?{" "}
          <span
            className={`underline text-blue-500 cursor-pointer`}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </main>
  );
};

export default Login;
