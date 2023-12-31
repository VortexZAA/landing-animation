import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Loader from "./Loader";
import { useAppSelector } from "@/hook/redux/hooks";
import { selectData } from "@/redux/auth/auth";
import Loading from "./loading";

export default function Modal({
  modal,
  setModal,
  title,
  children,
}: {
  modal: boolean;
  setModal: Function;
  title: string;
  children: any;
}) {
  function Close() {
    setModal(false);
  }
  const reduxData = useAppSelector(selectData);
  const { loading } = reduxData;
  return (
    <>
      <Transition appear show={modal} as={Fragment}>
        <Dialog as="div" open={modal} onClose={Close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div
            id="register_modal"
            className="fixed  inset-0 z-[999] overflow-y-auto bg-[black]/60"
          >
            <div className="flex min-h-screen items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel bg-transparent absolute z-10 flex w-fit max-w-[95vw] flex-col  overflow-hidden rounded-lg  p-0 text-black dark:text-gray-700 2xl:max-w-[80vw] shadow-md shadow-white/20">
                  <div className="flex h-12 w-full items-center justify-between bg-purple px-3 text-sm font-semibold text-white md:text-xl">
                    <h4>{title}</h4>
                    <button
                      type="button"
                      onClick={Close}
                      className="text-white hover:text-black/80 "
                    >
                      <svg
                        className="fill-current h-6 w-6 text-white"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <title>Close</title>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 101.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="backdrop-blur-sm bg-white/10  h-fit w-full flex flex-col overflow-y-auto relative">
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
