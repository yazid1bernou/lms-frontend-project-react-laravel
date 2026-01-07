import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, Link } from "react-router-dom";
import { apiUrl } from "../../../common/Config";
import toast from "react-hot-toast";
import { MdDragIndicator } from "react-icons/md";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { FaTrashAlt } from "react-icons/fa";
import UpdateRequirement from "./UpdateRequirement";

const ManageRequirement = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [requirements, setRequirements] = useState([]);
    const [requirementData, setRequirementData] = useState();

    const [showRequirement, setShowRequirement] = useState();
    const handleClose = () => setShowRequirement(false);

    const handleShow = (requirement) => {
        setShowRequirement(true)
        setRequirementData(requirement)
    }


    const userInfo = localStorage.getItem('InfoUserLMS')
    const token = userInfo ? JSON.parse(userInfo).token : null

    const onSubmit = async (data) => {
        setLoading(true)
        const formData = { ...data, course_id: params.id }
        await fetch(`${apiUrl}/requirements`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setLoading(false)
                    const newRequirements = [...requirements, result.data]
                    setRequirements(newRequirements)
                    toast.success(result.message)
                    reset()
                }
                else {
                    console.log("Something went wrong default values")
                }
            })
    }

    const fetchRequirements = async () => {
        await fetch(`${apiUrl}/requirements?course_id=${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setRequirements(result.data)
                }
                else {
                    console.log("Something went wrong.")
                }
            })
    }

    const deleteRequirement = async (id) => {
        if (confirm("Are you sur of delete ?")) {
            await fetch(`${apiUrl}/requirements/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },

            })
                .then(res => res.json())
                .then(result => {
                    setLoading(false)
                    if (result.status == 200) {

                        const newRequirements = requirements.filter(requirement => requirement.id != id)
                        setRequirements(newRequirements)
                        toast.success(result.message)
                        reset()
                    }
                    else {
                        console.log("Something went wrong default values")
                    }
                })
        }
    }

    useEffect(() => {
        fetchRequirements()
    }, [])


    return (
        <>
            <div className="card shadow-lg border-0 mt-4">
                <div className="card-body p-4">
                    <div className="d-flex">
                        <h4 className="h5 mb-3">Requirement</h4>
                    </div>
                    <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <input
                                className={`form-control ${errors.requirement && 'is-invalid'} `}
                                {
                                ...register("requirement", {
                                    required: "The Requirement field is required."
                                })
                                }
                                type="text" placeholder="Requirement" />
                            {
                                errors.requirement && <p className="invalid-feedback"> {errors.requirement.message}</p>
                            }
                        </div>
                        <button
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading == false ? 'Save' : 'Wait please ...'}

                        </button>

                    </form>
                    {
                        requirements && requirements.map(requirement => {
                            return (
                                <div key={`requirement-${requirement.id}`} className="card shadow mb-2">
                                    <div className="card-body p-2 d-flex">
                                        <div><MdDragIndicator />   </div>
                                        <div className="d-flex justify-content-between w-100">
                                            <div className="ps-2">
                                                {requirement.text}
                                            </div>
                                            <div className="d-flex">
                                                <Link href="#" onClick={() => handleShow(requirement)} className="text-primary me-1"> <HiMiniPencilSquare /></Link>
                                                <Link href="#" onClick={() => deleteRequirement(requirement.id)} className="text-danger">  <FaTrashAlt /></Link>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <UpdateRequirement
                requirementData={requirementData}
                showRequirement={showRequirement}
                handleClose={handleClose}
                requirements={requirements}
                setRequirements={setRequirements}

            />
        </>
    )
}


export default ManageRequirement;