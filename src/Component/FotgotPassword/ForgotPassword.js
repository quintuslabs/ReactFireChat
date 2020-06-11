import React, { Component } from "react";
import firebase from "firebase";
import { AppString } from "./../Const";
import ReactLoading from "react-loading";
import { withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { myFirebase, myFirestore } from "../../Config/MyFirebase";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.state = {
      isLoading: true,
      email: "",
    };
  }

  sendResetPasswordLinkHandler = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
        this.props.history.push("/");
      })
      .catch((error) => {
        window.alert(error);
      });
  };

  onChangeHandler = (e) => {
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <div className="viewRoot">
        <div className="header">CHAT DEMO</div>

        <div className="container mt-5">
          <div className="row">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <div className="card p-5">
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    placeholder="E.g:  abc123@example.com"
                    id="email"
                    onChange={(event) => this.onChangeHandler(event)}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => this.sendResetPasswordLinkHandler()}
                >
                  Send Reset Link
                </button>
              </div>
            </div>
            <div className="col-sm-3"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ForgotPassword);
