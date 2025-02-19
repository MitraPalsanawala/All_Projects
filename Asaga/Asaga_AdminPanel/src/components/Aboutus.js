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
const APP_URL = "http://192.168.0.116:2005/UploadFiles/AboutUs/";

class AboutUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Title: '', Description: '', file: [], data: [], ImgUrl: '', IsUpdate: false, currentId: '', IsImgPreview: false, fdata: {}, oldimage: '',
            cols: [
                { title: 'Sr.No', width: '1%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'Title', width: '18%', field: 'Title', headerStyle: headerTblStyle },

                {
                    title: 'AboutUsImage', field: 'url', width: '20%',
                    render: rowData =>
                        (rowData.AboutUsImage != "" && rowData.AboutUsImage != null) ?
                            <img src={APP_URL + rowData.AboutUsImage} alt="Image Not" style={{ width: 80, height: 80 }} />
                            :
                            <img style={{ height: '100px' }} src={APP_URL + "NoImage.png"} />
                },
                { title: 'Description', width: '50%', field: 'Description', headerStyle: headerTblStyle },

            ]
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.UpdateSub = this.UpdateSub.bind(this);
        this.cancelSub = this.cancelSub.bind(this);
    }

    componentDidMount() {
        MasterService.getAboutUs().then(response => {
            this.setState({ data: response.data.data })
        }, error => { })
    }

    handleSubmit(e) {
        debugger;
        e.preventDefault();
        if (!this.state.Title) {
            Swal.fire({ position: 'top-end', icon: 'error', title: 'Please Enter Title', toast: true, showConfirmButton: false, timer: 1500 });
        } else if (this.state.file.length === 0) {
            Swal.fire({ position: 'top-end', icon: 'error', title: 'Please Upload  Image!', toast: true, showConfirmButton: false, timer: 1500 });
        } else if (!this.state.Description) {
            Swal.fire({ position: 'top-end', icon: 'error', title: 'Please Enter Description', toast: true, showConfirmButton: false, timer: 1500 });
        }
        else {
            const { Title, file, Description } = this.state;
            var form = new FormData();
            form.append('Title', Title);
            form.append('AboutUsImage', file[0]);
            form.append('Description', Description);
            MasterService.setAboutUs(form).then(response => {
                if (response.data.status) {
                    if (file.file) { file.remove() }
                    this.setState({ Title: '', Description: '', IsImgPreview: false, currentId: '', file: [], ImgUrl: '', IsUpdate: false, oldimage: '' });
                    MasterService.getAboutUs().then(response => { this.setState({ data: response.data.data }) }, error => { });
                    Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: response.data.message, showConfirmButton: false, timer: 1500 });
                } else {
                    Swal.fire({ position: 'top-end', icon: 'error', toast: true, title: response.data.message, showConfirmButton: false, timer: 3000 });
                }
            }, error => { })
        }
    }

    UpdateSub(e) {
        debugger
        e.preventDefault();
        if (!this.state.Title) {
            Swal.fire({ position: 'top-end', icon: 'error', title: 'Please Enter Title', toast: true, showConfirmButton: false, timer: 1500 });
        } else if (!this.state.Description) {
            Swal.fire({ position: 'top-end', icon: 'error', title: 'Please Enter Description', toast: true, showConfirmButton: false, timer: 1500 });
        }

        else {
            const { currentId, Title, file, Description } = this.state;
            var form = new FormData();
            if (this.state.file.length) {
                form.append('AboutUsID', currentId);
                form.append('Title', Title);
                form.append('AboutUsImage', file[0]);
                form.append('Description', Description);
                // if (file.file) { file.remove() }
                MasterService.setCategory(form).then(response => {
                    if (response.data.status) {
                        this.form.reset();
                        this.setState({ Title: '', Description: '', Type: '', IsImgPreview: false, currentId: '', file: [], ImgUrl: '', IsUpdate: false, oldimage: '' });
                        MasterService.getCategory().then(response1 => { this.setState({ data: response1.data.data }) }, error => { });
                        Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: response.data.message, showConfirmButton: false, timer: 1500 });
                    } else {
                        Swal.fire({ position: 'top-end', icon: 'error', toast: true, title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                }, error => { })
            } else {
                form.append('AboutUsID', currentId);
                form.append('Title', Title);
                form.append('oldimage', this.state.oldimage);
                form.append('Description', Description);
                MasterService.setAboutUs(form).then(response => {
                    if (response.data.status) {
                        this.form.reset();
                        this.setState({ Title: '', Description: '', Type: '', IsImgPreview: false, currentId: '', file: [], ImgUrl: '', IsUpdate: false, oldimage: '' });
                        MasterService.getAboutUs().then(response1 => { this.setState({ data: response1.data.data }) }, error => { });
                        Swal.fire({ position: 'top-end', toast: true, icon: 'success', title: response.data.message, showConfirmButton: false, timer: 1500 });
                    } else {
                        Swal.fire({ position: 'top-end', icon: 'error', toast: true, title: response.data.message, showConfirmButton: false, timer: 3000 });
                    }
                }, error => { })
            }

        }
    }

    EditAboutUs(id) {
        debugger;
        MasterService.getAboutUs(id).then(response => {
            if (response.data.data) {
                this.setState({
                    currentId: response.data.data[0].AboutUsID,
                    IsUpdate: true,
                    IsImgPreview: true,
                    Title: response.data.data[0].Title,
                    oldimage: response.data.data[0].AboutUsImage,
                    Description: response.data.data[0].Description
                })
            } else { this.setState({ ImgUrl: "" }) }
        }, error => { this.setState({ ImgUrl: "" }) });
    }

    handleFile = (e) => {
        this.setState({
            file: e.target.files,
            filename: e.target.files[0].originalname,
        });
    };

    cancelSub = (e) => {
        this.form.reset();
        e.preventDefault();
        this.setState({
            Title: '', Description: '', IsImgPreview: false, currentId: '', file: [], content: '',
            ImgUrl: '', IsUpdate: false, oldimage: ''
        });
        if (this.state.file.file) { this.state.file.remove() }
    }

    render() {

        return (
            <div>
                <div className="container-fluid" style={{ paddingBottom: '22px' }}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">AboutUs Add</h3>
                                </div>

                                <form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; }}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <div className="form-group" style={{ width: '100%' }}>
                                                        <label>Title :</label>
                                                        <input type="text" placeholder="Title" maxLength="500"
                                                            value={this.state.Title} onChange={(e) => { this.setState({ Title: e.target.value }) }} className="form-control" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>AboutUs Image :</label>
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
                                                    // <label>{this.state.oldimage} files</label>
                                                    <label style={{ color: "red" }}>
                                                        Uploaded Image
                                                    </label>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group" style={{ width: '100%' }}>
                                                    <label>Description :</label>
                                                    <textarea
                                                        rows="3"
                                                        style={{ height: "120px" }}
                                                        value={this.state.Description}
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                Description: e.target.value,
                                                            });
                                                        }}
                                                        placeholder="Description"
                                                    />
                                                </div>
                                            </div>
                                        </div>
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

                        <div className="col-md-12">
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }} >
                                <div className="card-header">
                                    <h3 className="card-title">AboutUs View</h3>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title="" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditAboutUs(r.AboutUsID) },
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

export default AboutUs