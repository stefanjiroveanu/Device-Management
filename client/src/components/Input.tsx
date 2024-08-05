const Input = ({item, itemFunction, type, text}: any) => {
    return (<div className="relative w-80 flex">
    <input
      className="mb-10 rounded-xl bg-inherit border-2 border-solid border-slate-800 w-full h-8 text-white pl-2 text-sm outline-none font-display font-normal"
      type={type}
      placeholder=" "
      value={item}
      onChange={itemFunction}
    />
    <label
      className={`absolute top-1 font-display left-2 transition-all pointer-events-none ${
        item
          ? "-translate-y-6 text-sm text-white"
          : "text-base text-slate-500 font-display"
      }`}
    >
      {text}
    </label>
  </div>);
}

export default Input;