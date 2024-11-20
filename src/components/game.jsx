import { useEffect, useRef, useState } from 'react';
import GridUI from './grid-ui';
import { areItemsFromSingleGroup } from '../utils/helpers';
import Confetti from 'react-confetti';

const StatusOptions = {
  Success: 'success',
  Failure: 'failure',
};

function Game({ itemGroups, allItems, columns = 2, groupSize }) {
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState(null);
  const gridUIRef = useRef(null);

  // When items change, reset the game
  useEffect(() => {
    setItems(allItems);
    setAttempts(0);
    setStatus(null);
    if (gridUIRef.current) {
      gridUIRef.current.clearSelection();
    }
  }, [allItems]);

  // Take action if items are from the same group on selection completion
  function onSelection(selected) {
    if (selected.length === groupSize) {
      // If the selection is complete
      setAttempts((prevAttempts) => prevAttempts + 1);
      const newStatus = areItemsFromSingleGroup(itemGroups, selected)
        ? StatusOptions.Success
        : StatusOptions.Failure;
      setStatus(newStatus);
      const timeoutId = setTimeout(() => unHighlight(selected, newStatus), 1000);
      return () => clearTimeout(timeoutId);
    }
  }

  function unHighlight(itemsForRemoval, currentStatus) {
    // Remove the items if the selection was successful
    if (currentStatus === StatusOptions.Success) {
      setItems((prevItems) =>
        prevItems.filter((item) => !itemsForRemoval.includes(item))
      );
    }
    setStatus(null);
    if (gridUIRef.current) {
      gridUIRef.current.clearSelection();
    }
  }

  return (
    <div className=''>
      {items.length ? (
        <GridUI
          items={items}
          cols={columns}
          onSelection={onSelection}
          status={status}
          ref={gridUIRef}
        />
      ) : (
        <>
        <Confetti
          width={window.innerWidth} // Full screen width
          height={window.innerHeight} // Full screen height
        />
      <p className="text-center text-5xl">Well done. Reset to play again!</p>
      </>
      )}

      <p className="text-center text-2xl text-[#130089]">
        Attempts: <strong className='text-black'>{attempts}</strong>
      </p>
    </div>
  );
}

export default Game;
