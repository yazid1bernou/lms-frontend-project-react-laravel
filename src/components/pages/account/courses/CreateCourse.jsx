import { useForm } from "react-hook-form";
import Layout from "../../../common/Layout"
import UserSidebar from "../../../common/UserSidebar";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../../../common/Config";
import toast from "react-hot-toast";

const CreateCourse = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm()
    const navigate = useNavigate()

    const userInfo = localStorage.getItem('InfoUserLMS')
    const token = userInfo ? JSON.parse(userInfo).token : null


    const onSubmit = async (data) => {
        await fetch(`${apiUrl}/courses`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        },)
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    toast.success("Course Created successfully ")
                    navigate('/account/courses/edit/' + result.course.id)


                } else {
                    toast.error(result.message)
                }
            })
    }
    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container pb-5 pt-3'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Create course</li>
                            </ol>
                        </nav>
                        <div className='row'>
                            <div className='col-md-12 mt-5 mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <h2 className='h4 mb-0 pb-0'>Create course</h2>
                                </div>
                            </div>
                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>
                            <div className='col-lg-9'>
                                <div className='row'>
                                    <div className="card border-0 shadow-lg">
                                        <div className="card-body p-4">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="mb-3">

                                                    <label htmlFor="">Title</label>
                                                    <input
                                                        {
                                                        ...register('title', { required: 'The field title is required.' })
                                                        }
                                                        type="text" className={`form-control ${errors.title && 'is-invalid'}`} placeholder="Title" />
                                                    {
                                                        errors.title && <p className="invalid-feedback">{errors.title.message}</p>
                                                    }
                                                </div>
                                                <button className="btn btn-primary">Continue</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout >

        </>
    )
}

export default CreateCourse;