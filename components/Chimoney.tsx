import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { updateUserDetails } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { toast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';

const Chimoney = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);



  const FormSchema = z.object({
    pin: z.string().min(4, {
      message: "Your pin must be 4 digits",
    }),
  })


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    // Update user details on db and Create chimoney wallet and save.
    await updateUserDetails(Number(data.pin))
    // Create chimoney wallet and save.
    // 
    toast({
      className:
        'top-0 left-0 flex fixed md:max-w-[420px] bg-[#32c932] opacity-100 md:top-4 md:right-4',
      title: "Successful",

    })
    form.reset()
    setIsLoading(false)
    router.push("/")

  }

  return (
    <>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter your transaction pin.</FormLabel>
                <FormControl>
                  <InputOTP maxLength={4} inputMode='numeric' {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />

                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
            </>
          ) : (
            "Send"
          )}</Button>
        </form>
      </Form>
    </>
  )
}

export default Chimoney;