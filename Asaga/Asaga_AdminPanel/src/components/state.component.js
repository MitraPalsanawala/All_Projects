import React, { Component } from "react";
import { connect } from "react-redux";
import FormData from 'form-data';
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
import Select from 'react-select';
// import 'react-dropzone-uploader/dist/styles.css';
import MasterService from "../services/master.service";
// import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import '../style.css';
const headerTblStyle = { color: 'black' };

class State extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], CountryName: '', StateID: '', StateName: '',
            countries: [],
            CountryID: { 'label': '--Select State--', 'value': '--Select State--' },
            CountryData: [], SearchCountryData: '', SearchCountryID: '',
            cols: [
                { title: 'Sr.No', width: '5%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'State Name', width: '80%', field: 'StateName', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.StateName}</p>) } },
            ]
        }

    }

    componentDidMount() {
        this.GetCountry();
        this.GetState();
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
            //data: ""
        };
        MasterService.getCountry(config).then(response => {
            //debugger;
            this.setState({ countries: response.data.data.map(item => ({ value: item.CountryID, label: item.CountryName })) });
        }, error => { })

    }

    GetState() {
        var data = JSON.stringify({
            "StateID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getState",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
            //data: ""
        };
        MasterService.getState(config).then(response => {
            //debugger;
            this.setState({ data: response.data.data })
        }, error => { })

    }

    OnCountryChange = (e) => {
        debugger;
        this.setState({ CountryID: e });
    }

    handleSubmit = (e) => {

    }
    render() {

        return (
            <div>
                <div className="container-fluid" style={{ paddingBottom: '22px' }}>
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">State Add</h3>
                                </div>

                                <form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; }}>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>Country Name :</label>
                                                <Select
                                                    options={this.state.countries}
                                                    value={this.state.CountryID}
                                                    onChange={this.OnCountryChange} />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>State Name :</label>
                                                <input type="text" placeholder="State Name" maxLength="500"
                                                    value={this.state.StateName} onChange={(e) => { this.setState({ StateName: e.target.value }) }} className="form-control" />
                                            </div>
                                        </div>
                                        {/* <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>Country Name :</label>
                                                <DropDownListComponent id="ddlelement" dataSource={this.sportsData} popupHeight="200px" popupWidth="250px" placeholder="select a game" className="form-control" />
                                            </div>
                                        </div> */}

                                    </div>
                                    <div className="card-footer">
                                        {!this.state.IsUpdate &&
                                            <button type="submit" onSubmit={this.handleSubmit} className="btn btn-primary" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="fa fa-check-square"></i>Submit</button>
                                        }
                                        {this.state.IsUpdate &&
                                            <button type="button" onClick={this.UpdateSub} className="btn btn-primary" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="fa fa-check-square"></i>Update</button>
                                        }
                                        <button type="button" onClick={this.cancelSub} className="btn btn-danger" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="far fa-window-close"></i>Cancel</button>
                                    </div>
                                </form>

                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }} >
                                <div className="card-header">
                                    <h3 className="card-title">State View</h3>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title="" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditCategory(r.StateID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.RemoveCategory(r.StateID) }
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
export default State;