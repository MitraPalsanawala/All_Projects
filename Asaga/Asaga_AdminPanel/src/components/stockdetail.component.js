import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints';
import React, { Component } from "react";
// import { connect } from "react-redux";
import FormData from 'form-data';
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
import Select from 'react-select';
// import 'react-dropzone-uploader/dist/styles.css';
import MasterService from "../services/master.service";
import ItemService from "../services/item.service";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../style.css';
const headerTblStyle = { color: 'black' };

// const APP_URL = "http://asagaoffice.in:2005/UploadFiles/Item/";

class StockDetail extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            ItemID: { 'label': '---Select Item---', 'value': '---Select Item---' },
            SearchItemID: { 'label': '---Select Item---', 'value': '---Select Item---' },
            ItemErrMsg: '',
            sizes: [],
            SizeID: { 'label': '---Select Size---', 'value': '---Select Size---' },
            SearchSizeID: { 'label': '---Select Size---', 'value': '---Select Size---' },
            SizeErrMsg: '',
            rows: [{
                ItemDetailID: '',
                Size: '',
                sizes: [],
                SizeID: { 'label': '---Select Size---', 'value': '---Select Size---' },
                SearchSizeID: { 'label': '---Select Size---', 'value': '---Select Size---' },
                SizeErrMsg: '',
                TotalStock: '',
                RemainingStock: ''
            }],
            UpdateStockVisible: false,
            AddItemVisible: false, iconAdd: "fa fa-plus", iconFilter: "fa fa-plus", isFilterVisible: false,
            IsUpdate: true,

        };
    }
    componentDidMount() {
        this.GetItemMaster();
        this.GetSize();
    }

    GetItemMaster() {
        var data = JSON.stringify({
            "ItemID": "",
        });
        var config = {
            method: 'POST',
            url: ItemService.API_URL + "getItem",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        ItemService.getItem(config).then(response => {
            debugger;
            this.setState({ items: response.data.data.map(item => ({ value: item.ItemID, label: item.ItemName })) });
        }, error => { })
    }
    GetSize() {
        debugger;
        var data = JSON.stringify({
            "SizeID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getItemSize",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getItemSize(config).then(response => {
            debugger;
            // this.setState({ data: response.data.data })
            this.setState({ sizes: response.data.data.map(item => ({ value: item.Size, label: item.Size })) });

        }, error => { })
    }
    ValidateItem = (e) => {
        this.setState({ ItemErrMsg: '' })
    }
    ValidateCancelItem = (e) => {
        this.setState({ ItemErrMsg: 'required' })
    }
    onItemChange = (e) => {
        debugger;
        if (e != null) {
            this.setState({ ItemID: e }, (e) => { this.ValidateItem(); });
        }
        else {
            this.setState({ ItemID: { 'label': '---Select Item---', 'value': '---Select Item---' } }, () => { this.ValidateCancelItem() });
        }
    }

    ValidateSize = (e) => {
        this.setState({ SizeErrMsg: '' })
    }
    ValidateCancelSize = (e) => {
        this.setState({ SizeErrMsg: 'required' })
    }
    onSizeChange1 = (e) => {
        debugger;
        if (e != null) {
            this.setState({ SizeID: e }, (e) => { this.ValidateSize(); });
        }
        else {
            this.setState({ SizeID: { 'label': '---Select Size---', 'value': '---Select Size---' } }, () => { this.ValidateCancelSize() });
        }
    }
    onSizeChange = idx => e => {
        debugger;
        var rows = [...this.state.rows], result = rows[idx];
        rows[idx] = {
            ItemDetailID: rows[idx].ItemDetailID,
            // SizeID: e.value,
            Size: e,
            TotalStock: "",
            RemainingStock: ""
        };
        this.setState({ rows }, () => { this.form.validateFields(e) });
    }
    handleAddRow = () => {
        debugger;
        const rows = [...this.state.rows]
        const item = {
            ItemDetailID: "",
            Size: "",
            TotalStock: "",
            RemainingStock: ""
        };
        this.setState({
            rows: [...this.state.rows, item]
        });
    }
    handleRemoveRow = () => {
        this.setState({
            rows: this.state.rows.slice(0, -1)
        });
    };
    onTotalStockChange = idx => e => {
        debugger;
        var rows = [...this.state.rows], result = rows[idx];
        rows[idx] = {
            ItemDetailID: rows[idx].ItemDetailID,
            Size: result.Size,
            TotalStock: e.target.value,
            RemainingStock: result.RemainingStock
        };
        this.setState({ rows }, () => { this.form.validateFields(e.target) });
    }
    handleRemoveSpecificRow = (idx) => () => {
        debugger;
        if (idx > 0) {
            const rows = [...this.state.rows]
            var data = JSON.stringify({
                "ItemDetailID": rows[idx].ItemDetailID
            });
            var config = {
                method: 'POST',
                url: ItemService.API_URL + "deleteStock",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            ItemService.deleteStock(config).then(response => {
                //debugger;
                //this.setState({ data: response.data.data })
            }, error => { })
            rows.splice(idx, 1)
            this.setState({ rows })
        }
        else {
            Swal.fire({ icon: 'error', title: 'Cannot Remove Row', showConfirmButton: false, timer: 1500 });
        }
    }
    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();
        const rows = [...this.state.rows]
        // var bindsize = this.state.rows[0].Size.value;
        // var TotalStock = this.state.rows[0].TotalStock;
        // const { rows } = this.state;
        // const result = rows.map(({ bindsize, TotalStock }));

        if (this.state.ItemID.value == "---Select Item---") {
            this.setState({ ItemErrMsg: 'required' });
        }

        if (this.state.rows.Size) {
            this.setState({ MultiFileErr: 'required' });
            // allvalid = false;
        }
        if (this.form.isValid()) {
            let sizebind = []
            for (let index = 0; index < rows.length; index++) {
                sizebind.push({ 'Size': rows[index].Size.value, 'TotalStock': rows[index].TotalStock })
                //stockbind.push(rows[index].TotalStock)

                if (rows[index].Size.value == '') {
                    rows[index] = []
                }
                if (rows[index].TotalStock == '') {
                    rows[index] = []
                }
            }
            // const result = rows.map(({ sizebind, stockbind }))
            var itembind = this.state.ItemID.value;

            var data = "";
            data = JSON.stringify({
                "ItemID": itembind,
                "ItemStock": sizebind
            });
            var config = {
                method: 'POST',
                url: ItemService.API_URL + "UpdateStock",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            ItemService.UpdateStock(config).then(response => {
                //debugger;
                if (response.data.status) {
                    debugger;
                    // if (this.state.ZoneID != "") {
                    // Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: 'Successfully Updated', showConfirmButton: false, timer: 1500 });
                    Swal.fire({
                        title: 'Successfully Updated', icon: "success", timer: 1500
                    });
                    // }
                    // else {
                    //     Swal.fire({
                    //         title: 'Successfully Inserted', icon: "success", timer: 1500
                    //     });
                    // }
                    this.ClearData();
                    // this.GetZone();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }

    ClearData = (e) => {
        debugger
        // e.preventDefault();

        this.setState({
            ItemErrMsg: '',
            ItemID: { 'label': '---Select Item---', 'value': '---Select Item---' },
            rows: [{ Size: '', TotalStock: '' }],
        });
        this.form.reset();
        // this.GetItem();
        // this.GetCategory();
        // this.GetSubCategory();
        // this.GetSize();
        // this.GetColor();
    }

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">

                        <div className="col-md-12">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">Stock Add</h3>
                                </div>
                                {/* <form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; }}> */}
                                <FormWithConstraints
                                    ref={form => this.form = form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Item Name</label>
                                                    <Select isClearable={true} options={this.state.items}
                                                        value={this.state.ItemID} onChange={this.onItemChange} />
                                                    {this.state.ItemErrMsg && <span className="text-danger">{this.state.ItemErrMsg === 'required' ? 'Please Select Item' : ''}</span>}
                                                </div>
                                            </div>
                                            {
                                                this.state.rows.map((item, idx) => (
                                                    <div className="col-md-12" key={idx}>
                                                        <div className="row" >
                                                            <div className="col-md-3" >
                                                                <div className="form-group">
                                                                    <label>Size {idx + 1} </label>
                                                                    <label>{ }</label>
                                                                    {/* <input type="text" name='Size' required value={this.state.rows[idx].Size} onChange={this.onSizeChange(idx)} className="form-control" placeholder="Item Size" /> */}
                                                                    <Select isClearable={true} options={this.state.sizes} name={"Size" + idx}
                                                                        required value={this.state.rows[idx].Size} onChange={this.onSizeChange(idx)} />
                                                                    {/* {this.state.SizeErrMsg && <span className="text-danger">{this.state.SizeErrMsg === 'required' ? '*' : ''}</span>} */}
                                                                    <FieldFeedbacks for={"Size" + idx}>
                                                                        <FieldFeedback when="valueMissing">
                                                                            *
                                                                        </FieldFeedback>
                                                                    </FieldFeedbacks>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3" >
                                                                <div className="form-group">
                                                                    <label>Total Stock {idx + 1} </label>
                                                                    <label>{ }</label>
                                                                    <input type="text" name={"TotalStock" + idx} required value={this.state.rows[idx].TotalStock} onChange={this.onTotalStockChange(idx)} className="form-control" placeholder="Item Total Stock" />
                                                                    <FieldFeedbacks for={"TotalStock" + idx}>
                                                                        <FieldFeedback when="valueMissing">
                                                                            *
                                                                        </FieldFeedback>
                                                                    </FieldFeedbacks>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <i onClick={this.handleAddRow} className="fa fa-plus-circle pt-10" style={{ fontSize: 30, color: '#3699ff', marginRight: '15%' }} />
                                                                    <i onClick={this.handleRemoveSpecificRow(idx)} className="fa fa-minus-circle pt-10" style={{ fontSize: 30, color: '#3699ff' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
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
export default withCookies(StockDetail);