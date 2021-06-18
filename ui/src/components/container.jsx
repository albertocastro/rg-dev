import React, { useState } from "react";
import { TextField, Button, Typography, Paper,IconButton } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';

import Delete from '@material-ui/icons/Delete';
import "./styles.css"

export const STATUS = {
  RUNNING:"RUNNING",
  PAUSED:"PAUSED",
}
const ContainerRG = ({ containers, onCreate ,loading,onStop,onResume}) => {
  
  const [query, setQuery] = useState("");
  const handleCreateContainer = () => {
    
    onCreate(query)
  };

  if(loading) return <div>Loading</div>
  return (
    <div>
     
      <Paper elevation={3} style={{ padding: 20 }}>
        <h4>Create a container</h4>
        <TextField
          id="standard-basic"
          label="Standard"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateContainer}
        >
          Create
        </Button>
      </Paper>
      <br />
      {containers.map((container) => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            {container.server} {container.companyId}
            <i>{container.status}</i>
            <div className="containerActions">
              {
                container.status === STATUS.RUNNING && (
                  <IconButton size="small"  aria-label="delete" onClick={(e)=>{e.stopPropagation();onStop(container.containerId);} }>
                  <Pause />
                </IconButton>
                )
              }
                 {
                container.status === STATUS.PAUSED && (
                  <IconButton size="small"  aria-label="delete" onClick={(e)=>{e.stopPropagation();onResume(container.containerId);} }>
                  <PlayArrow />
                </IconButton>
                )
              }
          
         
            <IconButton size="small"  aria-label="delete">
              <Delete />
            </IconButton>
            </div>
          </AccordionSummary>
        </Accordion>
      ))}
      {/* <Accordion>
        {/* {containers.map((container) => (
          <React.Fragment>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
             dsdsds
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </React.Fragment>
        ))} 
      </Accordion> */}
    </div>
  );
};

export default ContainerRG;
