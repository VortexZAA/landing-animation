export default function Vip({
  text = "Seed 1",
}: {
  text: "Seed 1" | "Seed 2" | "Seed 3";
}) {
  const color =
    text === "Seed 1"
      ? "border-vip1 text-vip1 bg-vip1/20"
      : text === "Seed 2"
      ? "border-vip2 text-vip2 bg-vip2/20"
      : "border-vip3 text-vip3 bg-vip3/20";
  return (
    <>
      <div
        className={`w-28 lg:w-32  h-10 xl:h-12 shrink-0 border-2 ${color} right-0 flex gap-1 md:gap-2 justify-center items-center -top-14 px-2 md:px-3 font-semibold   rounded-full`}
      >
        {text==="Seed 1" && "Common"}
        {text==="Seed 2" && "Epic"}
        {text==="Seed 3" && "Legendary"}
      </div>
    </>
  );
}
