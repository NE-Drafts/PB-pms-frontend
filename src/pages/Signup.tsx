/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import type { SignupInputs } from "../types";
import { signUp } from "../services/auth";
import { ClipLoader } from "react-spinners";

const Signup = () => {
  const navigate = useNavigate();
  const [isViewPassword, setIsViewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signupSchema = yup.object({
    names: yup.string().min(3).required("Names are required"),
    email: yup
      .string()
      .email("This email is not valid")
      .required("Email is required"),
    phone: yup.string().matches(/^(?:\+2507|2507|07)\d{8}$/, {
      message:
        "Phone must start with +2507, 2507, or 07 and be followed by exactly 8 digits.",
    }),
    password: yup
      .string()
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
        message:
          "Password must have at least 6 characters, one symbol, one number, and one uppercase letter.",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInputs>({
    resolver: yupResolver(signupSchema) as Resolver<SignupInputs, any>,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    await signUp({
      names: data.names,
      email: data.email,
      phone: data.phone,
      password: data.password,
      setLoading: setIsLoading,
    });
  };

  return (
    <main
      className={`w-full h-full px-[2%] py-[15px] flex flex-col items-center justify-center gap-[20px]`}
    >
      <h3 className={`text-center font-[800] text-[24px] text-[#000]`}>
        Create account
      </h3>
      <div
        className={`w-[40%] h-[68vh] flex flex-col overflow-y-scroll rounded-[10px] no-scrollbar bg-[#fff] drop-shadow-xl px-[2%] py-[3%] gap-[28px]`}
      >
        <div className={`flex flex-col w-full items-start`}>
          <input
            {...register("names", { required: true })}
            type="text"
            className={`w-full px-[12px] py-[10px] rounded-[10px] border-[#00000066] border-solid border-[1px] outline-none`}
            placeholder="Write your full names"
          />
          {errors.names && (
            <span className="text-red-400 text-[12px] ml-[10px]">
              {errors?.names?.message}
            </span>
          )}
        </div>
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
        <div className={`flex flex-col w-full items-start`}>
          <input
            {...register("phone", { required: true })}
            type="tel"
            className={`w-full px-[12px] py-[10px] rounded-[10px] border-[#00000066] border-solid border-[1px] outline-none`}
            placeholder="Phone (ex: +250789764423)"
          />
          {errors.phone && (
            <span className="text-red-400 text-[12px] ml-[10px]">
              {errors?.phone?.message}
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
            <ClipLoader size={25} color="#fff" loading={isLoading} />
          ) : (
            "Sign Up"
          )}
        </button>

        <p className={`text-center text-[12px]`}>
          Already have an account?{" "}
          <span
            className={`underline text-blue-500 cursor-pointer`}
            onClick={() => navigate("/")}
          >
            Sign In
          </span>
        </p>
      </div>
    </main>
  );
};

export default Signup;
