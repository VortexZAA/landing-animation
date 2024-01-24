import { ToastError, ToastSuccess } from "@/components/alert/SweatAlert";
import { callHasMinted, callMint, callTokenURI, importToMetamask } from "@/contractInteractions/useAppContract";
import pb from "@/lib/pocketbase";
import { setLoading } from "@/redux/auth/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function useHelsinki({
    address,
}: {
    address: string;
}) {
    const dispatch = useDispatch();
    const [modalHelsinki, setModalHelsinki] = useState(false);
    const [isconneted, setIsConnected] = useState(false);
    const [nftImage, setNftImage] = useState(false);
    const [random, setRandom] = useState({
      top: 0,
      right: 0,
    });
    const [nftdata, setNftdata] = useState({
      name: "",
      description: "",
      image: "",
      attributes: [],
    });
    const incrementRandom = () => {
      //random coordinat number between 1 and 100
      const random = Math.floor(Math.random() * 80) + 1;
      //random coordinat number between 1 and 100
      const random2 = Math.floor(Math.random() * 70) + 1;
      setRandom({
        top: random,
        right: random2,
      });
    };
    useEffect(() => {
      if (isconneted) {
        const timer = setTimeout(incrementRandom, 850);
  
        return () => clearTimeout(timer);
      }
    }, [random, isconneted]);

    async function joinHelsinki() {
        try {
          //console.log("address", address);
    
          const check: any = await pb
            .collection("helsinki")
            .getFirstListItem(`address="${address}"`)
            .then((res) => {
              console.log(res);
              return true;
            })
            .catch((err) => {
              console.log(err);
              return false;
            });
          console.log("check", check);
          if (check) {
            ToastError.fire({
              title: "You have already joined the Helsinki.",
            });
          } else {
            let checkWeb3 = await callHasMinted(address);
            if (checkWeb3) {
              let create = await pb.collection("helsinki").create({
                address: address,
              });
              console.log("create", create);
              if (create) {
                ToastSuccess({}).fire({
                  title: "You have already joined the Helsinki.",
                });
              }
            } else {
              setModalHelsinki(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      async function success() {
        dispatch(setLoading(true));
        try {
          let id = await callMint(address);
          let uri = await callTokenURI(id);
          let res = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
          let data = await res.json();
          setNftImage(data.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
          setNftdata(data);
          importToMetamask(
            id,
            data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
          );
          //alert("You found the wizard, so your prize is " + id);
          setModalHelsinki(false);
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.error("Error minting:", error);
          ToastError.fire({
            title: "Something went wrong.",
          });
        }
      }

      const GhostModal = modalHelsinki && (
        <div className=" w-full h-full left-0 top-0 z-[60] absolute text-white p-10 backdrop-blur-sm bg-black/20 flex justify-center items-center">
          <h1 className="shadow hidden">
            Catch me to mint your BEVM Helsinki 🔥 POAP
          </h1>
          <div className="w-full flex justify-end absolute top-6 right-6">
            <button
              onClick={() => {
                setModalHelsinki(false);
                setIsConnected(false);
              }}
              className="w-7 h-7 flex justify-center items-center bg-black border-2 border-white/80 hover:border-white transition-colors rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                  className="text-white"
                />
              </svg>
            </button>
          </div>
          {!isconneted && (
            <div className="relative h-32 w-80 ml-[500px] rounded-lg bg-gray-800/80 border shadow-lg">
              <div className="absolute left-0 bottom-2/3 h-4 w-4 -translate-x-1/2 translate-y-1/2 rotate-45 transform border-b border-l bg-gray-800"></div>
              <div className="px-8">
                <h1 className="mt-6 mb-2 text-base font-bold text-orange-600">
                  Catch me to mint your BEVM Helsinki 🔥 POAP
                </h1>
                <p className="text-gray-200">Click on me to start👻</p>
              </div>
            </div>
          )}
          {!nftImage && (
            <button
              className="absolute w-28 bg-[url('/giphy.gif')] h-28 bg-contain bg-no-repeat z-[99999] "
              onClick={() => (isconneted ? success() : setIsConnected(true))}
              style={{
                right: `${isconneted ? random.top : 45}%`,
                top: `${isconneted ? random.right : 45}%`,
              }}
            ></button>
          )}
        </div>
      )
    
    return { joinHelsinki,GhostModal };
}

