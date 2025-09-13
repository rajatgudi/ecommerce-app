"use client"

import Link from "next/link";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {resetPassword} from "@/services/auth.sevices";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {schema} from "@/validations/reset-password.validations";

export default function Page() {
    const token = "--------------"
    //mutations
    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: async (data) => {
            console.log('data', data)
            alert("password reset successfully !")
            // router.push('/dashboard');
        },
        onError: async (error) => {
            console.log(error)

        }
    })
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        resolver: zodResolver(schema)

    })
    const handleResetPassword = (data: any) => {
        console.log(data);
        const {password} = data;
        mutation.mutate({
            token, password

        })
    }
    return (<div
        className={"flex flex-col  row-start-2 items-center justify-center min-h-screen p-8 pb-20 gap-4 sm:p-20"}>
        <h1>Hello, Please reset your password!</h1>
        <form onSubmit={handleSubmit(handleResetPassword)}
              className={"flex flex-col justify-center align-center gap-y-2"}>
            <input
                className={"p-2 w-[400] rounded-md border-2"}
                placeholder={"Enter new password"}
                type="password"
                {...register("password", {required: {value: true, message: "password is required!"},})}
            />
            {errors.password && <p className="text-red-600 text-sm">{errors?.password?.message}</p>}
            <input
                className={"p-2 w-[400] rounded-md border-2"}
                placeholder={"confirm password"}
                type="password"
                {...register("confirmPassword", {required: {value: true, message: "confirm Password is required!"},})}
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors?.confirmPassword?.message}</p>}
            <button className={"bg-blue-500 text-white rounded-md px-4 py-2 font-bold cursor-pointer"}
                    type={"submit"}
                    disabled={mutation.isPending}> {mutation.isPending ? 'Resetting...' : 'Reset Password'}
            </button>

        </form>
        <button type={"button"} className={"cursor-pointer font-bold hover:opacity-75"}>forgot password?</button>
        <h4>if dont have an account ?</h4>
        <button className={"bg-blue-500 text-white rounded-md px-4 py-2 font-bold cursor-pointer"}>
            <Link href="/register">Register</Link>
        </button>
    </div>)
}