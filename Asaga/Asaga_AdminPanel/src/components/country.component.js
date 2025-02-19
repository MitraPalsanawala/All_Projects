import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';
import React, { Component } from "react";
// import { Redirect } from 'react-router-dom';
// import { connect } from "react-redux";
import services from "../services/services";
import MasterService from "../services/master.service";
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
import '../style.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
const headerTblStyle = { color: 'black' };

class CountryMaster extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            data: [], CountryName: "", CountryID: "", cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'Country Name', width: '80%', field: 'CountryName', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CountryName}</p>) } },
            ]
        }
    }
    allowOnlyCharacters = (event) => {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (!new RegExp("^[a-zA-Z ]+$").test(keyValue)) event.preventDefault();
        return;
    };
    componentDidMount() {
        this.GetCountry();
    }
    GetCountry() {
        var data = JSON.stringify({
            "CountryID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getCountry",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getCountry(config).then(response => {
            //debugger;
            this.setState({ data: response.data.data })
        }, error => { })
    }
    EditCountry(id) {
        var data = JSON.stringify({
            "CountryID": id
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getCountry",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getCountry(config).then(response => {
            this.setState({
                CountryID: response.data.data[0].CountryID,
                CountryName: response.data.data[0].CountryName
            });
        }, error => { })
    }
    CheckAlert(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = JSON.stringify({
                    "CountryID": id
                });
                var config = {
                    method: 'POST',
                    url: MasterService.API_URL + "deleteCountry",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                MasterService.Country(config).then(response => {
                    if (response.data.status) {
                        this.GetCountry();
                        Swal.fire({
                            title: 'Successfully Deleted', icon: "success", timer: 1500
                        });
                    } else {
                        Swal.fire({ position: 'top-end', icon: 'error', title: response.data.message, showConfirmButton: false, timer: 1500 });
                    }
                }, error => { })
            } else if (result.isDenied) {
                Swal.close();
            }
        });
    }
    ClearData = (e) => {
        debugger;
        this.setState({ CountryID: "", CountryName: "" });
        this.form.reset();
        this.GetCountry();
    }
    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();
        if (this.form.isValid()) {
            var data = "";
            if (this.state.CountryID != "") {
                data = JSON.stringify({
                    "CountryID": this.state.CountryID,
                    "CountryName": this.state.CountryName
                });
            }
            else {
                data = JSON.stringify({
                    "CountryName": this.state.CountryName
                });
            }

            var config = {
                method: 'POST',
                url: MasterService.API_URL + "setCountry",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            MasterService.setCountry(config).then(response => {
                //debugger;
                if (response.data.status) {
                    debugger;
                    if (this.state.CountryID != "") {
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
                    this.GetCountry();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }
    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card card-custom gutter-b example example-compact">
                                <div className="card-header">
                                    <h3 className="card-title">Add Country</h3>
                                </div>
                                <FormWithConstraints
                                    ref={form => this.form = form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>Country Name </label>
                                                    <input type="text" name="CountryName" required value={this.state.CountryName} onChange={(e) => this.setState({ CountryName: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Country Name" />
                                                    <FieldFeedbacks for="CountryName">
                                                        <FieldFeedback when="*">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" onSubmit={this.handleSubmit} className="btn btn-primary" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="fa fa-check-square"></i>Submit</button>

                                        <button type="button" onClick={this.ClearData} className="btn btn-danger" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="far fa-window-close"></i>Cancel</button>

                                    </div>
                                </FormWithConstraints>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="card card-custom">
                                {/* <div className="card-header flex-wrap border-0 pt-6 pb-0">
                                    <div className="card-title">
                                        <h3 className="card-label">View Country</h3>
                                    </div>
                                </div> */}
                                <div className="card-body">
                                    <MaterialTable title="View Country" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditCountry(r.CountryID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.CheckAlert(r.CountryID) }
                                        ]}
                                        options={{
                                            headerStyle: { color: 'black' }, toolbar: true,
                                            paging: true, pageSize: 5, emptyRowsWhenPaging: true, pageSizeOptions: [5, 10, 15, 20],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
export default withCookies(CountryMaster);