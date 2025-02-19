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
const APP_URL = "https://asaga.in:9920/UploadFiles/AboutUs/";

class AboutUs extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            AboutUsID: '',
            Title: '',
            Description: '',
            ImgFile: [],
            ImgFilename: "",
            ImgFileErr: "",
            oldimage: '',
            data: [],
            AddAboutUsVisible: false, iconAdd: "fa fa-plus", iconFilter: "fa fa-plus",
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
    }

    componentDidMount() {
        debugger;
        this.GetAboutUs();
    }

    GetAboutUs() {
        var data = JSON.stringify({
            "AboutUsID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getAboutUs",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getAboutUs(config).then(response => {
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
            const { Title, oldimage, ImgFile, Description } = this.state;
            var form = new FormData();
            if (this.state.CategoryID != "") {
                form.append('AboutUsID', this.state.AboutUsID);
                form.append('Title', Title);
                form.append('Description', Description);
                form.append('oldimage', oldimage);
                for (let i = 0; i < this.state.ImgFile.length; i++) {
                    form.append("AboutUsImage", ImgFile[i]);
                }
            } else {
                // form.append('CategoryID', "");
                form.append('Title', Title);
                form.append('Description', Description);
                form.append('AboutUsImage', ImgFile[0]);
            }

            MasterService.setAboutUs(form).then(response => {
                //debugger;
                if (response.data.status) {
                    // this.form.reset();
                    debugger;
                    if (this.state.AboutUsID != "") {
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
                    this.GetAboutUs();
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
            Title: '', Description: '', ImgFile: [], oldimage: '', ImgFilename: '', ImgFileErr: ''
        });
        this.GetAboutUs();
    }

    EditAboutUs(id) {
        debugger;
        var data = JSON.stringify({
            "AboutUsID": id
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getAboutUs",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getAboutUs(config).then(response => {
            this.setState({
                AboutUsID: response.data.data[0].AboutUsID,
                Title: response.data.data[0].Title,
                Description: response.data.data[0].Description,
                IsUpdate: true,
                IsImgPreview: true,
                oldimage: response.data.data[0].AboutUsImage
            });
            this.setState({ AddAboutUsVisible: true });
            this.setState({ iconAdd: "fa fa-minus" });
        }, error => { })
    }
    handleImgFile = (e) => {
        this.setState({
            ImgFile: e.target.files,
            ImgFilename: e.target.files[0].originalname,
        });
    };

    onAddAboutUsClick = (e) => {
        if (this.state.AddAboutUsVisible == false) {
            this.setState({ AddAboutUsVisible: true });
            this.setState({ iconAdd: "fa fa-minus" });
        }
        else {
            this.setState({ AddAboutUsVisible: false });
            this.setState({ iconAdd: "fa fa-plus" });
        }
    }

    render() {
        return (
            <>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">
                        {/* {this.state.AddAboutUsVisible && */}
                        <div className="col-md-12">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">AboutUs Add</h3>
                                </div>
                                {/* <form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; }}> */}
                                <FormWithConstraints
                                    ref={form => this.form = form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className='row'>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <div className="form-group" style={{ width: '100%' }}>
                                                        <label>Title :</label>
                                                        {/* <input name='CategoryName' type="text" required onKeyPress={this.allowOnlyCharacters}
                                                    value={this.state.CategoryName} onChange={(e) => this.setState({ CategoryName: e.target.value })} className="form-control" placeholder="Enter Category Name" /> */}
                                                        <input type="text" name="Title" required value={this.state.Title} onChange={(e) => this.setState({ Title: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Category Name" />
                                                        <FieldFeedbacks for="Title">
                                                            <FieldFeedback when="*">
                                                                Please Enter AboutUs Title
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>AboutUs Image :</label>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg, image/png, image/jpg"
                                                        value={this.state.ImgFilename}
                                                        style={{ height: "37px" }}
                                                        onChange={this.handleImgFile}
                                                        className="form-control"
                                                    />
                                                    {this.state.ImgFileErr && <span className="text-danger">{this.state.ImgFileErr === 'required' ? 'Please Upload  Image' : ''}</span>}
                                                </div>
                                                {this.state.oldimage != "" && (
                                                    <label style={{ color: "red" }}>{this.state.oldimage} files</label>
                                                    // <label style={{ color: "red" }}>
                                                    //     Uploaded Image
                                                    // </label>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group" style={{ width: '100%' }}>
                                                    <label>Description :</label>
                                                    <textarea
                                                        rows="3"
                                                        name='Description'
                                                        style={{ height: "120px" }}
                                                        required value={this.state.Description}
                                                        className="form-control"
                                                        // onChange={(e) => {
                                                        //     this.setState({
                                                        //         Description: e.target.value,
                                                        //     });
                                                        // }}
                                                        onChange={(e) => this.setState({ Description: e.target.value }, () => { this.form.validateFields(e.target) })}
                                                        placeholder="Enter Description"
                                                    />
                                                    <FieldFeedbacks for="Description">
                                                        <FieldFeedback when="*">
                                                            Please Enter AboutUs Description
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>
                                                </div>
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
                        {/* } */}
                        <div className="col-md-12">
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }} >
                                <div className="card-header">
                                    <div className="col-md-12" style={{ marginTop: '22px' }}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h3 className="card-title">AboutUs View</h3>
                                            </div>
                                            {/* <div className="col-md-6" style={{ textAlign: 'right' }}>
                                                <a onClick={this.onAddAboutUsClick} className="btn btn-outline-primary font-weight-bolder mr-5">
                                                    <span className="svg-icon svg-icon-md">
                                                        <i id="btnAdd" className={this.state.iconAdd} />
                                                    </span>Update AboutUs</a>

                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title="" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditAboutUs(r.AboutUsID) },
                                            // { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.RemoveAboutUs(r.AboutUsID) }
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
            </>

        );
    }
}
// export default Category

export default withCookies(AboutUs);

