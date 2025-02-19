import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { withSignIn } from 'react-auth-kit'
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import service from '../services/services'
import Swal from "sweetalert2";

class Login extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {
            name: cookies.get('UserName')
        };
        this.state = { UserName: "", Password: "", MobileNo: "" };
    }

    handleSubmit = (e) => {
        debugger;
        e.preventDefault()
        var data = JSON.stringify({
            "UserName": this.state.UserName,
            "Password": this.state.Password
        });

        var config = {
            method: 'POST',
            url: service.API_URL + "setAdminLogIn",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        service.setAdminLogIn(config).then(response => {
            if (response.data.status) {
                const { cookies } = this.props;
                // cookies.set('UserID', response.data.data[0].UserID, { path: '/' });
                cookies.set('UserName', response.data.data[0].UserName);
                // if (response.data.data[0].UserType != "Admin") {
                //     cookies.set('MainClientID', response.data.data[0].ClientID, { path: '/' });
                //     cookies.set('MainCompanyID', response.data.data[0].CompanyID, { path: '/' });
                // }
                window.location.href = "/ItemDetail";

            }
            else {
                Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
            }
        }, error => { })
    }



    render() {
        return (
            <>
                <div style={{ height: '100%' }}>
                    <div className="d-flex flex-column flex-root" style={{ height: '100%' }}>
                        <div className="login login-4 login-signin-on d-flex flex-row-fluid" id="kt_login">
                            <div class="d-flex flex-center bgi-size-cover bgi-no-repeat flex-row-fluid"
                                style={{ backgroundImage: "url(../Images/bg-1.jpg)" }}>
                                <div className="login-form text-center p-7 position-relative overflow-hidden" >
                                    <div className="d-flex flex-center mb-15">

                                    </div>

                                    <div className="row" style={{ boxShadow: '0px 7px 29px 0px' }}>
                                        <div className="col-md-12">
                                            <div class="login-signin">
                                                <div class="mb-10 mt-10 mr-10 ml-10">
                                                    <h3 style={{ color: 'White' }}>LogIn To Admin</h3>
                                                    {/* <p class="opacity-60 font-weight-bold">Enter your details to login to your account:</p> */}
                                                </div>
                                                <form className="form" id="kt_login" onSubmit={this.handleSubmit}>
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <div class="form-group">
                                                                <input class="form-control h-auto text-white placeholder-white bg-dark-o-70 rounded-pill border-0 py-4 px-8 mb-5 ml-12" type="text" value={this.state.UserName} onChange={(e) => this.setState({ UserName: e.target.value })} placeholder="UserName" name="UserName" autoComplete="off" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-10">
                                                            <div class="form-group">
                                                                <input class="form-control h-auto text-white placeholder-white bg-dark-o-70 rounded-pill border-0 py-4 px-8 mb-5 ml-12" type="password" value={this.state.Password} onChange={(e) => this.setState({ Password: e.target.value })} placeholder="Password" name="Password" />
                                                            </div>
                                                        </div>
                                                        <div class="form-group d-flex flex-wrap justify-content-between align-items-center px-8">
                                                        </div>
                                                        <div className="col-md-10">
                                                            <div class="form-group text-centermb-10 mt-10  ml-20">
                                                                <button type="submit" onClick={this.handleSubmit} id="kt_login_signin_submit" className="btn btn-pill btn-outline-white font-weight-bold opacity-90 px-15 py-3">Log In</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

    }
}
export default withCookies(Login);