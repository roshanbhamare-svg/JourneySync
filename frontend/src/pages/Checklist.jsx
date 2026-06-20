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
         <div>

            <h1>
                Checklist
            </h1>

            <input
                type="text"
                placeholder="Add Task"
                value={task}
                onChange={(e)=>
                setTask(
                    e.target.value
                )}
            />

            <button
                onClick={
                    handleAdd
                }
            >
                Add
            </button>

            <hr />

            {

                tasks.map(item=>(

                    <div
                    key={item._id}
                    style={{
                        margin:"10px"
                    }}
                    >

                        <input
                            type="checkbox"
                            checked={
                                item.completed
                            }
                            onChange={()=>
                            handleToggle(
                                item
                            )}
                        />

                        <span
                        style={{
                            marginLeft:"10px",

                            textDecoration:
                            item.completed
                            ?
                            "line-through"
                            :
                            "none"
                        }}
                        >
                            {
                                item.task
                            }
                        </span>

                        <button
                        onClick={()=>
                        handleDelete(
                            item._id
                        )}
                        style={{
                            marginLeft:"10px"
                        }}
                        >
                            Delete
                        </button>

                    </div>

                ))

            }

        </div>

       </ItineraryGuard>
    );

}

export default Checklist;