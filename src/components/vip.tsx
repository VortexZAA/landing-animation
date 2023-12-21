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
        <svg
          className="h-1/2 w-fit"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_362_3343)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.9993 30.88C15.9993 22.5169 11.3408 6.92163 4.28639 6.92163C-0.644765 21.2098 6.37183 30.88 15.9993 30.88Z"
              stroke="currentColor"
              strokeWidth="1.06481"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.7392 27.9312C9.95191 27.1923 8.41272 25.9672 7.2329 24.3119C4.81205 20.9157 4.19339 16.0479 5.42911 10.6477"
              stroke="currentColor"
              strokeWidth="1.06481"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.999 30.88C15.999 22.5169 20.6576 6.92163 27.712 6.92163C32.6431 21.2098 25.6265 30.88 15.999 30.88Z"
              stroke="currentColor"
              strokeWidth="1.06481"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.6807 7.98649C12.3818 5.60397 13.3732 3.8204 14.4018 2.87964"
              stroke="currentColor"
              strokeWidth="1.06481"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.8811 9.51784C21.7598 3.93076 19.102 0 15.9986 0C12.8958 0 10.238 3.93076 9.11621 9.51784C11.5924 12.2943 13.5102 16.9258 14.6847 21.5486C15.701 24.5184 15.9986 27.8252 15.9986 30.8796C15.9986 27.8252 16.2963 24.5184 17.3126 21.5486C18.4876 16.9258 20.4048 12.2943 22.8811 9.51784Z"
              stroke="currentColor"
              strokeWidth="1.06481"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_362_3343">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
        {text}
      </div>
    </>
  );
}
