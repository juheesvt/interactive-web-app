import './App.css';
import React, {useEffect, useState} from "react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const DeleteBtn = () => {
    return (
        <div className={"delete-btn"}>
            <button>x</button>
        </div>
    )
}

const MovableItem = ({name, setItems, dataType, result, setResult, className, setClassName}) => {

    const changeItemColumn = (currentItem, columnName) => {
        if (columnName === '함수 슬롯') {
            setResult(eval(currentItem.name)(result))
        } else if (columnName === '데이터 슬롯') {
            setResult(currentItem.name)
        }

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
        <div ref={drag} className={className} style={{opacity}}>
            {name}
        </div>
    )
}

const Slot = ({title, children, className, dataType}) => {
    const [, drop] = useDrop({
        accept: dataType,
        drop: () => (
            {name: title}
        ),
    });

    return (
        <div ref={drop} className={className}>
            {/* eslint-disable-next-line no-restricted-globals */}
            {((children.length === 0 && (title === "데이터 슬롯" || title === "함수 슬롯")) ||
                    (title === "결과 슬롯" && children.name === "") ||
                    (title === "Data Blocks" || title === "Function Blocks"))
                && title}
            {((children.length === 1 && (title === "데이터 슬롯" || title === "함수 슬롯")) &&
                (title !== "결과 슬롯") &&
                (title !== "Data Blocks" || title !== "Function Blocks")) && <DeleteBtn/>}
            {children}
        </div>
    )
}

const toUpperCase = (result) => {
    return result.toUpperCase()
}

const wordNum = (result) => {
    return result.split(' ').length;
}

const reverse = (result) => {
    return result.split('').reverse().join('');
}

function App() {
    const [className, setClassName] = useState("movable-item")
    const [result, setResult] = useState('')
    const [items, setItems] = useState([
        {id: 1, name: "Smarter alone, Smartest together", column: "Data Blocks", type: "data"},
        {id: 2, name: "Make AI work for the rest of us", column: "Data Blocks", type: "data"},
        {id: 3, name: "toUpperCase", column: "Function Blocks", type: "function"},
        {id: 4, name: "wordNum", column: "Function Blocks", type: "function"},
        {id: 5, name: "reverse", column: "Function Blocks", type: "function"},
        {id: 0, name: "", column: "결과 슬롯", type: "result"}
    ]);

    const returnItemsForSlot = (columnName, className) => {
        return items
            .filter((item) => item.column === columnName)
            .map((item) => (
                <MovableItem key={item.id} name={item.name} setItems={setItems} dataType={item.type}
                             result={result} setResult={setResult} className={className}/>
            ))
    }

    const runClick = () => {
        setItems((prevState) => {
            return prevState.map(e => {
                return {
                    ...e,
                    name: e.id === 0 ? result : e.name,
                }
            })
        });
    }

    return (
        <div>
            <div className="navigation">
                <button className="run-btn" onClick={runClick}>
                    실행하기
                </button>
            </div>
            <div className="container">
                <div className="content">
                    <DndProvider backend={HTML5Backend}>
                        <div className={"first-column"}>
                            <Slot title={"Data Blocks"} className={"list"} dataType={"everybody"}>
                                {returnItemsForSlot("Data Blocks", {className})}
                            </Slot>

                            <Slot title={"Function Blocks"} className={"list"} dataType={"everybody"}>
                                {returnItemsForSlot("Function Blocks",{className})}
                            </Slot>
                        </div>
                        <div className="slot">
                            <Slot title={"데이터 슬롯"} className={"column"} dataType={"data"}>
                                {returnItemsForSlot("데이터 슬롯",{className})}
                            </Slot>
                            <Slot title={"함수 슬롯"} className={"column"} dataType={"function"}>
                                {returnItemsForSlot("함수 슬롯",{className})}
                            </Slot>
                            <Slot title={"결과 슬롯"} className={"column"} dataType={"result"}>
                                {returnItemsForSlot("결과 슬롯",{className})}

                            </Slot>
                        </div>
                    </DndProvider>
                </div>
            </div>
        </div>
    );
}

export default App;