import React, { Component } from "react";
import { PageHeader, Button, Typography, Row, Col, Card, Icon } from "antd";
import QueueAnim from "rc-queue-anim";
import Particles from "react-particles-js";
import Typed from "react-typed";

const { Title, Text } = Typography;

export default class Signin extends Component {
  render() {
    const { handleSignIn } = this.props;

    return (
      <div>
        <QueueAnim delay={300}>
          <div key="1">
            <PageHeader
              title="🛡Safeguard"
              subTitle="Blockchain based password manager"
              style={{
                marginLeft: 100,
                marginRight: 100
              }}
              extra={[
                <Button
                  onClick={handleSignIn.bind(this)}
                  key="sign-in"
                  type="primary"
                >
                  Sign In
                </Button>
              ]}
            />
          </div>
          <Particles
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              zIndex: -1,
              margin: "0px!important"
            }}
            params={{
              particles: {
                number: {
                  value: 20,
                  density: {
                    enable: true,
                    value_area: 1300.9002517356944
                  }
                },
                color: {
                  value: "#0099ff"
                },
                shape: {
                  type: "circle",
                  stroke: {
                    width: 4,
                    color: "#0099ff"
                  },
                  polygon: {
                    nb_sides: 3
                  },
                  image: {
                    src: "img/github.svg",
                    width: 100,
                    height: 100
                  }
                },
                opacity: {
                  value: 0.5,
                  random: false,
                  anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                  }
                },
                size: {
                  value: 15,
                  random: true,
                  anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                  }
                },
                line_linked: {
                  enable: true,
                  distance: 208.44356791251798,
                  color: "#0099ff",
                  opacity: 0.2,
                  width: 1
                },
                move: {
                  enable: true,
                  speed: 1,
                  direction: "any",
                  random: true,
                  straight: false,
                  out_mode: "out",
                  bounce: false,
                  attract: {
                    enable: false,
                    rotateX: 2886.1417095579413,
                    rotateY: 3046.4829156444935
                  }
                }
              },
              interactivity: {
                detect_on: "canvas",
                events: {
                  onhover: {
                    enable: false,
                    mode: "repulse"
                  },
                  onclick: {
                    enable: false,
                    mode: "push"
                  },
                  resize: true
                },
                modes: {
                  grab: {
                    distance: 400,
                    line_linked: {
                      opacity: 1
                    }
                  },
                  bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4
                  },
                  push: {
                    particles_nb: 4
                  },
                  remove: {
                    particles_nb: 2
                  }
                }
              },
              retina_detect: true
            }}
          />
          <div
            key="2"
            style={{
              marginTop: "15rem",
              textAlign: "center"
            }}
          >
            <div>
              <Title
                style={{
                  fontSize: "4rem"
                }}
              >
                Protect and remember your passwords <br /> better than you
              </Title>
              <Text
                style={{
                  fontSize: "1.5rem"
                }}
              >
                Safeguard is a <em />
                <Typed
                  strings={[
                    " Blockchain based password manager",
                    " secure password manager",
                    " way to forgot unsafe common passwords and be secure"
                  ]}
                  typeSpeed={40}
                  backSpeed={50}
                  loop
                />
                <br />
              </Text>

              <Button
                onClick={handleSignIn.bind(this)}
                key="sign-in"
                type="primary"
                size="large"
                style={{
                  marginTop: "3em",
                  marginRight: "1em",
                  boxShadow: "0 5px 18px 0 rgba(0,0,0,.1)",
                  borderRadius: "3px",
                  border: "none",
                  height: "3rem"
                }}
              >
                Get Started
              </Button>
              <Button
                onClick={handleSignIn.bind(this)}
                key="sign-in"
                size="large"
                style={{
                  marginTop: "3em",
                  marginRight: "1em",
                  boxShadow: "0 5px 18px 0 rgba(0,0,0,.1)",
                  borderRadius: "3px",
                  border: "none",
                  height: "3rem"
                }}
              >
                Download Chrome extension
              </Button>
            </div>
          </div>
          <div key="3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#0099ff"
                fill-opacity="1"
                d="M0,96L48,122.7C96,149,192,203,288,202.7C384,203,480,149,576,133.3C672,117,768,139,864,133.3C960,128,1056,96,1152,112C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              style={{
                transform: "translate(0,-10%)"
              }}
            >
              <path
                fill="#0099ff"
                fill-opacity="1"
                d="M0,256L34.3,245.3C68.6,235,137,213,206,202.7C274.3,192,343,192,411,170.7C480,149,549,107,617,101.3C685.7,96,754,128,823,154.7C891.4,181,960,203,1029,186.7C1097.1,171,1166,117,1234,133.3C1302.9,149,1371,235,1406,277.3L1440,320L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
              ></path>
            </svg>
          </div>

          {/* <div
            style={{
              textAlign: "center"
            }}
          >
            <Title level={2}>Blockchain based password manager</Title>
            <Text>
              Take back control of your data and privacy using the ingenious
              cryptographic pronciples of security.
            </Text>
            <br />
            <img
              style={{
                boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)"
              }}
              src="https://images.unsplash.com/photo-1531946405499-671fc3a8bbab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
            ></img>
          </div> */}
          <div key="4">
            <Row
              style={{
                marginBottom: "10rem"
              }}
            >
              <Col span={6} offset={3}>
                <Card
                  style={{
                    width: 400,
                    border: "none",
                    boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)"
                  }}
                >
                  <Icon
                    type="block"
                    style={{
                      fontSize: "4rem",
                      color: "#000",
                      margin: "1rem"
                    }}
                  />
                  <br />
                  <Title level={4}>Powered by Blockchain</Title>
                  <Text>
                    Store your password using the technology behind BitCoin and
                    other cryptocurrencies
                  </Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  style={{
                    width: 400,
                    border: "none",
                    boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)"
                  }}
                >
                  <Icon
                    type="lock"
                    style={{
                      fontSize: "4rem",
                      color: "#000",
                      margin: "1rem"
                    }}
                  />
                  <br />
                  <Title level={4}>Secure and easy</Title>
                  <Text>
                    Use the app with ease using the chrome extension for
                    autofill and many more
                  </Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  style={{
                    width: 400,
                    border: "none",
                    boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)"
                  }}
                >
                  <Icon
                    type="database"
                    style={{
                      fontSize: "4rem",
                      color: "#000",
                      margin: "1rem"
                    }}
                  />
                  <br />
                  <Title level={4}>Own your own data</Title>
                  <Text>
                    Your data is owned by yourself and not some big fancy
                    company trying to sell it.
                  </Text>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={6} offset={4}>
                <Title
                  style={{
                    fontSize: "3.125rem"
                  }}
                >
                  Store and autofill your passwords
                </Title>
                <Text
                  style={{
                    fontSize: "1.25rem",
                    marginBottom: "4rem"
                  }}
                >
                  Save all your passwords at one place and autofill them with
                  ease using browser extension.
                </Text>
                <img src="https://res.cloudinary.com/matrimonal/image/upload/v1576177295/DogJumpDoodle_aq6eay.svg" />
              </Col>
              <Col
                span={6}
                offset={2}
                style={{
                  textAlign: "center"
                }}
              >
                <img
                  style={{
                    boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)"
                  }}
                  src="https://res.cloudinary.com/matrimonal/image/upload/v1576145363/Screenshot_2019-12-12_at_3.22.30_PM_qyondc.png"
                />
              </Col>
            </Row>
          </div>
          <div
            key="5"
            style={{
              marginTop: 10,
              padding: "8em",
              textAlign: "center"
            }}
          >
            <Row>
              <Col span={12}>
                <img
                  style={{
                    boxShadow: "0 0.5em 1.5em 0 rgba(0,0,0,.1)",
                    width: 450
                  }}
                  src="https://res.cloudinary.com/matrimonal/image/upload/v1576148077/Screenshot_2019-12-05_at_11.35.56_PM_k34w5w.png"
                />
              </Col>
              <Col span={6} offset={2}>
                <Title
                  style={{
                    fontSize: "3.125rem"
                  }}
                >
                  Generate secure passwords
                </Title>
                <Text
                  style={{
                    fontSize: "1.25rem"
                  }}
                >
                  Keeping the same password for all websites is risky and then
                  there is the task of remebering them. Safeguard generates new
                  passwords everytime based on your desired level of strength.
                </Text>
                <img
                  src="https://res.cloudinary.com/matrimonal/image/upload/v1576177292/LayingDoodle_urxeda.svg"
                  alt=""
                />
              </Col>
            </Row>
          </div>

          <div key="7">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#0099ff"
                fill-opacity="1"
                d="M0,192L34.3,192C68.6,192,137,192,206,176C274.3,160,343,128,411,144C480,160,549,224,617,213.3C685.7,203,754,117,823,117.3C891.4,117,960,203,1029,202.7C1097.1,203,1166,117,1234,74.7C1302.9,32,1371,32,1406,32L1440,32L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div
            key="8"
            style={{
              textAlign: "center",
              background: "#0099ff",
              paddingBottom: "10rem",
              transform: "translate(0,-10%)"
            }}
          >
            <Button
              onClick={handleSignIn.bind(this)}
              key="sign-in"
              size="large"
              style={{
                marginTop: "3em",
                marginRight: "1em",
                boxShadow: "0 5px 18px 0 rgba(0,0,0,.1)",
                borderRadius: "3px",
                border: "none",
                height: "3rem"
              }}
            >
              Get Started
            </Button>
            <Button
              onClick={handleSignIn.bind(this)}
              key="sign-in"
              size="large"
              type="dashed"
              ghost
              style={{
                marginTop: "3em",
                marginRight: "1em",
                boxShadow: "0 5px 18px 0 rgba(0,0,0,.1)",
                borderRadius: "3px",
                border: "none",
                height: "3rem"
              }}
            >
              Download Chrome extension
            </Button>
          </div>
          <div
            key="8"
            style={{
              textAlign: "center",
              marginBottom: 10
            }}
          >
            🛡Safeguard © (2019 - Present) Created by gauthamzz
          </div>

          {/* <div key="3">
            <p className="lead">
              <button
                className="btn btn-primary btn-lg"
                id="signin-button"
                onClick={handleSignIn.bind(this)}
              >
                Sign In with Blockstack
              </button>
            </p>
          </div> */}
        </QueueAnim>
      </div>
    );
  }
}
