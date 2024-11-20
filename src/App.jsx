import { getConnectedGroups } from "./utils/helpers";
import { useCallback, useEffect, useState } from "react";
import Game from "./components/game";
import { Leva, useControls } from "leva";
import ReactHowler from "react-howler";
import backgroundSound from "./sounds/achievement.mp3"; // Import your background sound file

const isSmallScreen = window.innerWidth <= 768;

const App = () => {
  const { groupSize } = useControls({
    groupSize: { value: 2, min: 2, max: 4, step: 1 },
  });
  const { itemCount } = useControls({
    itemCount: { value: 8, min: 4, max: 12, step: 1 },
  });
  const { columns } = useControls({
    columns: { value: 4, min: 2, max: 4, step: 1, disabled: isSmallScreen },
  });

  const [itemGroups, setItemsGroup] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [playSound, setPlaySound] = useState(true); // Manage sound playback state
  const [soundRef, setSoundRef] = useState(null); // Store the sound instance

  const reset = useCallback(() => {
    const [newItemGroups, newAllItems] = getConnectedGroups(
      itemCount,
      groupSize
    );
    setItemsGroup(newItemGroups);
    setAllItems(newAllItems);
  }, [setAllItems, itemCount, groupSize]);

  useEffect(reset, [itemCount, groupSize, reset]);

  return (
    <div className="bg-gradient-to-br from-[#40ffe9] to-[#130089] flex flex-col p-6 sm:p-10 min-h-screen">
  {/* Background sound */}
  <ReactHowler
    src={backgroundSound} // Your imported sound file
    playing={playSound} // Control playback state
    loop={true} // Ensure the sound plays continuously
    volume={0.5} // Adjust volume as needed
    ref={(ref) => setSoundRef(ref)} // Store the instance for control
  />

<Leva
  collapsed
  hideCopyButton={true}
  titleBar={{
    position: { x: -620, y: 5 },
    filter: false,
    title: "Configure your game",
  }}
  theme={{
    colors: {
      highlight1: "white",
      highlight2: "white",
    },
  }}
  className="responsive-leva"
/>


  <h3 className="text-center mt-8 mb-10 font-bold text-3xl sm:text-4xl text-[#130089]">
    Fuse the {groupSize} linked words by tapping on their matching pairs.
  </h3>

  <Game
    itemGroups={itemGroups}
    allItems={allItems}
    columns={columns}
    groupSize={groupSize}
  />
  
  <div className="text-center mt-4">
    <button
      className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      onClick={() => reset()}
    >
      Reset
    </button>
  </div>

  {/* Toggle sound button */}
  <div className="text-center mt-4">
    <button
      className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
      onClick={() => {
        if (soundRef) {
          setPlaySound(!playSound); // Toggle play state
        }
      }}
    >
      {playSound ? "Pause Music🔈" : "Play Music 🔊"}
    </button>
  </div>
</div>

  );
};

export default App;
