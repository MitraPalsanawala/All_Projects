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

const APP_URL = "https://asaga.in:9920/UploadFiles/Item/";

class ItemDetail extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            ItemID: '',
            ItemName: '',
            Remarks: '',
            Material: '',
            Color: '',
            Description: '',
            ImgFile: [],
            ImgFilename: "",
            ImgFileErr: "",
            oldimage: '',
            MultiFile: [],
            MultiFilename: "",
            MultiFileErr: "",
            oldmultifileErr: "",
            data: [],
            categories: [],
            CategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' },
            SearchCategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' },
            CategoryErrMsg: '',
            colors: [],
            ColorID: { 'label': '---Select Color---', 'value': '---Select Color---' },
            SearchColorID: { 'label': '---Select Color---', 'value': '---Select Color---' },
            ColorErrMsg: '',
            subcategories: [],
            SubCategoryID: { 'label': '---Select SubCategory---', 'value': '---Select SubCategory---' },
            SearchSubCategoryID: { 'label': '---Select SubCategory---', 'value': '---Select SubCategory---' },
            SubCategoryErrMsg: '',
            BindCategoryID: { 'label': '---Select Bind Category---', 'value': '---Select Bind Category---' },
            BindSubCategoryID: { 'label': '---Select Bind SubCategory---', 'value': '---Select Bind SubCategory---' },
            bindsubcategories: [],
            bindcategories: [],
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
            cols: [
                { title: 'Sr.No', width: '2%', field: 'tableData.id', headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.tableData.id + 1}</p>) } },
                // { title: 'Category Name', width: '20%', field: 'CategoryName', headerStyle: headerTblStyle },
                // {
                //     title: 'Update', field: 'ItemStockDetail', headerStyle: headerTblStyle, render: rowData => {
                //         return (
                //             <button type="button" class="btn btn-primary" onClick={this.OnItemStockUpdateClick(rowData.ItemID)} className="btn btn-success">Stock</button>
                //         )
                //     }
                // },
                {
                    title: (<div style={{ width: '100%' }}><span>Category</span>
                        <hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>SubCategory</span>
                    </div>), width: '18%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.CategoryName}<hr /> {rowData.SubCategoryName}</p>) }
                },
                // { title: 'Item Name', width: '20%', field: 'ItemName', headerStyle: headerTblStyle },
                {
                    title: (<div style={{ width: '100%' }}><span>Item Name</span>
                        <hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>Amount</span>
                    </div>), width: '12%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.ItemName}<hr /> {rowData.Amount}</p>) }
                },
                {
                    title: (<div style={{ width: '100%' }}><span>Color</span>
                        <hr style={{ marginTop: '5px', marginBottom: '5px' }} /><span>Material</span>
                    </div>), width: '12%', removable: false, headerStyle: headerTblStyle, render: rowData => { return (<p style={{ marginBottom: '1px' }}>{rowData.Color}<hr /> {rowData.Material}</p>) }
                },
                {
                    title: 'Image', field: 'url', width: '10%',
                    render: rowData =>
                        (rowData.ItemImage != "" && rowData.ItemImage != null) ? <img src={APP_URL + rowData.ItemImage} alt="Image Not" style={{ width: 80, height: 80 }} /> : <img style={{ height: '100px' }} src={APP_URL + "NoImage.png"} />
                },
                { title: 'Description', width: '30%', field: 'Description', headerStyle: headerTblStyle },
                { title: 'Remarks', width: '30%', field: 'Remarks', headerStyle: headerTblStyle },
            ]
        };
    }
    GetItem() {
        var SearchCategoryID = "";
        var SearchSubCategoryID = "";

        if (this.state.SearchCategoryID.value != "---Select Category---") {
            SearchCategoryID = this.state.SearchCategoryID.value;
        }
        else {
            SearchCategoryID = "";
        }

        if (this.state.SearchSubCategoryID.value != "---Select SubCategory---") {
            SearchSubCategoryID = this.state.SearchSubCategoryID.value;
        }
        else {
            SearchSubCategoryID = "";
        }

        var data = JSON.stringify({
            "ItemID": "",
            "CategoryID": SearchCategoryID,
            "SubCategoryID": SearchSubCategoryID
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
            // this.setState({ data: response.data.data })
            if (response.data.status) {
                this.setState({ data: response.data.data })
            }
            else {
                this.setState({ data: [] })
            }
        }, error => { })
    }
    componentDidMount() {
        this.GetSubCategory();
        this.GetCategory();
        this.GetItem();
        this.GetColor();
        this.GetSize();
    }
    GetSubCategory() {
        var data = JSON.stringify({
            "CategoryID": "",
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
            // this.setState({ data: response.data.data })
            this.setState({ subcategories: response.data.data.map(item => ({ value: item.SubCategoryID, label: item.SubCategoryName })) });
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
    GetColor() {
        var data = JSON.stringify({
            "ColorID": ""
        });
        var config = {
            method: 'POST',
            url: MasterService.API_URL + "getItemColor",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        MasterService.getItemColor(config).then(response => {
            debugger;
            // this.setState({ data: response.data.data })
            this.setState({ colors: response.data.data.map(item => ({ value: item.Color, label: item.Color })) });

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
    ValidateCategory = (e) => {
        this.setState({ CategoryErrMsg: '' })
    }
    ValidateCancelCategory = (e) => {
        this.setState({ CategoryErrMsg: 'required' })
    }
    onCategoryChange1 = (e) => {
        debugger;
        if (e != null) {
            this.setState({ CategoryID: e }, (e) => { this.ValidateCategory(); });
        }
        else {
            this.setState({ CategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' } }, () => { this.ValidateCancelCategory() });
        }

    }

    onCategoryChange = (e) => {
        debugger;
        this.setState({ CategoryID: e });
        if (e.value != "---Select Category---") {
            var data = "";
            data = JSON.stringify({
                "CategoryID": e.value
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
                var checkstatus = this.state.IsEdit
                if (response.data.status) {
                    this.setState({ SearchSubCategoryID: { 'label': '---Select SubCategory---', 'value': '---Select SubCategory---' } })
                    this.setState({ subcategories: response.data.data.map(item => ({ value: item.SubCategoryID, label: item.SubCategoryName })) });
                }
                else {
                    this.setState({ subcategories: [] })
                    this.setState({ SearchSubCategoryID: { 'label': '---Select SubCategory---', 'value': '---Select SubCategory---' } })
                }
            }, error => { })
        }
        else {
            this.setState({ CategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' } });
        }
    }
    ValidateColor = (e) => {
        this.setState({ ColorErrMsg: '' })
    }
    ValidateCancelColor = (e) => {
        this.setState({ ColorErrMsg: 'required' })
    }
    onColorChange = (e) => {
        debugger;
        if (e != null) {
            this.setState({ ColorID: e }, (e) => { this.ValidateCategory(); });
        }
        else {
            this.setState({ ColorID: { 'label': '---Select Color---', 'value': '---Select Color---' } }, () => { this.ValidateCancelColor() });
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

    ValidateSubCategory = (e) => {
        this.setState({ SubCategoryErrMsg: '' })
    }
    ValidateCancelSubCategory = (e) => {
        this.setState({ SubCategoryErrMsg: 'required' })
    }
    onSubCategoryChange = (e) => {
        debugger;
        if (e != null) {
            this.setState({ SubCategoryID: e }, (e) => { this.ValidateSubCategory(); });
        }
        else {
            this.setState({ SubCategoryID: { 'label': '---Select SubCategory---', 'value': '---Select SubCategory---' } }, () => { this.ValidateCancelSubCategory() });
        }
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
   
    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        this.form.validateFields();
        const rows = [...this.state.rows]
        if (this.state.CategoryID.value == "---Select Category---") {
            this.setState({ CategoryErrMsg: 'required' });
        }
        if (this.state.SubCategoryID.value == "---Select SubCategory---") {
            this.setState({ SubCategoryErrMsg: 'required' });
        }
        if (this.state.ColorID.value == "---Select Color---") {
            this.setState({ ColorErrMsg: 'required' });
        }

        var allvalid = true;
        if (this.state.ItemID == "") {
            if (this.state.ImgFile.length == 0) {
                this.setState({ ImgFileErr: 'required' });
                allvalid = false;
            }
            if (this.state.MultiFile.length == 0) {
                this.setState({ MultiFileErr: 'required' });
                allvalid = false;
            }
        }
        // else {
        //     Swal.fire({
        //         title: 'not update', icon: "error", timer: 1500
        //     });
        // }
        if (this.form.isValid()) {
            let sizebind = []
            for (let index = 0; index < rows.length; index++) {
                // if (rows[index].Size.value == '' && rows[index].TotalStock == '') {
                //     rows[index] = []
                // }
                // if (rows[index].Size == '' && rows[index].TotalStock == '') {
                //     rows[index] = []
                // }
                sizebind.push({ 'Size': rows[index].Size.value, 'TotalStock': rows[index].TotalStock })
                //stockbind.push(rows[index].TotalStock)

                if (rows[index].Size.value == '') {
                    rows[index] = []
                }
                if (rows[index].TotalStock == '') {
                    rows[index] = []
                }
            }
            const { ItemName, Remarks, Material, Description, oldimage, Amount, ImgFile, MultiFile } = this.state;
            var categorybind = this.state.CategoryID.value;
            var subcategorybind = this.state.SubCategoryID.value;
            var colorbind = this.state.ColorID.value;
            var form = new FormData();
            if (this.state.ItemID != "") {
                form.append('ItemID', this.state.ItemID);
                form.append('CategoryID', categorybind);
                form.append('SubCategoryID', subcategorybind);
                form.append('ItemName', ItemName);
                form.append('Remarks', Remarks);
                form.append('Material', Material);
                form.append('Description', Description);
                form.append('Amount', Amount);
                form.append('Color', colorbind);
                form.append('oldimage', oldimage);
                for (let i = 0; i < this.state.ImgFile.length; i++) {
                    form.append("ItemImage", ImgFile[i]);
                }
                for (let i = 0; i < MultiFile.length; i++) {
                    form.append("Image", MultiFile[i]);
                }
                form.append("ItemStock", JSON.stringify(sizebind));
            } else {
                // form.append('ItemID', this.state.ItemID);
                form.append('CategoryID', categorybind);
                form.append('SubCategoryID', subcategorybind);
                form.append('ItemName', ItemName);
                form.append('Remarks', Remarks);
                form.append('Material', Material);
                form.append('Description', Description);
                form.append('Amount', Amount);
                form.append('Color', colorbind);
                form.append("ItemImage", ImgFile[0]);
                for (let i = 0; i < MultiFile.length; i++) {
                    form.append("Image", MultiFile[i]);
                }
                form.append("ItemStock", JSON.stringify(sizebind));
            }
            ItemService.setItem(form).then(response => {
                //debugger;
                if (response.data.status) {
                    // this.form.reset();
                    debugger;
                    if (this.state.ItemID != "") {
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
                    //this.GetItem();
                } else {
                    Swal.fire({ position: 'top-end', toast: true, icon: 'error', title: response.data.message, showConfirmButton: false, timer: 3000 });
                }

            }, error => { })
        }
    }
    handleImgFile = (e) => {
        this.setState({
            ImgFile: e.target.files,
            ImgFilename: e.target.files[0].originalname,
        });
    };
    handleMultiFile = (e) => {
        this.setState({
            MultiFile: e.target.files,
            MultiFilename: e.target.files[0].originalname,
        });
    };
    ClearData = (e) => {
        debugger
        // e.preventDefault();

        this.setState({
            categories: [], CategoryErrMsg: '', SubCategoryErrMsg: "",
            CategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' },
            SubCategoryID: { 'label': '---Select SubCategory---', 'value': '---Select SubCategory---' },
            ColorID: { 'label': '---Select Color---', 'value': '---Select Color---' },
            ColorErrMsg: '',
            ItemName: '', Material: '', Color: '', Amount: '', Remarks: '', Description: '',
            ImgFile: [], oldimage: '', ImgFilename: '', ImgFileErr: '',
            MultiFile: [], oldmultifileErr: '', MultiFilename: '', MultiFileErr: '', ItemImageDetail: '',
            rows: [{ Size: '', TotalStock: '' }], IsUpdate: true
        });
        this.form.reset();
        this.GetItem();
        this.GetCategory();
        this.GetSubCategory();
        this.GetSize();
        this.GetColor();
    }
    EditItem(id) {
        debugger;
        var data = JSON.stringify({
            "ItemID": id
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
            this.setState({
                ItemID: response.data.data[0].ItemID,
                CategoryID: { 'label': response.data.data[0].CategoryName, 'value': response.data.data[0].CategoryID },
                SubCategoryID: { 'label': response.data.data[0].SubCategoryName, 'value': response.data.data[0].SubCategoryID },
                ColorID: { 'label': response.data.data[0].Color, 'value': response.data.data[0].Color },
                ItemName: response.data.data[0].ItemName,
                Material: response.data.data[0].Material,
                // Color: response.data.data[0].Color,
                Amount: response.data.data[0].Amount,
                Remarks: response.data.data[0].Remarks,
                Description: response.data.data[0].Description,
                oldimage: response.data.data[0].ItemImage,
                ItemImageDetail: response.data.data[0].ItemImageDetail.length
            });
            // let bindImg = ""
            // debugger;
            // for (let j = 0; j < response.data.data[0].ItemImageDetail.length; j++) {
            //     bindImg += response.data.data.ItemImageDetail[0]

            // }
            // const element = zones[index];

            // var bindmultiImg = "";
            // for (let i = 0; i < response.data.data.ItemImageDetail[0].length; i++) {
            //     this.setState({ ItemImageDetail: response.data.data[0].ItemImageDetail[0].Image });
            // }
            // var demo = bindmultiImg.slice(0, -1);
            if (response.data.data[0].ItemStockDetail != null) {
                debugger;
                this.setState({ rows: response.data.data[0].ItemStockDetail });
            }
            else {
                this.setState({ rows: [{ ItemDetailID: '', Size: '', TotalStock: '', RemainingStock: '' }] });
            }
            this.setState({ AddItemVisible: true });
            this.setState({ IsUpdate: false });
            this.setState({ iconAdd: "fa fa-minus" });
        }, error => { })
    }
    RemoveItem(id) {
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = JSON.stringify({
                    "ItemID": id
                });
                var config = {
                    method: 'POST',
                    url: ItemService.API_URL + "deleteItem",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                ItemService.deleteItem(config).then(response => {
                    if (response.data.status) {
                        this.GetItem();
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
    RemoveImage = (id) => (e) => {
        e.preventDefault();
        debugger;
        Swal.fire({
            title: 'Are you Sure You Want to Delete?', icon: "warning", showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                var data = JSON.stringify({
                    "ItemImageID": id
                });
                var config = {
                    method: 'POST',
                    url: ItemService.API_URL + "ImageDelete",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                ItemService.ImageDelete(config).then(response => {
                    debugger;
                    if (response.data.status) {
                        this.GetItem();
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
    onAddItemClick = (e) => {
        if (this.state.AddItemVisible == false) {
            this.setState({ AddItemVisible: true });
            this.setState({ iconAdd: "fa fa-minus" });
        }
        else {
            this.setState({ AddItemVisible: false });
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
        this.GetItem();
    }
    OnSearchCancelItemClick = () => {
        debugger;
        this.setState({
            SearchCategoryID: { 'label': '---Select Category---', 'value': '---Select Category---' },
            SearchSubCategoryID: { 'label': '---Select SubCategory---', 'value': '---Select SubCategory---' },
        }, () => {
            this.GetItem();
        });
        //window.location.reload(true);

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
    OnItemStockUpdateClick = (itemid, itemdetailID) => e => {
        debugger;
        e.preventDefault();
        this.setState({ ItemID: itemid });
        this.setState({ ItemDetailID: itemdetailID });
        this.setState({ UpdateStockVisible: true });
        window.$(this.UpdateModal).modal('show');

        // this.GetHelper(bookingdate);
    }

    onBindSubCategoryChange = (e) => {
        if (e !== null) {
            this.setState({ BindSubCategoryID: e });
        }
        else {
            this.setState({ BindSubCategoryID: { 'label': '---Select Bind SubCategory---', 'value': '---Select Bind SubCategory---' } });
        }
    }

    render() {
        return (
            <div>
                <div className="container-fluid" style={{ marginTop: '13%' }}>
                    <div className="row">
                        {this.state.AddItemVisible &&
                            <div className="col-md-12">
                                <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                    <div className="card-header">
                                        <h3 className="card-title">Item Add</h3>
                                    </div>
                                    {/* <form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; }}> */}
                                    <FormWithConstraints
                                        ref={form => this.form = form}
                                        onSubmit={this.handleSubmit}
                                        noValidate>
                                        <div className="card-body">
                                            <div className="row">
                                                {/* <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Permanent category </label>
                                                        <Select isClearable={true} options={this.state.categories} value={this.state.PermanentCategoryID} onChange={this.onPermanentCategoryChange} />

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Bind SubCategory</label>
                                                        <Select isClearable={true} options={this.state.bindsubcategories} value={this.state.BindSubCategoryID} onChange={this.onBindSubCategoryChange} />

                                                    </div>
                                                </div> */}
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Category Name</label>
                                                        <Select isClearable={true} options={this.state.categories}
                                                            value={this.state.CategoryID} onChange={this.onCategoryChange} />
                                                        {this.state.CategoryErrMsg && <span className="text-danger">{this.state.CategoryErrMsg === 'required' ? '*' : ''}</span>}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>SubCategory Name</label>
                                                        <Select isClearable={true} options={this.state.subcategories}
                                                            value={this.state.SubCategoryID} onChange={this.onSubCategoryChange} />
                                                        {this.state.SubCategoryErrMsg && <span className="text-danger">{this.state.SubCategoryErrMsg === 'required' ? '*' : ''}</span>}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Item Name</label>
                                                        <input type="text" name="ItemName" required value={this.state.ItemName} onChange={(e) => this.setState({ ItemName: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Item Name" />
                                                        <FieldFeedbacks for="ItemName">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Material</label>
                                                        <input type="text" name="Material" required value={this.state.Material} onChange={(e) => this.setState({ Material: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Item Material" />
                                                        <FieldFeedbacks for="Material">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Color</label>
                                                        <input type="text" name="Color" required value={this.state.Color} onChange={(e) => this.setState({ Color: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Item Color" />
                                                        <FieldFeedbacks for="Color">
                                                            <FieldFeedback when="valueMissing">
                                                                Please Enter Item Color
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div> */}
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Color</label>
                                                        <Select isClearable={true} options={this.state.colors}
                                                            value={this.state.ColorID} onChange={this.onColorChange} />
                                                        {this.state.ColorErrMsg && <span className="text-danger">{this.state.ColorErrMsg === 'required' ? '*' : ''}</span>}
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Size</label>
                                                        <Select isClearable={true} options={this.state.sizes}
                                                            value={this.state.SizeID} onChange={this.onSizeChange1} />
                                                        {this.state.SizeErrMsg && <span className="text-danger">{this.state.SizeErrMsg === 'required' ? 'Please Select Size' : ''}</span>}
                                                    </div>
                                                </div> */}
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Amount</label>
                                                        <input type="text" name="Amount" required value={this.state.Amount} onChange={(e) => this.setState({ Amount: e.target.value }, () => { this.form.validateFields(e.target) })} className="form-control" placeholder="Enter Item Amount" />
                                                        <FieldFeedbacks for="Amount">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Item Image :</label>
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
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Multiple Image :</label>
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg, image/png, image/jpg"
                                                            value={this.state.MultiFilename}
                                                            style={{ height: "37px" }}
                                                            multiple onChange={this.handleMultiFile}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    {this.state.MultiFileErr && <span className="text-danger">{this.state.MultiFileErr === 'required' ? '*' : ''}</span>}

                                                    {this.state.ItemImageDetail != "" && (
                                                        <label style={{ color: "red" }}>{this.state.ItemImageDetail} Files Uploaded</label>

                                                    )}
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group" style={{ width: '100%' }}>
                                                        <label>Remarks :</label>
                                                        <textarea
                                                            rows="3"
                                                            style={{ height: "120px" }}
                                                            value={this.state.Remarks}
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    Remarks: e.target.value,
                                                                });
                                                            }}
                                                            placeholder="Enter Item Remarks"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
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
                                                            onChange={(e) => this.setState({
                                                                Description: e.target.value
                                                            }, () => { this.form.validateFields(e.target) })}
                                                            placeholder="Enter Item Description"
                                                        />
                                                        <FieldFeedbacks for="Description">
                                                            <FieldFeedback when="valueMissing">
                                                                *
                                                            </FieldFeedback>
                                                        </FieldFeedbacks>


                                                    </div>
                                                </div>
                                                {this.state.IsUpdate &&
                                                    this.state.rows.map((item, idx) => (
                                                        <div className="col-md-12" key={idx}>
                                                            <div className="row" >
                                                                <div className="col-md-2" >
                                                                    <div className="form-group">
                                                                        <label>Size {idx + 1} </label>
                                                                        <label>{ }</label>
                                                                        {/* <input type="text" name={"Size" + idx} required value={this.state.rows[idx].Size} onChange={this.onSizeChange(idx)} className="form-control" placeholder="Item Size" /> */}
                                                                        <Select isClearable={true} options={this.state.sizes} name={"Size" + idx}
                                                                            required value={this.state.rows[idx].Size} onChange={this.onSizeChange(idx)} />
                                                                        <FieldFeedbacks for={"Size" + idx}>
                                                                            <FieldFeedback when="valueMissing">
                                                                                *
                                                                            </FieldFeedback>
                                                                        </FieldFeedbacks>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2" >
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
                                                                {/* <div className="col-md-2" >
                                                                    <div className="form-group">
                                                                        <label>Remaining Stock {idx + 1} </label>
                                                                        <label>{ }</label>
                                                                        <input type="text" name='RemainingStock' required value={this.state.rows[idx].RemainingStock} onChange={this.onRemainingStockChange(idx)} className="form-control" placeholder="Item Remaining Stock" />
                                                                        <FieldFeedbacks for="RemainingStock">
                                                                            <FieldFeedback when="valueMissing">
                                                                                *
                                                                            </FieldFeedback>
                                                                        </FieldFeedbacks>
                                                                    </div>
                                                                </div> */}
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
                        }
                        {this.state.isFilterVisible &&
                            <div className="col-md-12">
                                <div className="" style={{ marginBottom: '1%' }} id="divFilter">
                                    <div className="card card-custom gutter-b example example-compact" style={{ boxShadow: '1px 1px 0px 2px' }}>
                                        <div className="card-header">
                                            <h3 className="card-title">Item Search</h3>
                                        </div>
                                        <div className="col-md-12" style={{ marginTop: '22px' }}>
                                            <div className='row'>
                                                <div className="col-md-3">
                                                    <div className="form-group formgroupcss">
                                                        <label>Category </label>
                                                        <Select options={this.state.categories} value={this.state.SearchCategoryID} onChange={(e) => this.setState({ SearchCategoryID: e })} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group formgroupcss">
                                                        <label>SubCategory </label>
                                                        <Select options={this.state.subcategories} value={this.state.SearchSubCategoryID} onChange={(e) => this.setState({ SearchSubCategoryID: e })} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3" style={{ marginTop: '-12px' }}>
                                                    <button type="button" onClick={this.OnSearchItemClick} className="btn btn-primary mt-12 mr-3">Search </button>
                                                    <button type="button" onClick={this.OnSearchCancelItemClick} className="btn btn-danger mt-12">Cancel </button>
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
                                                <a onClick={this.onAddItemClick} className="btn btn-outline-primary font-weight-bolder mr-5">
                                                    <span className="svg-icon svg-icon-md">
                                                        <i id="btnAdd" className={this.state.iconAdd} />
                                                    </span>Add Item</a>
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
                                        detailPanel={[
                                            {
                                                icon: 'add', tooltip: 'View', title: 'show',
                                                render: ({ rowData }) => {
                                                    if (rowData.ItemImageDetail != null || rowData.ItemStockDetail != null) {
                                                        return (
                                                            <div style={{ width: '100%', padding: '5px', paddingLeft: '35px', display: 'block' }}>
                                                                {
                                                                    (rowData.ItemImageDetail != null) ?
                                                                        (
                                                                            <table className="table table-bordered m-0" cellSpacing="0" rules="all" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                                <thead>
                                                                                    <tr style={{ color: 'black' }}>
                                                                                        {/* <th scope="col" style={{ color: 'black' }} >No.</th> */}
                                                                                        <th scope="col" style={{ color: 'black' }}>Image</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <td>
                                                                                        <div className="row">
                                                                                            {rowData.ItemImageDetail.map((value, inx1) => {
                                                                                                return (
                                                                                                    <tr key={inx1}>
                                                                                                        <div className="col -md-8">
                                                                                                            <div style={{ textAlign: 'center', marginRight: '2px' }}>
                                                                                                                {
                                                                                                                    <>
                                                                                                                        <img className="img-thumbnail" src={APP_URL + value.Image} alt=""
                                                                                                                            style={{
                                                                                                                                objectFit: "cover",
                                                                                                                                width: "120px",
                                                                                                                                height: "135px",
                                                                                                                                marginBottom: "5%",
                                                                                                                                marginLeft: "20%",
                                                                                                                            }}

                                                                                                                        />
                                                                                                                        <i onClick={this.RemoveImage(value.ItemImageID)} className="fa fa-minus-circle removeicon"></i>
                                                                                                                        {/* onClick: (e, r) => this.RemoveItem(r.ItemID) */}
                                                                                                                    </>
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </tr>
                                                                                                )
                                                                                            })}
                                                                                        </div>
                                                                                    </td>
                                                                                </tbody>
                                                                            </table>
                                                                        ) : ''

                                                                }

                                                                {
                                                                    (rowData.ItemStockDetail != null) ?
                                                                        (< table className="table table-bordered m-0" cellSpacing="0" rules="all" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                            <thead>
                                                                                <tr style={{ color: 'black' }}>
                                                                                    <th scope="col" style={{ color: 'black' }}>Stock</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <td>
                                                                                    <table style={{ width: '100%' }}>
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th scope="col" style={{ color: 'black' }}>Size</th>
                                                                                                <th scope="col" style={{ color: 'black' }}>Total Stock</th>
                                                                                                <th scope="col" style={{ color: 'black' }}>Remaining Stock</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {/* {
                                                                                         (rowData.ItemStockDetail != "" && rowData.ItemStockDetail != null)  */}
                                                                                            {rowData.ItemStockDetail.map((value) => {
                                                                                                return (
                                                                                                    <tr>
                                                                                                        <td>{value.Size ? value.Size : '-'}</td>
                                                                                                        <td>{value.TotalStock ? value.TotalStock : '-'}</td>
                                                                                                        <td>{value.RemainingStock ? value.RemainingStock : '-'}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                            {/* } */}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tbody>
                                                                        </table>) : ''
                                                                }
                                                            </div>
                                                        )
                                                    } else {
                                                        return false;
                                                    }
                                                }
                                            }
                                        ]}
                                        actions={[{ icon: 'edit', tooltip: 'Edit', onClick: (e, r) => this.EditItem(r.ItemID) },
                                        { icon: 'delete', tooltip: 'Delete', onClick: (e, r) => this.RemoveItem(r.ItemID) }
                                        ]}
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
// export default ItemDetail
export default withCookies(ItemDetail);