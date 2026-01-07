
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../../../common/Config';
import toast from 'react-hot-toast';

const UpdatOutcome = ({ outcomeData, showOutcome, handleClose, outcomes, setOutcomes }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false)
    const userInfo = localStorage.getItem('InfoUserLMS');
    const token = userInfo ? JSON.parse(userInfo).token : null;

    const onSubmit = async (data) => {
        setLoading(true)
        await fetch(`${apiUrl}/outcomes/${outcomeData.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false)
                if (result.status == 200) {
                    toast.success(result.message)
                    const updateOutcomes = outcomes.map(outcome => outcome.id == result.data.id
                        ? { ...outcomes, text: result.data.text } : outcome
                    )
                    setOutcomes(updateOutcomes)
                }
                else {
                    console.log("Something went wrong")
                }
            })
    }
    useEffect(() => {
        if (outcomeData) {
            reset({
                outcome: outcomeData.text
            })
        }
    }, [outcomeData])
    return (
        <>

            <Modal size='lg' show={showOutcome} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Outcome</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label htmlFor="" className='form-label'> Outcome </label>
                            <input
                                {
                                ...register('outcome', { required: "The outcome field is required" })
                                }
                                type="text" className={`form-control ${errors.outcome && 'is-invalid'}`} placeholder='Title' />
                            {
                                errors.outcome && <p className="invalid-feedback"> {errors.outcome.message}</p>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>

                        <button className="btn btn-primary" type='submit' disabled={loading}>
                            {loading == false ? 'Save' : 'Please wait ...'}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}


export default UpdatOutcome;