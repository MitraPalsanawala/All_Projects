import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
// import { Router, Switch, Route, NavLink } from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import Routes from './Routing';
import { clearMessage } from "./actions/message";
import { history } from './helpers/history';
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.js';
import { instanceOf } from 'prop-types';
import Select from 'react-select'
import { withCookies, Cookies } from 'react-cookie';
class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);
    const { cookies } = props;
    // this.logOut = this.logOut.bind(this);
    this.state = { currentUser: undefined, URLName: '' };
    history.listen((location) => { props.dispatch(clearMessage()) });
  }
  componentDidMount() {
    const user = this.props.user;
    //const URLSD = this.props.location.pathname;
    if (user) { this.setState({ currentUser: user }) }
  }
  // clear message when changing location
  // logOut() { this.props.dispatch(logout()) }
  logout = (e) => {
    debugger;
    e.preventDefault();
    const { cookies } = this.props;

    cookies.remove("UserName");


    history.push('/');
    window.location.href = "/";
  }
  render() {
    // const { currentUser } = this.state;
    return (
      <>

        {/* <Router history={history}>
            {
              this.props.isAuthenticated ? ( */}
        <Routes />
        {(this.props.allCookies.UserName !== undefined) ? (
          <div className="App">
            <div>
              <div id="kt_header_mobile" className="header-mobile bg-primary header-mobile-fixed">
                <a href="index.html">
                  <h3 style={{ color: 'white' }}>Asaga</h3>
                </a>
                <div className="d-flex align-items-center">
                  <button className="btn p-0 burger-icon burger-icon-left ml-4" id="kt_header_mobile_toggle">
                    <span />
                  </button>
                  <button className="btn p-0 ml-2" id="kt_header_mobile_topbar_toggle">
                    <span className="svg-icon svg-icon-xl">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                        <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                          <polygon points="0 0 24 0 24 24 0 24" />
                          <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
                          <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fillRule="nonzero" />
                        </g>
                      </svg> */}
                    </span>
                  </button>
                </div>
              </div>
              <div className="d-flex flex-column flex-root">
                <div className="d-flex flex-row flex-column-fluid page">
                  <div className="d-flex flex-column flex-row-fluid " id="kt_wrapper">
                    <div id="kt_header" className="header flex-column header-fixed">
                      <div className="header-top">
                        <div className="container">
                          <div className="d-none d-lg-flex align-items-center mr-3">
                            <a href="/ItemDetail" className="mr-20">
                              <h3 style={{ color: 'white' }}>Asaga</h3>
                            </a>
                          </div>
                          <div className="topbar bg-primary">
                            <div className="topbar-item">
                              <div className="btn btn-icon btn-hover-transparent-white w-sm-auto d-flex align-items-center btn-lg px-2" id="kt_quick_user_toggle">
                                <div className="d-flex flex-column text-right pr-sm-3">
                                  <span className="text-white font-weight-bolder font-size-sm d-none d-sm-inline">Admin</span>
                                </div>
                                <span className="symbol symbol-35">
                                  <span className="symbol-label font-size-h5 font-weight-bold text-white bg-white-o-30">A</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="header-bottom">
                        <div className="container">
                          <div className="header-navs header-navs-left" id="kt_header_navs">
                            <div className="tab-content">
                              <div className="tab-pane py-5 p-lg-0 show active" id="kt_header_tab_1">
                                <div id="kt_header_menu" className="header-menu header-menu-mobile header-menu-layout-default">
                                  <ul className="menu-nav">

                                    <li className="menu-item menu-item-submenu menu-item-rel" data-menu-toggle="click" aria-haspopup="true">
                                      <a className="menu-link menu-toggle">
                                        <span className="menu-text">Item Detail</span>
                                        <span className="menu-desc" />
                                        <i className="menu-arrow" />
                                      </a>
                                      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                                        <ul className="menu-subnav">

                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/ItemDetail"} className="menu-link">
                                              <span className="menu-text">Item Detail</span>
                                            </NavLink>
                                          </li>

                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/StockDetail"} className="menu-link">
                                              <span className="menu-text">Stock Detail</span>
                                            </NavLink>
                                          </li>
                                        </ul>
                                      </div>
                                    </li>

                                    <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                      <a className="menu-link">
                                        <NavLink to={"/OrderDetail"} activeClassName="current"><span className="menu-text">Order Detail</span></NavLink >
                                      </a>
                                    </li>

                                    <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                      <a className="menu-link">
                                        <NavLink to={"/UserDetail"} activeClassName="current"><span className="menu-text">User Detail</span></NavLink >
                                      </a>
                                    </li>

                                    <li className="menu-item menu-item-submenu menu-item-rel" data-menu-toggle="click" aria-haspopup="true">
                                      <a className="menu-link menu-toggle">
                                        <span className="menu-text">Master</span>
                                        <span className="menu-desc" />
                                        <i className="menu-arrow" />
                                      </a>
                                      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                                        <ul className="menu-subnav">

                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/category"} className="menu-link">
                                              <span className="menu-text">Category</span>
                                            </NavLink>
                                          </li>

                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/subcategory"} className="menu-link">
                                              <span className="menu-text">SubCategory</span>
                                            </NavLink>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/AboutUs"} className="menu-link">
                                              <span className="menu-text">AboutUs</span>
                                            </NavLink>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/Banner"} className="menu-link">
                                              <span className="menu-text">Banner</span>
                                            </NavLink>
                                          </li>
                                        </ul>
                                      </div>
                                    </li>

                                    <li className="menu-item menu-item-submenu menu-item-rel" data-menu-toggle="click" aria-haspopup="true">
                                      <a className="menu-link menu-toggle">
                                        <span className="menu-text">Others</span>
                                        <span className="menu-desc" />
                                        <i className="menu-arrow" />
                                      </a>
                                      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                                        <ul className="menu-subnav">

                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/Faq"} className="menu-link">
                                              <span className="menu-text">Faq</span>
                                            </NavLink>
                                          </li>

                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/ContactUs"} className="menu-link">
                                              <span className="menu-text">ContactUs</span>
                                            </NavLink>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/CoupanCode"} className="menu-link">
                                              <span className="menu-text">Coupan Code</span>
                                            </NavLink>
                                          </li>
                                          {/* <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/AboutUs"} className="menu-link">
                                              <span className="menu-text">AboutUs</span>
                                            </NavLink>
                                          </li>
                                          <li className="menu-item menu-item-submenu" data-menu-toggle="hover" aria-haspopup="true">
                                            <NavLink to={"/Banner"} className="menu-link">
                                              <span className="menu-text">Banner</span>
                                            </NavLink>
                                          </li> */}
                                        </ul>
                                      </div>
                                    </li>

                                  </ul>
                                </div>
                              </div>
                              {/* <div className="tab-pane p-5 p-lg-0 justify-content-between" id="kt_header_tab_2">
                                <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
                                  <a href="#" className="btn btn-light-success font-weight-bold mr-3 my-2 my-lg-0">Latest Orders</a>
                                  <a href="#" className="btn btn-light-primary font-weight-bold my-2 my-lg-0">Customer Service</a>
                                </div>
                                <div className="d-flex align-items-center">
                                  <a href="#" className="btn btn-danger font-weight-bold my-2 my-lg-0">Generate Reports</a>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content d-flex flex-column flex-column-fluid" id="kt_content">
                      <div className="d-flex flex-column-fluid">
                        <div className="container-fluid">
                          <div className="row">

                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div id="kt_quick_user" className="offcanvas offcanvas-right p-10">
                <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
                  <h3 className="font-weight-bold m-0">User Profile</h3>
                  <a href="#" className="btn btn-xs btn-icon btn-light btn-hover-primary" id="kt_quick_user_close">
                    <i className="ki ki-close icon-xs text-muted" />
                  </a>
                </div>
                <div className="offcanvas-content pr-5 mr-n5">
                  <div className="d-flex align-items-center mt-5">
                    <div className="symbol symbol-100 mr-5">
                      <div className="symbol-label" style={{ backgroundImage: 'url("metronic/theme/html/demo7/dist/assets/media/users/300_21.jpg")' }} />
                      <i className="symbol-badge bg-success" />
                    </div>
                    <div className="d-flex flex-column">
                      <a href="#" className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary">Admin</a>
                      <div className="navi mt-2">
                        <button type="button" onClick={this.logout} className="btn btn-sm btn-light-primary font-weight-bolder py-2 px-5">
                          Sign Out
                        </button>
                        {/* <a onClick={this.logout} className="btn btn-sm btn-light-primary font-weight-bolder py-2 px-5">Sign Out</a> */}
                      </div>
                    </div>
                  </div>
                  <div className="separator separator-dashed mt-8 mb-5" />
                  <div className="separator separator-dashed my-7" />
                </div>
              </div>
              <div id="kt_scrolltop" className="scrolltop">
                <span className="svg-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                      <polygon points="0 0 24 0 24 24 0 24" />
                      <rect fill="#000000" opacity="0.3" x={11} y={10} width={2} height={10} rx={1} />
                      <path d="M6.70710678,12.7071068 C6.31658249,13.0976311 5.68341751,13.0976311 5.29289322,12.7071068 C4.90236893,12.3165825 4.90236893,11.6834175 5.29289322,11.2928932 L11.2928932,5.29289322 C11.6714722,4.91431428 12.2810586,4.90106866 12.6757246,5.26284586 L18.6757246,10.7628459 C19.0828436,11.1360383 19.1103465,11.7686056 18.7371541,12.1757246 C18.3639617,12.5828436 17.7313944,12.6103465 17.3242754,12.2371541 L12.0300757,7.38413782 L6.70710678,12.7071068 Z" fill="#000000" fillRule="nonzero" />
                    </g>
                  </svg>
                </span>
              </div>
            </div>

          </div>
        ) : ''}
        < div className="footer bg-white py-4 d-flex flex-lg-column" id="kt_footer">
          <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="text-dark order-2 order-md-1">
              <span className="text-muted font-weight-bold mr-2">2023©</span>
              <a href="https://smtechno.com" target="_blank" className="text-dark-75 text-hover-primary">SM Techno
                Consultants PVT LTD</a>
            </div>
          </div>
        </div>


      </>
    );
  }

}

// export default App;
function mapStateToProps(state) { const { user } = state.auth; return { user }; }
export default withCookies(connect(mapStateToProps)(App));
