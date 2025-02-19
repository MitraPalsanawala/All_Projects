import React, { Component } from "react";
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import MaterialTable from '@material-table/core';
import OrderService from "../services/order.service";
import UserService from "../services/user.service";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../style.css';
// import $ from 'jquery';
const headerTblStyle = { color: 'black' };

class OrderMaster extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            OrderMasterID: '', UserName: '', DiscountID: '', DiscountAmount: '', TotalAmount: '',
            ShippingCharge: '', FinalAmount: '',
            users: [],
            UserID: { 'label': '---Select User---', 'value': '---Select User---' },
            SearchUserID: { 'label': '---Select User---', 'value': '---Select User---' },
            UserMsgErr: '',

            PaymentMode: [
                { label: "Online", value: "Online" },
                { label: "COD", value: "COD" },
            ],
            PaymentModeObj: { 'label': '--Select Payment Mode--', 'value': '--Select Payment Mode--' },
            SearchPaymentModeID: '',
            PaymentModeStatus: '',

            OrderStatus: [
                { label: "Confirm", value: "Confirm" },
                { label: "Pending", value: "Pending" },
            ],
            OrderStatusObj: { 'label': '--Select Order Status--', 'value': '--Select Order Status--' },
            SearchOrderStatusID: '',
            OrderStatusID: '',

            iconAdd: "fa fa-plus", iconFilter: "fa fa-plus", isFilterVisible: false,
            cols: [
                { title: 'Sr.No', width: '1%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'UserName', width: '35%', field: 'UserName', headerStyle: headerTblStyle },
                // { title: 'DiscountAmount', width: '15%', field: 'DiscountAmount', headerStyle: headerTblStyle },
                // { title: 'Discount', width: '15%', field: 'Discount', headerStyle: headerTblStyle },
                // { title: 'MinAmount', width: '15%', field: 'MinAmount', headerStyle: headerTblStyle },
                { title: 'Total Amount', width: '12%', field: 'TotalAmount', headerStyle: headerTblStyle },
                {
                    title: 'Order Status', field: 'Order Status', headerStyle: headerTblStyle, render: rowData => {
                        return (
                            (rowData.OrderStatus === 'Pending') ? <span style={{ color: 'red' }}>Pending</span> : <span style={{ color: 'green' }}>Confirm</span>

                        )
                    }
                },
                {
                    title: 'Payment Mode', field: 'PaymentMode', headerStyle: headerTblStyle, render: rowData => {
                        return (
                            (rowData.PaymentMode === 'COD') ? <span style={{ color: 'brown' }}>COD</span> : <span style={{ color: 'blue' }}>Online</span>
                        )
                    }
                },
                // { title: 'Payment Mode', width: '15%', field: 'PaymentMode', headerStyle: headerTblStyle },
                { title: 'Date', width: '20%', field: 'CreatedDate', headerStyle: headerTblStyle }
            ]
        }
        this.onPaymentModeChange = this.onPaymentModeChange.bind(this);
        this.onOrderStatusChange = this.onOrderStatusChange.bind(this);
    }
    componentDidMount() {
        this.GetOrderMaster();
        this.GetUser();
    }

    GetOrderMaster() {
        debugger;
        var SearchUserID = "";
        var paymentID = "";
        var StatusID = "";

        if (this.state.SearchUserID.value != "---Select User---") {
            SearchUserID = this.state.SearchUserID.value;
        }
        else {
            SearchUserID = "";
        }

        if (this.state.SearchPaymentModeID != "--Select Payment Mode--") {
            paymentID = this.state.SearchPaymentModeID;
        }
        else {
            paymentID = "";
        }


        if (this.state.SearchOrderStatusID != "--Select Order Status--") {
            StatusID = this.state.SearchOrderStatusID;
        }
        else {
            StatusID = "";
        }

        var data = JSON.stringify({
            "OrderMasterID": "",
            "UserID": SearchUserID,
            "PaymentMode": paymentID,
            "OrderStatus": StatusID
        });
        var config = {
            method: 'POST',
            url: OrderService.API_URL + "getOrderView",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        OrderService.getOrderView(config).then(response => {
            debugger;
            // this.setState({ data: response.data.data })
            if (response.data.status) {
                this.setState({ data: response.data.data })
            }
            else {
                this.setState({ data: [] })
            }
        }, error => { })
    }
    GetUser() {
        debugger;
        var data = JSON.stringify({
            "UserID": ""
        });
        var config = {
            method: 'POST',
            url: UserService.API_URL + "viewUserMaster",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        UserService.viewUserMaster(config).then(response => {
            debugger;
            this.setState({ users: response.data.data.map(item => ({ value: item.UserID, label: item.FirstName })) });
        }, error => { })
    }
    OnUserChange = (e) => {
        debugger;
        this.setState({ UserID: e });
        this.setState({ SearchUserID: e });
    }
    onPaymentModeChange(value) {
        debugger;
        this.setState({ SearchPaymentModeID: value.value });
        this.setState({ PaymentModeObj: value });
        this.setState({ PaymentModeStatus: value.value });
    }

    onOrderStatusChange(value) {
        debugger;
        this.setState({ SearchOrderStatusID: value.value });
        this.setState({ OrderStatusObj: value });
        this.setState({ OrderStatusID: value.value });
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

    OnSearchOrderClick = (e) => {
        debugger;
        e.preventDefault();
        this.GetOrderMaster();
    }

    OnSearchCancelOrderClick = () => {
        debugger;
        this.setState({
            SearchUserID: { 'label': '---Select User---', 'value': '---Select User---' },
            PaymentModeObj: { 'label': '--Select Payment Mode--' },
            SearchPaymentModeID: '',
            OrderStatusObj: { 'label': '--Select Order Status--' },
            SearchOrderStatusID: ''
        }, () => {
            this.GetOrderMaster();
        });
        //window.location.reload(true);

    }
    ClearData = (e) => {
        debugger
        // e.preventDefault();
        this.form.reset();
        this.setState({
            users: [], UserErrMsg: '',
            SearchUserID: { 'label': '---Select Category---', 'value': '---Select Category---' },
            OrderTypeObj: { 'label': '--Select Payment Mode--' },
            // SearchOrderType: '', SearchOrderTypeID: ''
        });
        this.GetOrderMaster();
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
                                            <h3 className="card-title">Order Detail Search</h3>
                                        </div>
                                        <div className="col-md-12" style={{ marginTop: '22px' }}>
                                            <div className='row'>
                                                <div className="col-md-3">
                                                    <div className="form-group formgroupcss">
                                                        <label>User: </label>
                                                        <Select options={this.state.users} value={this.state.SearchUserID} onChange={(e) => this.setState({ SearchUserID: e })} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group formgroupcss">
                                                        <label>Payment Mode:</label>
                                                        <Select
                                                            options={this.state.PaymentMode}
                                                            value={this.state.PaymentModeObj}
                                                            onChange={this.onPaymentModeChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    <div className="form-group formgroupcss">
                                                        <label>Order Status:</label>
                                                        <Select
                                                            options={this.state.OrderStatus}
                                                            value={this.state.OrderStatusObj}
                                                            onChange={this.onOrderStatusChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-3" style={{ marginTop: '-12px' }}>
                                                    <button type="button" onClick={this.OnSearchOrderClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                                    <button type="button" onClick={this.OnSearchCancelOrderClick} className="btn btn-danger mt-12">Cancel </button>
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
                                    <h3 className="card-title">Order Detail View</h3>
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
                                                    if (rowData.OrderDetail != null) {
                                                        return (
                                                            <div style={{ width: '100%', padding: '5px', paddingLeft: '35px', display: 'block' }}>
                                                                <table className="table table-bordered m-0" cellSpacing="0" rules="all" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                    <thead>
                                                                        <tr style={{ color: 'black' }}>
                                                                            <th scope="col" style={{ color: 'black', width: '0%' }} >No.</th>
                                                                            <th scope="col" style={{ color: 'black', width: '8%' }}>ItemName</th>
                                                                            <th scope="col" style={{ color: 'black', width: '12%' }}>Category</th>
                                                                            <th scope="col" style={{ color: 'black', width: '12%' }}>SubCategory</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>Quantity</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>Size</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>CoupanCodeAmount</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>TotalPrice</th>
                                                                            <th scope="col" style={{ color: 'black', width: '5%' }}>FinalPrice</th>
                                                                            {/* <th scope="col" style={{ color: 'black', width: '5%' }}>EmailID</th> */}

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {rowData.OrderDetail.map((value, inx1) => {
                                                                            return (
                                                                                <tr key={inx1}>

                                                                                    <td align="center" style={{ width: "5%" }}>{(inx1 + 1)}</td>
                                                                                    <td >{value.ItemName ? value.ItemName : '-'}</td>
                                                                                    <td >{value.CategoryName ? value.CategoryName : '-'}</td>
                                                                                    <td >{value.SubCategoryName ? value.SubCategoryName : '-'}</td>
                                                                                    <td >{value.Quantity ? value.Quantity : '-'}</td>
                                                                                    <td >{value.SizeName ? value.SizeName : '-'}</td>
                                                                                    <td >{value.CoupanCodeAmount ? value.CoupanCodeAmount : '-'}</td>
                                                                                    <td >{value.TotalPrice ? value.TotalPrice : '-'}</td>
                                                                                    <td >{value.FinalPrice ? value.FinalPrice : '-'}</td>
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
export default withCookies(OrderMaster);