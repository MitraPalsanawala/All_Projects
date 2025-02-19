import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

class dashboard extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    render() {

        return (
            <div>
                <div>
                    <div className="row">
                        <div className="col-md-3 offset-md-9" style={{ marginBottom: '1%', textAlign: 'right' }}>
                            <button type="button" className="btn btn-primary" onclick="CheckFilter()">
                                Filter <i id="btnFilter" className="fa fa-plus" />
                            </button>
                        </div>
                    </div>
                    <div className="row" style={{ marginBottom: '1%', display: 'none' }} id="divFilter">
                        <div className="col-md-3">
                            <div className="form-group formgroupcss">
                                <label>Start Date </label>
                                <input id="kt_datepicker_1" defaultValue="21-01-2023" readOnly type="text" className="form-control" placeholder />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group formgroupcss">
                                <label>End Date </label>
                                <input id="kt_datepicker_2" defaultValue="21-01-2023" readOnly type="text" className="form-control" placeholder />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <button type="button" className="btn btn-primary mt-8">Search </button>
                            <button type="button" className="btn btn-danger mt-8">Cancel </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-4">
                            <div className="card card-custom gutter-b card-stretch">
                                <div className="card-header border-0">
                                    <div className="card-title font-weight-bolder">
                                        <div className="card-label">
                                            Surat
                                            <div className="font-size-sm text-muted mt-2">Booking Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                {/* <i class="fa fa-list"></i> */}
                                                <img src="Images/booking.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Bookings
                                                Received</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">200</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="https://preview.keenthemes.com/metronic/theme/html/demo7/dist/assets/media/svg/misc/015-telegram.svg" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Assigned</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">180</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/finish.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Finished</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">185</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/complete.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Completed</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">182</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/pending.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Pending
                                                for Approval</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">10</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/approved4.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Approved</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">170</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/referral.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Referred
                                                Back</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="card card-custom gutter-b card-stretch">
                                <div className="card-header border-0">
                                    <div className="card-title font-weight-bolder">
                                        <div className="card-label">
                                            Ahmedabad
                                            <div className="font-size-sm text-muted mt-2">Booking Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/booking.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Bookings
                                                Received</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">200</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="https://preview.keenthemes.com/metronic/theme/html/demo7/dist/assets/media/svg/misc/015-telegram.svg" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Assigned</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">180</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/finish.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Finished</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">185</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/complete.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Completed</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">182</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/pending.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Pending
                                                for Approval</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">10</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/approved4.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Approved</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">170</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/referral.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Referred
                                                Back</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="card card-custom gutter-b card-stretch">
                                <div className="card-header border-0">
                                    <div className="card-title font-weight-bolder">
                                        <div className="card-label">
                                            Gandhinagar
                                            <div className="font-size-sm text-muted mt-2">Booking Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                {/* <i class="fa fa-list"></i> */}
                                                <img src="Images/booking.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Bookings
                                                Received</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">200</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="https://preview.keenthemes.com/metronic/theme/html/demo7/dist/assets/media/svg/misc/015-telegram.svg" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Assigned</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">180</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/finish.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Finished</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">185</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/complete.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Completed</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">182</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/pending.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Pending
                                                for Approval</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">10</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/approved4.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Approved</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">170</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/referral.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Referred
                                                Back</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="card card-custom gutter-b card-stretch">
                                <div className="card-header border-0">
                                    <div className="card-title font-weight-bolder">
                                        <div className="card-label">
                                            Vadodara
                                            <div className="font-size-sm text-muted mt-2">Booking Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                {/* <i class="fa fa-list"></i> */}
                                                <img src="Images/booking.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Bookings
                                                Received</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">200</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="https://preview.keenthemes.com/metronic/theme/html/demo7/dist/assets/media/svg/misc/015-telegram.svg" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Assigned</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">180</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/finish.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Finished</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">185</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/complete.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Completed</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">182</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/pending.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Pending
                                                for Approval</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">10</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/approved4.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Approved</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">170</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/referral.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Referred
                                                Back</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="card card-custom gutter-b card-stretch">
                                <div className="card-header border-0">
                                    <div className="card-title font-weight-bolder">
                                        <div className="card-label">
                                            Rajkot
                                            <div className="font-size-sm text-muted mt-2">Booking Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                {/* <i class="fa fa-list"></i> */}
                                                <img src="Images/booking.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Bookings
                                                Received</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">200</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="https://preview.keenthemes.com/metronic/theme/html/demo7/dist/assets/media/svg/misc/015-telegram.svg" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Assigned</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">180</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/finish.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Finished</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">185</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/complete.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Completed</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">182</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/pending.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Pending
                                                for Approval</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">10</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/approved4.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Approved</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">170</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/referral.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Referred
                                                Back</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="card card-custom gutter-b card-stretch">
                                <div className="card-header border-0">
                                    <div className="card-title font-weight-bolder">
                                        <div className="card-label">
                                            Bhavnagar
                                            <div className="font-size-sm text-muted mt-2">Booking Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                {/* <i class="fa fa-list"></i> */}
                                                <img src="Images/booking.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Bookings
                                                Received</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">200</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="https://preview.keenthemes.com/metronic/theme/html/demo7/dist/assets/media/svg/misc/015-telegram.svg" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Assigned</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">180</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/finish.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Finished</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">185</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/complete.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Completed</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">182</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/pending.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Pending
                                                for Approval</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">10</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap mb-2">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/approved4.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Approved</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">170</span>
                                    </div>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="symbol symbol-50 symbol-light mr-5">
                                            <span className="symbol-label">
                                                <img src="Images/referral.png" className="h-50 align-self-center" alt />
                                            </span>
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 mr-2 my-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Referred
                                                Back</a>
                                        </div>
                                        <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default dashboard