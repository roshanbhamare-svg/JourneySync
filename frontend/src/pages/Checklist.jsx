import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import {
    createChecklist,
    getChecklist,
    updateChecklist,
    deleteChecklist
}
from "../services/checklistService";

import ItineraryGuard from "../components/ItineraryGuard";

function Checklist(){

    const { tripId } =
    useParams();

    const [task,
    setTask] =
    useState("");

    const [tasks,
    setTasks] =
    useState([]);

    useEffect(()=>{

        loadTasks();

    },[]);

    const loadTasks =
    async()=>{

        try{

            const data =
            await getChecklist(
                tripId
            );

            setTasks(
                data.checklist
            );

        }
        catch(error){

            console.log(error);

        }

    };

    const handleAdd =
    async()=>{

        try{

            if(!task) return;

            await createChecklist({

                tripId,

                task

            });

            setTask("");

            loadTasks();

        }
        catch(error){

            console.log(error);

        }

    };

    const handleToggle =
    async(item)=>{

        try{

            await updateChecklist(

                item._id,

                {

                    completed:
                    !item.completed

                }

            );

            loadTasks();

        }
        catch(error){

            console.log(error);

        }

    };

    const handleDelete =
    async(id)=>{

        try{

            await deleteChecklist(
                id
            );

            loadTasks();

        }
        catch(error){

            console.log(error);

        }

    };

    return(

       <ItineraryGuard>
         <div className="checklist-container">

            <h1 style={{ marginBottom: "8px" }}>Trip Checklist</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                Keep track of your essentials, packing lists, and pre-departure tasks.
            </p>

            <div className="glass-panel">
                <div className="checklist-input-row">
                    <input
                        type="text"
                        placeholder="e.g. Pack passport & chargers"
                        value={task}
                        onChange={(e)=> setTask(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAdd();
                            }
                        }}
                    />

                    <button
                        className="btn-primary"
                        onClick={handleAdd}
                    >
                        Add
                    </button>
                </div>

                {tasks.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)", fontStyle: "italic", textAlign: "center", padding: "12px" }}>
                        All caught up! No tasks left.
                    </p>
                ) : (
                    <div className="checklist-list">
                        {
                            tasks.map(item=>(

                                <div key={item._id} className="checklist-item">

                                    <div 
                                        className="checklist-item-left"
                                        onClick={() => handleToggle(item)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => {}} /* Handled by parent click */
                                        />

                                        <span className={`checklist-text ${item.completed ? "completed" : ""}`}>
                                            {item.task}
                                        </span>
                                    </div>

                                    <button
                                        className="btn-danger"
                                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                                        onClick={(e)=> {
                                            e.stopPropagation();
                                            handleDelete(item._id);
                                        }}
                                    >
                                        Delete
                                    </button>

                                </div>

                            ))
                        }
                    </div>
                )}
            </div>

        </div>

       </ItineraryGuard>
    );

}

export default Checklist;