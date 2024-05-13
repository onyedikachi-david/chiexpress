'use client';

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema, cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { checkUserOnboarded, getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import Chimoney from './Chimoney';
import { revalidatePath } from 'next/cache';

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chimoneyState, setChimoneyState] = useState(true);

  const { toast } = useToast()



  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ''
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Sign up with Appwrite & create plaid token

      if (type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          email: data.email,
          phoneNumber: data.phoneNumber!,
          password: data.password,
          hasSubAccount: false,
        }

        const newUser = await signUp(userData);
        const userSub = await checkUserOnboarded();
        setChimoneyState(userSub)

        setUser(newUser);
      }

      if (type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })

        console.log(response)



        if (response) {
          // alert('Sign-in successful! Redirecting to home page.');
          toast({
            className:
              'top-0 left-0 flex fixed md:max-w-[420px] bg-blue-700 opacity-70 md:top-4 md:right-4'
            , variant: "default", title: "Sign in successful", description: "Redirecting to home page", action: <ToastAction altText='Go to home page' onClick={(e) => { router.push("/") }}> Go to dashboard</ToastAction>
          })
          const userSub = await checkUserOnboarded();
          console.log("User Sub: ", userSub)
          setChimoneyState(userSub)
          if (!userSub) {
            toast({
              className:
                'top-0 left-0 flex fixed md:max-w-[420px] bg-blue-700 opacity-70 md:top-4 md:right-4'
              , variant: "default", title: "Onboarding", description: "Complete onboarding", action: <ToastAction altText='Go to home page' onClick={(e) => { router.push("/") }}> Go to dashboard</ToastAction>
            })
          } else {
            router.push('/');

          }
        } else {
          toast({
            className:
              'top-0 left-0 flex fixed md:max-w-[420px] bg-red-600 opacity-70 md:top-4 md:right-4', variant: "destructive", title: "Error", description: "An error occured"
          })

          // Handle sign-in failure (e.g., display error message)
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        className:
          'top-0 left-0 flex fixed md:max-w-[420px] bg-red-600 opacity-70 md:top-4 md:right-4', variant: "destructive", title: "Error", description: `An error occurred ${error}`
      })
    } finally {
      setIsLoading(false);
    }
  }

  async function getUser() {
    setIsLoading(true);

    const user = await checkUserOnboarded();
    console.log(user);
    setIsLoading(false);

  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const user = await getLoggedInUser();

        if (user) {
          const userSub = await checkUserOnboarded();
          if (!userSub) {
            toast({
              className:
                'top-0 left-0 flex fixed md:max-w-[420px] bg-blue-700 opacity-70 md:top-4 md:right-4'
              , variant: "default", title: "Onboarding", description: "Complete onboarding", action: <ToastAction altText='Go to home page' onClick={(e) => { router.push("/") }}> Go to dashboard</ToastAction>
            })
          } else {
            router.push('/');

          }

          // toast({
          //   className:
          //     'top-0 left-0 flex fixed md:max-w-[420px] bg-blue-700 opacity-70 md:top-4 md:right-4'
          //   , variant: "default", title: "Sign in successful", description: "Redirecting to home page", action: <ToastAction altText='Go to home page' onClick={(e) => { router.push("/") }}> Go to dashboard</ToastAction>
          // })
          // router.push('/');

        } else {
          // Handle case when user is not logged in
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error state
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <section className="auth-form">
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/ChiExpress-favicon.jpg"
            width={34}
            height={34}
            alt="ChiExpress logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">ChiExpress</h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {
              user
                ? 'Link Account'
                : !chimoneyState
                  ? 'Onboarding'
                  : (type === 'sign-in'
                    ? 'Sign In'
                    : 'Sign Up')
            }

            <p className="text-16 font-normal text-gray-600">
              {user
                ? 'Link your account to get started'
                : !chimoneyState
                  ? ''
                  : 'Please enter your details'
              }
            </p>
          </h1>
        </div>
      </header>
      {!chimoneyState ? (
        <div className="flex flex-col gap-4">
          <Chimoney user={user} variant="primary" /> {/* Todo // change this to onboardinglink*/}
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomInput control={form.control} name='firstName' label="First Name" placeholder='Enter your first name' />
                    <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Enter your first name' />
                    <CustomInput control={form.control} name='phoneNumber' label="Phone Number" placeholder='Enter your phone number' />

                  </div>


                </>
              )}

              <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' />


              <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' />

              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in'
                    ? 'Sign In' : 'Sign Up'}
                </Button>

              </div>
            </form>
          </Form>
          <Button className="form-btn" onClick={getUser}>{isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> &nbsp;
              Loading...
            </>
          ) : "Get user"}</Button>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
              {type === 'sign-in' ? 'Sign up' : 'Sign in'}
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

export default AuthForm

#NEXT
NEXT_PUBLIC_SITE_URL = http://localhost:3000

#APPWRITE
NEXT_PUBLIC_APPWRITE_ENDPOINT = https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT = 663a2627000a01305c36 #Changed
APPWRITE_DATABASE_ID = 663a286b002838b8300f #Changed
APPWRITE_USER_COLLECTION_ID = 663a28a30014ba82aa71 #Changed
APPWRITE_WALLET_COLLECTION_ID = 663a2935002f29fc0400 #Changed
APPWRITE_TRANSACTION_COLLECTION_ID = 663a28e60003c5a9e4e3 #Changed
NEXT_APPWRITE_KEY = d0926d23a0d06f10fb23735b952b99f5e14cfcb4bfe68f3b166682f12d042e59627a5f40753f8908d24d8e0aaeb5e275540acc0a7c786d25647a0d6e7a2b87ed18f478ff1df9c9231202750315128bb6e2ae75e4c22aacc37a507455c453a5cbfcfdcd3128e1a330602a8eebb73a2c91ed04b354803d87da3133c68d122d9aa4 #Changed

#CHIMONEY
CHIMONEY_API_URL_ENDPOINT = https://api-v2-sandbox.chimoney.io/v0.2
CHIMONEY_API_KEY = 96f9f5f669158a66cb588548f7fa167220e7c03cfd62de2a79aa072c1abc1769
#PLAID
PLAID_CLIENT_ID = 662e1e5fdca064001c3e0086
PLAID_SECRET = be405988983be57fe34bef8e9038b3
PLAID_ENV = sandbox
PLAID_PRODUCTS = auth, transactions, identity
PLAID_COUNTRY_CODES = US, CA

#DWOLLA
DWOLLA_KEY = qAN5xkFYOSQeUNpN7GSPcGPHH8nSpVrPKSL8Ye5mSSP5AzddNt
DWOLLA_SECRET = FI50i6NbUQ90106Bt1n9bH6aCNWhcs8Rliy7VRqrXgNbKtLy00
DWOLLA_BASE_URL = https://api-sandbox.dwolla.com
DWOLLA_ENV = sandbox