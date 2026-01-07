import { useForm } from "react-hook-form";
import Layout from "../../../common/Layout"
import UserSidebar from "../../../common/UserSidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../../common/Config";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import ManageOutcome from "./ManageOutcome";
import ManageRequirement from "./ManageRequirement";
import EditCover from "./EditCover";

const EditCourse = () => {
    const navigate = useNavigate()

    const userInfo = localStorage.getItem('InfoUserLMS')
    const token = userInfo ? JSON.parse(userInfo).token : null

    const [categories, setCategories] = useState()
    const [levels, setLevels] = useState()
    const [languages, setLanguages] = useState()

    const [course, setCourse] = useState([])

    const params = useParams()
    const [loading, setLoading] = useState(false)

    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        defaultValues: async () => {
            await fetch(`${apiUrl}/courses/${params.id}`, {
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
                        console.log(result)
                        reset({
                            title: result.data.title,
                            category: result.data.category_id,
                            level: result.data.level_id,
                            language: result.data.language_id,
                            description: result.data.description,
                            sell_price: result.data.price,
                            cross_price: result.data.cross_price,

                        })
                        setCourse(result.data)
                    }
                    else {
                        console.log("Something went wrong default values")
                    }
                })
        }
    })


    const onSubmit = async (data) => {
        setLoading(true)
        await fetch(`${apiUrl}/courses/${params.id}`, {
            method: 'PUT',
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
                    setLoading(false)
                    toast.success("Course Created successfully ")
                } else {
                    const errors = result.errors
                    Object.keys(errors).forEach(field => {
                        setError(field, { message: errors[field][0] })
                    })
                }
            })
    }

    const courseMetaData = async (data) => {
        await fetch(`${apiUrl}/courses/meta-data`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        },)
            .then(res => res.json())
            .then(result => {
                console.log(result)
                if (result.status == 200) {
                    console.log(result.categories)
                    setCategories(result.categories)
                    setLevels(result.levels)
                    setLanguages(result.languages)


                } else {
                    console.log("Something went wrong!")
                }
            })
    }
    useEffect(() => {
        courseMetaData()
    }, [])
    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container pb-5 pt-3'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Edit course</li>
                            </ol>
                        </nav>
                        <div className='row'>
                            <div className='col-md-12 mt-5 mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <h2 className='h4 mb-0 pb-0'>Edit course</h2>
                                </div>
                            </div>
                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>
                            <div className='col-lg-9'>
                                <div className='row'>
                                    <div className="col-md-7">
                                        <div className="card border-0 shadow-lg">
                                            <div className="card-body p-4">
                                                <h4 className="h5 border-bottom pb-3 mb-3">Course Details</h4>
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="">Title</label>
                                                        <input
                                                            {
                                                            ...register('title', { required: 'The field title is required.' })
                                                            }
                                                            type="text" className={`form-control ${errors.title && 'is-invalid'}`} placeholder="Title" />
                                                        {
                                                            errors.title && <p className="invalid-feedback">{errors.title.message}</p>
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="category">Category</label>
                                                        <select className={`form-select ${errors.category && 'is-invalid'}`}
                                                            {
                                                            ...register('category', { required: 'The field category is required.' })
                                                            }

                                                        >
                                                            <option value="">Select a Category</option>
                                                            {categories && categories.map(category => {
                                                                return <option key={category.id} value={category.id}>{category.name}</option>
                                                            })}
                                                        </select>
                                                        {
                                                            errors.category && <p className="invalid-feedback">{errors.category.message}</p>
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="level">Level</label>
                                                        <select className={`form-select ${errors.level && 'is-invalid'}`}
                                                            {
                                                            ...register('level', { required: 'The field level is required.' })
                                                            }
                                                        >
                                                            <option value="">Select a Level</option>
                                                            {levels && levels.map(level => {
                                                                return <option key={level.id} value={level.id}>{level.name}</option>
                                                            })}
                                                        </select>
                                                        {
                                                            errors.level && <p className="invalid-feedback">{errors.level.message}</p>
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="language">Language</label>
                                                        <select className={`form-select ${errors.language && 'is-invalid'}`}
                                                            {
                                                            ...register('language', { required: 'The field language is required.' })
                                                            }
                                                        >
                                                            <option value="">Select a Language</option>
                                                            {languages && languages.map(language => (
                                                                <option key={language.id} value={language.id}>{language.name}</option>
                                                            ))}
                                                        </select>
                                                        {
                                                            errors.language && <p className="invalid-feedback">{errors.language.message}</p>
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="description">Description</label>
                                                        <textarea
                                                            {
                                                            ...register('description', { required: 'The field description is required.' })
                                                            }
                                                            id="description" rows={5} placeholder="Description" className={`form-control ${errors.description && 'is-invalid'}`} >

                                                        </textarea>
                                                        {
                                                            errors.description && <p className="invalid-feedback">{errors.description.message}</p>
                                                        }
                                                    </div>
                                                    <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>

                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="sell-price">Sell price</label>
                                                        <input
                                                            {
                                                            ...register('sell_price', { required: 'The field sell price is required.' })
                                                            }
                                                            type="text" className={`form-control ${errors.sell_price && 'is-invalid'}`} placeholder="Sell price" id="sell-price" />
                                                        {
                                                            errors.sell_price && <p className="invalid-feedback">{errors.sell_price.message}</p>
                                                        }
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="cross_price">Cross price</label>
                                                        <input
                                                            {
                                                            ...register('cross_price', { required: 'The field cross price is required.' })
                                                            }
                                                            type="text" className={`form-control ${errors.cross_price && 'is-invalid'}`} placeholder="Cross price" id="cross_price" />
                                                        {
                                                            errors.cross_price && <p className="invalid-feedback">{errors.cross_price.message}</p>
                                                        }
                                                    </div>
                                                    <button className="btn btn-primary">
                                                        {loading == false ? 'Update' : 'Wait please ...'}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">

                                        <ManageOutcome />
                                        <ManageRequirement />
                                        <EditCover course={course} setCourse={setCourse} />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
            </Layout >

        </>
    )
}

export default EditCourse;