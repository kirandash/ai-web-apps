"use client";

type Props = {
  data: string | null;
};

const StreamResponse = ({ data }: Props) => {
  return (
    <div className="w-full flex flex-col space-y-2 overflow-y-scroll max-h-[calc(100vh-250px)]">
      {typeof data === "string" && <p>{data}</p>}
    </div>
  );
};

export default StreamResponse;
