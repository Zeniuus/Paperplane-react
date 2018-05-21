import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import './Note.css';
import editIconPath from '../../icons/edit_icon.png';
import deleteIconPath from '../../icons/delete_icon.png';
import TextArea from './TextArea';
import { debounce, contentEmbededHTML, popUpModalOnClick } from '../../utils';
import {NOTE_URL} from '../../constants';
import axios from 'axios';

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'read',
      title: 'dd',
      content: '',
      noteId: '',
    };

    this.saveNote = debounce(this.saveNote, 1000);
    this.deleteNote = this.deleteNote.bind(this);
  }

  componentWillMount() {
    const { noteId, title, content } = this.props;
    this.setState({ noteId, title, content });
  }

  componentDidMount() {
    popUpModalOnClick(document, this.props.paper, this.props.showModal);
  }

  componentDidUpdate() {
    popUpModalOnClick(document, this.props.paper, this.props.showModal);
  }

  changeTitleMode(e) {
    this.setState({mode: 'fix'});
    e.stopPropagation();
  }

  onEnterKeyPress(e) {
    if (e.which === 13) {
      this.setState({mode: 'read'});
      this.saveNote();
    }
    e.stopPropagation();
  }

  saveNote() {
    console.log('debounced!');
    const url = `${NOTE_URL}/${this.props.noteId}`;
    const { title, content } = this.state;
    const data = { title, content };
    console.log(this.props.noteId);
    if (this.props.noteId) {
      axios.put(url, data)
          .then((res) => {
          })
          .catch((e) => console.log(e));
    }
    else {
      console.log('failed, check Note.js 56');
      this.saveNote();
    }
  }

  deleteNote(e) {
    const url = `${NOTE_URL}/${this.props.noteId}`;
    this.props.deleteNote();
    axios.delete(url)
      .then((res) => {
      })
      .catch((err) => console.log(err));
    e.stopPropagation();

  }

  render() {
    const handleChange = function (event) {
      const contentEmbededNote = event.target.value;
      const regex = /<a class="embed-[FE]\d+"((?!>)[\w\W])*>|<\/a>/gi
      const pureTextNote = contentEmbededNote.replace(regex, match => '');
      this.setState({
        content: pureTextNote,
      });

      this.saveNote();
    }.bind(this);

    const trigger = this.state.mode === 'read' ?
        (
          <div style={styles.noteTitleStyle}>
            <div>
              {this.state.title} <img style={styles.iconStyle} src={editIconPath} onClick={(e) => this.changeTitleMode(e)} />
            </div>
            <img style={styles.iconStyle} src={deleteIconPath} onClick={(e) => this.deleteNote(e)} />
          </div>
        ) :
        (
          <div onKeyPress={(e) => this.onEnterKeyPress(e)} onClick={(e) => e.stopPropagation()}>
            <TextArea html={this.state.title} onChange={event => this.setState({ title: event.target.value })} placeholder={'Write title!'} />
          </div>
        );
    return (
      <Collapsible trigger={trigger} transitionTime={100}>
        <TextArea html={contentEmbededHTML(this.state.content)} onChange={handleChange} />
      </Collapsible>
    );
  }
}

const styles = {
  textStyle: {
    flex: 1,
    height: '30px',
    fontSize: '1.5rem',
    fontStyle: 'bold',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingLeft: '10px',
  },
  titleTextArea: {
    borderWidth: '0px',
    borderBottomWidth: '1px',
    borderBottomColor: '#efefef',
    padding: '0.3rem',
    fontSize: '1.2rem',
    fontWeight: 400,
    lineHeight: '100%',
    width: '95%',
    outline: 'none',
  },
  iconStyle: {
    width: '20px',
    height: '20px',
  },
  noteTitleStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: '5px',
    alignItems: 'center',
    cursor: 'pointer'
  }
};

export default Note;