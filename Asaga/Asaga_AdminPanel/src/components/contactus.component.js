import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';
import React, { Component } from "react";
import FormData from 'form-data';
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
// import 'react-dropzone-uploader/dist/styles.css';
import MasterService from "../services/master.service";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../style.css';
const headerTblStyle = { color: 'black' };

class ContactUS extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            ContactUsID: "",
            MobileNo1: "",
            MobileNo2: "",
            EmailID1: "",
            EmailID2: "",
            Address: "",
            Latitude: "",
            Longitude: "",
            Instagram: "",
            Facebook: "",
            Twitter: "",
            Youtube: "",
        };
    }

    componentDidMount() {
        this.GetContactUs();
    }

    GetContactUs() {
        debugger;
        var data = JSON.stringify({
            "ContactUsID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getContactUs",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getContactUs(config).then(response => {
            debugger;
            // this.setState({ data: response.data.data })
            if (response.data.status) {
                this.setState({
                    ContactUsID: response.data.data[0].ContactUsID,
                    MobileNo1: response.data.data[0].MobileNo1,
                    MobileNo2: response.data.data[0].MobileNo2,
                    EmailID1: response.data.data[0].EmailID1,
                    EmailID2: response.data.data[0].EmailID2,
                    Address: response.data.data[0].Address,
                    Latitude: response.data.data[0].Latitude,
                    Longitude: response.data.data[0].Longitude,
                    Instagram: response.data.data[0].Instagram,
                    Facebook: response.data.data[0].Facebook,
                    Twitter: response.data.data[0].Twitter,
                    Youtube: response.data.data[0].Youtube
                })
            } else {
                this.setState({
                    MobileNo1: '',
                    MobileNo2: '',
                    EmailID1: '',
                    EmailID2: '',
                    Address: '',
                    Latitude: '',
                    Longitude: '',
                    Instagram: '',
                    Facebook: '',
                    Twitter: '',
                    Youtube: '',
                })
            }
        }, error => { })
    }

    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();

        if (this.form.isValid()) {
            var data = "";
            if (this.state.ContactUsID != "") {
                data = JSON.stringify({
                    "ContactUsID": this.state.ContactUsID,
                    "MobileNo1": this.state.MobileNo1,
                    "MobileNo2": this.state.MobileNo2,
                    "EmailID1": this.state.EmailID1,
                    "EmailID2": this.state.EmailID2,
                    "Address": this.state.Address,
                    "Latitude": this.state.Latitude,
                    "Longitude": this.state.Longitude,
                    "Instagram": this.state.Instagram,
                    "Facebook": this.state.Facebook
                });
            } else {
                data = JSON.stringify({
                    // "ContactUsID": this.state.ContactUsID,
                    "MobileNo1": this.state.MobileNo1,
                    "MobileNo2": this.state.MobileNo2,
                    "EmailID1": this.state.EmailID1,
                    "EmailID2": this.state.EmailID2,
                    "Address": this.state.Address,
                    "Latitude": this.state.Latitude,
                    "Longitude": this.state.Longitude,
                    "Instagram": this.state.Instagram,
                    "Facebook": this.state.Facebook
                });
            }
            var config = {
                method: 'POST',
                url: MasterService.API_URL + "setContactUs",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            MasterService.setContactUs(config).then(response => {
                //debugger;
                if (response.data.status) {
                    debugger;
                    if (this.state.ContactUsID != "") {
                        // Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: 'Successfully Updated', showConfirmButton: false, timer: 1500 });
                        Swal.fire({
                            title: 'Successfully Updated', icon: "success", timer: 1500
                        });
                    }
                    else {
                        Swal.fire({
                            title: 'Successfully Inserted', icon: "success", timer: 1500
                        });
                    }
                    this.ClearData();
                    // this.setState({
                    //     MobileNo1: response.data.MobileNo1
                    // })
                    this.GetContactUs();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }

    ClearData = (e) => {
        this.form.reset();
    }

    AllowNumberKey = (e) => {
        var code = ("charCode" in e) ? e.charCode : e.keyCode;
        if (!(code > 47 && code < 58)) { e.preventDefault(); }
    }

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">

                        <div className="col-md-12">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">Contact US</h3>
                                </div>
                                <FormWithConstraints
                                    ref={form => this.form = form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>MobileNo1</label>
                                                    <input type="text" name="MobileNo1" maxLength="10" onKeyPress={this.AllowNumberKey.bind(this)} value={this.state.MobileNo1} onChange={(e) => { this.setState({ MobileNo1: e.target.value }) }} className="form-control" placeholder="Enter MobileNo1" />
                                                    <FieldFeedbacks for="MobileNo1">
                                                        <FieldFeedback when="valueMissing">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>MobileNo2</label>
                                                    <input type="text" name="MobileNo2" maxLength="10" onKeyPress={this.AllowNumberKey.bind(this)} required value={this.state.MobileNo2} onChange={(e) => this.setState({ MobileNo2: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter MobileNo2" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>EmailID1</label>
                                                    <input type="text" name="EmailID1" required value={this.state.EmailID1} onChange={(e) => this.setState({ EmailID1: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter EmailID1" />
                                                    <FieldFeedbacks for="EmailID1">
                                                        <FieldFeedback when="valueMissing">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>EmailID2</label>
                                                    <input type="text" name="EmailID2" required value={this.state.EmailID2} onChange={(e) => this.setState({ EmailID2: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter EmailID2" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group" style={{ width: '100%' }}>
                                                    <label>Address :</label>
                                                    <textarea
                                                        rows="3"
                                                        name='Address'
                                                        style={{ height: "120px" }}
                                                        required value={this.state.Address}
                                                        className="form-control"
                                                        onChange={(e) => this.setState({
                                                            Address: e.target.value
                                                        }, () => { this.form.validateFields(e.target) })}
                                                        placeholder="Enter Address"
                                                    />
                                                    <FieldFeedbacks for="Address">
                                                        <FieldFeedback when="valueMissing">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>


                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Latitude</label>
                                                    <input type="text" name="Latitude" required value={this.state.Latitude} onChange={(e) => this.setState({ Latitude: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Latitude" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Longitude</label>
                                                    <input type="text" name="Longitude" required value={this.state.Longitude} onChange={(e) => this.setState({ Longitude: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Longitude" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Instagram</label>
                                                    <input type="text" name="Instagram" required value={this.state.Instagram} onChange={(e) => this.setState({ Instagram: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Instagram" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Facebook</label>
                                                    <input type="text" name="Facebook" required value={this.state.Facebook} onChange={(e) => this.setState({ Facebook: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Facebook" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" onSubmit={this.handleSubmit} className="btn btn-primary" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="fa fa-check-square"></i>Submit</button>
                                        <button type="button" onClick={this.ClearData} className="btn btn-danger" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="far fa-window-close"></i>Cancel</button>
                                    </div>
                                    {/* </form> */}
                                </FormWithConstraints>
                            </div>
                        </div>



                    </div>

                </div>
            </div >
        );
    }
}
export default withCookies(ContactUS);