import React, { Component } from "react";
import { Person, lookupProfile } from "blockstack";
import { Skeleton, Switch, Modal, Card, Icon, Avatar, Row, Col } from "antd";

const { Meta } = Card;
const { confirm } = Modal;

const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return "Anonymous";
        },
        avatarUrl() {
          return avatarFallbackImage;
        }
      },
      username: "",
      newUrl: "",
      newPassword: "",
      logins: [],
      statusIndex: 0,
      isLoading: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username
    });
  }

  handleNewUrlChange(event) {
    this.setState({ newUrl: event.target.value });
  }

  handleNewPasswordChange(event) {
    this.setState({ newPassword: event.target.value });
  }

  handleNewLoginSubmit(event) {
    this.saveNewLogin(this.state.newUrl, this.state.newPassword);
    this.setState({
      newUrl: "",
      newPassword: ""
    });
  }

  saveNewLogin(urlText, passwordText) {
    const { userSession } = this.props;
    let logins = this.state.logins;

    if (urlText.trim() !== "" && passwordText.trim() !== "") {
      let login = {
        id: this.state.statusIndex++,
        url: urlText.trim(),
        password: passwordText.trim(),
        created_at: Date.now()
      };

      logins.unshift(login);
      const options = { encrypt: false };
      userSession
        .putFile("loginss.json", JSON.stringify(logins), options)
        .then(() => {
          this.setState({
            logins: logins
          });
        });
    }
  }

  deleteLogin(urlText, passwordText) {
    const { userSession } = this.props;
    let logins = this.state.logins;

    logins = logins.filter(
      login => login.url != urlText && login.password != passwordText
    );

    const options = { encrypt: false };
    userSession
      .putFile("loginss.json", JSON.stringify(logins), options)
      .then(() => {
        this.setState({
          logins: logins
        });
      });
  }

  fetchData() {
    const { userSession } = this.props;
    this.setState({ isLoading: true });
    if (this.isLocal()) {
      const options = { decrypt: false };
      userSession
        .getFile("loginss.json", options)
        .then(file => {
          var logins = JSON.parse(file || "[]");
          this.setState({
            person: new Person(userSession.loadUserData().profile),
            username: userSession.loadUserData().username,
            statusIndex: logins.length,
            logins: logins
          });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    } else {
      const username = this.props.match.params.username;

      lookupProfile(username)
        .then(profile => {
          this.setState({
            person: new Person(profile),
            username: username
          });
        })
        .catch(error => {
          console.log("could not resolve profile");
        });

      const options = { username: username, decrypt: false };
      userSession
        .getFile("logins.json", options)
        .then(file => {
          var logins = JSON.parse(file || "[]");
          console.log(logins);
          this.setState({
            statusIndex: logins.length,
            logins: logins
          });
        })
        .catch(error => {
          console.log("could not fetch logins");
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  showConfirm(urlText, passwordText) {
    confirm({
      title: "Do you want to delete these items?",
      content:
        "This will delete the associated accounts and cannot be used afterwards!",
      onOk: () => {
        this.deleteLogin(urlText, passwordText);
      },
      onCancel: () => {}
    });
  }

  isLocal() {
    return this.props.match.params.username ? false : true;
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { username } = this.state;

    return !userSession.isSignInPending() && person ? (
      <div className="container">
        <div className="row">
          <div className="col-md-offset-3 col-md-6">
            <div className="col-md-12">
              <div className="avatar-section">
                <img
                  src={
                    person.avatarUrl()
                      ? person.avatarUrl()
                      : avatarFallbackImage
                  }
                  className="img-rounded avatar"
                  id="avatar-image"
                />
                <div className="username">
                  <h1>
                    <span id="heading-name">
                      {person.name() ? person.name() : "Nameless Person"}
                    </span>
                  </h1>
                  <span>{username}</span>
                  {this.isLocal() && (
                    <span>
                      &nbsp;|&nbsp;
                      <a onClick={handleSignOut.bind(this)}>(Logout)</a>
                    </span>
                  )}
                </div>
              </div>
            </div>
            {this.isLocal() && (
              <div className="new-password">
                <div className="col-md-12">
                  <textarea
                    className="url"
                    value={this.state.newUrl}
                    onChange={e => this.handleNewUrlChange(e)}
                    placeholder="url"
                  />
                </div>
                <div className="col-md-12">
                  <textarea
                    className="password"
                    value={this.state.newPassword}
                    onChange={e => this.handleNewPasswordChange(e)}
                    placeholder="password"
                  />
                </div>
                <div className="col-md-12 text-right">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={e => this.handleNewLoginSubmit(e)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            <div className="col-md-12 logins">
              {this.state.isLoading && <span>Loading...</span>}
              <Row gutter={[24, 24]}>
                {this.state.logins.map(status => (
                  <div className="status" key={status.id}>
                    <Col span={10}>
                      <Card
                        style={{ margin: 16 }}
                        actions={[
                          <a href={`https://${status.url}`} target="_blank">
                            {" "}
                            <Icon type="link" key="link" />{" "}
                          </a>,
                          <Icon type="edit" key="edit" />,
                          <Icon
                            type="delete"
                            key="delete"
                            onClick={() =>
                              this.showConfirm(status.url, status.password)
                            }
                          />
                        ]}
                      >
                        <Meta
                          avatar={
                            <Avatar src={`//logo.clearbit.com/${status.url}`} />
                          }
                          title={<div>{status.url}</div>}
                          description={<div>{status.password}</div>}
                        />
                      </Card>
                    </Col>
                  </div>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}
