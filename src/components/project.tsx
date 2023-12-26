export default function Project({
  text = "Project 1",
}: {
  text: "Project 1" | "Project 2" | "Project 3";
}) {
  const color =
    text === "Project 1"
      ? "border-vip1 text-vip1 bg-vip1/20"
      : text === "Project 2"
      ? "border-vip2 text-vip2 bg-vip2/20"
      : "border-vip3 text-vip3 bg-vip3/20";
  return (
    <>
      <div
        className={`w-28 lg:w-32  h-10 xl:h-12 absolute top-4 md:top-6 left-3 md:left-6 shrink-0 border-2 ${color} right-0 flex gap-1 md:gap-2 justify-center items-center -top-14 px-2 md:px-3 font-semibold   rounded-full`}
      >
        {text}
      </div>
    </>
  );
}
