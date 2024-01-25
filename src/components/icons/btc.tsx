import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/hook/redux/hooks";
import { selectData } from "@/redux/auth/auth";
import BnbIcon from "./bnb";
export default function BtcIcon({ addClass = "" }: { addClass?: string }) {
  const reduxData = useAppSelector(selectData);
  const { address, isEmty, chainId } = reduxData;
  return (
    <>
      {chainId === "0x89" ? (
        <>
          <img src="/polygon.svg" alt="" className="h-3/4 w-fit max-h-[40px]" />
        </>
      ) : chainId === "0x38" ? (
        <BnbIcon/>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className={`h-3/4 w-fit max-h-[40px] inline-block text-orange-300 ${addClass}`}
          viewBox="0 0 512 512"
        >
          <path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-141.7-35.3c4.9-33-20.2-50.7-54.6-62.6l11.1-44.7-27.2-6.8-10.9 43.5c-7.2-1.8-14.5-3.5-21.8-5.1l10.9-43.8-27.2-6.8-11.2 44.7c-5.9-1.3-11.7-2.7-17.4-4.1l0-.1-37.5-9.4-7.2 29.1s20.2 4.6 19.8 4.9c11 2.8 13 10 12.7 15.8l-12.7 50.9c.8 .2 1.7 .5 2.8 .9-.9-.2-1.9-.5-2.9-.7l-17.8 71.3c-1.3 3.3-4.8 8.4-12.5 6.5 .3 .4-19.8-4.9-19.8-4.9l-13.5 31.1 35.4 8.8c6.6 1.7 13 3.4 19.4 5l-11.3 45.2 27.2 6.8 11.2-44.7a1038.2 1038.2 0 0 0 21.7 5.6l-11.1 44.5 27.2 6.8 11.3-45.1c46.4 8.8 81.3 5.2 96-36.7 11.8-33.8-.6-53.3-25-66 17.8-4.1 31.2-15.8 34.7-39.9zm-62.2 87.2c-8.4 33.8-65.3 15.5-83.8 10.9l14.9-59.9c18.4 4.6 77.6 13.7 68.8 49zm8.4-87.7c-7.7 30.7-55 15.1-70.4 11.3l13.5-54.3c15.4 3.8 64.8 11 56.8 43z" />
        </svg>
      )}
    </>
  );
}
