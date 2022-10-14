import React from 'react'

export const Login = () => {
    return (
        <div>
            <React.Fragment>
                <main>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="myForm text-center">
                                <h1 className='misty' > Login </h1>
                                <form>
                                    <div className="form-group ">
                                        <label >Email address</label>
                                        <input type="email" className="form-control" required placeholder="Enter E-Mail" />
                                    </div>
                                    <div className="form-group ">
                                        <label >Password</label>
                                        <input type="password" className="form-control" required placeholder="Enter a Password" />
                                    </div>

                                    <button type="submit" className="btn-sm btn btn-outline-warning">Log In</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="myForm text-center">
                                <h1 className='misty' > Register </h1>
                                <form>
                                    <div className="form-group ">
                                        <label >Email Address</label>
                                        <input type="email" className="form-control" required placeholder="Enter E-Mail" />
                                    </div>
                                    <div className="form-group ">
                                        <label >Display Name</label>
                                        <input type="text" className="form-control" required placeholder="Enter UserName" />
                                    </div>
                                    <div className="form-group ">
                                        <label >Password</label>
                                        <input type="password" className="form-control" required placeholder="Enter a Password" />
                                    </div>

                                    <button type="submit" className="btn-sm btn btn-outline-warning">Sign Up</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </React.Fragment>
        </div>
    )
}
