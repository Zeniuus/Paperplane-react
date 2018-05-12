import React, { Component } from 'react';
import skyPath from '../static/el_capitan_bg.jpg';
import TextArea from 'react-textarea-autosize';
import axios from 'axios';
import {LOGIN_URL} from "../constants";
import {Link} from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
    };
    this.loginUser = this.loginUser.bind(this);
  }

  componentWillMount() {
  }

  loginUser() {
    const { id, password } = this.state;
    const { cookies } = this.props;

    axios.post(LOGIN_URL, {id, password})
      .then((res) => {
        const {uid, nickname, _id} = res.data;
        cookies.set('id', uid, { path: '/' });
        cookies.set('nickname', nickname, { path: '/' });
        cookies.set('_id', _id, { path: '/' });
        this.props.history.replace('/hi2');
      })
      .catch((e) => console.log(e));
  }

  render() {
    return (
      <div style={styles.backgroundStyle}>
        <div style={styles.loginStyle}>
          <div style={styles.titleStyle}>
            Paperplane
          </div>
          <input
              style={styles.titleTextArea}
              type="text" value={this.state.id}
              placeholder={'Username'}
              onChange={event => this.setState({ id: event.target.value })} />
          <input
              style={styles.titleTextArea}
              type="text" value={this.state.password}
              placeholder={'Password'}
              onChange={event => this.setState({ password: event.target.value })} />
          <div style={styles.buttonStyle} onClick={this.loginUser}>
            Login
          </div>
          <Link to='/register'>
            <div style={{...styles.buttonStyle, backgroundColor: '#595970'}} >
              Register
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

const styles = {
  backgroundStyle: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${skyPath})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
  },
  titleTextArea: {
    borderWidth: '0px',
    borderBottomWidth: '1px',
    borderBottomColor: '#efefef',
    marginBottom: '5px',
    padding: '0.3rem',
    fontSize: '1.2rem',
    fontWeight: 400,
    lineHeight: '100%',
    width: '10rem',
    outline: 'none',
    backgroundColor: 'rgb(255,255,255,0)',
  },
  buttonStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B008B',
    borderRadius: '1.5rem',
    height: '1.7rem',
    fontWeight: 900,
    fontSize: '1.2rem',
    width: '10rem',
    marginTop: '5px',
  },
  loginStyle: {
    height: '23vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '1.5rem',
    backgroundColor: 'rgb(255,255,255,0.5)',
    width: '20vw',
  },
  titleStyle: {
    fontSize: '1.2rem',
    fontWeight: 800,

  }
};

export default withCookies(Login);