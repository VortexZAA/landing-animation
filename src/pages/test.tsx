//npm install @splinetool/react-spline @splinetool/runtime bu komutları çalıştırıyoruz
import Spline from "@splinetool/react-spline"; // bunu ekleyeceğiz
import addresData from "@/data/calimBadge/4.json"; // bunu ekleyeceğiz
import pb from "@/lib/pocketbase";
import { useEffect, useState } from "react";
export default function TEST() {
  const [totalCreate, setTotalCreate] = useState(0);

  async function createCalimBadge() {
    let totalCreate = 0;
    await addresData.forEach(async (element) => {
      try {
        const checkAddress = await pb
          .collection("claim_badge_new")
          .getFirstListItem(`address="${element.address}"`)
          .then((res) => {return true})
          .catch((err) => {
            console.log(err);
            return false;
          });
        if (!checkAddress) {
          const result = await pb
            .collection("claim_badge_new")
            .create({ address: element.address });
          console.log(result);
          totalCreate = totalCreate + 1
        } else {
          console.log(element.address, " zaten var");
        }
      } catch (error) {
        console.log(error);
        alert("hata");
      }
    });
    setTotalCreate(totalCreate);
  }
  useEffect(() => {
    createCalimBadge();
  }, []);
  return (
    <div className="mx-auto z-20 absolute ">
      <h2 className="text-white text-7xl z-20">Total Create: {totalCreate}</h2>
    </div>
  );
}
