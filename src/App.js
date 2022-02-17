import './App.css';
import React, {useState} from "react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const MovableItem = ({setIsDataSlot}) => {
  const [{isDragging}, drag] = useDrag({
    type: 'data',
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (dropResult && dropResult.name === "데이터 슬롯") {
        setIsDataSlot(true);
      } else {
        setIsDataSlot(false);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
      <div ref={drag} className={"movable-item"} style={{opacity}}>
        Data 1
      </div>
  )
}

// @ts-ignore
const Slot = ({title, children, className, dataType}) => {
  const [, drop] = useDrop({
    accept: dataType,
    drop: () => ({name: {title}}),
  });

  return (
      <div ref={drop} className={className}>
        {title}
        {children}
      </div>
  )
}


function App() {

  const [isDataSlot, setIsDataSlot] = useState(true);
  const Item = <MovableItem setIsDataSlot={setIsDataSlot}/>;

  return (
      <div className="container">
        <DndProvider backend={HTML5Backend}>
          <Slot title={"data list"} className={"column data-list"} dataType={"everybody"}>
            {isDataSlot && Item}
          </Slot>

          <Slot title={"데이터 슬롯"} className={"column"} dataType={"data"}>
            {!isDataSlot && Item}
          </Slot>
          <Slot title={"함수 슬롯"} className={"column"} dataType={"function"}>
            {null}
          </Slot>
          <Slot title={"결과 슬롯"} className={"column"} dataType={"data"}>
            {null}
          </Slot>
        </DndProvider>
      </div>
  );
}

export default App;