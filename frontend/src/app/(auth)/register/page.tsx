"use client"
import Link from "next/link";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {registerUser} from "@/services/auth.service"
import {zodResolver} from "@hookform/resolvers/zod";
import {schema} from "@/validations/register.validation";

export default function Page() {


    //mutations
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: async (data) => {
            console.log('data', data)
            alert("register done !")
            // router.push('/dashboard');
        },
        onError: async (error) => {
            console.log(error)

        }
    })
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        resolver: zodResolver(schema)

    })
    console.log('errors', errors)

    const onSubmit = (data: any) => {
        console.log(data);
        const {name, email, password} = data;
        mutation.mutate({
            email,
            password, name,
        })
    }

    return <div
        className={"flex flex-col  row-start-2 items-center justify-center min-h-screen p-8 pb-20 gap-4 sm:p-20"}>
        <h1>Hello, Register user!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col justify-center align-center gap-y-2"}>

            <input
                className={"p-2 w-[400] rounded-md border-2"}
                placeholder={"Enter your name"}
                type="text"
                {...register("name", {required: {value: true, message: "name is required!"}, max: 50, min: 3})}
            />
            {errors.name && <p className="text-red-600 text-sm">{errors?.name?.message}</p>}

            <input
                className={"p-2 w-[400] rounded-md border-2"}
                placeholder={"Enter your email"}
                type="email"
                {...register("email", {required: {value: true, message: "email is required!"}})}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors?.email?.message}</p>}
            <input
                className={"p-2 w-[400] rounded-md border-2"}
                placeholder={"Enter your password"}
                type="password"
                {...register("password", {required: {value: true, message: "password is required!"},})}
            />
            {errors.password && <p className="text-red-600 text-sm">{errors?.password?.message}</p>}
            <input
                className={"p-2 w-[400] rounded-md border-2"}
                placeholder={"Re enter your password"}
                type="password"
                {...register("confirmPassword", {required: true})}
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors?.confirmPassword?.message}</p>}
            <button className={"bg-blue-500 text-white rounded-md px-4 py-2 font-bold cursor-pointer"}
                    type={"submit"} disabled={mutation.isPending}> {mutation.isPending ? 'Registering...' : 'Register'}
            </button>
        </form>
        <h4>If already have an account?</h4>
        <button className={"bg-blue-500 text-white rounded-md px-4 py-2 font-bold cursor-pointer"}><Link
            href="/login">Login</Link>
        </button>
    </div>
}