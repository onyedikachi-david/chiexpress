"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getUserPinHash, payoutChimoney } from "@/lib/actions/user.actions";
import { verifyPin } from "@/lib/utils";

import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import PinModal from "./PinModal";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z.string().min(2, "Amount is too short"),

});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    amount: '',
  });
  const [pin, setPin] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      amount: "",

    },
  });



  const handlePinSubmit = async (submittedPin) => {
    setPin(submittedPin);

    setPinModal(false);
    console.log("Hadle pin submit was called", submittedPin)
    // Handle pin verification logic here

    if (await validatePin(submittedPin)) {
      toast({
        className:
          "top-0 left-0 flex fixed md:max-w-[420px] bg-[#32c932] opacity-100 md:top-4 md:right-4",
        title: "Pin verification was successful, Submitting data",
      });
      submitFormData(formData);
    }
  };

  const validatePin = async (pin) => {
    const userPinHash = await getUserPinHash();
    const match = await verifyPin(userPinHash, Number(pin))
    console.log("Pin match 😋😋😋😋:  ", match)

    return match;
  };

  const handleSubmit = async (data) => {
    setIsLoading(true)
    setFormData(data);
    setPinModal(true);
    console.log("Continues: with data: ", data)
  };

  const submitFormData = async (data: z.infer<typeof formSchema>) => {
    // Implement your logic to submit form data to an API endpoint
    await payoutChimoney({ email: data.email, amount: data.amount })
    console.log('Submitting form data:', data);
    setIsLoading(false)
    toast({
      className:
        "top-0 left-0 flex fixed md:max-w-[420px] bg-[#32c932] opacity-100 md:top-4 md:right-4",
      title: "👍, Transfer was successful",
    });
    router.push('/')
  };

  return (
    <div>
      {pinModal ? (
        <PinModal onSubmit={handlePinSubmit} onClose={() => setPinModal(false)} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
            <div className="payment-transfer_form-details">
              <h2 className="text-18 font-semibold text-gray-900">Bank account details</h2>
              <p className="text-16 font-normal text-gray-600">
                Enter the bank account details of the recipient
              </p>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                      Recipient's Email Address
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input placeholder="ex: johndoe@gmail.com" className="input-class" {...field} />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="border-y border-gray-200">
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                      Amount
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input placeholder="ex: 5.00" className="input-class" {...field} />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <div className="payment-transfer_btn-box">
              <Button type="submit" className="payment-transfer_btn">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
                  </>
                ) : (
                  'Transfer Funds'
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PaymentTransferForm;
