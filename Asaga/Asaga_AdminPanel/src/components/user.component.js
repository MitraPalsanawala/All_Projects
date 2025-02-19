import React, { Component } from "react";
//import $ from 'jquery';
import { connect } from "react-redux";
// import Loader from 'react-loader-spinner';
import Swal from "sweetalert2";
//import moment from 'moment';
import FormData from 'form-data';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import MaterialTable from '@material-table/core';
import UserService from "../services/user.service";
import MasterService from "../services/master.service";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../style.css';
import $ from 'jquery';
const headerTblStyle = { color: 'black' };

class UserMaster extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            FirstName: '', MiddleName: '', LastName: '', UserName: '', Password: '', MobileNo: '', EmailID: '',
            LogInStatus: '', CreatedDate: '', data: [], SearchMobileNo: '', IsSearch: false,

            countryies: [],
            CountryID: { 'label': '---Select Country---', 'value': '---Select Country---' },
            SearchCountryID: { 'label': '---Select Country---', 'value': '---Select Country---' },
            CountryMsgErr: '',

            states: [],
            StateID: { 'label': '---Select State---', 'value': '---Select State---' },
            SearchStateID: { 'label': '---Select State---', 'value': '---Select State---' },
            StateMsgErr: '',

            cities: [],
            CityID: { 'label': '---Select City---', 'value': '---Select City---' },
            SearchCityID: { 'label': '---Select City---', 'value': '---Select City---' },
            CityMsgErr: '',
            iconAdd: "fa fa-plus", iconFilter: "fa fa-plus", isFilterVisible: false,

            cols: [
                { title: 'Sr.No', width: '1%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'First Name', width: '15%', field: 'FirstName', headerStyle: headerTblStyle },
                { title: 'Middle Name', width: '15%', field: 'MiddleName', headerStyle: headerTblStyle },
                { title: 'Last Name', width: '15%', field: 'LastName', headerStyle: headerTblStyle },
                { title: 'Mobile No', width: '15%', field: 'MobileNo', headerStyle: headerTblStyle },
                // {
                //     title: 'Password', field: 'Password', headerStyle: headerTblStyle, render: rowData => {
                //         return (
                //             <button type="button" onClick={this.PasswordView(rowData.Password)} className="btn btn-success"><i className="fa fa-eye"></i></button>
                //         )
                //     }
                // },
                { title: 'Email ID', width: '15%', field: 'EmailID', headerStyle: headerTblStyle },
                { title: 'Date', width: '15%', field: 'CreatedDate', headerStyle: headerTblStyle },
            ]
        }

        // this.handleSearch = this.handleSearch.bind(this);
        // this.cancleSearch = this.cancleSearch.bind(this);
        // this.handlechangePIN = this.handlechangePIN.bind(this);
        // this.PasswordView = this.PasswordView.bind(this);
        // this.ShowPIN = this.ShowPIN.bind(this);
        // this.cancelPIN = this.cancelPIN.bind(this);
    }
    componentDidMount() {
        this.GetUser();
        this.GetCountry();
        this.GetState();
        this.GetCity();
    }
    GetUser() {
        debugger;
        var SearchCountryID = "";
        var SearchStateID = "";
        var SearchCityID = ""

        if (this.state.SearchCountryID.value != "---Select Country---") {
            SearchCountryID = this.state.SearchCountryID.value;
        }
        else {
            SearchCountryID = "";
        }
        if (this.state.SearchStateID.value != "---Select State---") {
            SearchStateID = this.state.SearchStateID.value;
        }
        else {
            SearchStateID = "";
        }

        if (this.state.SearchCityID.value != "---Select City---") {
            SearchCityID = this.state.SearchCityID.value;
        }
        else {
            SearchCityID = "";
        }

        var data = JSON.stringify({
            "MobileNo": this.state.SearchMobileNo,
            "CountryID": SearchCountryID,
            "StateID": SearchStateID,
            "CityID": SearchCityID
        });
        // this.setState({ IsSearch: true });
        var config1 = {
            method: 'post',
            url: UserService.API_URL + "viewUserMaster",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        UserService.viewUserMaster(config1).then(response => {
            debugger;
            // this.setState({ data: response.data.data })
            if (response.data.status) {
                this.setState({ data: response.data.data })
            }
            else {
                this.setState({ data: [] })
            }
        }, error => { });
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
            debugger;
            this.setState({ countryies: response.data.data.map(item => ({ value: item.CountryID, label: item.CountryName })) });
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
        };
        MasterService.getState(config).then(response => {
            debugger;
            this.setState({ states: response.data.data.map(item => ({ value: item.StateID, label: item.StateName })) });
        }, error => { })
    }
    GetCity() {
        var data = JSON.stringify({
            "CityID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getCity",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getCity(config).then(response => {
            debugger;
            this.setState({ cities: response.data.data.map(item => ({ value: item.CityID, label: item.CityName })) });
        }, error => { })
    }
    OnCountryChange = (e) => {
        debugger;
        this.setState({ CountryID: e });
        this.setState({ SearchCountryID: e });
    }
    OnStateChange = (e) => {
        debugger;
        this.setState({ StateID: e });
        this.setState({ SearchStateID: e });
    }
    OnCityChange = (e) => {
        debugger;
        this.setState({ CityID: e });
        this.setState({ SearchCityID: e });
    }

    OnFilterClick = (e) => {
        e.preventDefault();
        if (this.state.isFilterVisible === false) {
            this.setState({ isFilterVisible: true });
            this.setState({ iconFilter: "fa fa-minus" });
        }
        else {
            this.setState({ isFilterVisible: false });
            this.setState({ iconFilter: "fa fa-plus" });
        }

    }

    OnSearchUserClick = (e) => {
        debugger;
        e.preventDefault();
        this.GetUser();
    }

    OnSearchCancelUserClick = () => {
        debugger;
        this.setState({
            SearchCityID: { 'label': '---Select City---', 'value': '---Select City---' },
            SearchStateID: { 'label': '---Select State---', 'value': '---Select State---' },
            SearchCountryID: { 'label': '---Select Country---', 'value': '---Select Country---' },
            SearchMobileNo: ""
        }, () => {
            this.GetUser();
        });
        //window.location.reload(true);

    }

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }} >
                    <div className="row">
                        {this.state.isFilterVisible &&
                            <div className="col-md-12">
                                <div className="" style={{ marginBottom: '1%' }} id="divFilter">
                                    <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                        <div className="card-header">
                                            <h3 className="card-title">User Search</h3>
                                        </div>
                                        <div className="col-md-12" style={{ marginTop: '22px' }}>
                                            <div className='row'>
                                                <div className="col-md-3">
                                                    <div className="form-group formgroupcss">
                                                        <label>Mobile No</label>
                                                        <input type="text" value={this.state.SearchMobileNo} onChange={(e) => { this.setState({ SearchMobileNo: e.target.value }) }} className="form-control" name="MobileNo" placeholder="Enter MobileNo" />
                                                    </div>
                                                </div>
                                                <div className="col-md-3" style={{ marginTop: '-12px' }}>
                                                    <button type="button" onClick={this.OnSearchUserClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                                    <button type="button" onClick={this.OnSearchCancelUserClick} className="btn btn-danger mt-12">Cancel </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="col-md-12">
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">User Detail View</h3>
                                    <div className="col-md-6" style={{ textAlign: 'right', paddingTop: '17px' }}>
                                        <a className="btn btn-outline-dark font-weight-bolder" onClick={this.OnFilterClick}>
                                            <i id="btnFilter" className={this.state.iconFilter} /> Filter
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title=""
                                        columns={this.state.cols}
                                        data={this.state.data}
                                        detailPanel={[
                                            {
                                                icon: 'add', tooltip: 'View', title: 'show',
                                                render: ({ rowData }) => {
                                                    if (rowData.UserAddressDetail != null) {
                                                        return (
                                                            <div style={{ width: '100%', padding: '5px', paddingLeft: '35px', display: 'block' }}>
                                                                <table className="table table-bordered m-0" cellSpacing="0" rules="all" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                    <thead>
                                                                        <tr style={{ color: 'black' }}>
                                                                            <th scope="col" style={{ color: 'black', width: '0%' }} >No.</th>
                                                                            <th scope="col" style={{ color: 'black', width: '8%' }}>Company Name</th>
                                                                            <th scope="col" style={{ color: 'black', width: '12%' }}>Address 1</th>
                                                                            <th scope="col" style={{ color: 'black', width: '12%' }}>Address 2</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>Country</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>State</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>City</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>Pincode</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>EmailID</th>

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {rowData.UserAddressDetail.map((value, inx1) => {
                                                                            return (
                                                                                <tr key={inx1}>

                                                                                    <td align="center" style={{ width: "5%" }}>{(inx1 + 1)}</td>
                                                                                    <td >{value.Company ? value.Company : '-'}</td>
                                                                                    <td >{value.Address1 ? value.Address1 : '-'}</td>
                                                                                    <td >{value.Address2 ? value.Address2 : '-'}</td>
                                                                                    <td >{value.CountryName ? value.CountryName : '-'}</td>
                                                                                    <td >{value.StateName ? value.StateName : '-'}</td>
                                                                                    <td >{value.CityName ? value.CityName : '-'}</td>
                                                                                    <td >{value.Pincode ? value.Pincode : '-'}</td>
                                                                                    <td >{value.EmailID ? value.EmailID : '-'}</td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )
                                                    }
                                                    // else { return false; }
                                                }
                                            }
                                        ]}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        )
    }
}
// export default UserMaster;
export default withCookies(UserMaster);