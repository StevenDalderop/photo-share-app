import { Button, Snackbar} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import axios from "axios";
import React from "react";


class AddPhoto extends React.Component<{ callback: (text: string) => void }, { succesMessage: any, errorMessage: string }> {
  uploadInput: null | HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      succesMessage: false,
      errorMessage: ""
    }
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
      .then(res => {
        this.setState({ succesMessage: true });
        if (this.uploadInput) { this.uploadInput.value = '' };
      })
      .catch(err => { this.setState({ errorMessage: err.response.data }); console.log(err.response) });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ succesMessage: false, errorMessage: "" });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleUpload}>
          <input type="file" accept="image/*" onChange={() => {this.setState({errorMessage: ""})}} ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
          <Button variant="contained" color="primary" size="medium" type="submit">
            Upload
          </Button>
        </form>
        {this.state.errorMessage !== "" && <Alert severity="error">{this.state.errorMessage}</Alert>}
        <Snackbar open={this.state.succesMessage} autoHideDuration={6000} onClose={this.handleClose} message="Photo succesfully uploaded" />
      </div>
    );
  }
}

export default AddPhoto;