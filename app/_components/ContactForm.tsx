import Input from "@/components/Input/Input";
import TextArea from "@/components/Input/TextArea";
import Text from "@/components/Text/Text";
import { ContactValues } from "@/types/contactTypes";
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import emailjs from "@emailjs/browser";
import { twMerge } from "tailwind-merge";

const emailServiceId = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID as string;
const emailTemplateId = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID as string;
const emailPublicKey = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY as string;

const ContactForm: FC = () => {
  const [success, setSuccess]: any = useState(null);
  const refFrom: any = useRef();
  const [values, setValues] = useState<ContactValues>({
    name: "",
    surname: "",
    email: "",
    relatedUnit: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const sendDisabled = useMemo(
    () =>
      values.name === "" ||
      values.surname === "" ||
      values.email === "" ||
      values.relatedUnit === "" ||
      values.description === "",
    [values]
  );

  const changeValue = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setValues((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    },
    []
  );

  const sendMail = useCallback(
    async (e: any) => {
      e.preventDefault();
      try {
        setLoading(true);
        setError(false);
        console.log(values);

        await emailjs
          .send(emailServiceId, emailTemplateId, values, emailPublicKey)
          .then(
            (result) => {
              console.log(result.text);
              setSuccess(true);
              refFrom.current.reset();
            },
            (error) => {
              console.log(error.text);
              setSuccess(false);
            }
          );
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [values]
  );

  return (
    <form
      ref={refFrom}
      onSubmit={sendMail}
      className="ml-auto lg:w-[627px] w-full bg-white bg-opacity-25 sm:rounded-[44px] rounded-2xl sm:p-16 p-6 flex flex-col"
    >
      <Text variant="2xl" className="font-semibold" font="font-spring">
        Contact Form
      </Text>
      <div className="flex items-center sm:flex-nowrap flex-wrap gap-10 sm:mt-12 mt-6">
        <Input
          className="flex-1"
          placeholder="Name*"
          name="name"
          required
          onChange={changeValue}
        />
        <Input
          className="flex-1"
          placeholder="Surname*"
          name="surname"
          required
          onChange={changeValue}
        />
      </div>
      <div className="flex items-center sm:flex-row flex-col sm:flex-nowrap flex-wrap gap-10 mt-8">
        <Input
          className="sm:flex-1 sm:w-auto w-full"
          placeholder="Email*"
          type="email"
          required
          name="email"
          onChange={changeValue}
        />
        <select
          className={twMerge(
            "sm:flex-1 sm:w-auto w-full focus:outline-none outline-none bg-transparent border-b-2 border-sacramento-green border-opacity-30 focus:border-opacity-100 transition-all placeholder:text-sonic-silver text-sacramento-green font-satoshi text-base py-2",
            values.relatedUnit === "" && "text-sonic-silver"
          )}
          name="relatedUnit"
          required
          placeholder="Related Unit*"
          onChange={changeValue}
        >
          <option disabled selected value="">
            Related Unit*
          </option>
          <option value="marketing">Marketing</option>
          <option value="technical">Technical</option>
          <option value="finance">Finance</option>
          <option value="partnership">Partnership</option>
          <option value="procurement">Procurement</option>
        </select>
      </div>
      <TextArea
        className="h-11 mt-8"
        placeholder="Briefly tell us about your project."
        name="description"
        required
        onChange={changeValue}
      />
      <button
        type="submit"
        disabled={sendDisabled || loading}
        className="disabled:opacity-60 sm:w-fit w-full p-[10px] text-white text-base font-bold font-satoshi bg-sacramento-green rounded-[5px] active:scale-95 transition-all mt-10"
      >
        SEND MESSAGE
      </button>
      <div className=" h-10 pt-2 text-green-800 drop-shadow-md">
        {success
          ? "Your message has been sent. We'll get back to you soon."
          : success === false &&
          "Something went wrong. Please try again later."}
      </div>
    </form>
  );
};

export default ContactForm;
