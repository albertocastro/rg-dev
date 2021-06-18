import {
  Container,
  Box,
  Card,
  TextField,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Typography,
} from "@material-ui/core/";
import ContainerRG from "./components/container";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react"
function App() {
  const [loading, setLoading] = useState(false);
  const [containers, setContainers] = useState([]);
  const handleCreateContainer = (query, callback) => {
    const [first, second] = query.split(" ");
    let server,companyId;
    if(first.length > second.length){
      companyId = first
      server = second
    }else{
      companyId = second
      server = first
    }
    setLoading(true);
    axios
      .get(`http://localhost:4200/start/${server}/${companyId}`)
      .then((response) => {
        setLoading(false);
        setContainers(response.data);
      });
  };
  const handleStopContainer = (containerId)=>{
    console.log(containerId)
    setLoading(true)
    axios.get(`http://localhost:4200/stop/${containerId}`)
    .then((response) => {
      setLoading(false);
      setContainers(response.data);
    });
  }
  const handleResumeContainer = (containerId)=>{
    console.log(containerId)
    setLoading(true)
    axios.get(`http://localhost:4200/resume/${containerId}`)
    .then((response) => {
      setLoading(false);
      setContainers(response.data);
    });
  }
  useEffect(() => {
    axios.get(`http://localhost:4200/state`).then(({ data }) => {
      setContainers(data);
    });
  }, []);
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" >
            Record Guardian Developer Tool
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box component="span" m={1}>
          <ContainerRG
            containers={containers}
            loading={loading}
            onStop = {handleStopContainer}
            onCreate={handleCreateContainer}
            onResume ={handleResumeContainer}
          />
          {/* <Card>
          <CardContent>
            
             <TextField
              id="outlined-basic"
              label="Ej. n4 9999999994"
              variant="outlined"
            />
            <Button variant="contained" color="primary">
              Start
            </Button>
          </CardContent>
        </Card> */}
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
