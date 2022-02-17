import './App.css';
import React, {useState} from "react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const MovableItem = ({name, setItems, dataType}) => {

    const changeItemColumn = (currentItem, columnName) => {
        setItems((prevState) => {
            return prevState.map(e => {
                return {
                    ...e,
                    column: e.name === currentItem.name ? columnName : e.column,
                }
            })
        });
    }

    const [{isDragging}, drag] = useDrag({
        // item: name
        item: {name, type: dataType},
        type: dataType,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();

            console.log(dropResult)
            console.log(item)

            if (dropResult && dropResult.name === "데이터 슬롯") {
                changeItemColumn(item, "데이터 슬롯")
            } else if (dropResult && dropResult.name === "함수 슬롯") {
                changeItemColumn(item, "함수 슬롯")
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;

    return (
        <div ref={drag} className={"movable-item"} style={{opacity}}>
            {name}
        </div>
    )
}

const Slot = ({title, children, className, dataType}) => {
    const [, drop] = useDrop({
        accept: dataType,
        drop: () => ({name: title}),
    });

    return (
        <div ref={drop} className={className}>
            {title}
            {children}
        </div>
    )
}

const toUpperCase = (items, setItems,) => {
    setItems((prevItem) => {
        return {
            name: items.name.toUpperCase()
        }
    })
}

// function wordNum = your_string.split(' ').length;
//
// function reverse = your_string.split('').reverse().join('');

function App() {

    const [items, setItems] = useState([
        {id: 1, name: "Smarter alone, Smartest together", column: "Data Blocks", type: "data"},
        {id: 2, name: "Make AI work for the rest of us", column: "Data Blocks", type: "data"},
        {id: 3, name: "toUpperCase", column: "Function Blocks", type: "function"},
        {id: 4, name: "wordNum", column: "Function Blocks", type: "function"},
        {id: 5, name: "reverse", column: "Function Blocks", type: "function"},
    ]);

    const returnItemsForSlot = (columnName) => {
        return items
            .filter((item) => item.column === columnName)
            .map((item) => (
                <MovableItem key={item.id} name={item.name} setItems={setItems} dataType={item.type}/>
            ))
    }


    return (
        <div>
            <div className="navigation">
                <button className="run-btn" onClic={null}>
                    실행하기
                </button>
            </div>
            <div className="container">
                <div className="content">
                    <DndProvider backend={HTML5Backend}>
                        <div className={"first-column"}>
                            <Slot title={"Data Blocks"} className={"list"} dataType={"everybody"}>
                                {returnItemsForSlot("Data Blocks")}
                            </Slot>

                            <Slot title={"Function Blocks"} className={"list"} dataType={"everybody"}>
                                {returnItemsForSlot("Function Blocks")}
                            </Slot>
                        </div>
                        <div className="slot">
                            <Slot title={"데이터 슬롯"} className={"column"} dataType={"data"}>
                                {returnItemsForSlot("데이터 슬롯")}
                            </Slot>
                            <Slot title={"함수 슬롯"} className={"column"} dataType={"function"}>
                                {returnItemsForSlot("함수 슬롯")}
                            </Slot>
                            <Slot title={"결과 슬롯"} className={"column"} dataType={"result"}>
                                {returnItemsForSlot("결과 슬롯")}
                            </Slot>
                        </div>
                    </DndProvider>
                </div>
            </div>
        </div>
    );
}

export default App;