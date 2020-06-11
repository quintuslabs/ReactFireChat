import firebase from "firebase";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { myFirestore } from "../../Config/MyFirebase";

import { AppString } from "./../Const";

class Register extends Component {
  constructor(props) {
    super(props);
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.state = {
      isLoading: true,
      name: "",
      email: "",
      password: "",
    };
  }

  onChangeHandler = (e) => {
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  registerWithEmailAndPasswordHandler = () => {
    const { email, password } = this.state;
    if (email.length === 0 && password.length === 0) {
      return;
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          this.setupUserDetails(result);
          console.log(result);
          console.log("User Register successfully!");
        })
        .catch((error) => console.log("errorMessage==>", error.message));
    }
  };

  setupUserDetails = async (result) => {
    let user = result.user;
    if (user) {
      const result = await myFirestore
        .collection(AppString.NODE_USERS)
        .where(AppString.ID, "==", user.uid)
        .get();

      if (result.docs.length === 0) {
        // Set new data since this is a new user
        myFirestore
          .collection("users")
          .doc(user.uid)
          .set({
            id: user.uid,
            nickname: this.state.name,
            aboutMe: "",
            photoUrl: "",
          })
          .then((data) => {
            // Write user info to local
            localStorage.setItem(AppString.ID, user.uid);
            localStorage.setItem(AppString.NICKNAME, this.state.name);
            localStorage.setItem(AppString.PHOTO_URL, "");
            this.setState({ isLoading: false }, () => {
              this.props.showToast(1, "Register success");
              this.props.history.push("/main");
            });
          });
      } else {
        // Write user info to local
        localStorage.setItem(AppString.ID, result.docs[0].data().id);
        localStorage.setItem(
          AppString.NICKNAME,
          result.docs[0].data().nickname
        );
        localStorage.setItem(
          AppString.PHOTO_URL,
          result.docs[0].data().photoUrl
        );
        localStorage.setItem(AppString.ABOUT_ME, result.docs[0].data().aboutMe);
        this.setState({ isLoading: false }, () => {
          this.props.showToast(1, "Login success");
          this.props.history.push("/main");
        });
      }
    } else {
      this.props.showToast(0, "User info not available");
    }
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
                  <label>Name</label>
                  <input
                    type="name"
                    className="form-control"
                    name="name"
                    value={this.state.name}
                    placeholder="E.g: abc123@example.com"
                    id="name"
                    onChange={(event) => this.onChangeHandler(event)}
                  />
                </div>
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    placeholder="E.g: abc123@example.com"
                    id="email"
                    onChange={(event) => this.onChangeHandler(event)}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    name="password"
                    value={this.state.password}
                    placeholder="Your Password"
                    id="password"
                    onChange={(event) => this.onChangeHandler(event)}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => this.registerWithEmailAndPasswordHandler()}
                >
                  Register
                </button>
                <p>
                  don't have an account ?{" "}
                  <span
                    onClick={this.navigateToRegister}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    Please Register
                  </span>
                </p>
              </div>
            </div>
            <div className="col-sm-3"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
