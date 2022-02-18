import './App.css';
import React, {useEffect, useState} from "react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const DeleteBtn = ({id, items, setItems}) => {
    const deleteItem = () => {
    //     setItems((item) => {
    //         console.log("삐용")
    //             console.log(id)
    //             // .filter(item.id === id)
    //             // .map(e => {
    //             //     return {
    //             //         ...e,
    //             //         column: id < 2 ? "Data Blocks" : (id < 100 ? "Function Blocks" : "결과 슬롯")
    //             //     }
    //             // })
    //     })
    }



    return (
        <div className={"delete-btn"}>
            <button onClick={deleteItem}>x</button>
        </div>
    )
}

const MovableItem = ({name, setItems, dataType, setIsDataSlotEmpty, setIsFuncSlotEmpty, isFuncSlotEmpty, isDataSlotEmpty, movableClassName, setMovableClassName}) => {

    console.log(movableClassName)
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

            if (dropResult && dropResult.name === "데이터 슬롯" && !isDataSlotEmpty) {
                setIsDataSlotEmpty(item.name)

                changeItemColumn(item, "데이터 슬롯")
            } else if (dropResult && dropResult.name === "함수 슬롯" && !isFuncSlotEmpty) {
                setIsFuncSlotEmpty(item.name)
                changeItemColumn(item, "함수 슬롯")
            }

        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),

    });

    const opacity = isDragging ? 0.4 : 1;
    return (
        <div ref={drag} className={movableClassName} style={{opacity}}>
            <div className={"name"}>
                {name}
            </div>
        </div>
    )
}

const Slot = ({items, setItems, title, children, className, dataType}) => {
    const [, drop] = useDrop({
        accept: dataType,
        drop: () => (
            {name: title}
        )
    });


    return (
        <div ref={drop} className={className}>

            {((children.length === 0 && (title === "데이터 슬롯" || title === "함수 슬롯")) ||
                    (title === "결과 슬롯" && ( children[0].props.name === null)) ||
                    (title === "Data Blocks" || title === "Function Blocks")) && title}

            {((children.length === 1 && (title === "데이터 슬롯" || title === "함수 슬롯")) &&
                (title !== "결과 슬롯") &&
                (title !== "Data Blocks" || title !== "Function Blocks")) && <DeleteBtn id = {children.id} items={items} setItems={setItems}/>}
            {/*{console.log("--", children[0].props.name)}*/}
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
    const [movableClassName, setMovableClassName] = useState("")
    const [isDataSlotEmpty, setIsDataSlotEmpty] = useState('')
    const [isFuncSlotEmpty, setIsFuncSlotEmpty] = useState('')
    const [items, setItems] = useState([
        {id: 1, name: "Smarter alone, Smartest together", column: "Data Blocks", type: "data"},
        {id: 2, name: "Make AI work for the rest of us", column: "Data Blocks", type: "data"},
        {id: 3, name: "toUpperCase", column: "Function Blocks", type: "function"},
        {id: 4, name: "wordNum", column: "Function Blocks", type: "function"},
        {id: 5, name: "reverse", column: "Function Blocks", type: "function"},
        {id: 100, name: null, column: "결과 슬롯", type: "result"}
    ]);

    const returnItemsForSlot = (columnName, className) => {
        return items
            .filter((item) => item.column === columnName)
            .map((item) => (
                <MovableItem key={item.id}
                             name={item.name}
                             setItems={setItems}
                             dataType={item.type}
                             setIsDataSlotEmpty={setIsDataSlotEmpty}
                             isDataSlotEmpty={isDataSlotEmpty}
                             setIsFuncSlotEmpty={setIsFuncSlotEmpty}
                             isFuncSlotEmpty={isFuncSlotEmpty}
                             movableClassName={className}
                             setMovableCalssName={setMovableClassName} />
            ))
    }

    const runClick = () => {
        if (isFuncSlotEmpty && isDataSlotEmpty) {
            setItems((prevState) => {
                return prevState.map(e => {
                    return {
                        ...e,
                        name: e.id === 100 ? eval(isFuncSlotEmpty)(isDataSlotEmpty) : e.name,
                    }
                })
            });
        }
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
                            <Slot items={items} setItems={setItems} title={"Data Blocks"} className={"list"} dataType={"everybody"}>
                                {returnItemsForSlot("Data Blocks", "movable-item")}
                            </Slot>

                            <Slot items={items} setItems={setItems} title={"Function Blocks"} className={"list"} dataType={"everybody"}>
                                {returnItemsForSlot("Function Blocks", "movable-item")}
                            </Slot>
                        </div>
                        <div className="slot">
                            <Slot items={items} setItems={setItems} title={"데이터 슬롯"} className={"column"} dataType={"data"}>
                                {returnItemsForSlot("데이터 슬롯", "movable-item")}
                            </Slot>
                            <Slot items={items} setItems={setItems} title={"함수 슬롯"} className={"column"} dataType={"function"}>
                                {returnItemsForSlot("함수 슬롯", "movable-item")}
                            </Slot>
                            <Slot items={items} setItems={setItems} title={"결과 슬롯"} className={"column"} dataType={"result"}>
                                {returnItemsForSlot("결과 슬롯", "result-item")}

                            </Slot>
                        </div>
                    </DndProvider>
                </div>
            </div>
        </div>
    );
}

export default App;