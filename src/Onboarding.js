import React, { Component } from "react";
import {
  Button,
  Typography,
  Row,
  Col,
  Icon,
  Input,
  Steps,
  Carousel
} from "antd";
import Typed from "react-typed";
const { Step } = Steps;
const { Text, Title } = Typography;

export default class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSection: 0,
      newEmail: this.props.email
    };
  }

  saveSettings(email, emailNotifications) {
    const { userSession } = this.props;
    const settings = {
      email: email,
	  emailNotifications: emailNotifications,
	  emailAccountCreated: true,
    };
    const options = { encrypt: false };
    userSession
      .putFile("infod.json", JSON.stringify(settings), options)
      .then(() => {
        console.log("settings updated");
      });
  }
  componentDidUpdate() {
	  // TODO: better approach
	  if(this.state.newEmail === null && this.props.email !== null)
	  this.setState({
		  newEmail: this.props.email
	  })
  }


  setCurrentSection = value => {
    this.setState({
      currentSection: value
    });
  };

  setNewEmail = value => {
    this.setState({
      newEmail: value
    });
  };

  nextSection = () => {
    this.setCurrentSection(this.state.currentSection + 1);
  };

  getFirstSection = () => {
    return (
      <div
        style={{
          textAlign: "center"
        }}
      >
        <Typed
          strings={[
            `<h1>👋 Hey, ${this.props.person.name()}</h1> <h2>Welcome to Safeguard.</h2>`
          ]}
          typeSpeed={30}
          showCursor={false}
        />

        <Button
          type="primary"
          key="sign-in"
          size="large"
          onClick={this.nextSection}
          style={{
            marginTop: "7vh",
            marginRight: "1em",
            boxShadow: "0 5px 18px 0 rgba(0,0,0,.1)",
            borderRadius: "3px",
            border: "none",
            height: "5vh",
            width: "10vh",
            fontSize: "2vh"
          }}
        >
          Next
        </Button>
      </div>
    );
  };
  getSecondSection = () => {
    return (
      <div
        style={{
          textAlign: "center"
        }}
      >
        <Row type="flex" gutter={[40, 16]} align="middle">
          <Col span={24} order={1}>
            <h2>What is your email address? </h2>
          </Col>
          <Col span={14} order={2} offset={5}>
            <Input
              size="large"
              placeholder="adam@safeguard.icu"
              value={this.state.newEmail}
              onChange={e => this.setNewEmail(e.target.value)}
              style={{
                border: "none",
                borderBottom: "5px solid #0099ff",
                fontSize: "2vh",
                textAlign: "center"
              }}
            />
          </Col>
        </Row>
        <Button
          type="primary"
          key="sign-in"
          size="large"
          onClick={() => {
            this.saveSettings(this.state.newEmail, true);
            this.nextSection();
          }}
          style={{
            marginTop: "3em",
            marginRight: "1em",
            boxShadow: "0 5px 18px 0 rgba(0,0,0,.1)",
            borderRadius: "3px",
            border: "none",
            height: "5vh",
            width: "10vh",
            fontSize: "2vh"
          }}
        >
          Next
        </Button>
      </div>
    );
  };
  getThirdSection = () => {
    return (
      <div
        style={{
          textAlign: "center"
        }}
      >
        <Row type="flex" justify="space-around" align="middle">
          <Col span={8} offset={2}>
            <Title
              style={{
                fontSize: "3.125rem"
              }}
            >
              Download Browser Extension
            </Title>
            <Text
              style={{
                fontSize: "1.25rem",
                marginBottom: "4rem",
                marginTop: "4rem"
              }}
            >
              Save all your passwords at one place, generate new passwords or
              autofill them with ease.
            </Text>
          </Col>
          <Col
            span={8}
            offset={4}
            style={{
              textAlign: "center"
            }}
          >
            <Carousel autoplay>
              <div>
                <img
                  style={{
                    verticalAlign: "middle"
                  }}
                  src="https://res.cloudinary.com/matrimonal/image/upload/v1576145363/Screenshot_2019-12-12_at_3.22.30_PM_qyondc.png"
                />
              </div>
              <div>
                <img
                  style={{
                    verticalAlign: "middle"
                  }}
                  src="https://res.cloudinary.com/matrimonal/image/upload/v1576402822/Screenshot_2019-12-14_at_6.48.26_PM_mq0gmd.png"
                />
              </div>
            </Carousel>
          </Col>
        </Row>

        <Button
          key="download"
          size="large"
          type="primary"
          style={{
            marginTop: "3em",
            marginRight: "1em",
            marginBottom: "20vh",
            boxShadow: "0 5px 18px 0 rgba(0,0,0,.1)",
            borderRadius: "3px",
            border: "none",
            height: "5vh",
            width: "20vh",
            fontSize: "2vh"
          }}
        >
          <Icon type="chrome" /> Install now
        </Button>
        <Button
          key="sign-in"
          size="large"
          onClick={this.props.toggleOnboardingSection}
          style={{
            marginTop: "3em",
            marginRight: "1em",
            marginBottom: "20vh",
            boxShadow: "0 5px 18px 0 rgba(0,0,0,.1)",
            borderRadius: "3px",
            border: "none",
            height: "5vh",
            width: "10vh",
            fontSize: "2vh"
          }}
        >
          Finish
        </Button>
      </div>
    );
  };
  render() {
	const { currentSection } = this.state;
    return (
      <Row
        type="flex"
        justify="space-around"
        align="middle"
        style={{
          height: "90vh",
          fontSize: "1.5vh",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='72' viewBox='0 0 36 72'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%230099ff' fill-opacity='0.07'%3E%3Cpath d='M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        <Col span={6} xs={20}>
          {currentSection === 0 && this.getFirstSection()}

          {currentSection === 1 && this.getSecondSection()}
          {currentSection === 2 && this.getThirdSection()}
        </Col>
        <Col lg={12} xs={0}>
          <Steps current={currentSection}>
            <Step title="Step 1" description="Welcome to safeguard." />
            <Step
              title="Step 2"
              description="Enter your email to get notifications."
            />
            <Step
              title="Step 3"
              description="Install the Browser Extension to access your passwords from anywhere."
            />
          </Steps>

        </Col>
      </Row>
    );
  }
}
