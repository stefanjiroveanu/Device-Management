const InvalidLoginPopup = ({ open, setOpen}: any) => {
  
  return (
    open && <div className="bg-red-500 bg-opacity-[0.1] rounded-lg border-[1px] border-solid border-red-700 mb-8 flex flex-row">
      <div className="font-display font-thin text-white p-2 text-sm">
        Incorrect username or password.
      </div>
      <button className="text-red-500 p-2" onClick={() => setOpen(false)}>
        x
      </button>
    </div>
  );
};

export default InvalidLoginPopup;