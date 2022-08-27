import { Button } from "@material-ui/core";
import axios from "axios";
import React from "react";


class AddPhoto extends React.Component<{callback: (text: string) => void}> {
  uploadInput : null | HTMLInputElement;

  constructor(props) {
    super(props);
    this.uploadInput = null;
  }

  componentDidMount() {
    this.props.callback("Add photo");
  }

  handleUpload = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (this.uploadInput === null || this.uploadInput.files === null) {
      return;
    }
    const domForm = new FormData();
    domForm.append('uploadedphoto', this.uploadInput.files[0]);
    axios.post('/photos/new', domForm)
      .then(res => console.log(res))
      .catch(err => console.log(err.response));
  };

  render() {
    return (
      <form onSubmit={this.handleUpload}>
        <input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
        <Button variant="contained" color="primary" size="medium" type="submit">
          Upload
        </Button>
      </form>
    );
  }
}

export default AddPhoto;