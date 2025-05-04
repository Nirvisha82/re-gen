export default function BaseButton({
  buttonText,
  type,
  onClick,
  customClasses,
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`rounded-md text-center py-2 px-4 md:px-8 md:py-2 bg-primary text-white font-semibold border-none ${customClasses} text-sm md:text-base`}
    >
      {buttonText}
    </button>
  );
}
