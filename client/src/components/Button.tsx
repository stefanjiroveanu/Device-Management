const Button = ({ itemFunction, text }: any) => {
  return (
    <div className="relative inline-flex  group focus:outline-none">
      <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-fuchsia-700 via-[#FF44EC] to-fuchsia-400 rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt w-80"></div>
      <a
        href="#"
        className=" bg-gradient-to-br from-fuchsia-700 to-fuchsia-400 relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-display w-80 h-12 focus:border-0"
        role="button"
        onClick={itemFunction}
      >
        {text}
      </a>
    </div>
  );
};

export default Button;
