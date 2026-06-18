
import { Checklist } from "../models/CheckList.models.js";

const createChecklist = async (req, res) => {

    try {

        const {
            tripId,
            task
        } = req.body;

        const checklist =
            await Checklist.create({

                tripId,

                task

            });

        return res.status(201).json({

            success: true,

            checklist

        });

    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getChecklist = async (req, res) => {

    try {

        const { tripId } =
            req.params;

        const checklist =
            await Checklist.find({

                tripId

            });

        return res.status(200).json({

            success: true,

            checklist

        });

    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


const updateChecklist = async (req, res) => {

    try {

        const { id } =
            req.params;

        const {
            completed
        } = req.body;

        const checklist =
            await Checklist.findByIdAndUpdate(

                id,

                {
                    completed
                },

                {
                    new: true
                }

            );

        return res.status(200).json({

            success: true,

            checklist

        });

    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const deleteChecklist = async (req, res) => {

    try {

        const { id } =
            req.params;

        await Checklist.findByIdAndDelete(
            id
        );

        return res.status(200).json({

            success: true,

            message:
                "Checklist item deleted"

        });

    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export {createChecklist , getChecklist , updateChecklist , deleteChecklist};