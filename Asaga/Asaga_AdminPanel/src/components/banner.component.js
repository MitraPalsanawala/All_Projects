import React, { Component } from "react";
import { connect } from "react-redux";
import FormData from 'form-data';
import Swal from "sweetalert2";
import MaterialTable from '@material-table/core';
// import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import MasterService from "../services/master.service";
import '../style.css';
const headerTblStyle = { color: 'black' };
const APP_URL = "https://asaga.in:9920/UploadFiles/Banner/";

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: [], data: [], ImgUrl: '', IsUpdate: false, currentId: '', IsImgPreview: false, fdata: {}, lblImage: "",
            oldimage: '',
            filename: "",
            cols: [
                { title: 'Sr.No', width: '10%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                {
                    title: 'BannerImage', field: 'url', width: '',
                    render: rowData =>
                        (rowData.BannerImage != "" && rowData.BannerImage != null) ?
                            <img src={APP_URL + rowData.BannerImage} alt="Image Not" style={{ width: 80, height: 80 }} />
                            :
                            <img style={{ height: '100px' }} src={APP_URL + "NoImage.png"} />
                }

            ]
        };
    }

    componentDidMount() {
        // debugger;
        this.GetBanner();
    }
    GetBanner() {
        var data = JSON.stringify({
            "BannerID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getBanner",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getBanner(config).then(response => {
            debugger;
            this.setState({ data: response.data.data })
        }, error => { })
    }
    handleSubmit = (e) => {
        debugger;
        e.preventDefault();

        if (this.state.file.length === 0) {
            Swal.fire({ position: 'top-end', icon: 'error', title: 'Please Upload Banner Image!', toast: true, showConfirmButton: false, timer: 1500 });
        }
        else {
            // this.form.reset();
            // document.getElementById("create-course-form").reset();
            const { file } = this.state;
            var form = new FormData();
            // for (let i = 0; i < file.length; i++) {
            //     form.append("BannerImage", file[i]);
            // }
            form.append("BannerImage", file[0]);
            MasterService.setBanner(form).then(response => {
                if (response.data.status) {
                    this.form.reset();
                    // if (file.file) { file.remove() }
                    this.setState({ IsImgPreview: false, currentId: '', file: [], ImgUrl: '', IsUpdate: false, lblImage: '', oldimage: '' });
                    this.GetBanner();
                    // MasterService.getBanner().then(response => { this.setState({ data: response.data.data }) }, error => { });
                    Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: response.data.message, showConfirmButton: false, timer: 1500 });
                } else {
                    Swal.fire({ position: 'top-end', icon: 'error', toast: true, title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }
    UpdateSub = (e) => {
        debugger
        e.preventDefault();
        var form = new FormData();
        const { currentId, file } = this.state;
        if (this.state.file.length) {
            form.append('BannerID', currentId);
            form.append('BannerImage', file[0]);
            MasterService.setBanner(form).then(response => {
                if (response.data.status) {
                    this.form.reset();
                    this.setState({ Type: '', IsImgPreview: false, currentId: '', file: [], ImgUrl: '', IsUpdate: false, lblImage: '', oldimage: '' });
                    this.GetBanner();
                    // MasterService.getBanner().then(response1 => { this.setState({ data: response1.data.data }) }, error => { });
                    Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: response.data.message, showConfirmButton: false, timer: 1500 });
                } else {
                    // this.setState({ Type: '', IsImgPreview: false, currentId: '', file: [], ImgUrl: '', IsUpdate: false });
                    Swal.fire({ position: 'top-end', icon: 'error', toast: true, title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        } else {
            form.append('BannerID', currentId);
            form.append('oldimage', this.state.oldimage);
            MasterService.setBanner(form).then(response => {
                if (response.data.status) {
                    this.form.reset();
                    this.setState({ Type: '', IsImgPreview: false, currentId: '', file: [], ImgUrl: '', IsUpdate: false, lblImage: '', oldimage: '' });
                    this.GetBanner();
                    // MasterService.getBanner().then(response1 => { this.setState({ data: response1.data.data }) }, error => { });
                    Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: response.data.message, showConfirmButton: false, timer: 1500 });
                } else {
                    // this.setState({ Type: '', IsImgPreview: false, currentId: '', file: [], ImgUrl: '', IsUpdate: false });
                    Swal.fire({ position: 'top-end', icon: 'error', toast: true, title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }
    RemoveBanner(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = JSON.stringify({
                    "BannerID": id
                });
                var config = {
                    method: 'POST',
                    url: MasterService.API_URL + "deleteBanner",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                MasterService.deleteBanner(config).then(response => {
                    if (response.data.status) {
                        this.GetBanner();
                        Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: response.data.message, showConfirmButton: false, timer: 1500 });
                    } else {
                        Swal.fire({ position: 'top-end', icon: 'error', toast: true, title: response.data.message, showConfirmButton: false, timer: 1500 });
                    }
                }, error => { })
            } else if (result.isDenied) {
                Swal.close();
            }
        });
    }
    cancelSub = (e) => {
        this.form.reset();
        e.preventDefault();
        this.setState({
            IsImgPreview: false, currentId: '', file: [], content: '',
            ImgUrl: '', IsUpdate: false, lblImage: "", oldimage: ''
        });
        if (this.state.file.file) { this.state.file.remove() }
    }
    handleFile = (e) => {
        this.setState({
            file: e.target.files,
            filename: e.target.files[0].originalname,
        });
    };
    EditBanner(id) {
        var data = JSON.stringify({
            "BannerID": id
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getBanner",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getBanner(config).then(response => {
            this.setState({
                // BannerID: response.data.data[0].BannerID,
                // BannerImage: response.data.data[0].BannerImage

                currentId: response.data.data[0].BannerID,
                IsUpdate: true,
                IsImgPreview: true,
                oldimage: response.data.data[0].BannerImage
            });
        }, error => { })
    }
    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }} >
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">Banner Add</h3>
                                </div>
                                <form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; }}>
                                    <div className="card-body">

                                        <div className="form-group">
                                            <label>Banner Image :</label>
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                value={this.state.filename}
                                                style={{ height: "37px" }}
                                                onChange={this.handleFile}
                                                className="form-control"
                                            />
                                           
                                        </div>
                                        {this.state.oldimage != "" && (
                                            <label style={{ color: "red" }}>{this.state.oldimage} files</label>
                                            // <label style={{ color: "red" }}>
                                            //     Uploaded Image
                                            // </label>
                                        )}
                                       
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
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">Banner View</h3>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title="" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditBanner(r.BannerID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.RemoveBanner(r.BannerID) }
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
        )
    }
}
export default Banner