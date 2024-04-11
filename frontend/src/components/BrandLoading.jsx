import CircularProgress from "@mui/material/CircularProgress";

const BrandLoading = (props) => {
  return (
    <>
      <img
        src={props.brandLogo}
        alt={props.imgAlt}
        className={props.imgClassName}
      />
      <CircularProgress color={props.circularColor} />
    </>
  );
};

export default BrandLoading;
