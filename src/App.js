import './App.css';
import React, {useState} from "react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

// 데이터 슬롯, 함수 슬롯에 존재하는 삭제 버튼 (기능 구현 미완성)
const DeleteBtn = ({id, items, setItems}) => {

    /*
     버튼 클릭 이벤트 발생시 해당 함수를 호출하여, 클릭된 item의 column을 바꿈으로써 해당 블록을 제거하려고 했으나,
     현재는 함수가 호출되면 화면 전체 컴포넌트가 사라지는 버그가 발생하는 상황입니다.
     */
    const deleteItem = () => {
        setItems(() => {
            return items
                .filter((item) => (item.id === eval(id)))
                .map(e => {
                    {console.log(id, e)}
                    return {
                        ...e,
                        column: id < 2 ? "Data Blocks" : (id < 100 ? "Function Blocks" : "결과 슬롯")
                    }
                })
        })
    }

    return (
        <div className={"delete-btn"}>
            <button onClick={deleteItem}>x</button>
        </div>
    )
}

// 드래그 앤 드롭이 가능한 데이터 블록, 함수 블록 혹은 결과 블록
const MovableItem = ({name, setItems, dataType, setIsDataSlotEmpty, setIsFuncSlotEmpty, isFuncSlotEmpty, isDataSlotEmpty, movableClassName, setMovableClassName}) => {

    // 특정 아이템 드래그 종료시 호출되는 함수. 여러 아이템 중 현재 드래그한 아이템의 column 값만 드래그한 블록으로 바꿔놓습니다.
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

    // React Hook 인 useDrag를 사용
    const [{isDragging}, drag] = useDrag({
        item: {name, type: dataType},

        // 아래 type을 이용하여 각 슬롯에 맞는 블록만 드래그 가능하게 구현하였습니다. => "data", "function", "result"
        type: dataType,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();

            // isDataSlotEmpty 와 isFunctionSlotEmpty 스테이트를 사용하여, 각 슬록에는 하나의 아이템만 들어갈 수 있도록 하였고,
            if (dropResult && dropResult.name === "데이터 슬롯" && !isDataSlotEmpty) {
                // 해당 스테이트를 사용하여 추후 결과 계산에 이용하였습니다
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

    // React Hook인 useDrop을 이용하여 dataType에 해당하는 아이템만 슬롯에 놓을 수 있도록 구현하였습니다
    const [, drop] = useDrop({
        accept: dataType,
        drop: () => (
            {name: title}
        )
    });

    return (

        // props와 state를 이용하여 각 슬롯에 아이템이 없는 경우에만 "슬롯 이름"이 보이도록,
        // 아이템이 존재하여 우측 상단에 x 버튼이 보이도록 구현하였습니다.
        <div ref={drop} className={className}>

            {((children.length === 0 && (title === "데이터 슬롯" || title === "함수 슬롯")) ||
                    (title === "결과 슬롯" && ( children[0].props.name === null)) ||
                    (title === "Data Blocks" || title === "Function Blocks")) && title}

            {((children.length === 1 && (title === "데이터 슬롯" || title === "함수 슬롯")) &&
                (title !== "결과 슬롯") &&
                (title !== "Data Blocks" || title !== "Function Blocks")) && <DeleteBtn id = {children[0].key} items={items} setItems={setItems}/>}
            {children}
        </div>
    )
}

// 3가지 함수 블록에 해당하는 계산을 진행하는 함수들입니다.
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

    // 드래그앤 드롭이 가능한 5가지 블록과 결과를 보여줄 블록 데이터입니다
    const [items, setItems] = useState([
        {id: 1, name: "Smarter alone, Smartest together", column: "Data Blocks", type: "data"},
        {id: 2, name: "Make AI work for the rest of us", column: "Data Blocks", type: "data"},
        {id: 3, name: "toUpperCase", column: "Function Blocks", type: "function"},
        {id: 4, name: "wordNum", column: "Function Blocks", type: "function"},
        {id: 5, name: "reverse", column: "Function Blocks", type: "function"},
        {id: 100, name: null, column: "결과 슬롯", type: "result"}
    ]);

    // 각 슬롯에 아이템을 보여주는 함수입니다.
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

    // 실행하기 버튼이 눌렸을 때 호출되는 함수입니다.
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