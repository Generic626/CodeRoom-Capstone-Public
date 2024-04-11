// import CircularProgress from "@mui/material/CircularProgress";
import brandLogo from "../assets/brand-logo.png";
import BrandLoading from "../components/BrandLoading";
const LoadingPage = () => {
  return (
    <div className="bg-[#333333] h-screen w-screen fixed flex flex-col justify-center items-center text-white">
      {/* <img
        src={brandLogo}
        alt="Loading Logo"
        className="w-[80px] h-[90px] mb-4"
      />
      <CircularProgress color="inherit" /> */}
      <BrandLoading
        brandLogo={brandLogo}
        imgAlt="Loading Logo"
        imgClassName="w-[80px] h-[90px] mb-4"
        circularColor="inherit"
      />
    </div>
  );
};

export default LoadingPage;
