import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { hashPin, verifyPin } from "@/lib/utils";
interface PinModalProps {
  onSubmit: (pin: string) => void;
  onClose: () => void;
}
const PinModal: React.FC<PinModalProps> = ({ onSubmit, onClose }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const FormSchema = z.object({
    pin: z.string().min(4, {
      message: "Transaction pin is required",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  enum OtpInputType {
    password = "password",
    text = "text",
  }


  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    onSubmit(data.pin);
   
  }

  return (
    <>

      <Dialog open={true} >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your transaction pin.</FormLabel>
                    <FormControl>
                      <InputOTP
                        aria-label="password"
                        maxLength={4}
                        inputMode="numeric"
                        {...field}
                      >
                        <InputOTPGroup typeof="password">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
Please enter your transaction pin                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>

      </Dialog>
    </>
  );
};

export default PinModal;
