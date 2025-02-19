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
import Select from 'react-select';
// import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import MasterService from "../services/master.service";
import '../style.css';
const headerTblStyle = { color: 'black' };
const APP_URL = "https://asaga.in:9920/UploadFiles/SubCategory/";


class SubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SubCategoryID: '',
            SubCategoryImage: '',
            SubCategoryName: '',
            Description: '',
            ImgFile: [],
            ImgFilename: "",
            ImgFileErr: "",
            oldimage: '',
            categories: [],
            CategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' },
            SearchCategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' },
            CategoryErrMsg: '',
            AddSubCategoryVisible: false, iconAdd: "fa fa-plus", iconFilter: "fa fa-plus", isFilterVisible: false,
            cols: [
                { title: 'Sr.No', width: '8%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'Category Name', width: '20%', field: 'CategoryName', headerStyle: headerTblStyle },
                { title: 'SubCategory Name', width: '20%', field: 'SubCategoryName', headerStyle: headerTblStyle },
                {
                    title: 'Image', field: 'url', width: '10%',
                    render: rowData =>
                        (rowData.SubCategoryImage != "" && rowData.SubCategoryImage != null) ? <img src={APP_URL + rowData.SubCategoryImage} alt="Image Not" style={{ width: 80, height: 80 }} /> : <img style={{ height: '100px' }} src={APP_URL + "NoImage.png"} />
                },
                { title: 'Description', width: '49%', field: 'Description', headerStyle: headerTblStyle },
            ]
        };
    }

    componentDidMount() {
        this.GetSubCategory();
        this.GetCategory();
    }

    GetSubCategory() {
        var SearchCategoryID = "";

        if (this.state.SearchCategoryID.value != "---Select Category---") {
            SearchCategoryID = this.state.SearchCategoryID.value;
        }
        else {
            SearchCategoryID = "";
        }

        var data = JSON.stringify({
            "CategoryID": SearchCategoryID,
            "SubCategoryID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getSubCategory",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getSubCategory(config).then(response => {
            debugger;
            if (response.data.status) {
                this.setState({ data: response.data.data })
            }
            else {
                this.setState({ data: [] })
            }
        }, error => { })
    }

    GetCategory() {
        debugger;
        var data = JSON.stringify({
            "CategoryID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getCategory",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getCategory(config).then(response => {
            debugger;
            // this.setState({ data: response.data.data })
            this.setState({
                categories: response.data.data.map(item => ({
                    value: item.CategoryID,
                    label: item.CategoryName,
                    // SubCategoryID: { 'label': '---Select SubCategory---', 'value': '---Select SubCategory---' },
                    // subcategories: response.data.data
                }))
            });

        }, error => { })
    }

    ValidateCategory = (e) => {
        this.setState({ CategoryErrMsg: '' })
    }
    ValidateCancelCategory = (e) => {
        this.setState({ CategoryErrMsg: 'required' })
    }
    onCategoryChange = (e) => {
        debugger;
        if (e != null) {
            this.setState({ CategoryID: e }, (e) => { this.ValidateCategory(); });
        }
        else {
            this.setState({ CategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' } }, () => { this.ValidateCancelCategory() });
        }

    }

    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();
        if (this.state.CategoryID.value == "---Select Category---") {
            this.setState({ CategoryErrMsg: 'required' });
        }

        var allvalid = true;
        if (this.state.ImgFile.length == 0) {
            this.setState({ ImgFileErr: 'required' });
            allvalid = false;
        }

        if (this.form.isValid()) {

            const { SubCategoryName, oldimage, ImgFile, Description } = this.state;
            var categorybind = this.state.CategoryID.value;
            var form = new FormData();
            if (this.state.SubCategoryID != "") {
                form.append('SubCategoryID', this.state.SubCategoryID);
                form.append('CategoryID', categorybind);
                form.append('SubCategoryName', SubCategoryName);
                form.append('Description', Description);
                form.append('oldimage', oldimage);
                for (let i = 0; i < this.state.ImgFile.length; i++) {
                    form.append("SubCategoryImage", ImgFile[i]);
                }
            } else {
                // form.append('CategoryID', "");
                form.append('CategoryID', categorybind);
                form.append('SubCategoryName', SubCategoryName);
                form.append('Description', Description);
                form.append('SubCategoryImage', ImgFile[0]);
            }
            MasterService.setSubCategory(form).then(response => {
                //debugger;
                if (response.data.status) {
                    // this.form.reset();
                    debugger;
                    if (this.state.SubCategoryID != "") {
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
                    this.GetSubCategory();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }

    }

    EditSubCategory(id) {
        debugger;
        var data = JSON.stringify({
            "SubCategoryID": id
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getSubCategory",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getSubCategory(config).then(response => {
            this.setState({
                SubCategoryID: response.data.data[0].SubCategoryID,
                CategoryID: { 'label': response.data.data[0].CategoryName, 'value': response.data.data[0].CategoryID },
                SubCategoryName: response.data.data[0].SubCategoryName,
                oldimage: response.data.data[0].SubCategoryImage,
                Description: response.data.data[0].Description
            });
            this.setState({ AddSubCategoryVisible: true });
            this.setState({ iconAdd: "fa fa-minus" });
        }, error => { })
    }

    ClearData = (e) => {
        debugger
        // e.preventDefault();
        this.setState({
            categories: [], CategoryErrMsg: '', SubCategoryName: '', Description: '',
            CategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' },
            ImgFile: [], oldimage: '', ImgFilename: '', ImgFileErr: '',
        });
        this.form.reset();
        this.GetCategory();
        this.GetSubCategory();
    }

    RemoveSubCategory(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = JSON.stringify({
                    "SubCategoryID": id
                });
                var config = {
                    method: 'POST',
                    url: MasterService.API_URL + "deleteSubCategory",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                MasterService.deleteSubCategory(config).then(response => {
                    if (response.data.status) {
                        this.GetSubCategory();
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

    handleImgFile = (e) => {
        this.setState({
            ImgFile: e.target.files,
            ImgFilename: e.target.files[0].originalname,
        });
    };
    onAddSubCategoryClick = (e) => {
        if (this.state.AddSubCategoryVisible == false) {
            this.setState({ AddSubCategoryVisible: true });
            this.setState({ iconAdd: "fa fa-minus" });
        }
        else {
            this.setState({ AddSubCategoryVisible: false });
            this.setState({ iconAdd: "fa fa-plus" });
        }
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
    OnSearchItemClick = (e) => {
        debugger;
        e.preventDefault();
        this.GetSubCategory();
    }
    OnSearchCancelSubCategoryClick = () => {
        debugger;
        this.setState({
            SearchCategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' },
        }, () => {
            this.GetSubCategory();
        });
        //window.location.reload(true);

    }

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">
                        {this.state.AddSubCategoryVisible &&
                            <div className="col-md-12">
                                <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                    <div className="card-header">
                                        <h3 className="card-title">SubCategory Add</h3>
                                    </div>
                                    <FormWithConstraints
                                        ref={form => this.form = form}
                                        onSubmit={this.handleSubmit}
                                        noValidate>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4">

                                                    <div className="form-group">
                                                        <label>Category Name</label>
                                                        <Select isClearable={true} options={this.state.categories}
                                                            value={this.state.CategoryID} onChange={this.onCategoryChange} />
                                                        {this.state.CategoryErrMsg && <span className="text-danger">{this.state.CategoryErrMsg === 'required' ? '*' : ''}</span>}
                                                    </div>

                                                </div>


                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <div className="form-group" style={{ width: '100%' }}>
                                                            <label>SubCategory Name :</label>
                                                            <input type="text" name="SubCategoryName" required
                                                                value={this.state.SubCategoryName} onChange={(e) => this.setState({ SubCategoryName: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter SubCategory Name" />
                                                            <FieldFeedbacks for="SubCategoryName">
                                                                <FieldFeedback when="valueMissing">
                                                                    *
                                                                </FieldFeedback>
                                                            </FieldFeedbacks>                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>SubCategory Image :</label>
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg, image/png, image/jpg"
                                                            value={this.state.ImgFilename}
                                                            style={{ height: "37px" }}
                                                            onChange={this.handleImgFile}
                                                            className="form-control"
                                                        />
                                                        {this.state.ImgFileErr && <span className="text-danger">{this.state.ImgFileErr === 'required' ? 'Please Upload Image' : ''}</span>}
                                                    </div>
                                                    {this.state.oldimage != "" && (
                                                        <label style={{ color: "red" }}>{this.state.oldimage} files</label>
                                                        // <label style={{ color: "red" }}>
                                                        //     Uploaded Image
                                                        // </label>
                                                    )}
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group" style={{ width: '100%' }}>
                                                        <label>Description :</label>
                                                        <textarea
                                                            rows="3"
                                                            style={{ height: "120px" }}
                                                            // value={this.state.Description}
                                                            className="form-control"
                                                            // onChange={(e) => {
                                                            //     this.setState({
                                                            //         Description: e.target.value,
                                                            //     });
                                                            // }}
                                                            required value={this.state.Description} onChange={(e) => this.setState({ Description: e.target.value }, () => { this.form.validateFields(e.target) })}
                                                            placeholder="Enter Description"
                                                        />
                                                    </div>
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
                        }
                        {this.state.isFilterVisible &&
                            <div className="col-md-12">
                                <div className="" style={{ marginBottom: '1%' }} id="divFilter">
                                    <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                        <div className="card-header">
                                            <h3 className="card-title">SubCategory Search</h3>
                                        </div>
                                        <div className="col-md-12" style={{ marginTop: '22px' }}>
                                            <div className='row'>
                                                <div className="col-md-3">
                                                    <div className="form-group formgroupcss">
                                                        <label>Category </label>
                                                        <Select options={this.state.categories} value={this.state.SearchCategoryID} onChange={(e) => this.setState({ SearchCategoryID: e })} />
                                                    </div>
                                                </div>

                                                <div className="col-md-3" style={{ marginTop: '-12px' }}>
                                                    <button type="button" onClick={this.OnSearchItemClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                                    <button type="button" onClick={this.OnSearchCancelSubCategoryClick} className="btn btn-danger mt-12">Cancel </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="col-md-12">
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }} >
                                <div className="card-header">
                                    <div className="col-md-12" style={{ marginTop: '22px' }}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h3 className="card-title">Item Detail View</h3>
                                            </div>
                                            <div className="col-md-6" style={{ textAlign: 'right' }}>
                                                {/* <div className="col-md-6" style={{ textAlign: 'left' }}> */}
                                                <a onClick={this.onAddSubCategoryClick} className="btn btn-outline-primary font-weight-bolder mr-5">
                                                    <span className="svg-icon svg-icon-md">
                                                        <i id="btnAdd" className={this.state.iconAdd} />
                                                    </span>Add SubCategory</a>
                                                <a className="btn btn-outline-dark font-weight-bolder" onClick={this.OnFilterClick}>
                                                    <i id="btnFilter" className={this.state.iconFilter} /> Filter
                                                </a>
                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title="" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditSubCategory(r.SubCategoryID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.RemoveSubCategory(r.SubCategoryID) }
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
export default SubCategory

