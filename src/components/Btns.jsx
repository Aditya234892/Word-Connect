import { forwardRef, useImperativeHandle, useState } from "react";
import ReactHowler from "react-howler";
import selectSound from "../sounds/selectSound.mp3"; 

const Btns = forwardRef(function Btns(
  { items, cols, onSelection, status },
  ref
) {
  const [selected, setSelected] = useState([]);
  const [playSound, setPlaySound] = useState(false); 

  const markSelection = (item) => {
    if (status) {
      return;
    }

    setPlaySound(true);

    let newSelected = [];
    if (selected.includes(item)) {
      newSelected = selected.filter((i) => i !== item);
    } else {
      newSelected = [...selected, item];
    }

    setSelected(newSelected);
    onSelection(newSelected);
  };

  function clearSelection() {
    setSelected([]);
  }

  useImperativeHandle(ref, () => ({ clearSelection }));

  return (
    <>
      {playSound && (
        <ReactHowler
          src={selectSound} 
          playing={playSound} 
          onEnd={() => setPlaySound(false)}
        />
      )}

      <section
        className={`grid grid-cols-5 gap-8 mx-auto mb-8 ${
          status === "disabled" ? "cursor-not-allowed" : ""
        }`}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {items.map((item) => {
          const isSelected = selected.includes(item);
          const isSuccessful = status === "success" && isSelected;
          const isFailure = status === "failure" && isSelected;

        
          console.log({
            item,
            isSelected,
            isSuccessful,
            isFailure,
            status,
          });

          
          const className = `rounded-lg px-2.5 py-2 text-center cursor-pointer shadow-md shadow-indigo-800 text-lg 
            ${isSelected && !status ? "bg-indigo-200 text-blue-600" : ""} 
            ${isSuccessful ? "bg-green-300 text-green-800" : ""} 
            ${isFailure ? "bg-red-300 text-red-800" : ""}`;

          return (
            <button
              key={item}
              className={className}
              onClick={() => markSelection(item)}
            >
              {item}
            </button>
          );
        })}
      </section>
    </>
  );
});

export default Btns;
