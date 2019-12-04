import React, { Component } from "react";
import { Person, lookupProfile } from "blockstack";
import {
  Skeleton,
  Menu,
  Modal,
  Card,
  Icon,
  Avatar,
  Row,
  Col,
  message,
  Button,
  Input,
  Tooltip,
  Result,
  Empty,
  PageHeader,
  Switch,
  Typography
} from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

const { Meta } = Card;
const { confirm } = Modal;
const { SubMenu } = Menu;
const { Search } = Input;
const { Paragraph, Text } = Typography;

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
      newUsername: "",
      logins: [],
      searchLogins: [],
      statusIndex: 0,
      isLoading: false,
      visible: false,
      copied: false,
      noSearchResults: false
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

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleNewUrlChange(event) {
    this.setState({ newUrl: event.target.value });
  }

  handleNewPasswordChange(event) {
    this.setState({ newPassword: event.target.value });
  }

  handleNewUsernameChange(event) {
    this.setState({ newUsername: event.target.value });
  }

  handleNewLoginSubmit(event) {
    this.saveNewLogin(
      this.state.newUrl,
      this.state.newUsername,
      this.state.newPassword
    );
    this.setState({
      newUrl: "",
      newPassword: "",
      newUsername: "",
      visible: false
    });
    message.success("New Login added successfully");
  }

  saveNewLogin(urlText, usernameText, passwordText) {
    const { userSession } = this.props;
    let logins = this.state.logins;

    if (urlText.trim() !== "" && passwordText.trim() !== "") {
      let login = {
        id: this.state.statusIndex++,
        url: urlText.trim(),
        password: passwordText.trim(),
        username: usernameText.trim(),
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
    message.success("Item has been deleted");
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
          var searchText = this.props.match.params.search;
          if (searchText) {
            var searchLogins = logins.filter(v =>
              v.url.toLowerCase().includes(searchText)
            );
            if (searchLogins.length === 0) {
              this.setState({
                noSearchResults: true
              });
            }
          }

          this.setState({
            person: new Person(userSession.loadUserData().profile),
            username: userSession.loadUserData().username,
            statusIndex: logins.length,
            logins: logins,
            searchLogins: searchLogins
          });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });

      console.log(this.props.match.params.search);
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

  injectPassword = (url, username, password) => {
    message.success("Password Successfully applied", 2);
    window.parent.postMessage(
      {
        url: url,
        username: username,
        password: password,
        app: "safeguard-web"
      },
      "*"
    );
  };

  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
  };

  handleClick = e => {
    console.log("click ", e);
  };

  isLocal() {
    return this.props.match.params.username ? false : true;
  }

  cardElement = status => {
    // 576 is xs in ant design
    const isIframe = window.innerWidth < 576 ? true : false;
    if (isIframe) {
      return [
        <Tooltip title="Click to apply password">
          <Icon
            type="check-circle"
            key="apply"
            onClick={() =>
              this.injectPassword(status.url, status.username, status.password)
            }
          />
        </Tooltip>,

        <Icon
          xs={0}
          lg={1}
          type="delete"
          key="delete"
          onClick={() => this.showConfirm(status.url, status.password)}
        />
      ];
    }
    return [
      <Tooltip title="Click to copy password">
        <CopyToClipboard
          text={status.password}
          onCopy={() => {
            this.setState({ copied: true });
            message.success("Password Successfully copied for " + status.url);
          }}
        >
          <Icon type="copy" key="copy" />
        </CopyToClipboard>
      </Tooltip>,
      <a href={`https://${status.url}`} target="_blank">
        {" "}
        <Icon type="link" key="link" />{" "}
      </a>,
      <Icon
        xs={0}
        lg={1}
        type="delete"
        key="delete"
        onClick={() => this.showConfirm(status.url, status.password)}
      />
    ];
  };

  HeaderElement = () => {
    const isIframe = window.innerWidth < 576 ? true : false;
    if (isIframe) {
      return (
        <PageHeader
          title="🛡Safeguard"
          extra={[
            <Button
              size="medium"
              type="dashed"
              icon="plus"
              onClick={this.showModal}
            >
              Add new password
            </Button>
          ]}
        />
      );
    }
    return (
      <PageHeader
        title="🛡Safeguard"
        subTitle="Blockchain based password manager"
        extra={[
          <Button
            size="medium"
            type="dashed"
            icon="plus"
            onClick={this.showModal}
          >
            Add new
          </Button>
        ]}
      />
    );
  };

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person, visible } = this.state;
    const { username } = this.state;
    const { logins, searchLogins } = this.state;
    const { noSearchResults } = this.state;
    const cardItems = noSearchResults
      ? []
      : searchLogins && searchLogins.length !== 0
      ? searchLogins
      : logins;

    return !userSession.isSignInPending() && person ? (
      <div>
        {this.HeaderElement()}
        <Row>
          <Col md={4} sm={0} xs={0}>
            <Menu
              onClick={this.handleClick}
              defaultOpenKeys={["sub1"]}
              defaultSelectedKeys={["web"]}
              mode="inline"
            >
              <Menu.Item key="web">
                <Icon type="global" />
                <span>Websites</span>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    <span>
                      {person.name() ? person.name() : "Nameless Person"}
                    </span>
                  </span>
                }
              >
                <Menu.ItemGroup key="g1" title="Blockstack">
                  <Menu.Item key="id">
                    <Avatar
                      src={
                        person.avatarUrl()
                          ? person.avatarUrl()
                          : avatarFallbackImage
                      }
                      shape="square"
                      size="small"
                      style={{ backgroundColor: "#87d068", margin: 10 }}
                    />
                    {username}
                  </Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
              <Menu.Item key="2">
                {this.isLocal() && (
                  <a onClick={handleSignOut.bind(this)}>
                    <Icon type="logout" />
                    Logout
                  </a>
                )}
              </Menu.Item>
            </Menu>
          </Col>
          <Col md={20} sm={24} xs={24}>
            <div className="container">
              <div className="row">
                <div className="col-md-offset-3 col-md-6">
                  {this.isLocal() && (
                    <Modal
                      title="Add Login"
                      visible={visible}
                      onCancel={this.handleCancel}
                      onOk={e => this.handleNewLoginSubmit(e)}
                    >
                      url
                      <Input
                        addonBefore="https://"
                        placeholder="google.com"
                        value={this.state.newUrl}
                        onChange={e => this.handleNewUrlChange(e)}
                        style={{ marginBottom: 10 }}
                        suffix={
                          <Icon
                            type="link"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                      />
                      username or email
                      <Input
                        placeholder="Enter your username"
                        style={{ marginBottom: 10 }}
                        value={this.state.newUsername}
                        onChange={e => this.handleNewUsernameChange(e)}
                        suffix={
                          <Icon
                            type="user"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                      />
                      password
                      <Input.Password
                        placeholder="input password"
                        value={this.state.newPassword}
                        onChange={e => this.handleNewPasswordChange(e)}
                        style={{ marginBottom: 10 }}
                      />
                    </Modal>
                  )}
                  <div className="col-md-12 logins">
                    {this.state.isLoading && (
                      <Row gutter={[24, 24]}>
                        <Col lg={8} md={12} xs={24}>
                          <Card
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)",
                              borderRadius: 5,
                              borderColor: "white"
                            }}
                          >
                            <Skeleton active avatar></Skeleton>
                          </Card>
                        </Col>
                        <Col lg={8} md={12} xs={24}>
                          <Card
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)",
                              borderRadius: 5,
                              borderColor: "white"
                            }}
                          >
                            <Skeleton active avatar></Skeleton>
                          </Card>
                        </Col>
                        <Col lg={8} md={12} xs={24}>
                          <Card
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)",
                              borderRadius: 5,
                              borderColor: "white"
                            }}
                          >
                            <Skeleton active avatar></Skeleton>
                          </Card>
                        </Col>
                        <Col lg={8} md={12} xs={24}>
                          <Card
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)",
                              borderRadius: 5,
                              borderColor: "white"
                            }}
                          >
                            <Skeleton active avatar></Skeleton>
                          </Card>
                        </Col>
                      </Row>
                    )}
                    <Row gutter={[24, 24]}>
                      {this.state.noSearchResults && (
                        <Col lg={8} md={12} xs={24}>
                          {" "}
                          <div
                            style={{
                              marginLeft: 20,
                              marginRight: 20
                            }}
                          >
                            <Empty
                              image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                              imageStyle={{
                                height: 60
                              }}
                              description={
                                <span>Sorry, No Password for this site.</span>
                              }
                            >
                              <Button
                                type="primary"
                                onClick={event => (window.location.href = "/")}
                              >
                                {" "}
                                See all passwords
                              </Button>
                            </Empty>
                          </div>{" "}
                        </Col>
                      )}
                      {cardItems.map(status => (
                        <div className="status" key={status.id}>
                          <Col lg={8} md={12} xs={24}>
                            <Card
                              style={{
                                marginLeft: 20,
                                marginRight: 20,
                                boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)",
                                borderRadius: 5,
                                borderColor: "white"
                              }}
                              actions={this.cardElement(status)}
                            >
                              <Meta
                                avatar={
                                  <Avatar
                                    src={`//logo.clearbit.com/${status.url}`}
                                  />
                                }
                                title={<div>{status.url}</div>}
                                description={
                                  <div>
                                    <Text copyable={{ text: status.username }}>
                                      {status.username}
                                    </Text>
                                    <br />
                                    <Text
                                      type="secondary"
                                      copyable={{ text: status.password }}
                                      style={{
                                        WebkitTextSecurity: "disc",
                                      }}
                                    >
                                      {status.password}
                                    </Text>
                                  </div>
                                }
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
          </Col>
        </Row>
      </div>
    ) : null;
  }
}
