export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-[70px] w-[70px]  bg-blue-300 rounded-lg"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block h-[70px] w-[70px]  bg-blue-500 rounded-lg">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }} 
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block  h-[70px] w-[70px]  text-gray-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return (
    <>
      <div onClick={flip} className={className }></div>
      <div className="flex" />
    </>
  );
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}

