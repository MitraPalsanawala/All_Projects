import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';
import React, { Component } from "react";
import { connect } from "react-redux";
import FormData from 'form-data';
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
// import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import MasterService from "../services/master.service";
import '../style.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
const headerTblStyle = { color: 'black' };

class CoupanCode extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            data: [], CoupanCodeID: "", CoupanCode: "", CoupanCodeDiscount: "", Type: "", StartDate: "", EndDate: "",
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'Coupan Code', width: '80%', field: 'CoupanCode', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CoupanCode}</p>) } },
                { title: 'CoupanCode Discount', width: '80%', field: 'CoupanCodeDiscount', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CoupanCodeDiscount}</p>) } },
                { title: 'Type', width: '80%', field: 'Type', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.Type}</p>) } },
                { title: 'StartDate', width: '80%', field: 'StartDate', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.StartDate}</p>) } },
                { title: 'EndDate', width: '80%', field: 'EndDate', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.EndDate}</p>) } },
            ]
        }
    }

    componentDidMount() {
        this.GetCoupanCode();
    }

    GetCoupanCode() {
        var data = JSON.stringify({
            "CoupanCodeID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getCouponCode",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getCouponCode(config).then(response => {
            //debugger;
            this.setState({ data: response.data.data })
        }, error => { })
    }

    EditCoupanCode(id) {
        debugger;
        var data = JSON.stringify({
            "CoupanCodeID": id
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getCouponCode",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getCouponCode(config).then(response => {
            var dateString = response.data.data[0].StartDate;
            var dateMomentObject = moment(dateString, "DD-MM-YYYY");
            var date = dateMomentObject.toDate();

            var DateString = response.data.data[0].EndDate;
            var DateMomentObject = moment(DateString, "DD-MM-YYYY");
            var Date = DateMomentObject.toDate();

            debugger;
            this.setState({
                CoupanCodeID: response.data.data[0].CoupanCodeID,
                CoupanCode: response.data.data[0].CoupanCode,
                CoupanCodeDiscount: response.data.data[0].CoupanCodeDiscount,
                Type: response.data.data[0].Type,
                StartDate: date ? date : '',
                EndDate: Date ? Date : ''
            });
        }, error => { })
    }

    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();
        if (this.form.isValid()) {
            var data = "";
            if (this.state.CoupanCodeID != "") {
                data = JSON.stringify({
                    "CoupanCodeID": this.state.CoupanCodeID,
                    "CoupanCode": this.state.CoupanCode,
                    "CoupanCodeDiscount": this.state.CoupanCodeDiscount,
                    "Type": this.state.Type,
                    "StartDate": moment(this.state.StartDate).format('DD-MM-YYYY'),
                    "EndDate": moment(this.state.EndDate).format('DD-MM-YYYY')
                });
            }
            else {
                data = JSON.stringify({
                    "CoupanCode": this.state.CoupanCode,
                    "CoupanCodeDiscount": this.state.CoupanCodeDiscount,
                    "Type": this.state.Type,
                    "StartDate": moment(this.state.StartDate).format('DD-MM-YYYY'),
                    "EndDate": moment(this.state.EndDate).format('DD-MM-YYYY')
                });
            }

            var config = {
                method: 'POST',
                url: MasterService.API_URL + "setCouponCode",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            MasterService.setCouponCode(config).then(response => {
                //debugger;
                if (response.data.status) {
                    debugger;
                    if (this.state.CoupanCodeID != "") {
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
                    this.GetCoupanCode();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }

    ClearData = (e) => {
        debugger;
        this.setState({ CountryID: "", CoupanCode: "", CoupanCodeDiscount: "", Type: "", StartDate: "", EndDate: "" });
        this.form.reset();
        this.GetCoupanCode();
    }

    RemoveCoupanCode(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = JSON.stringify({
                    "CoupanCodeID": id
                });
                var config = {
                    method: 'POST',
                    url: MasterService.API_URL + "deleteCouponCode",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                MasterService.deleteCouponCode(config).then(response => {
                    if (response.data.status) {
                        this.GetCoupanCode();
                        Swal.fire({
                            title: 'Successfully Deleted', icon: "success", timer: 1500
                        });
                    } else {
                        Swal.fire({ icon: 'error', title: response.data.message, showConfirmButton: false, timer: 1500 });
                    }
                }, error => { })
            } else if (result.isDenied) {
                Swal.close();
            }
        });
    }

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">CoupanCode Add</h3>
                                </div>
                                {/* <form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; }}> */}
                                <FormWithConstraints
                                    ref={form => this.form = form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>Coupan Code :</label>
                                                <input type="text" name="CoupanCode" required value={this.state.CoupanCode} onChange={(e) => this.setState({ CoupanCode: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Coupan Code" />
                                                <FieldFeedbacks for="CoupanCode">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>CoupanCode Discount :</label>
                                                <input type="text" name="CoupanCodeDiscount" required value={this.state.CoupanCodeDiscount} onChange={(e) => this.setState({ CoupanCodeDiscount: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter CoupanCode Discount" />
                                                <FieldFeedbacks for="CoupanCodeDiscount">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>Type :</label>
                                                <input type="text" name="Type" required value={this.state.Type} onChange={(e) => this.setState({ Type: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter CoupanCode Discount" />
                                                <FieldFeedbacks for="Type">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>StartDate :</label>
                                                <DatePicker dateFormat="dd-MM-yyyy" name='StartDate' selected={this.state.StartDate} minDate={new Date()} autoComplete="off" className="form-control readonly" id="txtTaskDate" value={this.state.StartDate}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            StartDate: e,
                                                        });
                                                    }}
                                                />
                                                <FieldFeedbacks for="StartDate">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>EndDate :</label>
                                                <DatePicker dateFormat="dd-MM-yyyy" name='EndDate' selected={this.state.EndDate} minDate={new Date()} autoComplete="off" className="form-control readonly" id="txtTaskDate" value={this.state.EndDate}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            EndDate: e,
                                                        });
                                                    }}
                                                />
                                                <FieldFeedbacks for="EndDate">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
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

                        <div className="col-md-8">
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }} >
                                <div className="card-header">
                                    <h3 className="card-title">CoupanCode View</h3>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title="" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditCoupanCode(r.CoupanCodeID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.RemoveCoupanCode(r.CoupanCodeID) }
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
            </div >

        );
    }
}

export default withCookies(CoupanCode);