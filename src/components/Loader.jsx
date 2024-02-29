import React from "react";
import { Oval } from "react-loader-spinner";

const Loader = () => {
  return (
    <Oval
      height={320}
      width={60}
      color="#22c55e"
      wrapperStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      wrapperClass="loader"
      visible={true}
      strokeWidth={3}
    />
  );
};

export default Loader;
