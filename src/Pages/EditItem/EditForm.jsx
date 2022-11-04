import { Form, Formik } from 'formik'
import React from 'react'
import CustomField from '../../Hooks/CustomField'

function EditForm({ onSubmit, initialValues, validationSchema, showWarn, loading, err, imgErr }) {
    return (
        <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema} >
            {(props) => (
                <Form>
                    <CustomField name='name' type='text' label='Title' warn={+showWarn.title} />
                    <CustomField name='year' type='number' label='Year' />
                    <CustomField name='watchDate' type='datetime-local' label='Watch Date' />
                    <CustomField name='url' type='text' label='Image URL' warn={+showWarn.img} />
                    <p id="submitting"></p>
                    {loading && <div className="loading"> <p className="text">
                        Verifying Data... </p>
                        <div className="loader"></div>
                    </div>}
                    <span className="err">{err?.messageTitle}</span>
                    <span className="err showSuccess">{imgErr}</span>
                    {!loading && <button type='submit'>Submit</button>}
                </Form>
            )}
        </Formik>
    )
}

export default EditForm