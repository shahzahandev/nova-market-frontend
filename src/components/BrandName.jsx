export default function BrandName({ name }) {
  const words = (name || "").trim().split(/\s+/);
  const firstWord = words.shift();
  const remaining = words.join(" ");

  return (
    <>
      {firstWord}
      {remaining && (
        <>
          {" "}
          <span className="text-brand-500">{remaining}</span>
        </>
      )}
    </>
  );
}