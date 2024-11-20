import { forwardRef, useImperativeHandle, useState } from "react";
import ReactHowler from "react-howler";
import selectSound from "../sounds/selectSound.mp3"; // Import the sound file

const GridUI = forwardRef(function GridUI(
  { items, cols, onSelection, status },
  ref
) {
  const [selected, setSelected] = useState([]);
  const [playSound, setPlaySound] = useState(false); // State to control sound play

  // Mark the selection and inform the parent
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

  // Expose clearSelection method to the parent
  useImperativeHandle(ref, () => ({ clearSelection }));

  return (
    <>
      {playSound && (
        <ReactHowler
          src={selectSound} // Use the imported sound file here
          playing={playSound} // Control when the sound is playing
          onEnd={() => setPlaySound(false)} // Stop playing after the sound ends
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

          // Debugging: log the item, selected status, and final class names
          console.log({
            item,
            isSelected,
            isSuccessful,
            isFailure,
            status,
          });

          // Conditional class names based on selection and status
          const className = `rounded-lg px-2.5 py-2 text-center cursor-pointer shadow-md shadow-indigo-800 text-lg 
            ${isSelected && !status ? "bg-indigo-200 text-blue-600" : ""} 
            ${isSuccessful ? "bg-green-300 text-green-800" : ""} 
            ${isFailure ? "bg-red-300 text-red-800" : ""}`;

          return (
            <button
              key={item}
              className={className}
              onClick={() => markSelection(item)} // Make sure markSelection updates selected state and status
            >
              {item}
            </button>
          );
        })}
      </section>
    </>
  );
});

export default GridUI;
