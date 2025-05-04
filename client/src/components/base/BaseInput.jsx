export default function BaseInput({
  placeHolder,
  label,
  errorText,
  type,
  isHidden = false,
  name,
  onChange,
  value,
}) {
  return (
    <div className={`w-full ${isHidden ? "hidden" : ""}`}>
      <div className="space-y-1">
        <label className="font-xl font-medium">{label}</label>

        <div className="rounded-md border">
          <input
            value={value ?? ""}
            onChange={onChange}
            name={name}
            type={type ?? "text"}
            className="w-full border-none px-4 py-2 rounded-md focus:outline-primary"
            placeholder={placeHolder}
          />
        </div>
      </div>
      <div
        className={`text-xs text-red-500 ${errorText.length ? "" : "hidden"} `}
      >
        {errorText}
      </div>
    </div>
  );
}
