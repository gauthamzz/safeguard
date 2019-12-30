import React, { Component } from "react";
import { Person } from "blockstack";
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
  Empty,
  PageHeader,
  Typography,
  Slider,
  Checkbox,
  InputNumber,
  Progress,
  Divider,
  Alert,
  Collapse
} from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import generatePassword from "password-generator";
import zxcvbn from "zxcvbn";
import copy from "copy-to-clipboard";
import platform from "platform";
import Onboarding from "./Onboarding";
import { setTwoToneColor } from "antd/lib/icon/twoTonePrimaryColor";

const { Meta } = Card;
const { confirm } = Modal;
const { SubMenu } = Menu;
const { Text, Title } = Typography;
const { Panel } = Collapse;

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
      email: "",
      phoneNumber: "",
      emailNotifications: true,
      phoneNotifications: true,
      publicKey: "",
      newUrl: this.props.match.params.search,
      newPassword: "",
      newUsername: "",
      logins: [],
      searchLogins: [],
      statusIndex: 0,
      isLoading: false,
      visible: false,
      copied: false,
      noSearchResults: false,
      showPasswordGeneratorModal: false,
      showSettingsModal: false,
      generatedPasswordRating: 2.0,
      passwordGenerated: "",
      generatedPasswordMemorable: true,
      generatedPasswordLength: 11,
      generatePasswordFeedback: "",
      sharePasswordModal: false,
      sharePasswordBlockstackId: "",
      showOnboarding: false,
      emailAccountCreated: false
    };
  }

  componentDidMount() {
    this.checkNewLogin();
    this.fetchInfo();
    this.fetchData();
    this.getGeneratePassword(
      this.state.generatedPasswordLength,
      this.state.generatedPasswordMemorable
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username,
      email: userSession.loadUserData().email
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

  handleNewShareBlockstackId(event) {
    this.setState({
      sharePasswordBlockstackId: event.target.value
    });
  }

  handleNewEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  handleNewPhonenumber(event) {
    this.setState({
      phoneNumber: event.target.value
    });
  }

  getPublicKey(username) {
    const { userSession } = this.props;
    const options = {
      decrypt: false,
      username,
      zoneFileLookupURL: "https://core.blockstack.org/v1/names"
    };
    try {
      return userSession.getFile("infod.json", options).then(file => {
        console.log(username, file);
        return file.publicKey;
      });
    } catch (e) {
      console.log(e);
    }
    console.error("unable to find public key");
  }

  handleSharePasswordSubmit(url, username, password) {
    // const {getPublicKeyFromPrivate} = this.props;
    // let userData = this.props.userSession.loadUserData();

    // console.log(getPublicKeyFromPrivate(userData.appPrivateKey));
    const publicKey = this.getPublicKey("gauthamzzz.id.blockstack");
    message.info(
      this.state.sharePasswordBlockstackId +
        "is going to get the password for" +
        url +
        username +
        password
    );
  }

  handleSettingsSubmit(event) {
    this.saveSettings(
      this.state.email,
      this.state.emailNotifications,
      this.state.phoneNumber,
      this.state.phoneNotifications
    );
    message.success("Settings updated successfully");
    this.toggleSettingsModal();
  }

  handleNewLoginSubmit(event) {
    if (
      this.state.newPassword.length !== 0 &&
      this.state.newUsername.length !== 0 &&
      this.state.newPassword.length !== 0
    ) {
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
    } else {
      message.error("Required field empty");
    }
  }

  // setPublicInfo() {
  //   console.log(localStorage.getItem("STORE_PUBLIC_KEY"))
  //   const { userSession } = this.props;
  //   let userData = userSession.loadUserData();
  //   if (!userData) {
  //     return;
  //   }
  //   const publicKey = userSession.getPublicKeyFromPrivate(
  //     userData.appPrivateKey
  //   );
  //   userSession
  //     .putFile("info.json", JSON.stringify(publicKey), { encrypt: false })
  //     .then(() => {
  //       localStorage.setItem("STORE_PUBLIC_KEY", true)
  //     })
  //     .catch(e => {
  //       // eslint-disable-next-line no-console
  //       console.log(e);
  //     });
  // }

  handleOnboardingEmailSubmit(email, emailNotifications) {
    console.log("saving", email, emailNotifications);
    this.saveSettings(email, emailNotifications, undefined, undefined);
  }

  saveSettings(
    email,
    emailNotifications,
    phoneNumber,
    phoneNotifications,
    emailAccountCreated
  ) {
    const { userSession, getPublicKeyFromPrivate } = this.props;
    let userData = userSession.loadUserData();

    const publicKey = getPublicKeyFromPrivate(userData.appPrivateKey);
    const settings = {
      email: email,
      phoneNumber: phoneNumber,
      emailNotifications: emailNotifications,
      phoneNotifications: phoneNotifications,
      emailAccountCreated: emailAccountCreated,
      publicKey: publicKey
    };
    console.log(settings);
    const options = { encrypt: false };
    userSession
      .putFile("infod.json", JSON.stringify(settings), options)
      .then(() => {
        console.log("settings updated");
      });
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
      const options = { encrypt: true };
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

    const options = { encrypt: true };
    userSession
      .putFile("loginss.json", JSON.stringify(logins), options)
      .then(() => {
        this.setState({
          logins: logins
        });
      });
    message.success("Item has been deleted");
  }

  fetchInfo() {
    const { userSession } = this.props;
    if (this.isLocal()) {
      const options = { decrypt: false };
      userSession.getFile("infod.json", options).then(file => {
        if (!file) {
          // if file doesn't exist then user is probably new
          this.toggleOnboardingSection();
        }
        var info = JSON.parse(file || "[]");
        this.setState({
          email: info.email,
          phoneNumber: info.phoneNumber,
          emailNotifications: info.emailNotifications,
          phoneNotifications: info.phoneNotifications,
          emailAccountCreated: info.emailAccountCreated,
          publicKey: info.publicKey
        });
      });

      if (this.state.emailAccountCreated) {
        this.createNewAccountEmail();
      }
    }
  }
  fetchData() {
    const { userSession } = this.props;
    this.setState({ isLoading: true });
    if (this.isLocal()) {
      const options = { decrypt: true };
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

  getProgressStatus = percentage => {
    if (percentage < 41) {
      return "exception";
    } else if (percentage < 81) {
      return "active";
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  isLocal() {
    return this.props.match.params.username ? false : true;
  }

  settingsElement = () => {
    return (
      <div>
        Email
        <Input
          placeholder="tim@apple.com"
          value={this.state.email}
          onChange={e => this.handleNewEmail(e)}
          style={{ marginBottom: 10 }}
        />
        <br />
        Phone Number
        <Input
          placeholder="+91-999999999"
          value={this.state.phoneNumber}
          onChange={e => this.handleNewPhonenumber(e)}
          style={{ marginBottom: 10 }}
        />
        <br />
        <Checkbox
          key="email-noti"
          checked={this.state.emailNotifications}
          onChange={() =>
            this.setState({
              emailNotifications: !this.state.emailNotifications
            })
          }
        >
          Send email alerts for new login activity.
        </Checkbox>
        {/* <Checkbox
          key="phone-noti"
          checked={this.state.phoneNotifications}
          onChange={() =>
            this.setState({
              phoneNotifications: !this.state.phoneNotifications
            })
          }
        >
          Send SMS alerts.
        </Checkbox> */}
      </div>
    );
  };

  generatedPasswordElement = () => {
    return (
      <div>
        <Title
          style={{
            textAlign: "center",
            padding: 20
          }}
          copyable={{ text: this.state.passwordGenerated }}
          editable={{
            onChange: text => {
              this.setState({
                passwordGenerated: text,
                generatedPasswordRating: zxcvbn(text).score,
                newPassword: text
              });
            }
          }}
          ellipsis="true"
          level={4}
        >
          {this.state.passwordGenerated}
        </Title>

        <Divider dashed />
        <Text strong="true">
          Customize password
          <Tooltip title="Click to refresh">
            <Icon
              type="redo"
              key="redo"
              style={{ color: "#1890FF" }}
              onClick={() =>
                this.getGeneratePassword(
                  this.state.generatedPasswordLength,
                  this.state.generatedPasswordMemorable
                )
              }
            />
          </Tooltip>
        </Text>

        <Row style={{ marginTop: 10 }}>
          <Col xs={4}>
            <Progress
              width={40}
              type="circle"
              percent={(this.state.generatedPasswordRating + 1) / 0.05}
              status={this.getProgressStatus(
                (this.state.generatedPasswordRating + 1) / 0.05
              )}
            />
          </Col>

          <Col xs={8}>
            <Checkbox
              checked={this.state.generatedPasswordMemorable}
              onChange={() =>
                this.getGeneratePassword(
                  this.state.generatedPasswordLength,
                  !this.state.generatedPasswordMemorable
                )
              }
            >
              Easy to remember
            </Checkbox>
          </Col>

          <Col xs={12}>
            <Slider
              value={this.state.generatedPasswordLength}
              min={1}
              max={20}
              onChange={text =>
                this.getGeneratePassword(
                  text,
                  this.state.generatedPasswordMemorable
                )
              }
            />
          </Col>
        </Row>
        {this.state.generatePasswordFeedback.length !== 0 && (
          <Alert
            message={this.state.generatePasswordFeedback}
            type="info"
            style={{ marginTop: 20 }}
          />
        )}
      </div>
    );
  };

  // TODO: share password if ever needed currently scraped

  //   {this.state.sharePasswordModal && (
  //     <Modal
  //       title="Share password"
  //       visible={this.state.sharePasswordModal}
  //       onOk={e =>
  //         this.handleSharePasswordSubmit(
  //           status.url,
  //           status.username,
  //           status.password
  //         )
  //       }
  //       onCancel={() => {
  //         this.setState({
  //           sharePasswordModal: !this.state.sharePasswordModal
  //         });
  //       }}
  //     >
  //       <Input
  //         placeholder="Blockstack id"
  //         value={this.state.sharePasswordBlockstackId}
  //         onChange={e => this.handleNewShareBlockstackId(e)}
  //       />
  //     </Modal>
  //   )}
  //   <Icon
  //   xs={0}
  //   lg={1}
  //   type="share-alt"
  //   key="share-alt"
  //   onClick={() =>
  //     this.setState({
  //       sharePasswordModal: !this.state.sharePasswordModal
  //     })
  //   }
  // />,

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
        <Icon type="link" key="link" />
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

  getGeneratePassword = (value, memorable) => {
    const password = generatePassword(value, memorable);
    const gen = zxcvbn(password);
    this.setState({
      passwordGenerated: password,
      generatedPasswordLength: value,
      generatedPasswordMemorable: memorable,
      generatedPasswordRating: gen.score,
      generatePasswordFeedback: gen.feedback.suggestions,
      newPassword: password
    });
  };

  togglePasswordGeneratorModal = () => {
    this.setState({
      showPasswordGeneratorModal: !this.state.showPasswordGeneratorModal
    });
  };

  toggleSettingsModal = () => {
    this.fetchInfo();
    this.setState({
      showSettingsModal: !this.state.showSettingsModal
    });
  };

  toggleOnboardingSection = () => {
    this.setState({
      showOnboarding: !this.state.showOnboarding
    });

    // TODO: if new account send email and make sure Onboarding section is not shown ever again.
  };

  createNewAccountEmail = () => {
    const mail = {
      templateId: "d-cbe214626b2949a7a5fa36f09d8c05c0",
      from: "safeguard@safeguard.icu",
      replyTo: "thabeatsz@gmail.com",
      to: this.state.email
    };
    if (this.state.emailNotifications) this.sendEmail(mail);
    this.setState({
      emailAccountCreated: false
    });

    this.saveSettings(
      this.state.email,
      this.state.emailNotifications,
      this.state.phoneNumber,
      this.state.phoneNotifications,
      false
    );
  };

  checkNewLogin = () => {
    const oldLogin = localStorage.getItem("EXISTING_LOGIN");
    if (!oldLogin) {
      console.log("sending email due to new device");
      const mail = {
        templateId: "d-c4e6407fed5246e4ad1205baa3f941a6",
        dynamic_template_data: {
          platform: platform.name,
          os: String(platform.os),
          id: this.state.username
        },
        from: "activity@safeguard.icu",
        replyTo: "thabeatsz@gmail.com",
        to: this.state.email
      };
      if (this.state.emailNotifications) this.sendEmail(mail);
    }

    localStorage.setItem("EXISTING_LOGIN", true);
  };

  sendEmail = mail => {
    const body = JSON.stringify(mail);
    fetch(
      "https://cors-anywhere.herokuapp.com/https://liver-impala-9566.twil.io/send",
      {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*"
        }
      }
    )
      .then(function(response) {
        console.log(
          response.status,
          response.statusText,
          response.headers,
          response.url
        );

        return response.text();
      })
      .catch(function(error) {
        console.log(error.message);
      });
  };

  HeaderElement = () => {
    const isIframe = window.innerWidth < 576 ? true : false;
    const isOnboarding = this.state.showOnboarding;
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

    if (isOnboarding) {
      return (
        <PageHeader
          title="🛡Safeguard"
          subTitle="Blockchain based password manager"
        />
      );
    }
    return (
      <PageHeader
        title="🛡Safeguard"
        subTitle="Blockchain based password manager"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='Artboard-5' fill='%230099ff' fill-opacity='0.07' fill-rule='nonzero'%3E%3Cpath d='M6 18h12V6H6v12zM4 4h16v16H4V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
        extra={[
          <Button
            key="add-new-password"
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
    const { handleSignOut, userSession, getPublicKeyFromPrivate } = this.props;
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
        {this.state.showOnboarding === true ? (
          <Onboarding
            person={person}
            getPublicKeyFromPrivate={getPublicKeyFromPrivate}
            toggleOnboardingSection={this.toggleOnboardingSection}
            email={this.state.email}
            handleNewEmail={this.handleNewEmail}
            handleOnboardingEmailSubmit={this.handleOnboardingEmailSubmit}
            saveSettings={this.saveSettings}
            userSession={this.props.userSession}
          />
        ) : (
          <Row>
            <Col md={4} sm={0} xs={0}>
              <Menu
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
                    <Menu.Item
                      key="id"
                      onClick={() => {
                        window.open("https://browser.blockstack.org/profiles");
                      }}
                    >
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
                <Menu.Item key="generate-password">
                  {this.isLocal() && (
                    <a onClick={this.togglePasswordGeneratorModal}>
                      <Icon type="key" />
                      Generate Password
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item key="settings">
                  {this.isLocal() && (
                    <a onClick={this.toggleSettingsModal}>
                      <Icon type="setting" />
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item key="feedback">
                  <a href="https://forms.gle/ZnCAQH63hjJxw7ci9" target="_blank">
                    <Icon type="form" />
                    Feedback
                  </a>
                </Menu.Item>

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
                        style={{ top: 20 }}
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
                        <Text>Password</Text>
                        <Input.Password
                          placeholder="input password"
                          value={this.state.newPassword}
                          onChange={e => this.handleNewPasswordChange(e)}
                          style={{ marginBottom: 10 }}
                        />
                        <Collapse bordered={false}>
                          <Panel header="Generate Password" key="gen">
                            {this.generatedPasswordElement()}
                          </Panel>
                        </Collapse>
                      </Modal>
                    )}

                    {this.isLocal() && (
                      <Modal
                        title="Generate Secure Passwords"
                        visible={this.state.showPasswordGeneratorModal}
                        onCancel={this.togglePasswordGeneratorModal}
                        onOk={() => {
                          copy(this.state.passwordGenerated);
                          message.success("Generated password copied");
                          this.togglePasswordGeneratorModal();
                        }}
                      >
                        {this.generatedPasswordElement()}
                      </Modal>
                    )}
                    {this.isLocal() && (
                      <Modal
                        title="Settings"
                        visible={this.state.showSettingsModal}
                        onCancel={() => this.toggleSettingsModal()}
                        onOk={() => {
                          console.log("apply changes to setting");
                          this.handleSettingsSubmit();
                        }}
                      >
                        {this.settingsElement()}
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
                                  onClick={event =>
                                    (window.location.href = "/")
                                  }
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
                                      <Text
                                        copyable={{ text: status.username }}
                                      >
                                        {status.username}
                                      </Text>
                                      <br />
                                      <Text
                                        type="secondary"
                                        copyable={{ text: status.password }}
                                        style={{
                                          WebkitTextSecurity: "disc"
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
        )}
      </div>
    ) : null;
  }
}
