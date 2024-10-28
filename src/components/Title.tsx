import React from "react";

type TitleProps = {
  title: string;
};

const Title = ({ title }: TitleProps) => {
  return <h1 className="text-center text-4xl">{title.toUpperCase()}</h1>;
};

export default Title;
