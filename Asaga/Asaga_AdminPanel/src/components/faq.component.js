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
import CKEditorEdit from "react-ckeditor-component";
import '../style.css';
const headerTblStyle = { color: 'black' };

class Faq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FaqID: '', FaqQuestion: '', FaqAnswer: '', content: '', file: [], data: [], ImgUrl: '', IsUpdate: false, currentId: '', IsImgPreview: false, fdata: {}, oldimage: '',
            cols: [
                { title: 'Sr.No', width: '0%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                { title: 'Question', width: '40%', field: 'FaqQuestion', headerStyle: headerTblStyle },
                {
                    title: 'Answer', width: '70%', field: 'FaqAnswer', headerStyle: headerTblStyle, render: rowData => {
                        return (<p style={{ marginBottom: '1px' }}>{rowData.FaqAnswer.replace(/<[^>]+>/g,
                            ""
                        )}</p>)
                    }
                },
            ]
        };
        this.onChangeEVT = this.onChangeEVT.bind(this);
    }
    componentDidMount() {
        this.GetFaq();
    }
    GetFaq() {
        var data = JSON.stringify({
            "FaqID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getFAQ",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getFAQ(config).then(response => {
            debugger;
            this.setState({ data: response.data.data })
        }, error => { })
    }
    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();
        if (this.form.isValid()) {
            var data = "";
            if (this.state.FaqID != "") {
                data = JSON.stringify({
                    "FaqID": this.state.FaqID,
                    "Question": this.state.Question,
                    "Answer": this.state.content,
                    //"Answer": this.state.Answer,
                });
            } else {
                data = JSON.stringify({
                    // "FaqID": this.state.FaqID,
                    "Question": this.state.Question,
                    "Answer": this.state.content,
                    //"Answer": this.state.Answer,
                });
            }
            var config = {
                method: 'POST',
                url: MasterService.API_URL + "setFAQ",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            MasterService.setFAQ(config).then(response => {
                if (response.data.status) {
                    if (this.state.FaqID != "") {
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
                    this.GetFaq();
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
            FaqAnswer: '', FaqQuestion: '', Question: '', Answer: '', content: ''
        });
        this.form.reset();
        this.GetFaq();
    }
    EditFaq(id) {
        debugger;
        var data = JSON.stringify({
            "FaqID": id
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getFAQ",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getFAQ(config).then(response => {
            debugger;
            this.setState({
                FaqID: response.data.data[0].FaqID,
                Question: response.data.data[0].FaqQuestion,
                content: response.data.data[0].FaqAnswer,
            });
        }, error => { })
    }
    RemoveFaq(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = JSON.stringify({
                    "FaqID": id
                });
                var config = {
                    method: 'POST',
                    url: MasterService.API_URL + "removeFAQ",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                MasterService.removeFAQ(config).then(response => {
                    if (response.data.status) {
                        this.GetFaq();
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

    onChangeEVT(evt) {
        var newContent = evt.editor.getData();
        this.setState({ content: newContent });
    }
    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">Faq Add</h3>
                                </div>
                                <FormWithConstraints
                                    ref={form => this.form = form}
                                    onSubmit={this.handleSubmit}
                                    noValidate>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group" style={{ width: '100%' }}>
                                                    <label>Question :</label>
                                                    <textarea
                                                        name='FaqQuestion'
                                                        rows="3"
                                                        style={{ height: "120px" }}
                                                        // value={this.state.Question}
                                                        className="form-control"
                                                        // onChange={(e) => {
                                                        //     this.setState({
                                                        //         Question: e.target.value,
                                                        //     });
                                                        // }}
                                                        required
                                                        value={this.state.Question} onChange={(e) => this.setState({ Question: e.target.value },
                                                            () => { this.form.validateFields(e.target) })}
                                                        placeholder="Question"
                                                    />
                                                    <FieldFeedbacks for="FaqQuestion">
                                                        <FieldFeedback when="*">
                                                            *
                                                        </FieldFeedback>
                                                    </FieldFeedbacks>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group" style={{ width: '100%' }}>
                                                    <label>Answer :</label>
                                                   
                                                    <CKEditorEdit
                                                        name='FaqAnswer'
                                                        role="img"
                                                        data={this.state.content}
                                                        content={this.state.content}
                                                        events={{ change: this.onChangeEVT }}
                                                    />
                                                    <FieldFeedbacks for="FaqAnswer">
                                                        <FieldFeedback when="*">
                                                            *
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
                                </FormWithConstraints>

                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="card card-custom" style={{ boxShadow: '1px 1px 0px 2px' }} >
                                <div className="card-header">
                                    <h3 className="card-title">Faq View</h3>
                                </div>
                                <div className="card-body">
                                    <MaterialTable title="" columns={this.state.cols} data={this.state.data}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditFaq(r.FaqID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.RemoveFaq(r.FaqID) },
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
export default Faq