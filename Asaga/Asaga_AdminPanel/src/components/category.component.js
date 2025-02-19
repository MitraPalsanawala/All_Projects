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
const APP_URL = "https://asaga.in:9920/UploadFiles/Category/";


class Category extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            CategoryID: '',
            CategoryName: '',
            ImgFile: [],
            ImgFilename: "",
            ImgFileErr: "",
            oldimage: '',
            data: [],
            cols: [
                { title: 'Sr.No', width: '8%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'Category Name', width: '44%', field: 'CategoryName', headerStyle: headerTblStyle },
                {
                    title: 'Category Image', field: 'url', width: '32%',
                    render: rowData =>
                        (rowData.CategoryImage != "" && rowData.CategoryImage != null) ?
                            <img src={APP_URL + rowData.CategoryImage} alt="Image Not" style={{ width: 80, height: 80 }} />
                            :
                            <img style={{ height: '100px' }} src={APP_URL + "NoImage.png"} />
                }

            ]
        };
    }

    componentDidMount() {
        debugger;
        this.GetCategory();
    }

    GetCategory() {
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
            if (response.data.status) {
                this.setState({ data: response.data.data })
            }
            else {
                this.setState({ data: [] })
            }
        }, error => { })
    }



    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();


        var allvalid = true;
        if (this.state.ImgFile.length == 0) {
            this.setState({ ImgFileErr: 'required' });
            allvalid = false;
        }

        if (this.form.isValid()) {
            // if (allvalid == true) {

            // var data = "";
            const { CategoryName, oldimage, ImgFile } = this.state;
            var form = new FormData();
            if (this.state.CategoryID != "") {
                form.append('CategoryID', this.state.CategoryID);
                form.append('CategoryName', CategoryName);
                form.append('oldimage', oldimage);
                for (let i = 0; i < this.state.ImgFile.length; i++) {
                    form.append("CategoryImage", ImgFile[i]);
                }
            } else {
                // form.append('CategoryID', "");
                form.append('CategoryName', CategoryName);
                form.append('CategoryImage', ImgFile[0]);
            }

            MasterService.setCategory(form).then(response => {
                //debugger;
                if (response.data.status) {
                    // this.form.reset();
                    debugger;
                    if (this.state.CategoryID != "") {
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
                    this.GetCategory();
                }
                else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
            // }
        }
    }

    ClearData = (e) => {
        debugger
        // e.preventDefault();
        this.form.reset();
        this.setState({
            CategoryName: '', ImgFile: [], oldimage: '', ImgFilename: '', ImgFileErr: ''
        });
        this.GetCategory();
    }

    EditCategory(id) {
        debugger;
        var data = JSON.stringify({
            "CategoryID": id
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
            this.setState({
                CategoryID: response.data.data[0].CategoryID,
                CategoryName: response.data.data[0].CategoryName,
                IsUpdate: true,
                IsImgPreview: true,
                oldimage: response.data.data[0].CategoryImage
            });
        }, error => { })
    }
    RemoveCategory(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = JSON.stringify({
                    "CategoryID": id
                });
                var config = {
                    method: 'POST',
                    url: MasterService.API_URL + "deleteCategory",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                MasterService.deleteCategory(config).then(response => {
                    if (response.data.status) {
                        this.GetCategory();
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

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">Category Add</h3>
                                </div>
                                {/* <form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; }}> */}
                                <FormWithConstraints
                                    ref={form => this.form = form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="form-group" style={{ width: '100%' }}>
                                                <label>Category Name :</label>
                                                {/* <input name='CategoryName' type="text" required onKeyPress={this.allowOnlyCharacters}
                                                    value={this.state.CategoryName} onChange={(e) => this.setState({ CategoryName: e.target.value })} className="form-control" placeholder="Enter Category Name" /> */}
                                                <input type="text" name="CategoryName" required value={this.state.CategoryName} onChange={(e) => this.setState({ CategoryName: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Category Name" />
                                                <FieldFeedbacks for="CategoryName">
                                                    <FieldFeedback when="*">
                                                        *
                                                    </FieldFeedback>
                                                </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Category Image :</label>
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                value={this.state.ImgFilename}
                                                style={{ height: "37px" }}
                                                onChange={this.handleImgFile}
                                                className="form-control"
                                            />
                                            {this.state.ImgFileErr && <span className="text-danger">{this.state.ImgFileErr === 'required' ? '*' : ''}</span>}
                                        </div>
                                        {this.state.oldimage != "" && (
                                            <label style={{ color: "red" }}>{this.state.oldimage} files</label>
                                            // <label style={{ color: "red" }}>
                                            //     Uploaded Image
                                            // </label>
                                        )}

                                    </div>
                                    <div className="card-footer">

                                        <button type="submit" onSubmit={this.handleSubmit} className="btn btn-primary" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="fa fa-check-square"></i>Submit</button>

                                        <button type="button" onClick={this.ClearData} className="btn btn-danger" style={{ marginRight: '10px', cursor: 'pointer' }}><i className="far fa-window-close"></i>Cancel</button>
                                    </div>
                                    {/* </form> */}
                                </FormWithConstraints>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }} >
                                <div className="card-header">
                                    <h3 className="card-title">Category View</h3>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title="" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditCategory(r.CategoryID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.RemoveCategory(r.CategoryID) }
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
export default withCookies(Category);

