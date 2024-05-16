"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import CustomInput from "./CustomInput";
import { authFormSchema, cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  checkUserOnboarded,
  getLoggedInUser,
  signIn,
  signUp,
} from "@/lib/actions/user.actions";
import Chimoney from "./Chimoney";
import { revalidatePath } from "next/cache";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chimoneyState, setChimoneyState] = useState(true);

  const { toast } = useToast();

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          email: data.email,
          phoneNumber: data.phoneNumber!,
          password: data.password,
          hasSubAccount: false,
        };

        const newUser = await signUp(userData);
        // const userSub = await checkUserOnboarded();
        // setChimoneyState(userSub);
        setUser(newUser);
      } else if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) {
          const userSub = await checkUserOnboarded();
          setChimoneyState(userSub);
          if (!userSub) {


          } else {
            toast({
              className:
                "top-0 left-0 flex fixed md:max-w-[420px] bg-blue-700 opacity-70 md:top-4 md:right-4",
              variant: "default",
              title: "Sign in successful",
              description: "Click if you are not redirected automatically",
              action: (
                <ToastAction
                  altText="Go to home page"
                  onClick={(e) => {
                    router.push("/");
                  }}
                >
                  {" "}
                  Go to dashboard
                </ToastAction>
              ),
            });
            router.push("/");
          }
        } else {
          // Sign in failure
          toast({
            className:
              "top-0 left-0 flex fixed md:max-w-[420px] bg-red-600 opacity-70 md:top-4 md:right-4",
            variant: "destructive",
            title: "Error",
            description: "An error occured",
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        className:
          "top-0 left-0 flex fixed md:max-w-[420px] bg-red-600 opacity-70 md:top-4 md:right-4",
        variant: "destructive",
        title: "Error",
        description: `An error occurred ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedInUser = await getLoggedInUser();

        if (loggedInUser) {
          const userSub = await checkUserOnboarded();
          if (!userSub) {
            setChimoneyState(userSub)
            toast({
              className:
                "top-0 left-0 flex fixed md:max-w-[420px] bg-blue-700 opacity-70 md:top-4 md:right-4",
              variant: "default",
              title: "Onboarding",
              description: "Complete onboarding",
            });
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
      }
    };

    fetchData();
  }, []);

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/ChiExpress-favicon.jpg"
            width={34}
            height={34}
            alt="ChiExpress logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            ChiExpress
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user
              ? "Link Account"
              : !chimoneyState
                ? "Onboarding"
                : type === "sign-in"
                  ? "Sign In"
                  : "Sign Up"}

            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : !chimoneyState
                  ? ""
                  : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      <>
        {!chimoneyState ? (
          <div className="flex flex-col gap-4">
            <Chimoney user={user} variant="primary" /> {/* Todo // change this to onboardinglink*/}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      name="phoneNumber"
                      label="Phone Number"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </>
              )}

              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />

              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>)}

        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="form-link"
          >
            {type === "sign-in" ? "Sign up" : "Sign in"}
          </Link>
        </footer>
      </>
    </section>
  );
};

export default AuthForm;
