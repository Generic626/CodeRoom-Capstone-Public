import { useContext } from "react";
import { SharedNotebookListContext } from "../../context/SharedNotebookList";

import { Autocomplete, Chip, TextField } from "@mui/material";
const AutoCompleteChip = (props) => {
  // const setSelectedEmails = props.setState;
  // const selectedList = props.value;

  const { sharedNotebookList, setSharedNotebookList } = useContext(
    SharedNotebookListContext
  );

  // console.log(selectedList);

  return (
    <Autocomplete
      clearIcon={false}
      // value={selectedList}
      value={sharedNotebookList}
      limitTags={2}
      options={props.options}
      freeSolo
      multiple
      onChange={(event, value) => {
        // console.log(value);
        // setSelectedEmails(value);
        setSharedNotebookList(value);
      }}
      renderTags={(value, getTagProps) => {
        // console.log(value);
        // setSelectedEmails(value);
        return value.map((option, index) => {
          return (
            <Chip label={option} {...getTagProps({ index })} key={index} />
          );
        });
      }}
      renderInput={(params) => (
        <TextField label={props.placeholder} {...params} variant="filled" />
      )}
      className={`${props.className}`}
    />
  );
};

export default AutoCompleteChip;
