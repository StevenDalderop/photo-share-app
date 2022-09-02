import { Button, Snackbar} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import axios from "axios";
import React from "react";


class AddPhoto extends React.Component<{ callback: (text: string) => void }, { succesMessage: boolean, errorMessage: string }> {
  uploadInput: null | HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      succesMessage: false,
      errorMessage: ""
    };
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
      .then(() => {
        this.setState({ succesMessage: true });
        if (this.uploadInput) { this.uploadInput.value = ''; }
      })
      .catch(err => { this.setState({ errorMessage: err.response.data }); console.log(err.response); });
  };

  handleChange = (e : React.SyntheticEvent) => {
    if (e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    if (file.size > 2 * 10 ** 6) { // 2 megabyte
      this.setState({errorMessage: "file size must be smaller than 2 MB"});
      return;
    }
    if (!(['image/jpg', 'image/jpeg', 'image/png'].includes(file.type))) {
      this.setState({errorMessage: "file type must be one of: jpg, jpeg, png"});
      return;
    }
    this.setState({errorMessage: ""});
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
          <input type="file" accept="image/*" onChange={this.handleChange} ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
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