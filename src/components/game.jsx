import { useEffect, useRef, useState } from 'react';
import Btns from './Btns';
import { areItemsFromSingleGroup } from '../utilities/Calculations';
import Confetti from 'react-confetti';

const StatusOptions = {
  Success: 'success',
  Failure: 'failure',
};

function Game({ itemGroups, allItems, columns = 2, groupSize }) {
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState(null);
  const BtnsRef = useRef(null);

  useEffect(() => {
    setItems(allItems);
    setAttempts(0);
    setStatus(null);
    if (BtnsRef.current) {
      BtnsRef.current.clearSelection();
    }
  }, [allItems]);

  function onSelection(selected) {
    if (selected.length === groupSize) {
    
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
    if (currentStatus === StatusOptions.Success) {
      setItems((prevItems) =>
        prevItems.filter((item) => !itemsForRemoval.includes(item))
      );
    }
    setStatus(null);
    if (BtnsRef.current) {
      BtnsRef.current.clearSelection();
    }
  }

  return (
    <div className=''>
      {items.length ? (
        <Btns
          items={items}
          cols={columns}
          onSelection={onSelection}
          status={status}
          ref={BtnsRef}
        />
      ) : (
        <>
        <Confetti
          width={window.innerWidth} 
          height={window.innerHeight}
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
