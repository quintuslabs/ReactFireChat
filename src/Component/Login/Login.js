import firebase from "firebase";
import React, { Component } from "react";
import ReactLoading from "react-loading";
import { withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { myFirebase, myFirestore } from "../../Config/MyFirebase";
import "./Login.css";
import { AppString } from "./../Const";

class Login extends Component {
  constructor(props) {
    super(props);
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.state = {
      isLoading: true,
      email: "",
      password: "",
    };
  }

  componentDidMount() {
    this.checkLogin();
  }

  onChangeHandler = (e) => {
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  signInWithEmailAndPasswordHandler = () => {
    const { email, password } = this.state;
    if (email.length === 0 && password.length === 0) {
      return;
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.setupUserDetails(result);
          console.log(result);
          console.log("User logged-in successfully!");
        })
        .catch((error) => console.log("errorMessage==>", error.message));
    }
  };

  checkLogin = () => {
    if (localStorage.getItem(AppString.ID)) {
      this.setState({ isLoading: false }, () => {
        this.setState({ isLoading: false });
        this.props.showToast(1, "Login success");
        this.props.history.push("/main");
      });
    } else {
      this.setState({ isLoading: false });
    }
  };

  onLoginPress = () => {
    this.setState({ isLoading: true });
    myFirebase
      .auth()
      .signInWithPopup(this.provider)
      .then(async (result) => {
        this.setupUserDetails(result);
      })
      .catch((err) => {
        this.props.showToast(0, err.message);
        this.setState({ isLoading: false });
      });
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
            nickname: user.displayName,
            aboutMe: "",
            photoUrl: user.photoURL,
          })
          .then((data) => {
            // Write user info to local
            localStorage.setItem(AppString.ID, user.uid);
            localStorage.setItem(AppString.NICKNAME, user.displayName);
            localStorage.setItem(AppString.PHOTO_URL, user.photoURL);
            this.setState({ isLoading: false }, () => {
              this.props.showToast(1, "Login success");
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

  navigateToRegister = () => {
    this.props.history.push("/register");
  };
  navigateToForgotPassword = () => {
    this.props.history.push("/forgot_password");
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
                  onClick={() => this.signInWithEmailAndPasswordHandler()}
                >
                  Sign in
                </button>
                <p style={{ marginTop: 10 }}>
                  don't have an account ?{" "}
                  <span
                    onClick={this.navigateToRegister}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    Please Register
                  </span>
                </p>
                <p style={{ marginTop: 10 }}>
                  <span
                    onClick={this.navigateToForgotPassword}
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    Forgot Password
                  </span>
                </p>
              </div>
            </div>
            <div className="col-sm-3"></div>
          </div>
        </div>

        <button className="btnLogin" type="submit" onClick={this.onLoginPress}>
          SIGN IN WITH GOOGLE
        </button>

        {this.state.isLoading ? (
          <div className="viewLoading">
            <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Login);
